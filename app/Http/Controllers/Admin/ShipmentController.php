<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Shipment::with(['order.customer'])
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = $request->search;
                $q->where('shipment_number', 'like', "%{$s}%")
                  ->orWhereHas('order', fn($o) => $o->where('order_number', 'like', "%{$s}%"))
                  ->orWhereHas('order.customer', fn($c) => $c->where('first_name', 'like', "%{$s}%")
                      ->orWhere('last_name', 'like', "%{$s}%"));
            })
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc');

        $perPage   = (int) $request->get('per_page', 10);
        $shipments = $query->paginate($perPage);

        return Inertia::render('Admin/Sales/Shipments/Index', [
            'shipments' => $shipments->items(),
            'pagination' => [
                'total'        => $shipments->total(),
                'per_page'     => $shipments->perPage(),
                'current_page' => $shipments->currentPage(),
                'last_page'    => $shipments->lastPage(),
                'from'         => $shipments->firstItem() ?? 0,
                'to'           => $shipments->lastItem()  ?? 0,
            ],
            'filters' => [
                'search'   => $request->get('search', ''),
                'status'   => $request->get('status', ''),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function show(Shipment $shipment)
    {
        $shipment->load(['order.user', 'order.addresses', 'order.items.product']);

        $totalQty = $shipment->order->items->sum('qty');

        return Inertia::render('Admin/Sales/Shipments/Show', [
            'shipment' => [
                'id'              => $shipment->id,
                'shipment_number' => $shipment->shipment_number,
                'status'          => $shipment->status,
                'carrier'         => $shipment->carrier,
                'tracking_number' => $shipment->tracking_number,
                'notes'           => $shipment->notes,
                'created_at'      => $shipment->created_at->format('d M Y, H:i'),
                'total_qty'       => $totalQty,
                'order'           => [
                    'id'        => $shipment->order->id,
                    'order_number' => $shipment->order->order_number,
                    'user'      => $shipment->order->user,
                    'addresses' => $shipment->order->addresses,
                    'items'     => $shipment->order->items,
                ],
            ],
        ]);
    }

    public function updateStatus(Request $request, Shipment $shipment)
    {
        $request->validate(['status' => 'required|in:pending,shipped,delivered,returned']);
        $shipment->update(['status' => $request->status]);
        return back()->with('success', 'Shipment status updated.');
    }
}
