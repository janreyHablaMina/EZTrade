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

                \App\Models\Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Daily Trade Profit',
                    'message' => 'You earned a ' . number_format($profit, 2) . ' USDT profit from your ' . $plan->level . ' plan!',
                    'type' => 'success',
                ]);

                // Ambassador Downline Bonus (5% of the downline's deposit/trade size)
                $currentUpline = $user->referrer;
                while ($currentUpline) {
                    if ($currentUpline->role === 'Ambassador') {
                        $ambassadorBonus = $plan->min_deposit * 0.05;
                        $currentUpline->balance += $ambassadorBonus;
                        $currentUpline->save();

                        \App\Models\Notification::create([
                            'user_id' => $currentUpline->id,
                            'title' => 'Ambassador Downline Bonus',
                            'message' => 'You earned a ' . number_format($ambassadorBonus, 4) . ' USDT bonus from your downline ' . $user->name . '!',
                            'type' => 'success',
                        ]);
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

                    \App\Models\Notification::create([
                        'user_id' => $admin->id,
                        'title' => 'Admin System Profit',
                        'message' => 'Platform earned ' . number_format($adminBonus, 4) . ' USDT from ' . $user->name . '\'s trade.',
                        'type' => 'success',
                    ]);
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
