<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\CustomerGroup;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->get();
        
        $stats = [
            'total' => Coupon::count(),
            'active' => Coupon::where('is_active', true)->where(function($q) {
                $q->whereNull('expire_date')->orWhere('expire_date', '>=', now());
            })->count(),
            'expired' => Coupon::where('expire_date', '<', now())->count(),
            'total_usage' => Coupon::sum('used_count'),
        ];
        
        return Inertia::render('Admin/Marketing/Coupons/Index', [
            'coupons' => $coupons,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Marketing/Coupons/Create', [
            'categories' => Category::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get(),
            'customerGroups' => CustomerGroup::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:coupons',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed,free_shipping,buy_x_get_y',
            'discount_value' => 'nullable|numeric|min:0',
            'minimum_order' => 'nullable|numeric|min:0',
            'maximum_discount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'expire_date' => 'nullable|date|after:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'per_customer_limit' => 'required|integer|min:1',
            'applicable_categories' => 'nullable|array',
            'applicable_products' => 'nullable|array',
            'customer_groups' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        Coupon::create($validated);
        return redirect()->route('admin.marketing.coupons.index');
    }

    public function edit($id)
    {
        $coupon = Coupon::findOrFail($id);
        
        return Inertia::render('Admin/Marketing/Coupons/Create', [
            'coupon' => $coupon,
            'categories' => Category::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get(),
            'customerGroups' => CustomerGroup::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:coupons,code,' . $id,
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed,free_shipping,buy_x_get_y',
            'discount_value' => 'nullable|numeric|min:0',
            'minimum_order' => 'nullable|numeric|min:0',
            'maximum_discount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'expire_date' => 'nullable|date|after:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'per_customer_limit' => 'required|integer|min:1',
            'applicable_categories' => 'nullable|array',
            'applicable_products' => 'nullable|array',
            'customer_groups' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $coupon->update($validated);
        return redirect()->route('admin.marketing.coupons.index');
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return redirect()->route('admin.marketing.coupons.index');
    }
}
