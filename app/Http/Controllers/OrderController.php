<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderAddress;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Coupon;
use App\Models\UserCoupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Place Order - Raw request data', $request->all());

        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postalCode' => 'required|string|max:10',
            'country' => 'required|string|max:100',
            'shippingMethod' => 'required|in:standard,express',
            'paymentMethod' => 'required|in:cod,transfer',
            'cartItems' => 'required|array',
            'cartItems.*.productId'   => 'required|integer',
            'cartItems.*.variantId'   => 'nullable|integer',
            'cartItems.*.name'        => 'required|string',
            'cartItems.*.image'       => 'nullable|string',
            'cartItems.*.variantName' => 'nullable|string',
            'cartItems.*.quantity'    => 'required|integer|min:1',
            'cartItems.*.price'       => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'shippingCost' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'couponCode' => 'nullable|string',
        ]);

        \Log::info('Place Order - Validation passed');

        try {
            DB::beginTransaction();

            // Log incoming data for debugging
            \Log::info('Place Order - Incoming data', [
                'user_id' => auth()->id(),
                'cartItems_count' => count($validated['cartItems']),
                'subtotal' => $validated['subtotal'],
                'total' => $validated['total'],
                'couponCode' => $validated['couponCode'] ?? null,
            ]);

            // Handle coupon usage
            $coupon = null;
            $discount = 0;
            if (!empty($validated['couponCode'])) {
                $coupon = Coupon::where('code', strtoupper(trim($validated['couponCode'])))->first();
                
                if ($coupon) {
                    // Validate coupon again before using
                    if (!$coupon->is_active) {
                        return back()->with('error', 'This coupon is not active');
                    }
                    
                    if ($coupon->expire_date && now()->gt($coupon->expire_date)) {
                        return back()->with('error', 'This coupon has expired');
                    }
                    
                    if ($coupon->start_date && now()->lt($coupon->start_date)) {
                        return back()->with('error', 'This coupon is not yet active');
                    }
                    
                    // Check if user already used this coupon
                    $userCoupon = UserCoupon::where('user_id', auth()->id())
                        ->where('coupon_id', $coupon->id)
                        ->first();
                    
                    if ($userCoupon && $userCoupon->is_used) {
                        return back()->with('error', 'You have already used this coupon');
                    }
                    
                    // Calculate discount
                    switch ($coupon->discount_type) {
                        case 'percentage':
                            $discount = ($validated['subtotal'] * $coupon->discount_value) / 100;
                            break;
                        case 'fixed':
                            $discount = $coupon->discount_value;
                            break;
                        case 'free_shipping':
                            $discount = 0; // Handled separately
                            break;
                    }
                    
                    // Apply maximum discount limit if set
                    if ($coupon->maximum_discount && $discount > $coupon->maximum_discount) {
                        $discount = $coupon->maximum_discount;
                    }
                    
                    // Ensure discount doesn't exceed subtotal
                    if ($discount > $validated['subtotal']) {
                        $discount = $validated['subtotal'];
                    }
                }
            }

            // Create billing address
            $billingAddress = OrderAddress::create([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'postal_code' => $validated['postalCode'],
                'country' => $validated['country'],
                'address_type' => 'billing',
            ]);

            \Log::info('Billing address created', ['billing_address_id' => $billingAddress->id]);

            // Create shipping address (same as billing for now)
            $shippingAddress = OrderAddress::create([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'postal_code' => $validated['postalCode'],
                'country' => $validated['country'],
                'address_type' => 'shipping',
            ]);

            \Log::info('Shipping address created', ['shipping_address_id' => $shippingAddress->id]);

            // Create order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'customer_id' => null, // Not using customer table for now
                'user_id' => auth()->id(), // Use authenticated user
                'status' => 'pending',
                'channel' => 'web',
                'subtotal' => $validated['subtotal'],
                'tax' => 0,
                'shipping_amount' => $validated['shippingCost'],
                'discount' => $discount,
                'grand_total' => $validated['total'],
                'payment_status' => 'pending',
                'payment_method' => $validated['paymentMethod'],
                'shipping_method' => $validated['shippingMethod'],
                'shipping_cost' => $validated['shippingCost'],
                'billing_address_id' => $billingAddress->id,
                'coupon_code' => $coupon ? $coupon->code : null,
            ]);

            \Log::info('Order created', ['order_id' => $order->id, 'order_number' => $order->order_number]);

            // Link addresses to order
            $order->addresses()->saveMany([$billingAddress, $shippingAddress]);

            // Create order items (stock deduction should happen when order is processed/confirmed by admin)
            foreach ($validated['cartItems'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['productId'],
                    'variant_id' => $item['variantId'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['price'] * $item['quantity'],
                ]);
            }

            // Mark coupon as used if coupon was applied
            if ($coupon) {
                // Find or create user coupon record
                $userCoupon = UserCoupon::where('user_id', auth()->id())
                    ->where('coupon_id', $coupon->id)
                    ->first();
                
                if ($userCoupon) {
                    // Mark as used
                    $userCoupon->update([
                        'is_used' => true,
                        'used_at' => now(),
                    ]);
                } else {
                    // Create new user coupon record and mark as used
                    UserCoupon::create([
                        'user_id' => auth()->id(),
                        'coupon_id' => $coupon->id,
                        'is_used' => true,
                        'used_at' => now(),
                    ]);
                }
                
                // Increment coupon usage count
                $coupon->increment('used_count');
            }

            DB::commit();

            // Create notification for admin users
            $adminUsers = User::where('role', 'admin')->get();
            foreach ($adminUsers as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'order_created',
                    'title' => 'New Order Received',
                    'message' => "Order #{$order->order_number} received with total Rp" . number_format($order->grand_total, 0, ',', '.'),
                    'data' => [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'total' => $order->grand_total,
                    ],
                    'link' => "/admin/sales/orders/{$order->id}",
                    'is_read' => false,
                ]);
            }

            return redirect()->route('order.success')->with('order', [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'status'         => $order->status,
                'payment_method' => $order->payment_method,
                'shipping_method'=> $order->shipping_method,
                'subtotal'       => $order->subtotal,
                'shipping_cost'  => $order->shipping_cost,
                'grand_total'    => $order->grand_total,
                'created_at'     => $order->created_at->format('d M Y, H:i'),
                'items'          => collect($validated['cartItems'])->map(fn($item) => [
                    'name'        => $item['name']        ?? '',
                    'image'       => $item['image']       ?? null,
                    'variantName' => $item['variantName'] ?? null,
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                ])->all(),
                'address' => [
                    'name'     => $validated['firstName'] . ' ' . $validated['lastName'],
                    'address'  => $validated['address'],
                    'city'     => $validated['city'],
                    'province' => $validated['province'],
                    'postal'   => $validated['postalCode'],
                    'country'  => $validated['country'],
                    'phone'    => $validated['phone'],
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Place Order failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'Failed to create order. Please try again.');
        }
    }
}
