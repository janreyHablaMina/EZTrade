<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class SimulatorController extends Controller
{
    public function simulateTrade(Request $request)
    {
        $users = User::where('status', 'Active')->whereNotNull('vip_plan_id')->get();
        $processed = 0;
        $totalProfit = 0;

        foreach ($users as $user) {
            $plan = \App\Models\VipPlan::find($user->vip_plan_id);
            if ($plan && $user->balance > 0) {
                $profit = $user->balance * ($plan->daily_profit_percent / 100);
                $user->balance += $profit;
                $user->save();

                \App\Models\Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Daily Trade Profit',
                    'message' => 'You earned a ' . number_format($profit, 2) . ' USDT profit from your ' . $plan->level . ' plan!',
                    'type' => 'success',
                ]);

                $processed++;
                $totalProfit += $profit;
            }
        }

        return response()->json([
            'message' => "Simulated trades for {$processed} users.",
            'processed' => $processed,
            'total_profit' => $totalProfit
        ]);
    }
}
