<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductQuestion;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Achievement;
use App\Models\Victory;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
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
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', today())->count();
        $totalQuestions = ProductQuestion::count();
        $unansweredQuestions = ProductQuestion::whereNull('answer')->count();

        // Achievement System - Monthly Target
        $currentMonth = now()->format('Y-m');
        $monthlyTarget = 300000000; // Target: 300 juta IDR

        // Get or create current month achievement
        $achievement = Achievement::firstOrCreate(
            ['month_year' => $currentMonth],
            [
                'target_amount' => $monthlyTarget,
                'current_revenue' => 0,
                'progress_percentage' => 0,
                'target_achieved' => false,
                'processed' => false,
            ]
        );

        // Update current revenue for this month
        $monthlyRevenue = Order::where('payment_status', 'paid')
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->sum('grand_total');

        $achievement->current_revenue = $monthlyRevenue;
        $achievement->progress_percentage = $monthlyTarget > 0 ? ($monthlyRevenue / $monthlyTarget) * 100 : 0;
        $achievement->target_achieved = $achievement->progress_percentage >= 100;
        $achievement->save();

        // Get total victories
        $victory = Victory::firstOrCreate(['id' => 1], ['total_victories' => 0, 'last_processed_month' => null]);

        // Check if we need to process month-over-month (first visit of new month)
        if ($victory->last_processed_month && $victory->last_processed_month !== $currentMonth) {
            // Check if previous month achieved target
            $previousMonthAchievement = Achievement::where('month_year', $victory->last_processed_month)->first();
            if ($previousMonthAchievement && $previousMonthAchievement->target_achieved && !$previousMonthAchievement->processed) {
                $victory->total_victories += 1;
                $previousMonthAchievement->processed = true;
                $previousMonthAchievement->save();
            }
            $victory->last_processed_month = $currentMonth;
            $victory->save();
        } else if (!$victory->last_processed_month) {
            $victory->last_processed_month = $currentMonth;
            $victory->save();
        }

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

        // Get recent product questions
        $recentQuestions = ProductQuestion::with(['user', 'product'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'answer' => $question->answer,
                    'created_at' => $question->created_at->format('d M Y, H:i'),
                    'user' => [
                        'name' => $question->user->name ?? 'Unknown',
                    ],
                    'product' => [
                        'name' => $question->product->name ?? 'Unknown',
                    ],
                ];
            });

        // Get top products by sales
        $topProducts = OrderItem::selectRaw('product_id, SUM(quantity) as total_sold, SUM(quantity * price) as total_revenue')
            ->with('product')
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->product ? $item->product->name : 'Unknown',
                    'sales' => $item->total_sold,
                    'revenue' => $item->total_revenue,
                ];
            });

        // Get sales data for chart (last 8 days for Revenue Analytics)
        $salesData = Order::selectRaw("strftime('%Y-%m-%d', created_at) as date, SUM(grand_total) as total_revenue, COUNT(*) as total_orders")
            ->where('created_at', '>=', now()->subDays(8))
            ->where('payment_status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'revenue' => $item->total_revenue,
                    'orders' => $item->total_orders,
                ];
            });

        // Get top categories by revenue - process in PHP to avoid duplication
        $orderItems = OrderItem::select('oi.id', 'oi.quantity', 'oi.price', 'p.id as product_id')
            ->from('order_items as oi')
            ->join('products as p', 'oi.product_id', '=', 'p.id')
            ->join('orders as o', 'oi.order_id', '=', 'o.id')
            ->where('o.payment_status', 'paid')
            ->get();

        $categoryRevenue = [];
        foreach ($orderItems as $item) {
            $categories = DB::select("
                SELECT cp.category_id, c.name
                FROM category_product cp
                JOIN categories c ON cp.category_id = c.id
                WHERE cp.product_id = ?
                AND cp.category_id IN (19, 20, 21, 22, 23, 24, 25, 26, 27, 28)
                ORDER BY cp.category_id ASC
                LIMIT 1
            ", [$item->product_id]);

            if (!empty($categories)) {
                $cat = $categories[0];
                $revenue = $item->quantity * $item->price;
                if (!isset($categoryRevenue[$cat->category_id])) {
                    $categoryRevenue[$cat->category_id] = [
                        'id' => $cat->category_id,
                        'name' => $cat->name,
                        'revenue' => 0,
                    ];
                }
                $categoryRevenue[$cat->category_id]['revenue'] += $revenue;
            }
        }

        // Sort by revenue and take top 4
        usort($categoryRevenue, function ($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });
        $categoryRevenue = array_slice($categoryRevenue, 0, 4);
        $categoryRevenue = collect($categoryRevenue);

        // Calculate trends vs last month
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereYear('created_at', now()->subMonth()->year)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->sum('grand_total');

        $lastMonthOrders = Order::whereYear('created_at', now()->subMonth()->year)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->count();

        $lastMonthUsers = User::whereYear('created_at', now()->subMonth()->year)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->count();

        $revenueTrend = $lastMonthRevenue > 0 ? (($totalRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0;
        $ordersTrend = $lastMonthOrders > 0 ? (($totalOrders - $lastMonthOrders) / $lastMonthOrders) * 100 : 0;
        $usersTrend = $lastMonthUsers > 0 ? (($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'new_users_today' => $newUsersToday,
                'total_questions' => $totalQuestions,
                'unanswered_questions' => $unansweredQuestions,
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_victories' => $victory->total_victories,
                'revenue_trend' => $revenueTrend,
                'orders_trend' => $ordersTrend,
                'users_trend' => $usersTrend,
            ],
            'recentQuestions' => $recentQuestions,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'salesData' => $salesData,
            'topCategories' => $categoryRevenue,
            'achievement' => [
                'target_amount' => $achievement->target_amount,
                'current_revenue' => $achievement->current_revenue,
                'progress_percentage' => $achievement->progress_percentage,
                'target_achieved' => $achievement->target_achieved,
            ],
        ], 'app');
    }
}
