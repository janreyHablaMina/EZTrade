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
        $grossAssets = $netBalance + $minusBonuses;

        $adminEarnings = $usersWithPlans->map(function($user) {
            $grossCut = $user->vipPlan->min_deposit * 0.05;
            $deduction = 0;
            
            if ($user->referred_by) {
                $deduction = $user->vipPlan->min_deposit * 0.05;
            }
            
            $netEarnings = $grossCut - $deduction;

            return [
                'id' => $user->id, // using user ID as a proxy for the transaction ID
                'user' => $user,
                'type' => 'VIP Plan Cut (5%)',
                'amount_earned' => $netEarnings,
                'gross_cut' => $grossCut,
                'deduction' => $deduction,
                'deposit_amount' => $user->vipPlan->min_deposit,
                'created_at' => $user->updated_at, // approximation of when plan was unlocked
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
