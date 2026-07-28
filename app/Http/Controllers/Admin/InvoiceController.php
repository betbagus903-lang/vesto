<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['order.customer'])
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = $request->search;
                $q->where('invoice_number', 'like', "%{$s}%")
                  ->orWhereHas('order', fn($o) => $o->where('order_number', 'like', "%{$s}%"))
                  ->orWhereHas('order.customer', fn($c) => $c->where('first_name', 'like', "%{$s}%")
                      ->orWhere('last_name', 'like', "%{$s}%"));
            })
            ->when($request->filled('payment_status'), fn($q) => $q->where('payment_status', $request->payment_status))
            ->orderBy('created_at', 'desc');

        $perPage  = (int) $request->get('per_page', 10);
        $invoices = $query->paginate($perPage);

        return Inertia::render('Admin/Sales/Invoices/Index', [
            'invoices' => $invoices->items(),
            'pagination' => [
                'total'        => $invoices->total(),
                'per_page'     => $invoices->perPage(),
                'current_page' => $invoices->currentPage(),
                'last_page'    => $invoices->lastPage(),
                'from'         => $invoices->firstItem() ?? 0,
                'to'           => $invoices->lastItem()  ?? 0,
            ],
            'filters' => [
                'search'         => $request->get('search', ''),
                'payment_status' => $request->get('payment_status', ''),
                'per_page'       => $perPage,
            ],
        ]);
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['order.user', 'order.addresses', 'order.items.product']);

        return Inertia::render('Admin/Sales/Invoices/Show', [
            'invoice' => [
                'id'             => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'payment_status' => $invoice->payment_status,
                'subtotal'       => $invoice->subtotal,
                'tax'            => $invoice->tax,
                'grand_total'    => $invoice->grand_total,
                'created_at'     => $invoice->created_at->format('d M Y, H:i'),
                'order'          => [
                    'id'        => $invoice->order->id,
                    'order_number' => $invoice->order->order_number,
                    'user'      => $invoice->order->user,
                    'addresses' => $invoice->order->addresses,
                    'items'     => $invoice->order->items,
                ],
            ],
        ]);
    }

    public function updatePaymentStatus(Request $request, Invoice $invoice)
    {
        $request->validate(['payment_status' => 'required|in:unpaid,paid,refunded']);
        $invoice->update(['payment_status' => $request->payment_status]);
        // Sync to order
        $invoice->order->update(['payment_status' => $request->payment_status]);
        return back()->with('success', 'Payment status updated.');
    }

    public function download(Invoice $invoice)
    {
        $invoice->load(['order.user', 'order.addresses', 'order.items.product']);

        $pdf = Pdf::loadView('invoices.pdf', compact('invoice'));

        return $pdf->download('invoice-' . $invoice->invoice_number . '.pdf');
    }
}
