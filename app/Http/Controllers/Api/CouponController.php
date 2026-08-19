<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\UserCoupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        $code = strtoupper(trim($request->code));
        $subtotal = $request->subtotal;

        // Find coupon by code
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coupon code',
            ], 404);
        }

        // Check if coupon is active
        if (!$coupon->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon is not active',
            ], 400);
        }

        // Check if coupon is expired
        if ($coupon->expire_date && now()->gt($coupon->expire_date)) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon has expired',
            ], 400);
        }

        // Check if coupon is not started yet
        if ($coupon->start_date && now()->lt($coupon->start_date)) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon is not yet active',
            ], 400);
        }

        // Check if coupon has reached usage limit
        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon has reached its usage limit',
            ], 400);
        }

        // Check if user has already used this coupon (per customer limit)
        $userCoupon = UserCoupon::where('user_id', $user->id)
            ->where('coupon_id', $coupon->id)
            ->first();

        if ($userCoupon && $userCoupon->is_used) {
            return response()->json([
                'success' => false,
                'message' => 'You have already used this coupon',
            ], 400);
        }

        if ($userCoupon && !$userCoupon->is_used) {
            // User has the coupon but hasn't used it yet - allow
        } else {
            // Check per customer limit
            if ($coupon->per_customer_limit > 0) {
                $usageCount = UserCoupon::where('user_id', $user->id)
                    ->where('coupon_id', $coupon->id)
                    ->where('is_used', true)
                    ->count();

                if ($usageCount >= $coupon->per_customer_limit) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You have reached the usage limit for this coupon',
                    ], 400);
                }
            }
        }

        // Check minimum order requirement
        if ($coupon->minimum_order && $subtotal < $coupon->minimum_order) {
            return response()->json([
                'success' => false,
                'message' => "Minimum order amount is Rp {$coupon->minimum_order}",
            ], 400);
        }

        // Calculate discount
        $discount = 0;

        switch ($coupon->discount_type) {
            case 'percentage':
                $discount = ($subtotal * $coupon->discount_value) / 100;
                break;
            case 'fixed':
                $discount = $coupon->discount_value;
                break;
            case 'free_shipping':
                $discount = 0; // Handled separately in shipping calculation
                break;
            case 'buy_x_get_y':
                // Special case - not implemented for now
                $discount = 0;
                break;
        }

        // Apply maximum discount limit if set
        if ($coupon->maximum_discount && $discount > $coupon->maximum_discount) {
            $discount = $coupon->maximum_discount;
        }

        // Ensure discount doesn't exceed subtotal
        if ($discount > $subtotal) {
            $discount = $subtotal;
        }

        return response()->json([
            'success' => true,
            'discount' => $discount,
            'coupon_id' => $coupon->id,
            'discount_type' => $coupon->discount_type,
            'discount_value' => $coupon->discount_value,
        ]);
    }
}
