<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\TradingCode;
use App\Models\TradingCodeRedemption;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TradingCodeController extends Controller
{
    public function generate(Request $request)
    {
        // 1. Generate an 8-character uppercase code
        $code = strtoupper(Str::random(8));

        // 2. Save it to the DB with 30-min expiration
        $tradingCode = TradingCode::create([
            'code' => $code,
            'reward_type' => 'vip_yield',
            'expires_at' => Carbon::now()->addMinutes(30),
        ]);

        // 3. Create a broadcast notification
        Notification::create([
            'user_id' => null,
            'title' => 'New Trading Code Available!',
            'message' => "Hurry! Paste this code in the Trade tab to earn your VIP yield. Code: {$code} (Expires in 30 mins)",
            'type' => 'Promotion',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Trading code generated and broadcasted successfully',
            'trading_code' => $tradingCode,
        ]);
    }

    public function redeem(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();
        if (!$user) {
            $userId = $request->query('user_id');
            if ($userId) {
                $user = \App\Models\User::with('vipPlan')->find($userId);
            }
        } else {
            // Eager-load vipPlan for sanctum-authenticated users too
            $user->load('vipPlan');
        }

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $codeStr = trim($request->code);
        $tradingCode = TradingCode::where('code', $codeStr)->first();

        if (!$tradingCode) {
            return response()->json(['message' => 'Invalid trading code.'], 400);
        }

        if (Carbon::now()->greaterThan($tradingCode->expires_at)) {
            return response()->json(['message' => 'This trading code has expired.'], 400);
        }

        // Check if already redeemed
        $alreadyRedeemed = TradingCodeRedemption::where('user_id', $user->id)
            ->where('trading_code_id', $tradingCode->id)
            ->exists();

        if ($alreadyRedeemed) {
            return response()->json(['message' => 'You have already redeemed this code.'], 400);
        }

        // Calculate reward: (balance * daily_profit_percent / 100)
        $rewardAmount = 0.00;
        if ($user->vipPlan && !is_null($user->vipPlan->daily_profit_percent)) {
            $rewardAmount = round(floatval($user->balance) * floatval($user->vipPlan->daily_profit_percent) / 100, 2);
        }

        // Credit balance
        $user->balance = floatval($user->balance) + $rewardAmount;
        $user->save();

        // Record redemption
        TradingCodeRedemption::create([
            'user_id' => $user->id,
            'trading_code_id' => $tradingCode->id,
            'reward_amount' => $rewardAmount,
        ]);

        return response()->json([
            'message' => 'Successfully quantified yield!',
            'reward' => $rewardAmount,
            'new_balance' => $user->balance
        ]);
    }
}
