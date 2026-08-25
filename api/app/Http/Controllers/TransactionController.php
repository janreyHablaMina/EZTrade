<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['message' => 'User ID required'], 400);
        }

        // Fetch deposits
        $deposits = DB::table('deposits')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'dep_' . $item->id,
                    'type' => 'deposit',
                    'title' => 'USDT Deposit',
                    'subtitle' => $item->network,
                    'amount' => '+' . number_format((float)$item->amount, 2) . ' USDT',
                    'positive' => true,
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                ];
            });

        // Fetch withdrawals
        $withdrawals = DB::table('withdrawals')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'wit_' . $item->id,
                    'type' => 'withdraw',
                    'title' => 'USDT Withdraw',
                    'subtitle' => $item->network,
                    'amount' => '-' . number_format((float)$item->amount, 2) . ' USDT',
                    'positive' => false,
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                ];
            });

        // Fetch earnings logs
        $earnings = DB::table('earnings_logs')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($item) {
                // Determine title based on type
                $title = 'Profit';
                if ($item->type === 'daily_profit') $title = 'Daily Profit';
                elseif ($item->type === 'referral_bonus') $title = 'Referral Bonus';

                return [
                    'id' => 'earn_' . $item->id,
                    'type' => 'profit',
                    'title' => $title,
                    'subtitle' => 'Quantify',
                    'amount' => '+' . number_format((float)$item->amount, 2) . ' USDT',
                    'positive' => true,
                    'status' => 'Completed',
                    'created_at' => $item->created_at,
                ];
            });

        // Merge and sort
        $transactions = collect([])
            ->merge($deposits)
            ->merge($withdrawals)
            ->merge($earnings)
            ->sortByDesc('created_at')
            ->values()
            ->toArray();

        return response()->json([
            'transactions' => $transactions
        ]);
    }
}
