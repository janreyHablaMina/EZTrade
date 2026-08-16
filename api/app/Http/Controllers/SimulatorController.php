<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SimulatorController extends Controller
{
    public function simulateTrade(Request $request)
    {
        $user = $request->user();
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
