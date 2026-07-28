<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product', 'reviews'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Buyer/Dashboard', [
            'user' => $request->user(),
            'orders' => $orders,
        ]);
    }
}