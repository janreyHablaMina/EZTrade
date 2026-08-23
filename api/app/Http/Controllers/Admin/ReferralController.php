<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index(Request $request)
    {
        $query = User::whereNotNull('referred_by');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('vipLevel') && $request->vipLevel !== 'all') {
            $query->where('vip_plan_id', $request->vipLevel);
        }

        if ($request->has('dateFrom') && $request->dateFrom != '') {
            $query->whereDate('created_at', '>=', $request->dateFrom);
        }

        if ($request->has('dateTo') && $request->dateTo != '') {
            $query->whereDate('created_at', '<=', $request->dateTo);
        }

        $referredUsers = $query->with(['deposits' => function($q) {
                $q->where('status', 'Approved')->orWhere('status', 'Completed');
            }, 'tradingCodeRedemptions'])
            ->orderBy('created_at', 'desc')
            ->get();

        $data = $referredUsers->map(function ($user) {
            $totalDeposited = $user->deposits->sum('amount');
            $totalEarnings = $user->tradingCodeRedemptions->sum('amount_earned');
            
            $firstDeposit = $user->deposits->where('status', 'Approved')->sortBy('created_at')->first();
            $firstDepositAmount = $firstDeposit ? $firstDeposit->amount : 0;
            
            $totalBonusGiven = 0;
            $commission = 0;
            $ambassadorDeduction = 0;
            
            if ($firstDepositAmount > 0) {
                $rates = [1 => 0.10, 2 => 0.05, 3 => 0.03];
                $currentUserId = $user->referred_by;
                $level = 1;
                
                while ($currentUserId && $level <= 3) {
                    $referrer = User::find($currentUserId);
                    if (!$referrer) break;
                    
                    $bonus = $firstDepositAmount * $rates[$level];
                    $totalBonusGiven += $bonus;
                    
                    if ($level === 1) {
                        $commission = $bonus;
                    }
                    
                    $currentUserId = $referrer->referred_by;
                    $level++;
                }
                
                // Calculate Ambassador Deduction
                $uplineId = $user->referred_by;
                $foundAmbassador = false;
                while ($uplineId) {
                    $upline = User::find($uplineId);
                    if (!$upline) break;
                    if ($upline->role === 'Ambassador') {
                        $foundAmbassador = true;
                        break;
                    }
                    $uplineId = $upline->referred_by;
                }
                
                if ($foundAmbassador) {
                    $ambassadorDeduction = $totalBonusGiven / 2;
                }
            }

            return [
                'id' => 'RF' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'dbId' => $user->id,
                'userName' => $user->name,
                'userEmail' => $user->email,
                'vipLevel' => $user->vip_plan_id ?? 1,
                'registeredAt' => $user->created_at,
                'totalDeposited' => $totalDeposited,
                'totalEarnings' => $totalEarnings,
                'totalBonusGiven' => $totalBonusGiven,
                'yourCommission' => $commission,
                'ambassadorDeduction' => $ambassadorDeduction,
                'commissionStatus' => $commission > 0 ? 'Paid' : 'None',
            ];
        });

        return response()->json($data);
    }
}
