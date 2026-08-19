<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
    {
        $totalRevenue  = (float) Order::sum('grand_total');
        $thisMonth     = (float) Order::whereMonth('created_at', now()->month)->sum('grand_total');
        $lastMonth     = (float) Order::whereMonth('created_at', now()->subMonth()->month)->sum('grand_total');
        $monthTrend    = $lastMonth > 0 ? round(($thisMonth - $lastMonth) / $lastMonth * 100, 1) : 0;
        $totalRefunds  = (float) Order::where('status','refunded')->sum('grand_total');
        $netRevenue    = $totalRevenue - $totalRefunds;
        $totalOrders   = (int) Order::count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // Monthly revenue chart (last 12 months)
        $monthly = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $rev  = (float) Order::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('grand_total');
            $monthly->push(['month' => $date->format('M Y'), 'revenue' => $rev, 'expenses' => $rev * 0.35, 'profit' => $rev * 0.65]);
        }

        // Recent transactions
        $transactions = Order::with('user')->latest()->limit(10)->get()->map(fn($o) => [
            'id'          => $o->id,
            'ref'         => '#TXN-'.str_pad($o->id,6,'0',STR_PAD_LEFT),
            'customer'    => optional($o->user)->name ?? 'Guest',
            'amount'      => (float)$o->grand_total,
            'type'        => 'credit',
            'status'      => $o->status,
            'method'      => $o->payment_method ?? 'COD',
            'date'        => $o->created_at->format('d M Y'),
        ]);

        // Expense stubs
        $expenses = collect([
            ['category'=>'Shipping','amount'=>1200000,'pct'=>28,'color'=>'#3B82F6'],
            ['category'=>'Marketing','amount'=>900000,'pct'=>21,'color'=>'#8B5CF6'],
            ['category'=>'Operations','amount'=>750000,'pct'=>17,'color'=>'#10B981'],
            ['category'=>'Salaries','amount'=>1400000,'pct'=>32,'color'=>'#F59E0B'],
            ['category'=>'Other','amount'=>90000,'pct'=>2,'color'=>'#EF4444'],
        ]);

        // Invoices stub
        $invoices = Order::latest()->limit(8)->get()->map(fn($o) => [
            'id'       => '#INV-'.str_pad($o->id,5,'0',STR_PAD_LEFT),
            'customer' => optional($o->user)->name ?? 'Guest',
            'amount'   => (float)$o->grand_total,
            'status'   => in_array($o->status,['completed','processing']) ? 'paid' : ($o->status==='pending' ? 'pending' : 'overdue'),
            'due'      => $o->created_at->addDays(7)->format('d M Y'),
            'date'     => $o->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Finance/Index', [
            'stats'        => compact('totalRevenue','thisMonth','lastMonth','monthTrend','totalRefunds','netRevenue','avgOrderValue','totalOrders'),
            'monthly'      => $monthly,
            'transactions' => $transactions,
            'expenses'     => $expenses,
            'invoices'     => $invoices,
        ]);
    }
}
