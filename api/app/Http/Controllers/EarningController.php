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

        $adminLogs = \App\Models\EarningsLog::with('sourceUser')
            ->where('type', 'Daily Admin Cut')
            ->orderBy('created_at', 'desc')
            ->get();

        $adminEarnings = $adminLogs->map(function($log) {
            $ambassadorLog = \App\Models\EarningsLog::where('type', 'Daily Ambassador Cut')
                ->where('source_user_id', $log->source_user_id)
                ->whereDate('created_at', $log->created_at->toDateString())
                ->first();

            $userLog = \App\Models\EarningsLog::where('type', 'Daily User Cut')
                ->where('source_user_id', $log->source_user_id)
                ->whereDate('created_at', $log->created_at->toDateString())
                ->first();

            $ambassadorCut = $ambassadorLog ? $ambassadorLog->amount : 0;
            $userCut = $userLog ? $userLog->amount : 0;
            $adminCut = $log->amount;
            $gross = $adminCut + $ambassadorCut + $userCut;

            return [
                'id' => $log->id,
                'user' => $log->sourceUser,
                'type' => 'Daily Trading Profit',
                'gross_amount' => $gross,
                'user_cut' => $userCut,
                'admin_cut' => $adminCut,
                'ambassador_cut' => $ambassadorCut,
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
