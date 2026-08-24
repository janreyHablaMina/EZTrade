<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Get a list of all conversations for the admin (grouped by user).
     * Returns the latest message for each user.
     */
    public function getConversations()
    {
        // Get the latest message per user
        $subquery = Message::select('sender_id', 'receiver_id', DB::raw('MAX(id) as last_message_id'))
            ->groupBy('sender_id', 'receiver_id');

        // We assume admin's receiver_id might be null or a specific ID, let's treat admin as a special case.
        // Actually, for simplicity, let's just group by the non-admin user ID.
        // If sender_id is admin, non-admin is receiver_id.
        // If receiver_id is admin, non-admin is sender_id.
        
        // A simple way to get all distinct users who have sent or received a message
        $userIds = Message::select('sender_id')->distinct()->pluck('sender_id')
            ->concat(Message::select('receiver_id')->whereNotNull('receiver_id')->distinct()->pluck('receiver_id'))
            ->unique()
            ->filter(function($id) { 
                // Exclude admin if we know the admin ID, but for now we just return all users and the frontend can filter
                return true; 
            });
            
        $users = User::whereIn('id', $userIds)->get()->map(function($user) {
            $lastMessage = Message::where(function($query) use ($user) {
                    $query->where('sender_id', $user->id)
                          ->orWhere('receiver_id', $user->id);
                })
                ->orderBy('created_at', 'desc')
                ->first();
                
            $unreadCount = Message::where('sender_id', $user->id)
                ->where('is_read', false)
                ->count();
                
            return [
                'user' => $user,
                'last_message' => $lastMessage,
                'unread_count' => $unreadCount
            ];
        })->sortByDesc(function($item) {
            return $item['last_message']->created_at ?? now();
        })->values();

        return response()->json($users);
    }

    /**
     * Get chat history with a specific user.
     */
    public function getHistory($userId)
    {
        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }

    /**
     * Send a new message.
     */
    public function send(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'nullable|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message->load(['sender', 'receiver'])
        ], 201);
    }

    /**
     * Mark messages from a specific user as read (Admin side).
     */
    public function markAsRead(Request $request, $userId)
    {
        Message::where('sender_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
            
        return response()->json(['message' => 'Messages marked as read']);
    }
    
    /**
     * Get total unread count for admin.
     */
    public function getUnreadCount()
    {
        $count = Message::where('is_read', false)
            ->whereNull('receiver_id') // Assuming messages TO admin have receiver_id = null
            ->orWhereHas('receiver', function($q) {
                $q->where('role', 'admin'); // If admin has role
            })
            ->count();
            
        return response()->json(['count' => $count]);
    }
}
