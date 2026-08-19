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
            
        $activeTradeCapital = $usersWithPlans->sum(fn($u) => $u->vipPlan->min_deposit ?? 0);
        
        $directReferralEarnings = 0;
        $minusBonuses = 0;
        
        $downlineUsers = User::whereIn('id', $downlineIds)->get();
        foreach ($downlineUsers as $u) {
            $firstDeposit = \App\Models\Deposit::where('user_id', $u->id)->where('status', 'Approved')->orderBy('created_at', 'asc')->first();
            if ($firstDeposit) {
                if ($u->referred_by == $ambassador->id || $u->referred_by == $ambassador->referral_code) {
                    $directReferralEarnings += $firstDeposit->amount * 0.10; // 10% direct bonus
                    $minusBonuses += $firstDeposit->amount * 0.05; // 5% deduction
                }
            }
        }
        
        $earningsLogs = \App\Models\EarningsLog::where('user_id', $ambassador->id)->get();
        $grossAssets = $earningsLogs->sum('amount') + $directReferralEarnings;
        
        $netBalance = $ambassador->balance;

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
        $earningsLogs = \App\Models\EarningsLog::with('sourceUser')
            ->where('user_id', $ambassador->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $earnings = $earningsLogs->map(function($log) {
            return [
                'id' => 'L'.$log->id,
                'user' => $log->sourceUser,
                'deposit_amount' => $log->deposit_amount,
                'gross_cut' => $log->amount,
                'deduction' => 0,
                'direct_bonus' => 0,
                'net_earnings' => $log->amount,
                'created_at' => $log->created_at,
            ];
        })->toArray();
        
        $downlineIds = User::where('referred_by', $ambassador->id)->pluck('id');
        $usersWithPlans = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->orderBy('updated_at', 'desc')
            ->get();

        foreach ($usersWithPlans as $user) {
            if ($user->vipPlan && ($user->referred_by == $ambassador->id || $user->referred_by == $ambassador->referral_code)) {
                $directBonus = $user->vipPlan->min_deposit * 0.10;
                $earnings[] = [
                    'id' => 'D'.$user->id,
                    'user' => $user,
                    'deposit_amount' => $user->vipPlan->min_deposit,
                    'gross_cut' => $directBonus,
                    'deduction' => 0,
                    'direct_bonus' => $directBonus,
                    'net_earnings' => $directBonus,
                    'created_at' => $user->updated_at,
                ];
            }
        }
        
        usort($earnings, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
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
