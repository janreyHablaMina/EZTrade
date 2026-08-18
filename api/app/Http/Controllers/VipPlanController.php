<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\VipPlan;

class VipPlanController extends Controller
{
    public function index()
    {
        return response()->json(VipPlan::orderBy('created_at', 'desc')->get());
    }

    public function stats()
    {
        $totalInvestors = \App\Models\User::whereNotNull('vip_plan_id')->count();
        $totalDeposited = \App\Models\Deposit::where('status', 'approved')->sum('amount');
        
        return response()->json([
            'total_investors' => $totalInvestors,
            'total_deposited' => (float)$totalDeposited,
            'total_earnings_paid' => 0, // Placeholder as no earnings table exists yet
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'level' => 'required|string',
            'min_deposit' => 'required|numeric|min:0',
            'daily_profit_percent' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
        ]);

        $plan = VipPlan::create($request->all());

        return response()->json([
            'message' => 'VIP Plan created successfully',
            'plan' => $plan
        ], 201);
    }

    public function unlock(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:vip_plans,id',
        ]);

        $user = \App\Models\User::find($request->user_id);
        $plan = VipPlan::find($request->plan_id);

        if ($user->balance < $plan->min_deposit) {
            return response()->json([
                'message' => 'Insufficient balance to unlock this VIP plan.',
            ], 400);
        }

        $user->balance -= $plan->min_deposit;
        $user->vip_plan_id = $plan->id;
        $user->save();

        // Multi-tier referral bonus based on VIP Plan cost
        $rates = [
            1 => 0.10,
            2 => 0.05,
            3 => 0.02,
        ];

        $currentUserId = $user->referred_by;
        $level = 1;

        while ($currentUserId && $level <= 3) {
            $referrer = \App\Models\User::find($currentUserId);
            if (!$referrer) {
                break;
            }

            $bonus = $plan->min_deposit * $rates[$level];
            $referrer->balance += $bonus;
            $referrer->save();
            
            \App\Models\Notification::create([
                'user_id' => $referrer->id,
                'title' => 'Level ' . $level . ' Referral Bonus!',
                'message' => 'You received a ' . number_format($bonus, 2) . ' USDT bonus from your level ' . $level . ' referral purchasing a VIP Plan!',
                'type' => 'success',
            ]);

            $currentUserId = $referrer->referred_by;
            $level++;
        }

        // Deduct the 10% referral bonus from Admin (5%) and Ambassador (5%)
        if ($user->referred_by) {
            $deductionAmount = $plan->min_deposit * 0.05; // 5% each

            // 1. Deduct from Admin
            $admin = \App\Models\User::where('role', 'Admin')->first();
            if ($admin) {
                $admin->balance -= $deductionAmount;
                $admin->save();
            }

            // 2. Find the Ambassador for this downline and deduct from them
            $uplineId = $user->referred_by;
            while ($uplineId) {
                $upline = \App\Models\User::find($uplineId);
                if (!$upline) break;

                if ($upline->role === 'Ambassador') {
                    $upline->balance -= $deductionAmount;
                    $upline->save();
                    
                    \App\Models\Notification::create([
                        'user_id' => $upline->id,
                        'title' => 'Referral Bonus Deduction',
                        'message' => 'A deduction of ' . number_format($deductionAmount, 2) . ' USDT was applied for a downline VIP Plan purchase.',
                        'type' => 'warning',
                    ]);
                    break; // Stop at the first Ambassador
                }
                $uplineId = $upline->referred_by;
            }
        }

        return response()->json([
            'message' => 'VIP Plan unlocked successfully!',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $plan = VipPlan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'message' => 'VIP Plan deleted successfully'
        ]);
    }
}
