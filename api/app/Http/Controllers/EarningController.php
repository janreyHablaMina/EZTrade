<?php

namespace App\Http\Controllers;

use App\Models\TradingCodeRedemption;
use Illuminate\Http\Request;

class EarningController extends Controller
{
    public function index()
    {
        $deposits = \App\Models\Deposit::with('user')
            ->where('status', 'Approved')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalPlatformDeposits = $deposits->sum('amount');
        
        $activeTradeCapital = 0;
        $usersWithPlans = \App\Models\User::with('vipPlan')
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();
            
        foreach ($usersWithPlans as $u) {
            if ($u->vipPlan) {
                $activeTradeCapital += $u->vipPlan->min_deposit;
            }
        }
        
        $minusBonuses = 0;
        foreach ($usersWithPlans as $u) {
            if ($u->vipPlan && $u->referred_by) {
                $minusBonuses += $u->vipPlan->min_deposit * 0.05; // 5% deduction for VIP plan purchase
            }
        }

        $admin = \App\Models\User::where('role', 'Admin')->first();
        $netBalance = $admin ? $admin->balance : 0;

        $earningsLogs = \App\Models\EarningsLog::with('sourceUser')->orderBy('created_at', 'desc')->get();
        $grossAssets = $earningsLogs->where('type', 'Daily Admin Cut')->sum('amount');
        $minusBonuses = $earningsLogs->where('type', 'Daily Ambassador Cut')->sum('amount');

        $adminEarnings = $earningsLogs->map(function($log) {
            return [
                'id' => $log->id,
                'user' => $log->sourceUser,
                'type' => $log->type,
                'amount_earned' => $log->amount,
                'gross_cut' => $log->amount,
                'deduction' => 0,
                'deposit_amount' => $log->deposit_amount,
                'created_at' => $log->created_at,
            ];
        });
        
        return response()->json([
            'financials' => [
                'totalPlatformDeposits' => $totalPlatformDeposits,
                'activeTradeCapital' => $activeTradeCapital,
                'grossAssets' => $grossAssets,
                'minusBonuses' => $minusBonuses,
                'netBalance' => $netBalance,
            ],
            'earnings' => $adminEarnings
        ]);
    }
}
