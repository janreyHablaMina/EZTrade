<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VipPlanController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', function ($id) {
    return \App\Models\User::with('vipPlan')->findOrFail($id);
});
Route::get('/users/{id}/stats', function ($id) {
    $user = \App\Models\User::with('vipPlan')->findOrFail($id);

    // Sum all redemption rewards ever
    $totalProfit = \App\Models\TradingCodeRedemption::where('user_id', $id)
        ->sum('reward_amount');

    // Sum of today's redemptions
    $todayProfit = \App\Models\TradingCodeRedemption::where('user_id', $id)
        ->whereDate('created_at', now()->toDateString())
        ->sum('reward_amount');

    $balance = floatval($user->balance);

    // today_percent: actual % gain today = earned / balance_before_today_gain
    $todayPercent = 0;
    if ($todayProfit > 0) {
        $balanceBefore = $balance - floatval($todayProfit);
        if ($balanceBefore > 0) {
            $todayPercent = round((floatval($todayProfit) / $balanceBefore) * 100, 2);
        }
    }

    // Real daily profit potential = balance * daily_profit_percent / 100
    $dailyProfit = 0;
    if ($user->vipPlan) {
        $dailyProfit = round(
            $balance * floatval($user->vipPlan->daily_profit_percent) / 100,
            2
        );
    }

    return response()->json([
        'total_profit'  => round(floatval($totalProfit), 2),
        'today_profit'  => round(floatval($todayProfit), 2),
        'today_percent' => $todayPercent,
        'daily_profit'  => $dailyProfit,
        'balance'       => $balance,
    ]);
});
Route::get('/vip-plans', [VipPlanController::class, 'index']);
Route::post('/vip-plans', [VipPlanController::class, 'store']);
Route::post('/vip-plans/unlock', [VipPlanController::class, 'unlock']);

Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
Route::post('/notifications', [\App\Http\Controllers\NotificationController::class, 'store']);
Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);

Route::post('/trading-codes/generate', [\App\Http\Controllers\TradingCodeController::class, 'generate']);
Route::post('/trading-codes/redeem', [\App\Http\Controllers\TradingCodeController::class, 'redeem']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
