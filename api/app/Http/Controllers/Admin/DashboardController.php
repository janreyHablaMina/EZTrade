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
        foreach ($usersWithPlans as $u) {
            if ($u->vipPlan) {
                $adminTradeCapital += $u->vipPlan->min_deposit;
            }
        }
        $adminMinusBonuses = 0;
        $usersWithApprovedDeposits = Deposit::with('user')->where('status', 'Approved')->select('user_id')->distinct()->get();
        
        foreach ($usersWithApprovedDeposits as $record) {
            $firstDeposit = Deposit::where('user_id', $record->user_id)->where('status', 'Approved')->orderBy('created_at', 'asc')->first();
            if ($firstDeposit && $firstDeposit->user && $firstDeposit->user->referred_by) {
                
                $hasAmbassador = false;
                $uplineId = $firstDeposit->user->referred_by;
                while ($uplineId) {
                    $upline = \App\Models\User::find($uplineId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $hasAmbassador = true;
                        break;
                    }
                    $uplineId = $upline->referred_by;
                }
                
                if ($hasAmbassador) {
                    $adminMinusBonuses += $firstDeposit->amount * 0.05; // Admin pays 5%
                } else {
                    $adminMinusBonuses += $firstDeposit->amount * 0.10; // Admin pays full 10%
                }
            }
        }
        
        $admin = User::where('role', 'Admin')->first();
        
        return response()->json([
            'total_deposit' => $adminDeposits,
            'active_capital' => $adminTradeCapital,
            'minus_bonuses' => $adminMinusBonuses,
            'net_balance' => $admin ? $admin->balance : 0
        ]);
    }
}
