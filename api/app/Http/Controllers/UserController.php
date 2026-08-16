<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TradingCodeRedemption;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
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
                $balance * floatval($user->vipPlan->daily_profit_percent) / 100,
                2
            );
        }

        return response()->json([
            'total_profit'  => round(floatval($totalProfit), 2),
            'today_profit'  => round(floatval($todayProfit), 2),
            'today_percent' => $todayPercent,
            'daily_profit'  => $dailyProfit,
            'balance'       => $balance,
        ]);
    }
}
