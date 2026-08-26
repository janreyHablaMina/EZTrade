<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWithdrawalRequest;
use App\Models\Withdrawal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    public function index()
    {
        return response()->json(Withdrawal::with('user')->orderBy('created_at', 'desc')->get());
    }

    public function store(StoreWithdrawalRequest $request)
    {
        $validated = $request->validated();

        // Check if withdrawals are within allowed time
        $setting = DB::table('settings')->where('key', 'withdrawal_settings')->first();
        if ($setting) {
            $settings = json_decode($setting->value, true);
            if (isset($settings['is_enabled']) && $settings['is_enabled']) {
                $now = now()->format('H:i');
                $startTime = $settings['start_time'];
                $endTime = $settings['end_time'];
                
                // If end time is next day (e.g. 22:00 to 06:00), handle properly
                $isWithinTime = false;
                if ($startTime <= $endTime) {
                    $isWithinTime = ($now >= $startTime && $now <= $endTime);
                } else {
                    $isWithinTime = ($now >= $startTime || $now <= $endTime);
                }

                if (!$isWithinTime) {
                    return response()->json([
                        'message' => "Withdrawals are only allowed between $startTime and $endTime server time."
                    ], 400);
                }
            }
        }

        // Fetch platform controls to enforce minimum withdrawal limit
        $platformSetting = DB::table('settings')->where('key', 'platform_controls')->first();
        if ($platformSetting) {
            $platformData = json_decode($platformSetting->value, true);
            $minWithdrawal = isset($platformData['min_withdrawal']) ? (float)$platformData['min_withdrawal'] : 10;
            
            if ($validated['amount'] < $minWithdrawal) {
                return response()->json([
                    'message' => "The minimum withdrawal amount is \${$minWithdrawal}."
                ], 400);
            }
        }

        // Verify user and balance
        $user = User::find($validated['user_id']);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (empty($user->withdrawal_password)) {
            return response()->json(['message' => 'Please set a withdrawal password first'], 400);
        }

        if ($user->withdrawal_password !== $validated['withdrawal_password']) {
            return response()->json(['message' => 'Invalid withdrawal password'], 400);
        }

        if ($user->balance < $validated['amount']) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        $withdrawal = null;

        DB::transaction(function () use ($validated, $user, &$withdrawal) {
            // Deduct balance immediately
            $user->balance -= $validated['amount'];
            $user->save();

            $withdrawal = Withdrawal::create([
                'user_id' => $validated['user_id'],
                'amount' => $validated['amount'],
                'network' => $validated['network'],
                'wallet_address' => $validated['wallet_address'],
                'status' => 'Pending'
            ]);
        });

        return response()->json([
            'message' => 'Withdrawal submitted successfully',
            'withdrawal' => $withdrawal
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $withdrawal = Withdrawal::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Pending,Completed,Rejected'
        ]);

        if ($withdrawal->status === 'Pending' && $request->status === 'Completed') {
            $withdrawal->update(['status' => 'Completed']);
        } elseif ($withdrawal->status === 'Pending' && $request->status === 'Rejected') {
            DB::transaction(function () use ($withdrawal) {
                $withdrawal->status = 'Rejected';
                $withdrawal->save();
                
                // Refund the balance since it was deducted on request creation
                $withdrawal->user->balance += $withdrawal->amount;
                $withdrawal->user->save();
            });
        } else {
            $withdrawal->update(['status' => $request->status]);
        }

        return response()->json([
            'message' => 'Withdrawal updated successfully',
            'withdrawal' => $withdrawal->load('user')
        ]);
    }
}
