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
            if ($plan) {
                // Profit is calculated based on the VIP plan's minimum deposit (the price of the plan)
                $profit = $plan->min_deposit * ($plan->daily_profit_percent / 100);
                $user->balance += $profit;
                $user->save();



                // Ambassador Downline Bonus (5% of the downline's deposit/trade size)
                $currentUpline = $user->referrer;
                while ($currentUpline) {
                    if ($currentUpline->role === 'Ambassador') {
                        $ambassadorBonus = $plan->min_deposit * 0.05;
                        $currentUpline->balance += $ambassadorBonus;
                        $currentUpline->save();


                        break; // Only give to the closest Ambassador upline
                    }
                    $currentUpline = $currentUpline->referrer;
                }

                // Admin Bonus (5% of the deposit/trade size)
                $admin = \App\Models\User::where('role', 'Admin')->first();
                if ($admin) {
                    $adminBonus = $plan->min_deposit * 0.05;
                    $admin->balance += $adminBonus;
                    $admin->save();


                }

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
