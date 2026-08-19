<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'addresses'])
            ->latest()
            ->get()
            ->map(function ($order) {
                $firstItem = $order->items->first();
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'date' => $order->created_at->translatedFormat('d M Y'),
                    'status' => $this->translateStatus($order->status),
                    'status_raw' => $order->status,
                    'total' => $order->grand_total,
                    'product' => $firstItem?->product?->name ?? 'Produk',
                    'image' => $firstItem?->product?->thumbnail_url ?? null,
                    'items_count' => $order->items->count(),
                    'payment_method' => $order->payment_method,
                    'shipping_method' => $order->shipping_method,
                ];
            });

        return Inertia::render('Buyer/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $order = Order::where('user_id', $user->id)
            ->where('id', $id)
            ->with(['items.product', 'addresses'])
            ->firstOrFail();

        return Inertia::render('Buyer/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'date' => $order->created_at->translatedFormat('d M Y H:i'),
                'status' => $this->translateStatus($order->status),
                'status_raw' => $order->status,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'tax' => $order->tax,
                'discount' => $order->discount,
                'grand_total' => $order->grand_total,
                'payment_method' => $order->payment_method,
                'shipping_method' => $order->shipping_method,
                'payment_status' => $order->payment_status,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->product?->name ?? 'Produk',
                        'image' => $item->product?->thumbnail_url ?? null,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total' => $item->total,
                    ];
                }),
                'billing_address' => $order->addresses->where('address_type', 'billing')->first(),
                'shipping_address' => $order->addresses->where('address_type', 'shipping')->first(),
            ],
        ]);
    }

    private function translateStatus($status)
    {
        return match($status) {
            'pending' => 'Menunggu Pembayaran',
            'processing' => 'Diproses',
            'shipped' => 'Dikirim',
            'delivered' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            'refunded' => 'Dikembalikan',
            default => $status,
        };
    }
}
