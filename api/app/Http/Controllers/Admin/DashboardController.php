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
}
