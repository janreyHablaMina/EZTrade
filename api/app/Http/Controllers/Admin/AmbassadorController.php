<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AmbassadorController extends Controller
{
    public function index()
    {
        // Fetch all users with role 'Ambassador'
        $ambassadors = User::where('role', 'Ambassador')
            ->orderBy('created_at', 'desc')
            ->get();

        $data = $ambassadors->map(function ($ambassador) {
            // Get all downline users
            $downline = User::where('referred_by', $ambassador->id)->get();
            $downlineCount = $downline->count();
            
            // Total assets (balance) of downline
            $totalDownlineAssets = $downline->sum('balance');
            
            // "Daily Earnings (5%)" - as requested in mock, calculate 5% of downline assets as a placeholder admin earnings metric
            $dailyEarnings = $totalDownlineAssets * 0.05;

            return [
                'id' => 'AMB' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
                'dbId' => $ambassador->id,
                'name' => $ambassador->name,
                'email' => $ambassador->email,
                'status' => $ambassador->status ?? 'Active',
                'registeredAt' => $ambassador->created_at,
                'teamSize' => $downlineCount + 1,
                'downlineCount' => $downlineCount,
                'totalDownlineAssets' => $totalDownlineAssets,
                'dailyEarnings' => $dailyEarnings,
                'referralCode' => $ambassador->referral_code ?? 'N/A',
            ];
        });

        return response()->json($data);
    }

    public function show($id)
    {
        $ambassador = User::findOrFail($id);
        
        $downline = User::where('referred_by', $ambassador->id)->get();
        $downlineCount = $downline->count();
        $totalDownlineAssets = $downline->sum('balance');
        
        $downlineIds = $downline->pluck('id');
        $deposits = \App\Models\Deposit::whereIn('user_id', $downlineIds)
            ->where('status', 'Approved')
            ->get();
        
        $totalDownlineDeposits = $deposits->sum('amount');
        
        // Calculate Active Trade Capital (only users with active VIP plans)
        $usersWithPlans = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();
            
        $activeTradeCapital = 0;
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

        $netBalance = $ambassador->balance;
        $grossAssets = $netBalance + $minusBonuses; // Total earnings before deductions

        return response()->json([
            'id' => 'EZT-' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
            'dbId' => $ambassador->id,
            'name' => $ambassador->name,
            'email' => $ambassador->email,
            'phone' => $ambassador->phone ?? 'N/A',
            'status' => $ambassador->status ?? 'Active',
            'kycStatus' => $ambassador->kyc_status ?? 'Not Verified',
            'registeredAt' => $ambassador->created_at->format('M d, Y, h:i A'),
            'balance' => $ambassador->balance ?? 0,
            'teamSize' => $downlineCount + 1,
            'downlineCount' => $downlineCount,
            'activeTradeCapital' => $activeTradeCapital,
            'dailyEarnings' => 0, // unused
            'referralCode' => $ambassador->referral_code ?? 'N/A',
            'financials' => [
                'totalDownlineDeposits' => $totalDownlineDeposits,
                'activeTradeCapital' => $activeTradeCapital,
                'grossAssets' => $grossAssets,
                'minusBonuses' => $minusBonuses,
                'netBalance' => $netBalance,
            ]
        ]);
    }

    public function downline($id)
    {
        $ambassador = User::findOrFail($id);
        $users = User::with('vipPlan')
            ->where('referred_by', $ambassador->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($users);
    }

    public function earnings($id)
    {
        $ambassador = User::findOrFail($id);
        $downlineIds = User::where('referred_by', $ambassador->id)->pluck('id');
        
        $usersWithPlans = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->orderBy('updated_at', 'desc')
            ->get();

        $earnings = $usersWithPlans->map(function($user) use ($ambassador) {
            $grossCut = $user->vipPlan->min_deposit * 0.05;
            $deduction = 0;
            $directBonus = 0;
            
            if ($user->referred_by) {
                $deduction = $user->vipPlan->min_deposit * 0.05; // ALWAYS deducted
                if ($user->referred_by == $ambassador->id) {
                    $directBonus = $user->vipPlan->min_deposit * 0.10;
                }
            }
            $netEarnings = $grossCut - $deduction + $directBonus;

            return [
                'id' => $user->id, // using user ID as proxy
                'user' => $user,
                'deposit_amount' => $user->vipPlan->min_deposit,
                'gross_cut' => $grossCut,
                'deduction' => $deduction,
                'direct_bonus' => $directBonus,
                'net_earnings' => $netEarnings,
                'created_at' => $user->updated_at,
            ];
        });

        return response()->json($earnings);
    }

    public function simulateDay($id)
    {
        $ambassador = User::findOrFail($id);
        
        $downlineIds = User::where('referred_by', $ambassador->id)->pluck('id');
        
        $users = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();
            
        $activeTradeCapital = 0;
            
        foreach ($users as $user) {
            $plan = $user->vipPlan;
            if ($plan) {
                // User gets their profit
                $profit = $plan->min_deposit * ($plan->daily_profit_percent / 100);
                $user->balance += $profit;
                $user->save();
                
                $activeTradeCapital += $plan->min_deposit;
            }
        }

        // 2. Ambassador and Admin get 5% of Active Trade Capital
        $ambBonus = $activeTradeCapital * 0.05;
        $adminBonus = $activeTradeCapital * 0.05;

        // NOTE: We do NOT save to DB here. This is purely for UI interaction.
        $simulatedBalance = $ambassador->balance + $ambBonus;

        return response()->json([
            'message' => 'Simulated 1 day passing.',
            'amb_bonus' => $ambBonus,
            'new_balance' => $simulatedBalance
        ]);
    }
}
