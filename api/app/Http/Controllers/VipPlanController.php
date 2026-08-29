<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreVipPlanRequest;
use App\Models\VipPlan;

class VipPlanController extends Controller
{
    public function index()
    {
        return response()->json(VipPlan::withCount('users')->orderBy('created_at', 'desc')->get());
    }

    public function stats()
    {
        $totalInvestors = \App\Models\User::whereNotNull('vip_plan_id')->count();
        $totalDeposited = \App\Models\User::whereNotNull('vip_plan_id')
            ->join('vip_plans', 'users.vip_plan_id', '=', 'vip_plans.id')
            ->sum('vip_plans.min_deposit');
            
        $totalEarningsPaid = \App\Models\EarningsLog::whereIn('type', ['Daily Ambassador Cut'])->sum('amount') 
                           + \App\Models\TradingCodeRedemption::sum('reward_amount');
        
        return response()->json([
            'total_investors' => $totalInvestors,
            'total_deposited' => (float)$totalDeposited,
            'total_earnings_paid' => (float)$totalEarningsPaid,
        ]);
    }

    public function store(StoreVipPlanRequest $request)
    {
        $validated = $request->validated();
        $plan = VipPlan::create($validated);

        return response()->json([
            'message' => 'VIP Plan created successfully',
            'plan' => $plan
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $plan = VipPlan::findOrFail($id);

        $request->validate([
            'level' => 'sometimes|required|string',
            'min_deposit' => 'sometimes|required|numeric|min:0',
            'daily_profit_percent' => 'sometimes|required|numeric|min:0',
            'duration_days' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|string'
        ]);

        $plan->update($request->all());

        return response()->json([
            'message' => 'VIP Plan updated successfully',
            'plan' => $plan
        ]);
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

        // Referral bonus logic has been moved to DepositController

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
