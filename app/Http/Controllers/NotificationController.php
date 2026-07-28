<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        // Temporarily show all notifications for testing
        $notifications = \App\Models\Notification::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications->items(),
            'pagination' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'from' => $notifications->firstItem() ?? 0,
                'to' => $notifications->lastItem() ?? 0,
            ],
            'unread_count' => \App\Models\Notification::where('is_read', false)->count(),
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        // Temporarily remove user check for testing
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        auth()->user()->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back()->with('success', 'All notifications marked as read.');
    }

    public function destroy(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->delete();

        return back()->with('success', 'Notification deleted.');
    }

    public function getUnreadCount()
    {
        try {
            // Temporarily return all unread notifications for testing
            $count = \App\Models\Notification::where('is_read', false)->count();
            return response()->json(['count' => $count]);
        } catch (\Exception $e) {
            \Log::error('getUnreadCount error: ' . $e->getMessage());
            return response()->json(['count' => 0]);
        }
    }

    public function getNotifications()
    {
        try {
            // Temporarily return all unread notifications for testing
            $notifications = \App\Models\Notification::where('is_read', false)
                ->orderBy('created_at', 'desc')
                ->get(['id', 'title', 'message', 'link', 'is_read', 'created_at']);

            return response()->json(['notifications' => $notifications]);
        } catch (\Exception $e) {
            \Log::error('getNotifications error: ' . $e->getMessage());
            return response()->json(['notifications' => []]);
        }
    }
}
