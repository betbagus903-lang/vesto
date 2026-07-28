<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /* ── Index ──────────────────────────────────────────── */
    public function index(Request $request)
    {
        $query = Order::with('user')
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = $request->search;
                $q->where('order_number', 'like', "%{$s}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$s}%")
                      ->orWhere('email', 'like', "%{$s}%"));
            })
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('payment_status'), fn($q) => $q->where('payment_status', $request->payment_status))
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_order', 'desc'));

        $perPage = (int) $request->get('per_page', 10);
        $orders  = $query->paginate($perPage);

        return Inertia::render('Admin/Sales/Orders/Index', [
            'orders' => $orders->items(),
            'pagination' => [
                'total'        => $orders->total(),
                'per_page'     => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'from'         => $orders->firstItem() ?? 0,
                'to'           => $orders->lastItem()  ?? 0,
            ],
            'filters' => [
                'search'         => $request->get('search', ''),
                'status'         => $request->get('status', ''),
                'payment_status' => $request->get('payment_status', ''),
                'sort_by'        => $request->get('sort_by', 'created_at'),
                'sort_order'     => $request->get('sort_order', 'desc'),
                'per_page'       => $perPage,
            ],
        ]);
    }

    /* ── Create page ────────────────────────────────────── */
    public function create(Request $request)
    {
        $customer = null;
        if ($request->filled('customer_id')) {
            $customer = Customer::with('customerGroup')->find($request->customer_id);
        }

        return Inertia::render('Admin/Sales/Orders/Create', [
            'selectedCustomer' => $customer,
            'customerGroups'   => CustomerGroup::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /* ── Store ──────────────────────────────────────────── */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items'       => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty'        => 'required|integer|min:1',
            'notes'       => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            $subtotal = 0;
            $itemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price   = (float) $product->price;
                $qty     = (int) $item['qty'];
                $total   = $price * $qty;
                $subtotal += $total;

                $itemsData[] = [
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'sku'          => $product->sku,
                    'price'        => $price,
                    'qty'          => $qty,
                    'total'        => $total,
                ];
            }

            $tax        = round($subtotal * 0.11, 2); // 11% PPN
            $grandTotal = $subtotal + $tax;

            $order = Order::create([
                'customer_id'    => $request->customer_id,
                'status'         => 'pending',
                'channel'        => 'web',
                'subtotal'       => $subtotal,
                'tax'            => $tax,
                'grand_total'    => $grandTotal,
                'payment_status' => 'unpaid',
                'notes'          => $request->notes,
            ]);

            $order->items()->createMany($itemsData);
        });

        return redirect()->route('admin.sales.orders.index')->with('success', 'Order berhasil diperbarui.');
    }

    /* ── Show ───────────────────────────────────────────── */
    public function show(Order $order)
    {
        $order->load(['user', 'addresses', 'items.product', 'shipment', 'invoice']);

        return Inertia::render('Admin/Sales/Orders/Show', [
            'order' => [
                'id'                   => $order->id,
                'order_number'         => $order->order_number,
                'status'               => $order->status,
                'payment_status'       => $order->payment_status,
                'channel'              => $order->channel,
                'subtotal'             => $order->subtotal,
                'tax'                  => $order->tax,
                'grand_total'          => $order->grand_total,
                'shipping_amount'      => $order->shipping_amount,
                'payment_method'       => $order->payment_method,
                'shipping_method'      => $order->shipping_method,
                'notes'                => $order->notes,
                'created_at'           => $order->created_at->format('d M Y, H:i'),
                'user'                 => $order->user,
                'addresses'            => $order->addresses,
                'items'                => $order->items,
                'shipment'             => $order->shipment,
                'invoice'              => $order->invoice,
                'can_create_invoice'   => is_null($order->invoice),
                'can_create_shipment'  => ! is_null($order->invoice) && is_null($order->shipment),
            ],
        ]);
    }

    /* ── Update status ──────────────────────────────────── */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,completed,cancelled']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Order status updated.');
    }

    /* ── Create Invoice (from Order) ────────────────────── */
    public function createInvoice(Order $order)
    {
        if ($order->invoice) {
            return back()->with('error', 'Invoice already exists for this order.');
        }

        Invoice::create([
            'order_id'       => $order->id,
            'subtotal'       => $order->subtotal,
            'tax'            => $order->tax,
            'grand_total'    => $order->grand_total,
            'payment_status' => 'unpaid',
        ]);

        // Move order to processing
        if ($order->status === 'pending') {
            $order->update(['status' => 'processing']);
        }

        return back()->with('success', 'Invoice created successfully.');
    }

    /* ── Create Shipment (from Order, requires Invoice) ─── */
    public function createShipment(Request $request, Order $order)
    {
        if (! $order->invoice) {
            return back()->with('error', 'Please create an invoice first.');
        }

        if ($order->shipment) {
            return back()->with('error', 'Shipment already exists for this order.');
        }

        $request->validate([
            'carrier'         => 'nullable|string|max:100',
            'tracking_number' => 'nullable|string|max:100',
            'notes'           => 'nullable|string',
        ]);

        Shipment::create([
            'order_id'        => $order->id,
            'status'          => 'pending',
            'carrier'         => $request->carrier,
            'tracking_number' => $request->tracking_number ?: ('TRK-' . strtoupper(uniqid())),
            'notes'           => $request->notes,
        ]);

        // Move order to shipped
        $order->update(['status' => 'shipped']);

        return back()->with('success', 'Shipment created successfully.');
    }

    /* ── Search customers (for drawer) ─────────────────── */
    public function searchCustomers(Request $request)
    {
        $customers = Customer::with('customerGroup')
            ->when($request->filled('q'), function ($query) use ($request) {
                $s = $request->q;
                $query->where('first_name', 'like', "%{$s}%")
                      ->orWhere('last_name',  'like', "%{$s}%")
                      ->orWhere('email',      'like', "%{$s}%")
                      ->orWhere('phone',      'like', "%{$s}%");
            })
            ->limit(20)
            ->get(['id', 'first_name', 'last_name', 'email', 'phone', 'customer_group_id']);

        return response()->json($customers);
    }

    /* ── Search products (for drawer) ──────────────────── */
    public function searchProducts(Request $request)
    {
        $products = Product::when($request->filled('q'), function ($query) use ($request) {
                $s = $request->q;
                $query->where('name', 'like', "%{$s}%")
                      ->orWhere('sku',  'like', "%{$s}%");
            })
            ->where('status', true)
            ->limit(20)
            ->get(['id', 'name', 'sku', 'price', 'stock']);

        return response()->json($products);
    }
}
