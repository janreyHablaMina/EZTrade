<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        // For admin, maybe return all. But usually we separate admin/user routes.
        // Let's check if there is an admin param or just return user notifications.
        $userId = $request->query('user_id');
        
        if ($userId) {
            // Get user specific notifications + global notifications
            $notifications = Notification::where('user_id', $userId)
                                       ->orWhereNull('user_id')
                                       ->orderBy('created_at', 'desc')
                                       ->get();
            return response()->json($notifications);
        }

        // Admin: get all notifications sent
        $notifications = Notification::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
        ]);

        $notification = Notification::create([
            'user_id' => $request->user_id, // null means all users
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);
        
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        
        Notification::where('user_id', $request->user_id)
            ->orWhereNull('user_id')
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
