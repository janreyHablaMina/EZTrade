<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TradingCodeRedemption;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('vipPlan')->orderBy('created_at', 'desc')->get()->makeVisible('withdrawal_password'));
    }
    public function globalStats()
    {
        $usersWithPlans = User::where('role', '!=', 'Admin')->with('vipPlan')->where('status', 'Active')->whereNotNull('vip_plan_id')->get();
        $totalTradingCapital = $usersWithPlans->sum(fn($u) => $u->vipPlan->min_deposit ?? 0);
        
        $totalBalance = User::where('role', '!=', 'Admin')->sum('balance');
        
        $totalDeduction = 0;
        
        $allUsers = User::all()->keyBy('id'); // N+1 Optimization: Load users into memory
        $firstDeposits = \App\Models\Deposit::where('status', 'Approved')
            ->whereIn('id', function($q) {
                $q->select(\Illuminate\Support\Facades\DB::raw('MIN(id)'))->from('deposits')->where('status', 'Approved')->groupBy('user_id');
            })->get();
            
        $rates = \App\Helpers\SettingsHelper::getReferralRates();

        foreach ($firstDeposits as $firstDeposit) {
            $user = $allUsers->get($firstDeposit->user_id);
            if ($user && $user->referred_by) {
                $level = 1;
                $currentUplineId = $user->referred_by;
                while ($currentUplineId && $level <= 3) {
                    $upline = $allUsers->get($currentUplineId);
                    if (!$upline) break;
                    $totalDeduction += $firstDeposit->amount * ($rates[$level] ?? 0);
                    $currentUplineId = $upline->referred_by;
                    $level++;
                }
            }
        }
        
        $totalEarnings = \App\Models\TradingCodeRedemption::sum('reward_amount') + 
                         \App\Models\EarningsLog::where('type', 'Daily Ambassador Cut')->sum('amount');

        return response()->json([
            'total_trading_capital' => $totalTradingCapital,
            'total_balance' => $totalBalance,
            'total_deduction' => $totalDeduction,
            'net_income' => $totalEarnings,
        ]);
    }

    public function show($id)
    {
        return User::with('vipPlan')->findOrFail($id)->makeVisible('withdrawal_password');
    }

    public function stats($id)
    {
        $user = User::with('vipPlan')->findOrFail($id);

        $totalProfit = TradingCodeRedemption::where('user_id', $id)
            ->sum('reward_amount');

        $todayProfit = TradingCodeRedemption::where('user_id', $id)
            ->whereDate('created_at', now()->toDateString())
            ->sum('reward_amount');

        $balance = floatval($user->balance);

        $todayPercent = 0;
        if ($todayProfit > 0) {
            $balanceBefore = $balance - floatval($todayProfit);
            if ($balanceBefore > 0) {
                $todayPercent = round((floatval($todayProfit) / $balanceBefore) * 100, 2);
            }
        }

        $dailyProfit = 0;
        if ($user->vipPlan) {
            $dailyProfit = round(
                floatval($user->vipPlan->min_deposit) * floatval($user->vipPlan->daily_profit_percent) / 100,
                2
            );
        }

        $chartData = [
            'labels' => [],
            'data' => []
        ];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $chartData['labels'][] = $date->format('D'); // 'Mon', 'Tue', etc.
            
            $dayProfit = TradingCodeRedemption::where('user_id', $id)
                ->whereDate('created_at', $date->toDateString())
                ->sum('reward_amount');
                
            $chartData['data'][] = round(floatval($dayProfit), 2);
        }

        return response()->json([
            'total_profit'  => round(floatval($totalProfit), 2),
            'today_profit'  => round(floatval($todayProfit), 2),
            'today_percent' => $todayPercent,
            'daily_profit'  => $dailyProfit,
            'balance'       => round($balance, 2),
            'chart_data'    => $chartData,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:User,Ambassador,Admin',
            'status' => 'sometimes|in:Active,Inactive,Suspended',
            'kyc_status' => 'sometimes|in:Verified,Not Verified',
            'vipLevel' => 'nullable|string',
            'withdrawal_password' => 'nullable|string'
        ]);

        // Map vipLevel to vip_plan_id
        if (isset($validated['vipLevel'])) {
            $plan = \App\Models\VipPlan::where('level', $validated['vipLevel'])->first();
            if ($plan) {
                $validated['vip_plan_id'] = $plan->id;
            } else if (strtolower($validated['vipLevel']) === 'none') {
                $validated['vip_plan_id'] = null;
            }
            unset($validated['vipLevel']);
        }

        $user->update($validated);

        if (isset($validated['status']) && in_array($validated['status'], ['Suspended', 'Inactive'])) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->load('vipPlan')
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function setWithdrawalPassword(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!empty($user->withdrawal_password)) {
            return response()->json(['message' => 'Withdrawal password has already been set and cannot be changed.'], 403);
        }

        $validated = $request->validate([
            'password' => 'required|string|min:6'
        ]);

        $user->withdrawal_password = $validated['password'];
        $user->save();

        return response()->json([
            'message' => 'Withdrawal password set successfully',
            'user' => $user->load('vipPlan')
        ]);
    }
}
