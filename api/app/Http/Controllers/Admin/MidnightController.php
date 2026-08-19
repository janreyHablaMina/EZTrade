<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EarningsLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MidnightController extends Controller
{
    public function simulate(Request $request)
    {
        DB::beginTransaction();
        try {
            // Find Admin
            $admin = User::where('role', 'Admin')->first();

            // Find all active users with VIP plans
            $usersWithPlans = User::with('vipPlan')
                ->where('status', 'Active')
                ->whereNotNull('vip_plan_id')
                ->get();

            $totalAdminCut = 0;
            $totalAmbassadorCut = 0;

            foreach ($usersWithPlans as $user) {
                if (!$user->vipPlan) continue;

                $dailyCapital = $user->vipPlan->min_deposit;
                
                // By default, Admin gets the full 10% daily cut
                $dailyAdminCut = $dailyCapital * 0.10;
                $ambassadorDeduction = 0;

                // If user is referred by an Ambassador, split the cut 5% / 5%
                if ($user->referred_by) {
                    $referrer = User::where('id', $user->referred_by)
                                    ->orWhere('referral_code', $user->referred_by)
                                    ->first();
                    
                    if ($referrer && $referrer->role === 'Ambassador') {
                        $dailyAdminCut = $dailyCapital * 0.05; // Admin drops to 5%
                        $ambassadorDeduction = $dailyCapital * 0.05; // Ambassador gets 5%
                        
                        // Log Ambassador Earnings
                        EarningsLog::create([
                            'user_id' => $referrer->id,
                            'source_user_id' => $user->id,
                            'type' => 'Daily Ambassador Cut',
                            'amount' => $ambassadorDeduction,
                            'deposit_amount' => $dailyCapital,
                        ]);

                        // Add to ambassador balance
                        $referrer->balance += $ambassadorDeduction;
                        $referrer->save();
                        
                        $totalAmbassadorCut += $ambassadorDeduction;
                    }
                }

                $netAdminCut = $dailyAdminCut;

                // Log Admin Earnings
                if ($admin) {
                    EarningsLog::create([
                        'user_id' => $admin->id,
                        'source_user_id' => $user->id,
                        'type' => 'Daily Admin Cut',
                        'amount' => $netAdminCut,
                        'deposit_amount' => $dailyCapital,
                    ]);
                    
                    $totalAdminCut += $netAdminCut;
                }
            }

            if ($admin) {
                $admin->balance += $totalAdminCut;
                $admin->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Midnight simulation completed successfully',
                'admin_cut' => $totalAdminCut,
                'ambassador_cut' => $totalAmbassadorCut
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
