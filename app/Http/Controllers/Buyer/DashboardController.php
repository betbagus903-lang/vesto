<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\UserCoupon;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Total pesanan & completed orders
        $totalOrders = Order::where('user_id', $user->id)->count();
        $completedOrders = Order::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        // Total wishlist
        $wishlistCount = Wishlist::where('user_id', $user->id)->count();

        // Kupon aktif milik user
        $activeCoupons = UserCoupon::where('user_id', $user->id)
            ->where('is_used', false)
            ->whereHas('coupon', function ($query) {
                $query->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('expire_date')
                            ->orWhere('expire_date', '>=', now());
                    });
            })
            ->count();

        // Total pengeluaran (sum dari order yang sudah selesai/dibayar)
        $totalSpending = Order::where('user_id', $user->id)
            ->whereIn('status', ['completed', 'shipped', 'processing'])
            ->sum('grand_total');

        // 5 pesanan terbaru
        $recentOrders = Order::with(['items.product'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                $firstItem = $order->items->first();
                return [
                    'id' => $order->order_number ?? $order->id,
                    'date' => $order->created_at->translatedFormat('d M Y'),
                    'product' => $firstItem?->product?->name ?? 'Produk',
                    'price' => $order->grand_total,
                    'status' => $this->translateStatus($order->status),
                    'image' => $firstItem?->product?->thumbnail_url ?? null,
                ];
            });

        // Wishlist asli
        $wishlistProducts = Wishlist::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($wishlist) {
                return [
                    'id' => $wishlist->id,
                    'product_id' => $wishlist->product_id,
                    'name' => $wishlist->product->name,
                    'price' => $wishlist->product->price,
                    'image' => $wishlist->product->thumbnail_url,
                ];
            });

        // Aktivitas belanja 6 bulan terakhir (grouping per bulan)
        // Use SQLite-compatible strftime for date formatting
        $activityData = Order::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw("strftime('%m', created_at) as month_num, COUNT(*) as orders, SUM(grand_total) as spending")
            ->groupBy('month_num')
            ->orderBy(DB::raw('MIN(created_at)'))
            ->get()
            ->map(fn ($row) => [
                'month' => $this->getMonthName($row->month_num),
                'orders' => $row->orders,
                'spending' => round($row->spending / 1000000, 2), // dalam jutaan
            ]);

        // Rekomendasi produk (produk populer/terbaru di luar yang sudah dibeli)
        $purchasedProductIds = OrderItem::whereHas('order', fn ($q) => $q->where('user_id', $user->id))
            ->pluck('product_id');

        $recommendedProducts = Product::whereNotIn('id', $purchasedProductIds)
            ->where('status', true)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => $p->price,
                'oldPrice' => $p->compare_at_price > $p->price ? $p->compare_at_price : null,
                'discount' => $p->compare_at_price > $p->price
                    ? round((($p->compare_at_price - $p->price) / $p->compare_at_price) * 100)
                    : null,
                'image' => $p->thumbnail_url,
            ]);

        // Recently viewed (karena belum ada tabel product_views, return empty array)
        $recentlyViewed = [];

        // Get active promotion banner for buyer dashboard
        $promotionBanner = Banner::active()
            ->byType('promotion')
            ->bySlot('buyer_dashboard')
            ->sorted()
            ->first();

        return Inertia::render('Buyer/Dashboard', [
            'personalStats' => [
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'wishlist' => $wishlistCount,
                'coupons' => $activeCoupons,
                'totalSpending' => $totalSpending,
            ],
            'recentOrders' => $recentOrders,
            'wishlistProducts' => $wishlistProducts,
            'activityData' => $activityData,
            'recommendedProducts' => $recommendedProducts,
            'recentlyViewed' => $recentlyViewed,
            'promotionBanner' => $promotionBanner,
        ]);
    }

    public function orders(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'addresses', 'shipment', 'statusHistory'])
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
                    'shipment' => $order->shipment ? [
                        'carrier' => $order->shipment->carrier,
                        'tracking_number' => $order->shipment->tracking_number,
                        'estimated_delivery' => $order->shipment->estimated_delivery ?? null,
                    ] : null,
                    'status_history' => $order->statusHistory->map(function ($history) {
                        return [
                            'id' => $history->id,
                            'status' => $history->status,
                            'label' => $history->label,
                            'description' => $history->description,
                            'date' => $history->changed_at->translatedFormat('d M Y · H:i'),
                        ];
                    }),
                ];
            });

        return Inertia::render('Buyer/Orders', [
            'orders' => $orders,
        ]);
    }

    private function translateStatus($status)
    {
        return match($status) {
            'pending' => 'Dikemas',
            'processing' => 'Dikemas',
            'shipped' => 'Dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default => ucfirst($status),
        };
    }

    public function wishlist(Request $request)
    {
        $user = $request->user();

        $wishlistProducts = Wishlist::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->get()
            ->map(function ($wishlist) {
                return [
                    'id' => $wishlist->id,
                    'product_id' => $wishlist->product_id,
                    'name' => $wishlist->product->name,
                    'price' => $wishlist->product->price,
                    'original_price' => $wishlist->product->compare_at_price > $wishlist->product->price ? $wishlist->product->compare_at_price : null,
                    'discount' => $wishlist->product->compare_at_price > $wishlist->product->price
                        ? round((($wishlist->product->compare_at_price - $wishlist->product->price) / $wishlist->product->compare_at_price) * 100)
                        : null,
                    'image' => $wishlist->product->thumbnail_url,
                    'rating' => 4,
                    'reviews' => rand(10, 100),
                ];
            });

        return Inertia::render('Buyer/Wishlist', [
            'wishlistProducts' => $wishlistProducts,
        ]);
    }

    private function getMonthName($monthNum)
    {
        return match($monthNum) {
            '01' => 'Jan',
            '02' => 'Feb',
            '03' => 'Mar',
            '04' => 'Apr',
            '05' => 'Mei',
            '06' => 'Jun',
            '07' => 'Jul',
            '08' => 'Agu',
            '09' => 'Sep',
            '10' => 'Okt',
            '11' => 'Nov',
            '12' => 'Des',
            default => $monthNum,
        };
    }

    public function reviews(Request $request)
    {
        $user = $request->user();

        $reviews = Review::where('user_id', $user->id)
            ->with(['product', 'variant'])
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'images' => $review->images,
                    'status' => $review->status,
                    'created_at' => $review->created_at->translatedFormat('d M Y'),
                    'product' => [
                        'id' => $review->product->id,
                        'name' => $review->product->name,
                        'image' => $review->product->thumbnail_url,
                        'price' => $review->product->price,
                    ],
                    'variant' => $review->variant ? [
                        'id' => $review->variant->id,
                        'name' => $review->variant->name,
                    ] : null,
                ];
            });

        return Inertia::render('Buyer/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function coupons(Request $request)
    {
        $user = $request->user();

        // Get user's coupons (coupons assigned to this user)
        $userCoupons = UserCoupon::where('user_id', $user->id)
            ->with('coupon')
            ->get()
            ->map(function ($userCoupon) {
                $coupon = $userCoupon->coupon;
                return [
                    'id' => $userCoupon->id,
                    'code' => $coupon->code,
                    'description' => $coupon->description,
                    'discount_type' => $coupon->discount_type,
                    'discount_value' => $coupon->discount_value,
                    'minimum_order' => $coupon->minimum_order,
                    'maximum_discount' => $coupon->maximum_discount,
                    'start_date' => $coupon->start_date ? $coupon->start_date->format('Y-m-d') : null,
                    'expire_date' => $coupon->expire_date ? $coupon->expire_date->format('Y-m-d') : null,
                    'is_used' => $userCoupon->is_used,
                    'used_at' => $userCoupon->used_at ? $userCoupon->used_at->translatedFormat('d M Y') : null,
                    'status' => $userCoupon->is_used ? 'used' : ($coupon->expire_date && now()->gt($coupon->expire_date) ? 'expired' : 'active'),
                ];
            });

        return Inertia::render('Buyer/Coupons', [
            'coupons' => $userCoupons,
        ]);
    }
}