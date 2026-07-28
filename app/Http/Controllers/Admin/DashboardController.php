<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('grand_total');
        $totalCustomers = Customer::count();
        $totalProducts = Product::count();
        $totalVariants = ProductVariant::count();

        // Get recent orders
        $recentOrders = Order::with('customer')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer ? $order->customer->first_name . ' ' . $order->customer->last_name : 'Guest',
                    'grand_total' => $order->grand_total,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->format('d M Y, H:i'),
                ];
            });

        // Get order status distribution
        $orderStatuses = Order::selectRaw('status, COUNT(*) as count')
            // ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Get payment status distribution
        $paymentStatuses = Order::selectRaw('payment_status, COUNT(*) as count')
            // ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('payment_status')
            ->pluck('count', 'payment_status')
            ->toArray();

        // Get low stock products
        $lowStockProducts = ProductVariant::with('product')
            ->where('stock', '<=', 5)
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'product_name' => $variant->product ? $variant->product->name : 'Unknown',
                    'sku' => $variant->sku,
                    'stock' => $variant->stock,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_customers' => $totalCustomers,
                'total_products' => $totalProducts,
                'total_variants' => $totalVariants,
            ],
            'recent_orders' => $recentOrders,
            'order_statuses' => $orderStatuses,
            'payment_statuses' => $paymentStatuses,
            'low_stock_products' => $lowStockProducts,
        ], 'app');
    }
}
