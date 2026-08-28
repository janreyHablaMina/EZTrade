<?php

namespace App\Services;

use App\Models\User;
use App\Models\Deposit;
use App\Models\Withdrawal;
use App\Models\TradingCodeRedemption;
use App\Models\EarningsLog;
use Illuminate\Support\Facades\DB;
use App\Helpers\SettingsHelper;

class DashboardService
{
    public function getStats()
    {
        $totalUsers = User::count();
        $activeVips = User::whereNotNull('vip_plan_id')->count();
        $totalEarnings = TradingCodeRedemption::sum('reward_amount');
        
        $depositsByStatus = Deposit::select('status', DB::raw('count(*) as count, sum(amount) as total'))
                                   ->groupBy('status')
                                   ->get()
                                   ->keyBy('status');
                                   
        $totalDeposits = $depositsByStatus['Approved']->total ?? 0;
        $pendingDeposits = $depositsByStatus['Pending']->count ?? 0;
        
        $withdrawalsByStatus = Withdrawal::select('status', DB::raw('count(*) as count, sum(amount) as total'))
                                         ->groupBy('status')
                                         ->get()
                                         ->keyBy('status');
                                         
        $totalWithdrawals = $withdrawalsByStatus['Completed']->total ?? 0;

        $recentDeposits = Deposit::with('user')->orderBy('created_at', 'desc')->take(4)->get();
        $recentWithdrawals = Withdrawal::with('user')->orderBy('created_at', 'desc')->take(4)->get();

        $vipLevels = DB::table('users')
            ->join('vip_plans', 'users.vip_plan_id', '=', 'vip_plans.id')
            ->select('vip_plans.level as label', DB::raw('count(users.id) as users'))
            ->groupBy('vip_plans.level')
            ->get()
            ->map(function ($item) use ($activeVips) {
                return [
                    'label' => strtoupper($item->label),
                    'users' => $item->users,
                    'pct' => $activeVips > 0 ? round(($item->users / $activeVips) * 100) : 0,
                ];
            });

        $totalTrades = TradingCodeRedemption::count();

        // ── N+1 Optimization: Load all users into memory ──
        $allUsers = User::all()->keyBy('id');
        $usersWithPlans = User::with('vipPlan')->where('status', 'Active')->whereNotNull('vip_plan_id')->get();
        $adminTradeCapital = $usersWithPlans->sum(fn($u) => $u->vipPlan->min_deposit ?? 0);

        $adminMinusBonuses = 0;
        
        // Optimize first deposits lookup
        $firstDeposits = Deposit::where('status', 'Approved')
            ->whereIn('id', function($q) {
                $q->select(DB::raw('MIN(id)'))->from('deposits')->where('status', 'Approved')->groupBy('user_id');
            })->get();

        $rates = SettingsHelper::getReferralRates();

        foreach ($firstDeposits as $firstDeposit) {
            $user = $allUsers->get($firstDeposit->user_id);
            if ($user && $user->referred_by) {
                $hasAmbassador = false;
                $uplineId = $user->referred_by;
                
                $level = 1;
                $totalBonusPaidOut = 0;
                $currentUplineId = $uplineId;
                
                while ($currentUplineId && $level <= 3) {
                    $upline = $allUsers->get($currentUplineId);
                    if (!$upline) break;
                    $totalBonusPaidOut += $firstDeposit->amount * ($rates[$level] ?? 0);
                    $currentUplineId = $upline->referred_by;
                    $level++;
                }
                
                $ambassadorCheckId = $uplineId;
                while ($ambassadorCheckId) {
                    $upline = $allUsers->get($ambassadorCheckId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $hasAmbassador = true;
                        break;
                    }
                    $ambassadorCheckId = $upline->referred_by;
                }
                
                if ($totalBonusPaidOut > 0) {
                    $adminMinusBonuses += $hasAmbassador ? ($totalBonusPaidOut / 2) : $totalBonusPaidOut;
                }
            }
        }

        $admin = $allUsers->where('role', 'Admin')->first();
        $adminGrossIncome = $admin ? EarningsLog::where('user_id', $admin->id)->where('type', 'Daily Admin Cut')->sum('amount') : 0;
        $adminNetIncome = $adminGrossIncome - $adminMinusBonuses;

        return [
            'total_users' => $totalUsers,
            'active_vips' => $activeVips,
            'total_earnings' => (float)$totalEarnings,
            'total_deposits' => (float)$totalDeposits,
            'deposits_by_status' => [
                'Completed' => $depositsByStatus['Approved']->count ?? 0,
                'Pending' => $pendingDeposits,
                'Failed' => $depositsByStatus['Rejected']->count ?? 0,
            ],
            'pending_deposits' => $pendingDeposits,
            'total_withdrawals' => (float)$totalWithdrawals,
            'withdrawals_by_status' => [
                'Completed' => $withdrawalsByStatus['Completed']->count ?? 0,
                'Pending' => $withdrawalsByStatus['Pending']->count ?? 0,
                'Rejected' => $withdrawalsByStatus['Rejected']->count ?? 0,
            ],
            'recent_deposits' => $recentDeposits,
            'recent_withdrawals' => $recentWithdrawals,
            'vip_levels' => $vipLevels,
            'system_stats' => [
                'total_trades' => $totalTrades,
            ],
            'admin_trade_capital' => $adminTradeCapital,
            'admin_gross_income' => $adminGrossIncome,
            'admin_total_deduction' => $adminMinusBonuses,
            'admin_net_income' => $adminNetIncome,
        ];
    }

