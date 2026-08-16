<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class SimulatorController extends Controller
{
    public function simulateTrade(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::findOrFail($request->user_id);
        
        // Simulate a winning trade of $10
        $profit = 10.00;
        $user->balance += $profit;
        $user->save();

        return response()->json([
            'message' => 'Simulated successful trade!',
            'profit' => $profit,
            'new_balance' => $user->balance,
            'user' => $user
        ]);
    }
}
