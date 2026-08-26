<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepositRequest;
use App\Models\Deposit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepositController extends Controller
{
    public function index()
    {
        return response()->json(Deposit::with('user')->orderBy('created_at', 'desc')->get());
    }

    public function store(StoreDepositRequest $request)
    {
        $validated = $request->validated();

        // Fetch platform controls to enforce minimum deposit limit
        $platformSetting = DB::table('settings')->where('key', 'platform_controls')->first();
        if ($platformSetting) {
            $platformData = json_decode($platformSetting->value, true);
            $minDeposit = isset($platformData['min_deposit']) ? (float)$platformData['min_deposit'] : 10;
            
            if ($validated['amount'] < $minDeposit) {
                return response()->json([
                    'message' => "The minimum deposit amount is \${$minDeposit}."
                ], 400);
            }
        }

        $deposit = Deposit::create([
            'user_id' => $validated['user_id'],
            'amount' => $validated['amount'],
            'network' => $validated['network'],
            'txid' => $validated['txid'],
            'status' => 'Pending'
        ]);

        return response()->json([
            'message' => 'Deposit submitted successfully',
            'deposit' => $deposit
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $deposit = Deposit::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected'
        ]);

        if ($deposit->status === 'Pending' && $request->status === 'Approved') {
            DB::transaction(function () use ($deposit) {
                $deposit->status = 'Approved';
                $deposit->save();

                $deposit->user->balance += $deposit->amount;
                $deposit->user->save();

                $user = $deposit->user;

                // Only give referral bonuses if this is the user's FIRST approved deposit
                $approvedDepositsCount = \App\Models\Deposit::where('user_id', $user->id)
                                                            ->where('status', 'Approved')
                                                            ->count();

                if ($approvedDepositsCount === 1) { // 1 because the current deposit was just saved as Approved
                    // Multi-tier referral bonus based on Deposit Amount
                    $rates = \App\Helpers\SettingsHelper::getReferralRates();

                    $currentUserId = $user->referred_by;
                    $level = 1;
                    $totalBonusPaidOut = 0;

                    while ($currentUserId && $level <= 3) {
                        $referrer = \App\Models\User::find($currentUserId);
                        if (!$referrer) {
                            break;
                        }

                        $bonus = $deposit->amount * $rates[$level];
                        $referrer->balance += $bonus;
                        $referrer->save();
                        
                        \App\Models\Notification::create([
                            'user_id' => $referrer->id,
                            'title' => 'Level ' . $level . ' Referral Bonus!',
                            'message' => 'You received a ' . number_format($bonus, 2) . ' USDT bonus from your level ' . $level . ' referral making their first deposit!',
                            'type' => 'success',
                        ]);
                        
                        $totalBonusPaidOut += $bonus;
                        $currentUserId = $referrer->referred_by;
                        $level++;
                    }

                    // Deduct the total referral bonus paid out
                    if ($totalBonusPaidOut > 0) {
                        $adminDeductionAmount = $totalBonusPaidOut; // Default: Admin pays full 100% of the bonus

                        // Check if there is an Ambassador in the upline
                        $uplineId = $user->referred_by;
                        $foundAmbassador = null;
                        while ($uplineId) {
                            $upline = \App\Models\User::find($uplineId);
                            if (!$upline) break;

                            if ($upline->role === 'Ambassador') {
                                $foundAmbassador = $upline;
                                break;
                            }
                            $uplineId = $upline->referred_by;
                        }

                        if ($foundAmbassador) {
                            // Split 50% Admin / 50% Ambassador
                            $adminDeductionAmount = $totalBonusPaidOut / 2;
                            $ambassadorDeductionAmount = $totalBonusPaidOut / 2;

                            $foundAmbassador->balance -= $ambassadorDeductionAmount;
                            $foundAmbassador->save();
                            
                            \App\Models\Notification::create([
                                'user_id' => $foundAmbassador->id,
                                'title' => 'Referral Bonus Deduction',
                                'message' => 'A deduction of ' . number_format($ambassadorDeductionAmount, 2) . ' USDT was applied for a downline\'s first deposit.',
                                'type' => 'warning',
                            ]);
                        }

                        // Deduct from Admin
                        $admin = \App\Models\User::where('role', 'Admin')->first();
                        if ($admin) {
                            $admin->balance -= $adminDeductionAmount;
                            $admin->save();
                        }
                    }
                }
            });
        } else {
            $deposit->update(['status' => $request->status]);
        }

        return response()->json([
            'message' => 'Deposit updated successfully',
            'deposit' => $deposit->load('user')
        ]);
    }
}
