<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index()
    {
        // Fetch users and their asset metrics
        $users = User::with(['deposits' => function($q) {
                $q->where('status', 'Approved')->orWhere('status', 'Completed');
            }, 'withdrawals' => function($q) {
                $q->where('status', 'Approved')->orWhere('status', 'Completed');
            }])
            ->orderBy('balance', 'desc')
            ->get();

        $data = $users->map(function ($user) {
            $totalDeposited = $user->deposits->sum('amount');
            $totalWithdrawn = $user->withdrawals->sum('amount');
            
            return [
                'id' => 'USR' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'dbId' => $user->id,
                'userName' => $user->name,
                'userEmail' => $user->email,
                'vipLevel' => $user->vip_plan_id ?? 1,
                'balance' => $user->balance,
                'totalDeposited' => $totalDeposited,
                'totalWithdrawn' => $totalWithdrawn,
                'status' => $user->status ?? 'Active',
            ];
        });

        return response()->json($data);
    }
}
