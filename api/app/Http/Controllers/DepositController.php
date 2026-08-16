<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepositController extends Controller
{
    public function index()
    {
        return response()->json(Deposit::with('user')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'network' => 'required|string',
            'txid' => 'required|string'
        ]);

        $deposit = Deposit::create([
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'network' => $request->network,
            'txid' => $request->txid,
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

                // Give 10% to the referrer on every approved deposit
                if ($deposit->user->referred_by) {
                    $referrer = \App\Models\User::find($deposit->user->referred_by);
                    if ($referrer) {
                        $bonus = $deposit->amount * 0.10;
                        $referrer->balance += $bonus;
                        $referrer->save();
                        
                        \App\Models\Notification::create([
                            'user_id' => $referrer->id,
                            'title' => 'Referral Bonus!',
                            'message' => 'You received a ' . number_format($bonus, 2) . ' USDT bonus from your referral\'s deposit!',
                            'type' => 'success',
                        ]);
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
