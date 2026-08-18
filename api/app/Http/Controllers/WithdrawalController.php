<?php

namespace App\Http\Controllers;

use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    public function index()
    {
        return response()->json(Withdrawal::with('user')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'network' => 'required|string',
            'txid' => 'nullable|string'
        ]);

        // Verify user has enough balance
        $user = \App\Models\User::find($request->user_id);
        if ($user->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        $withdrawal = null;

        DB::transaction(function () use ($request, $user, &$withdrawal) {
            // Deduct balance immediately
            $user->balance -= $request->amount;
            $user->save();

            $withdrawal = Withdrawal::create([
                'user_id' => $request->user_id,
                'amount' => $request->amount,
                'network' => $request->network,
                'txid' => $request->txid,
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