    public function getVisualizedStats()
    {
        $adminDeposits = Deposit::where('status', 'Approved')->sum('amount');
        
        $usersWithPlans = User::with('vipPlan')->where('status', 'Active')->whereNotNull('vip_plan_id')->get();
        $allUsers = User::all()->keyBy('id'); // Memory optimization for tree traversal
            
        $adminTradeCapital = 0;
        $tradeCapitalAmbassador = 0;
        $tradeCapitalNonAmbassador = 0;
        
        foreach ($usersWithPlans as $u) {
            if ($u->vipPlan) {
                $adminTradeCapital += $u->vipPlan->min_deposit;
                
                $hasAmb = false;
                $uplineId = $u->referred_by;
                while ($uplineId) {
                    $upline = $allUsers->get($uplineId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $hasAmb = true;
                        break;
                    }
                    $uplineId = $upline->referred_by;
                }
                
                if ($hasAmb) {
                    $tradeCapitalAmbassador += $u->vipPlan->min_deposit;
                } else {
                    $tradeCapitalNonAmbassador += $u->vipPlan->min_deposit;
                }
            }
        }

        $adminMinusBonuses = 0;
        $adminTotalReferralGiven = 0;
        $referralGivenAmbassador = 0;
        $referralGivenNonAmbassador = 0;
        
        $firstDeposits = Deposit::where('status', 'Approved')
            ->whereIn('id', function($q) {
                $q->select(DB::raw('MIN(id)'))->from('deposits')->where('status', 'Approved')->groupBy('user_id');
            })->get();
            
        $rates = SettingsHelper::getReferralRates();
        
        foreach ($firstDeposits as $firstDeposit) {
            $user = $allUsers->get($firstDeposit->user_id);
            if ($user && $user->referred_by) {
                $hasAmbassador = false;
                $uplineId = $user->referred_by;
                
                $level = 1;
                $totalBonusPaidOut = 0;
                $currentUplineId = $uplineId;
                
                while ($currentUplineId && $level <= 3) {
                    $upline = $allUsers->get($currentUplineId);
                    if (!$upline) break;
                    $totalBonusPaidOut += $firstDeposit->amount * ($rates[$level] ?? 0);
                    $currentUplineId = $upline->referred_by;
                    $level++;
                }
                
                $ambassadorCheckId = $uplineId;
                while ($ambassadorCheckId) {
                    $upline = $allUsers->get($ambassadorCheckId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $hasAmbassador = true;
                        break;
                    }
                    $ambassadorCheckId = $upline->referred_by;
                }
                
                if ($totalBonusPaidOut > 0) {
                    $adminTotalReferralGiven += $totalBonusPaidOut;
                    if ($hasAmbassador) {
                        $referralGivenAmbassador += $totalBonusPaidOut;
                        $adminMinusBonuses += $totalBonusPaidOut / 2;
                    } else {
                        $referralGivenNonAmbassador += $totalBonusPaidOut;
                        $adminMinusBonuses += $totalBonusPaidOut;
                    }
                }
            }
        }
        
        $admin = $allUsers->where('role', 'Admin')->first();
        
        $adminGrossAmbassador = 0;
        $adminGrossNonAmbassador = 0;
        if ($admin) {
            $adminEarningsLogs = EarningsLog::where('user_id', $admin->id)->where('type', 'Daily Admin Cut')->get();
            foreach ($adminEarningsLogs as $log) {
                if (abs($log->amount - ($log->deposit_amount * 0.05)) < 0.01) {
                    $adminGrossAmbassador += $log->amount;
                } else {
                    $adminGrossNonAmbassador += $log->amount;
                }
            }
        }

        $adminNetAmbassador = $adminGrossAmbassador - ($referralGivenAmbassador / 2);
        $adminNetNonAmbassador = $adminGrossNonAmbassador - $referralGivenNonAmbassador;
        
        return [
            'total_deposit' => $adminDeposits,
            'active_capital' => $adminTradeCapital,
            'trade_capital_ambassador' => $tradeCapitalAmbassador,
            'trade_capital_non_ambassador' => $tradeCapitalNonAmbassador,
            'minus_bonuses' => $adminMinusBonuses,
            'total_referral_given' => $adminTotalReferralGiven,
            'referral_given_ambassador' => $referralGivenAmbassador,
            'referral_given_non_ambassador' => $referralGivenNonAmbassador,
            'admin_gross_ambassador' => $adminGrossAmbassador,
            'admin_gross_non_ambassador' => $adminGrossNonAmbassador,
            'admin_net_ambassador' => $adminNetAmbassador,
            'admin_net_non_ambassador' => $adminNetNonAmbassador,
        ];
    }
}
