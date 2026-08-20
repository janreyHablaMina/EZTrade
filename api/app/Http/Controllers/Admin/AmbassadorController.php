<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AmbassadorController extends Controller
{
    protected function getAllDownlineIds($userId)
    {
        $allDownlineIds = [];
        $currentLevelIds = [$userId];

        while (!empty($currentLevelIds)) {
            $nextLevelIds = \App\Models\User::whereIn('referred_by', $currentLevelIds)
                ->pluck('id')
                ->toArray();
                
            if (empty($nextLevelIds)) {
                break;
            }
            
            $allDownlineIds = array_merge($allDownlineIds, $nextLevelIds);
            $currentLevelIds = $nextLevelIds;
        }

        return $allDownlineIds;
    }

    public function index()
    {
        // Fetch all users with role 'Ambassador'
        $ambassadors = User::where('role', 'Ambassador')
            ->orderBy('created_at', 'desc')
            ->get();

        $data = $ambassadors->map(function ($ambassador) {
            // Get all downline users recursively
            $downlineIds = $this->getAllDownlineIds($ambassador->id);
            $downline = User::whereIn('id', $downlineIds)->get();
            $downlineCount = count($downlineIds);
            
            // Total assets (balance) of downline
            $totalDownlineAssets = $downline->sum('balance');
            
            // "Daily Earnings (5%)" - as requested in mock, calculate 5% of downline assets as a placeholder admin earnings metric
            $dailyEarnings = $totalDownlineAssets * 0.05;

            return [
                'id' => 'AMB' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
                'dbId' => $ambassador->id,
                'name' => $ambassador->name,
                'email' => $ambassador->email,
                'status' => $ambassador->status ?? 'Active',
                'registeredAt' => $ambassador->created_at,
                'teamSize' => $downlineCount + 1,
                'downlineCount' => $downlineCount,
                'totalDownlineAssets' => $totalDownlineAssets,
                'dailyEarnings' => $dailyEarnings,
                'referralCode' => $ambassador->referral_code ?? 'N/A',
            ];
        });

        return response()->json($data);
    }

    public function show($id)
    {
        $ambassador = User::findOrFail($id);
        
        $downlineIds = $this->getAllDownlineIds($ambassador->id);
        $downline = User::whereIn('id', $downlineIds)->get();
        $downlineCount = count($downlineIds);
        $totalDownlineAssets = $downline->sum('balance');
        $deposits = \App\Models\Deposit::whereIn('user_id', $downlineIds)
            ->where('status', 'Approved')
            ->get();
        
        $totalDownlineDeposits = $deposits->sum('amount');
        
        // Calculate Active Trade Capital (only users with active VIP plans)
        $usersWithPlans = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();
            
        $activeTradeCapital = $usersWithPlans->sum(fn($u) => $u->vipPlan->min_deposit ?? 0);
        
        $directReferralEarnings = 0;
        $minusBonuses = 0;
        $totalReferralGiven = 0;
        
        $usersWithApprovedDeposits = \App\Models\Deposit::with('user')->where('status', 'Approved')->select('user_id')->distinct()->get();
        
        foreach ($usersWithApprovedDeposits as $record) {
            $firstDeposit = \App\Models\Deposit::where('user_id', $record->user_id)->where('status', 'Approved')->orderBy('created_at', 'asc')->first();
            if ($firstDeposit && $firstDeposit->user && $firstDeposit->user->referred_by) {
                
                $rates = [1 => 0.10, 2 => 0.05, 3 => 0.03];
                $level = 1;
                $totalBonusPaidOut = 0;
                $currentUplineId = $firstDeposit->user->referred_by;
                
                while ($currentUplineId && $level <= 3) {
                    $upline = \App\Models\User::find($currentUplineId);
                    if (!$upline) break;
                    
                    $bonus = $firstDeposit->amount * $rates[$level];
                    $totalBonusPaidOut += $bonus;
                    
                    if ($upline->id === $ambassador->id) {
                        $directReferralEarnings += $bonus;
                    }
                    
                    $currentUplineId = $upline->referred_by;
                    $level++;
                }
                
                $uplineId = $firstDeposit->user->referred_by;
                $foundAmbassadorId = null;
                while ($uplineId) {
                    $upline = \App\Models\User::find($uplineId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $foundAmbassadorId = $upline->id;
                        break;
                    }
                    $uplineId = $upline->referred_by;
                }
                
                if ($foundAmbassadorId === $ambassador->id) {
                    $minusBonuses += $totalBonusPaidOut / 2; // Ambassador pays 50%
                    $totalReferralGiven += $totalBonusPaidOut;
                }
            }
        }
        
        $earningsLogs = \App\Models\EarningsLog::where('user_id', $ambassador->id)->get();
        $grossAssets = $earningsLogs->sum('amount') + $directReferralEarnings;
        
        $netBalance = $ambassador->balance;

        return response()->json([
            'id' => 'EZT-' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
            'dbId' => $ambassador->id,
            'name' => $ambassador->name,
            'email' => $ambassador->email,
            'phone' => $ambassador->phone ?? 'N/A',
            'status' => $ambassador->status ?? 'Active',
            'kycStatus' => $ambassador->kyc_status ?? 'Not Verified',
            'registeredAt' => $ambassador->created_at->format('M d, Y, h:i A'),
            'balance' => $ambassador->balance ?? 0,
            'teamSize' => $downlineCount + 1,
            'downlineCount' => $downlineCount,
            'activeTradeCapital' => $activeTradeCapital,
            'dailyEarnings' => 0, // unused
            'referralCode' => $ambassador->referral_code ?? 'N/A',
            'financials' => [
                'totalDownlineDeposits' => $totalDownlineDeposits,
                'activeTradeCapital' => $activeTradeCapital,
                'grossAssets' => $grossAssets,
                'minusBonuses' => $minusBonuses,
                'totalReferralGiven' => $totalReferralGiven,
                'netBalance' => $netBalance,
            ]
        ]);
    }

    public function downline($id)
    {
        $ambassador = User::findOrFail($id);
        $downlineIds = $this->getAllDownlineIds($ambassador->id);
        $users = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($users);
    }

    public function earnings($id)
    {
        $ambassador = User::findOrFail($id);
        $earningsLogs = \App\Models\EarningsLog::with('sourceUser')
            ->where('user_id', $ambassador->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $earnings = $earningsLogs->map(function($log) {
            return [
                'id' => 'L'.$log->id,
                'user' => $log->sourceUser,
                'deposit_amount' => $log->deposit_amount,
                'gross_cut' => $log->amount,
                'deduction' => 0,
                'direct_bonus' => 0,
                'net_earnings' => $log->amount,
                'created_at' => $log->created_at,
            ];
        })->toArray();
        
        $downlineIds = $this->getAllDownlineIds($ambassador->id);
        $usersWithPlans = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->orderBy('updated_at', 'desc')
            ->get();

        foreach ($usersWithPlans as $user) {
            if ($user->vipPlan && in_array($user->id, $downlineIds)) {
                $directBonus = $user->vipPlan->min_deposit * 0.10;
                $earnings[] = [
                    'id' => 'D'.$user->id,
                    'user' => $user,
                    'deposit_amount' => $user->vipPlan->min_deposit,
                    'gross_cut' => $directBonus,
                    'deduction' => 0,
                    'direct_bonus' => $directBonus,
                    'net_earnings' => $directBonus,
                    'created_at' => $user->updated_at,
                ];
            }
        }
        
        usort($earnings, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return response()->json($earnings);
    }

    public function simulateDay($id)
    {
        $ambassador = User::findOrFail($id);
        
        $downlineIds = $this->getAllDownlineIds($ambassador->id);
        
        $users = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();
            
        $activeTradeCapital = 0;
            
        foreach ($users as $user) {
            $plan = $user->vipPlan;
            if ($plan) {
                // User gets their profit
                $profit = $plan->min_deposit * ($plan->daily_profit_percent / 100);
                $user->balance += $profit;
                $user->save();
                
                $activeTradeCapital += $plan->min_deposit;
            }
        }

        // 2. Ambassador and Admin get 5% of Active Trade Capital
        $ambBonus = $activeTradeCapital * 0.05;
        $adminBonus = $activeTradeCapital * 0.05;

        // NOTE: We do NOT save to DB here. This is purely for UI interaction.
        $simulatedBalance = $ambassador->balance + $ambBonus;

        return response()->json([
            'message' => 'Simulated 1 day passing.',
            'amb_bonus' => $ambBonus,
            'new_balance' => $simulatedBalance
        ]);
    }
}
