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
        $request->validate([
            'profit_percentage' => 'nullable|numeric|min:0.01|max:100',
            'expires_in_minutes' => 'nullable|integer|min:1',
            'broadcast' => 'nullable|boolean',
            'message_title' => 'nullable|string|max:255',
            'message_content' => 'nullable|string',
        ]);

        $profitPercentage = $request->input('profit_percentage', 10.00);
        $expiresInMinutes = $request->input('expires_in_minutes', 30);

        // 1. Generate an 8-character uppercase code
        $code = strtoupper(Str::random(8));

        // 2. Save it to the DB with provided or default expiration
        $tradingCode = TradingCode::create([
            'code' => $code,
            'reward_type' => 'deposit_bonus',
            'profit_percentage' => $profitPercentage,
            'expires_at' => Carbon::now()->addMinutes($expiresInMinutes),
        ]);

        if ($request->input('broadcast', false)) {
            $dateStr = Carbon::now()->format('F j, Y');
            $titleTemplate = $request->input('message_title', 'Bonus Trading Signal Active!');
            $contentTemplate = $request->input('message_content', "🚨 New Bonus Code Available! 🚨\n\n🎟️ Code: {code}\nEarn {profit}% of your VIP plan limit.");

            $replacedContent = str_replace(
                ['{code}', '{profit}', '{duration}', '{dateStr}'],
                [$code, $profitPercentage, $expiresInMinutes, $dateStr],
                $contentTemplate
            );

            Notification::create([
                'user_id' => null,
                'title' => $titleTemplate,
                'message' => $replacedContent,
                'type' => 'Promotion',
                'is_read' => false,
            ]);

            \App\Models\Message::create([
                'sender_id' => 22,
                'receiver_id' => null,
                'content' => $replacedContent,
                'is_read' => false,
            ]);
        }

        return response()->json([
            'message' => 'Trading code generated successfully',
            'trading_code' => $tradingCode,
        ]);
    }

    public function generateBonus(Request $request)
    {
        $setting = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'bonus_automation')->first();
        if (!$setting) {
            return response()->json(['message' => 'Bonus automation config not found'], 400);
        }

        $config = json_decode($setting->value, true);
        $profitPercentage = $config['profit_percentage'] ?? 50;
        $expiresInMinutes = $config['duration_minutes'] ?? 60;
        
        $code = strtoupper(Str::random(8));

        $tradingCode = TradingCode::create([
            'code' => $code,
            'reward_type' => 'deposit_bonus',
            'profit_percentage' => $profitPercentage,
            'expires_at' => Carbon::now()->addMinutes($expiresInMinutes),
        ]);

        $dateStr = Carbon::now()->format('F j, Y');
        $titleTemplate = $config['message_title'] ?? 'Bonus Trading Signal Active!';
        $contentTemplate = $config['message_content'] ?? "🚨 SURPRISE BONUS! 🚨\n\n🎟️ Code: {code}";

        $userId = $request->input('user_id');

        $replacedContent = str_replace(
            ['{code}', '{profit}', '{duration}', '{dateStr}'],
            [$code, $profitPercentage, $expiresInMinutes, $dateStr],
            $contentTemplate
        );

        Notification::create([
            'user_id' => $userId,
            'title' => $titleTemplate,
            'message' => $replacedContent,
            'type' => 'Promotion',
            'is_read' => false,
        ]);

        $msg = \App\Models\Message::create([
            'sender_id' => 22,
            'receiver_id' => $userId,
            'content' => $replacedContent,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Bonus trading code sent successfully',
            'trading_code' => $tradingCode,
            'chat_message' => $msg
        ]);
    }

    public function generateAutomated(Request $request)
    {
        $setting = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'trade_automation')->first();
        if (!$setting) {
            return response()->json(['message' => 'Trade automation config not found'], 400);
        }

        $config = json_decode($setting->value, true);
        $tradesPerDay = $config['trades_per_day'] ?? 1;
        $expiresInMinutes = $config['duration_minutes'] ?? 30;
        
        $profitPercentage = round(100 / $tradesPerDay, 2);
        $code = strtoupper(Str::random(8));

        $tradingCode = TradingCode::create([
            'code' => $code,
            'reward_type' => 'vip_yield',
            'profit_percentage' => $profitPercentage,
            'expires_at' => Carbon::now()->addMinutes($expiresInMinutes),
        ]);

        $dateStr = Carbon::now()->format('F j, Y');
        $titleTemplate = $config['message_title'] ?? 'New Trading Signal Active!';
        $contentTemplate = $config['message_content'] ?? "🚨 New Trading Code Available! 🚨\n\n🎟️ Code: {code}";

        $userId = $request->input('user_id');

        $replacedContent = str_replace(
            ['{code}', '{profit}', '{duration}', '{dateStr}'],
            [$code, $profitPercentage, $expiresInMinutes, $dateStr],
            $contentTemplate
        );

        Notification::create([
            'user_id' => $userId,
            'title' => $titleTemplate,
            'message' => $replacedContent,
            'type' => 'Promotion',
            'is_read' => false,
        ]);

        $msg = \App\Models\Message::create([
            'sender_id' => 22,
            'receiver_id' => $userId,
            'content' => $replacedContent,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Automated trading code sent successfully',
            'trading_code' => $tradingCode,
            'chat_message' => $msg
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

        // Calculate reward
        $rewardAmount = 0.00;
        if ($user->vipPlan && !is_null($user->vipPlan->daily_profit_percent)) {
            $minDeposit = floatval($user->vipPlan->min_deposit);
            
            if ($tradingCode->reward_type === 'deposit_bonus') {
                // Manual Bonus: Percentage directly off the VIP Deposit Limit
                $rewardAmount = round($minDeposit * (floatval($tradingCode->profit_percentage) / 100), 2);
            } else {
                // Automated Daily Yield: Percentage off the Daily Profit limit
                $dailyProfit = $minDeposit * (floatval($user->vipPlan->daily_profit_percent) / 100);
                $rewardAmount = round($dailyProfit * (floatval($tradingCode->profit_percentage) / 100), 2);
            }
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
