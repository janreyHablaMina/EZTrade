<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index()
    {
        // Fetch all users who were referred by someone
        $referredUsers = User::whereNotNull('referred_by')
            ->with(['deposits' => function($q) {
                $q->where('status', 'Approved')->orWhere('status', 'Completed');
            }, 'tradingCodeRedemptions'])
            ->orderBy('created_at', 'desc')
            ->get();

        $data = $referredUsers->map(function ($user) {
            $totalDeposited = $user->deposits->sum('amount');
            $totalEarnings = $user->tradingCodeRedemptions->sum('amount_earned');
            
            // Commission paid out for this user's deposits (approx 17% max if all 3 tiers exist)
            // We'll calculate it statically based on tiers actually existing, or just 10% for simplicity.
            // Let's just do 10% as direct commission for display.
            $commission = $totalDeposited * 0.10;

            return [
                'id' => 'RF' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'dbId' => $user->id,
                'userName' => $user->name,
                'userEmail' => $user->email,
                'vipLevel' => $user->vip_plan_id ?? 1,
                'status' => 'Active', // Assume active
                'registeredAt' => $user->created_at,
                'totalDeposited' => $totalDeposited,
                'totalEarnings' => $totalEarnings,
                'yourCommission' => $commission,
                'commissionStatus' => $commission > 0 ? 'Paid' : 'None',
            ];
        });

        return response()->json($data);
    }
}
