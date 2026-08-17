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
