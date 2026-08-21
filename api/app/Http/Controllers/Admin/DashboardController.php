<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Deposit;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $totalUsers = User::count();
        $activeVips = User::whereNotNull('vip_plan_id')->count();
        $totalEarnings = \App\Models\TradingCodeRedemption::sum('reward_amount');
        
        $totalDeposits = Deposit::where('status', 'Approved')->sum('amount');
        $depositsByStatus = Deposit::select('status', DB::raw('count(*) as count'))
                                   ->groupBy('status')
                                   ->pluck('count', 'status');
        
        $pendingDeposits = $depositsByStatus['Pending'] ?? 0;
        
        $totalWithdrawals = Withdrawal::where('status', 'Completed')->sum('amount');
        $withdrawalsByStatus = Withdrawal::select('status', DB::raw('count(*) as count'))
                                         ->groupBy('status')
                                         ->pluck('count', 'status');

        $recentDeposits = Deposit::with('user')->orderBy('created_at', 'desc')->take(4)->get();
        $recentWithdrawals = Withdrawal::with('user')->orderBy('created_at', 'desc')->take(4)->get();

        // VIP Levels
        $totalUsersWithVip = User::whereNotNull('vip_plan_id')->count();
        $vipLevels = DB::table('users')
            ->join('vip_plans', 'users.vip_plan_id', '=', 'vip_plans.id')
            ->select('vip_plans.level as label', DB::raw('count(users.id) as users'))
            ->groupBy('vip_plans.level')
            ->get()
            ->map(function ($item) use ($totalUsersWithVip) {
                return [
                    'label' => strtoupper($item->label),
                    'users' => $item->users,
                    'pct' => $totalUsersWithVip > 0 ? round(($item->users / $totalUsersWithVip) * 100) : 0,
                ];
            });

        // System Stats
        $totalTrades = \App\Models\TradingCodeRedemption::count();

        // Calculate Admin Specific Metrics
        $usersWithPlans = User::with('vipPlan')->where('status', 'Active')->whereNotNull('vip_plan_id')->get();
        $adminTradeCapital = $usersWithPlans->sum(fn($u) => $u->vipPlan->min_deposit ?? 0);

        $adminMinusBonuses = 0;
        $usersWithApprovedDeposits = Deposit::with('user')->where('status', 'Approved')->select('user_id')->distinct()->get();
        foreach ($usersWithApprovedDeposits as $record) {
            $firstDeposit = Deposit::where('user_id', $record->user_id)->where('status', 'Approved')->orderBy('created_at', 'asc')->first();
            if ($firstDeposit && $firstDeposit->user && $firstDeposit->user->referred_by) {
                $hasAmbassador = false;
                $uplineId = $firstDeposit->user->referred_by;
                $rates = [1 => 0.10, 2 => 0.05, 3 => 0.03];
                $level = 1;
                $totalBonusPaidOut = 0;
                $currentUplineId = $uplineId;
                while ($currentUplineId && $level <= 3) {
                    $upline = User::find($currentUplineId);
                    if (!$upline) break;
                    $totalBonusPaidOut += $firstDeposit->amount * $rates[$level];
                    $currentUplineId = $upline->referred_by;
                    $level++;
                }
                $ambassadorCheckId = $uplineId;
                while ($ambassadorCheckId) {
                    $upline = User::find($ambassadorCheckId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $hasAmbassador = true;
                        break;
                    }
                    $ambassadorCheckId = $upline->referred_by;
                }
                if ($totalBonusPaidOut > 0) {
                    if ($hasAmbassador) {
                        $adminMinusBonuses += $totalBonusPaidOut / 2;
                    } else {
                        $adminMinusBonuses += $totalBonusPaidOut;
                    }
                }
            }
        }

        $admin = User::where('role', 'Admin')->first();
        $adminGrossIncome = 0;
        if ($admin) {
            $adminGrossIncome = \App\Models\EarningsLog::where('user_id', $admin->id)->where('type', 'Daily Admin Cut')->sum('amount');
        }
        $adminNetIncome = $adminGrossIncome - $adminMinusBonuses;

        return response()->json([
            'total_users' => $totalUsers,
            'active_vips' => $activeVips,
            'total_earnings' => (float)$totalEarnings,
            'total_deposits' => (float)$totalDeposits,
            'deposits_by_status' => [
                'Completed' => $depositsByStatus['Approved'] ?? 0,
                'Pending' => $depositsByStatus['Pending'] ?? 0,
                'Failed' => $depositsByStatus['Rejected'] ?? 0,
            ],
            'pending_deposits' => $pendingDeposits,
            'total_withdrawals' => (float)$totalWithdrawals,
            'withdrawals_by_status' => [
                'Completed' => $withdrawalsByStatus['Completed'] ?? 0,
                'Pending' => $withdrawalsByStatus['Pending'] ?? 0,
                'Rejected' => $withdrawalsByStatus['Rejected'] ?? 0,
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
        ]);
    }

    public function visualizeStats(Request $request)
    {
        $adminDeposits = Deposit::where('status', 'Approved')->sum('amount');
        
        $usersWithPlans = User::with('vipPlan')
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();
            
        $adminTradeCapital = 0;
        $tradeCapitalAmbassador = 0;
        $tradeCapitalNonAmbassador = 0;
        
        foreach ($usersWithPlans as $u) {
            if ($u->vipPlan) {
                $adminTradeCapital += $u->vipPlan->min_deposit;
                
                $hasAmb = false;
                $uplineId = $u->referred_by;
                while ($uplineId) {
                    $upline = \App\Models\User::find($uplineId);
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
        $usersWithApprovedDeposits = Deposit::with('user')->where('status', 'Approved')->select('user_id')->distinct()->get();
        
        foreach ($usersWithApprovedDeposits as $record) {
            $firstDeposit = Deposit::where('user_id', $record->user_id)->where('status', 'Approved')->orderBy('created_at', 'asc')->first();
            if ($firstDeposit && $firstDeposit->user && $firstDeposit->user->referred_by) {
                $hasAmbassador = false;
                $uplineId = $firstDeposit->user->referred_by;
                
                // 1. Calculate the total bonus paid out
                $rates = [1 => 0.10, 2 => 0.05, 3 => 0.03];
                $level = 1;
                $totalBonusPaidOut = 0;
                $currentUplineId = $uplineId;
                
                while ($currentUplineId && $level <= 3) {
                    $upline = \App\Models\User::find($currentUplineId);
                    if (!$upline) break;
                    
                    $totalBonusPaidOut += $firstDeposit->amount * $rates[$level];
                    $currentUplineId = $upline->referred_by;
                    $level++;
                }
                
                // 2. Check for an ambassador anywhere in the entire upline chain
                $ambassadorCheckId = $uplineId;
                while ($ambassadorCheckId) {
                    $upline = \App\Models\User::find($ambassadorCheckId);
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
                        $adminMinusBonuses += $totalBonusPaidOut / 2; // Admin pays 50%
                    } else {
                        $referralGivenNonAmbassador += $totalBonusPaidOut;
                        $adminMinusBonuses += $totalBonusPaidOut; // Admin pays full 100%
                    }
                }
            }
        }
        
        $admin = User::where('role', 'Admin')->first();
        
        $adminGrossAmbassador = 0;
        $adminGrossNonAmbassador = 0;
        if ($admin) {
            $adminEarningsLogs = \App\Models\EarningsLog::where('user_id', $admin->id)->where('type', 'Daily Admin Cut')->get();
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
        
        return response()->json([
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
            'net_balance' => $admin ? $admin->balance : 0
        ]);
    }

    public function getChartData(Request $request)
    {
        $range = $request->query('range', 'today'); // today, week, month

        $now = now();

        if ($range === 'today') {
            $start = $now->copy()->startOfDay();
            $end   = $now->copy()->endOfDay();
            $groupFormat = 'HH24":00"'; // PostgreSQL hourly
        } elseif ($range === 'week') {
            $start = $now->copy()->startOfWeek();
            $end   = $now->copy()->endOfWeek();
            $groupFormat = 'YYYY-MM-DD';
        } else {
            // month
            $start = $now->copy()->startOfMonth();
            $end   = $now->copy()->endOfMonth();
            $groupFormat = 'YYYY-MM-DD';
        }

        $pgFormat = $groupFormat;

        // Deposits
        $deposits = Deposit::where('status', 'Approved')
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw("TO_CHAR(created_at, '{$pgFormat}') as label"), DB::raw('SUM(amount) as total'))
            ->groupBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->orderBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->pluck('total', 'label');

        // Withdrawals
        $withdrawals = Withdrawal::where('status', 'Completed')
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw("TO_CHAR(created_at, '{$pgFormat}') as label"), DB::raw('SUM(amount) as total'))
            ->groupBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->orderBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->pluck('total', 'label');

        // Earnings
        $earnings = \App\Models\EarningsLog::whereBetween('created_at', [$start, $end])
            ->select(DB::raw("TO_CHAR(created_at, '{$pgFormat}') as label"), DB::raw('SUM(amount) as total'))
            ->groupBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->orderBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->pluck('total', 'label');

        // Build a unified set of labels
        $allLabels = collect($deposits->keys())
            ->merge($withdrawals->keys())
            ->merge($earnings->keys())
            ->unique()
            ->sort()
            ->values();

        $result = $allLabels->map(fn($label) => [
            'label'       => $label,
            'deposits'    => (float) ($deposits[$label] ?? 0),
            'withdrawals' => (float) ($withdrawals[$label] ?? 0),
            'earnings'    => (float) ($earnings[$label] ?? 0),
        ]);

        return response()->json([
            'range'  => $range,
            'points' => $result->values(),
        ]);
    }
}
