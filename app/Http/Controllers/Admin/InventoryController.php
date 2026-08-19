<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $search   = $request->input('search');
        $filter   = $request->input('filter', 'all'); // all|low|out|overstock
        $sort     = $request->input('sort', 'name');
        $dir      = $request->input('dir', 'asc');

        $query = Product::select('id','name','sku','stock','price','type','is_active')
            ->when($search, fn($q) => $q->where('name','like',"%$search%")->orWhere('sku','like',"%$search%"))
            ->when($filter === 'low',       fn($q) => $q->where('stock','>',0)->where('stock','<=',10))
            ->when($filter === 'out',       fn($q) => $q->where('stock','<=',0))
            ->when($filter === 'overstock', fn($q) => $q->where('stock','>',100))
            ->orderBy($sort, $dir);

        $products = $query->paginate(20)->withQueryString();

        $stats = [
            'total_products'    => Product::count(),
            'in_stock'          => Product::where('stock','>',10)->count(),
            'low_stock'         => Product::where('stock','>',0)->where('stock','<=',10)->count(),
            'out_of_stock'      => Product::where('stock','<=',0)->count(),
            'overstock'         => Product::where('stock','>',100)->count(),
            'total_stock_value' => (float) DB::table('products')->selectRaw('SUM(stock * price) as val')->value('val'),
        ];

        return Inertia::render('Admin/Inventory/Index', [
            'products' => $products,
            'stats'    => $stats,
            'filters'  => compact('search','filter','sort','dir'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['stock' => 'required|integer|min:0']);
        $product = Product::findOrFail($id);
        $product->update(['stock' => $request->stock]);
        return back()->with('success', 'Stock updated.');
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate(['updates' => 'required|array', 'updates.*.id' => 'required|integer', 'updates.*.stock' => 'required|integer|min:0']);
        foreach ($request->updates as $u) {
            Product::where('id', $u['id'])->update(['stock' => $u['stock']]);
        }
        return back()->with('success', 'Bulk stock updated.');
    }
}
