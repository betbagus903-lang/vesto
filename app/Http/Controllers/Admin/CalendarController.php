<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        // Build events from orders and new customers
        $orderEvents = Order::latest()->limit(30)->get()->map(fn($o) => [
            'id'    => 'order-'.$o->id,
            'title' => 'Order #'.str_pad($o->id,4,'0',STR_PAD_LEFT),
            'date'  => $o->created_at->format('Y-m-d'),
            'time'  => $o->created_at->format('H:i'),
            'type'  => 'order',
            'color' => '#3B82F6',
            'meta'  => optional($o->user)->name ?? 'Guest',
        ]);

        $customerEvents = User::where('role','buyer')->latest()->limit(20)->get()->map(fn($u) => [
            'id'    => 'cust-'.$u->id,
            'title' => 'New Customer: '.$u->name,
            'date'  => $u->created_at->format('Y-m-d'),
            'time'  => $u->created_at->format('H:i'),
            'type'  => 'customer',
            'color' => '#10B981',
            'meta'  => $u->email,
        ]);

        // Static reminder events
        $reminders = collect([
            ['id'=>'rem-1','title'=>'Monthly Finance Review','date'=>now()->format('Y-m').'-05','time'=>'09:00','type'=>'reminder','color'=>'#F59E0B','meta'=>'Finance Team'],
            ['id'=>'rem-2','title'=>'Supplier Meeting','date'=>now()->format('Y-m').'-12','time'=>'14:00','type'=>'meeting','color'=>'#8B5CF6','meta'=>'Procurement'],
            ['id'=>'rem-3','title'=>'Inventory Audit','date'=>now()->format('Y-m').'-18','time'=>'10:00','type'=>'task','color'=>'#EF4444','meta'=>'Warehouse'],
            ['id'=>'rem-4','title'=>'Marketing Campaign Launch','date'=>now()->format('Y-m').'-22','time'=>'08:00','type'=>'campaign','color'=>'#EC4899','meta'=>'Marketing'],
        ]);

        $allEvents = $orderEvents->concat($customerEvents)->concat($reminders)->sortByDesc('date')->values();

        $upcomingToday = $allEvents->where('date', now()->format('Y-m-d'))->values();

        return Inertia::render('Admin/Calendar/Index', [
            'events'        => $allEvents,
            'upcomingToday' => $upcomingToday,
            'currentMonth'  => now()->format('Y-m'),
            'stats'  => [
                'total_events'   => $allEvents->count(),
                'orders_today'   => $orderEvents->where('date', now()->format('Y-m-d'))->count(),
                'meetings'       => $reminders->whereIn('type',['meeting','reminder'])->count(),
                'tasks_due'      => $reminders->where('type','task')->count(),
            ],
        ]);
    }
}
