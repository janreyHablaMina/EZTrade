<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TradingCodeRedemption;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('vipPlan')->orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        return User::with('vipPlan')->findOrFail($id);
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

        return response()->json([
            'total_profit'  => round(floatval($totalProfit), 2),
            'today_profit'  => round(floatval($todayProfit), 2),
            'today_percent' => $todayPercent,
            'daily_profit'  => $dailyProfit,
            'balance'       => round($balance, 2),
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
            'role' => 'sometimes|in:User,Ambassador',
            'status' => 'sometimes|in:Active,Inactive,Suspended',
            'kyc_status' => 'sometimes|in:Verified,Not Verified',
            'vipLevel' => 'nullable|string'
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

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->load('vipPlan')
        ]);
    }
}
