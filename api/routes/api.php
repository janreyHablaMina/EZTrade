<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VipPlanController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TradingCodeController;
use App\Http\Controllers\TransactionController;

// ── Auth ──────────────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);

// ── Users ─────────────────────────────────────────────────────────────────────
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/global/stats', [UserController::class, 'globalStats']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::patch('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/users/{id}/stats', [UserController::class, 'stats']);
Route::post('/users/simulate-trade', [\App\Http\Controllers\Admin\SimulatorController::class, 'simulateTrade']);

// ── Transactions ─────────────────────────────────────────────────────────────
Route::get('/transactions', [TransactionController::class, 'index']);

// ── VIP Plans ─────────────────────────────────────────────────────────────────
Route::get('/vip-plans/stats', [VipPlanController::class, 'stats']);
Route::get('/vip-plans', [VipPlanController::class, 'index']);
Route::post('/vip-plans', [VipPlanController::class, 'store']);
Route::patch('/vip-plans/{id}', [VipPlanController::class, 'update']);
Route::delete('/vip-plans/{id}', [VipPlanController::class, 'destroy']);

    // ── Deposits ─────────────────────────────────────────────────────────────────
    Route::get('/deposits', [\App\Http\Controllers\DepositController::class, 'index']);
    Route::post('/deposits', [\App\Http\Controllers\DepositController::class, 'store']);
    Route::patch('/deposits/{id}', [\App\Http\Controllers\DepositController::class, 'update']);
    
    // ── Withdrawals ─────────────────────────────────────────────────────────────────
    Route::get('/withdrawals', [\App\Http\Controllers\WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [\App\Http\Controllers\WithdrawalController::class, 'store']);
    Route::patch('/withdrawals/{id}', [\App\Http\Controllers\WithdrawalController::class, 'update']);

Route::post('/vip-plans/unlock', [VipPlanController::class, 'unlock']);

// ── Notifications ─────────────────────────────────────────────────────────────
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

// ── Admin Endpoints ─────────────────────────────────────────────────────────────
Route::get('/admin/dashboard-stats', [\App\Http\Controllers\Admin\DashboardController::class, 'getStats']);
Route::get('/admin/chart-data', [\App\Http\Controllers\Admin\DashboardController::class, 'getChartData']);
Route::get('/admin/visualize-stats', [\App\Http\Controllers\Admin\DashboardController::class, 'visualizeStats']);
Route::get('/admin/referrals', [\App\Http\Controllers\Admin\ReferralController::class, 'index']);
Route::get('/admin/ambassadors', [\App\Http\Controllers\Admin\AmbassadorController::class, 'index']);
Route::get('/admin/ambassadors/{id}', [\App\Http\Controllers\Admin\AmbassadorController::class, 'show']);
Route::get('/admin/ambassadors/{id}/downline', [\App\Http\Controllers\Admin\AmbassadorController::class, 'downline']);
Route::get('/admin/ambassadors/{id}/earnings', [\App\Http\Controllers\Admin\AmbassadorController::class, 'earnings']);
Route::post('/admin/ambassadors/{id}/simulate', [\App\Http\Controllers\Admin\AmbassadorController::class, 'simulateDay']);
Route::get('/admin/assets', [\App\Http\Controllers\Admin\AssetController::class, 'index']);
Route::get('/settings/trade', [\App\Http\Controllers\TradeSettingsController::class, 'getSettings']);
Route::post('/settings/trade', [\App\Http\Controllers\TradeSettingsController::class, 'updateSettings']);
Route::get('/settings/withdrawal', [\App\Http\Controllers\WithdrawalSettingsController::class, 'getSettings']);
Route::post('/settings/withdrawal', [\App\Http\Controllers\WithdrawalSettingsController::class, 'updateSettings']);
Route::get('/settings/system', [\App\Http\Controllers\SystemSettingsController::class, 'getAllSettings']);
Route::post('/settings/system/{key}', [\App\Http\Controllers\SystemSettingsController::class, 'updateSettings']);

// Messages
Route::get('/messages/conversations', [\App\Http\Controllers\MessageController::class, 'getConversations']);
Route::get('/messages/unread', [\App\Http\Controllers\MessageController::class, 'getUnreadCount']);
Route::get('/messages/{userId}', [\App\Http\Controllers\MessageController::class, 'getHistory']);
Route::post('/messages', [\App\Http\Controllers\MessageController::class, 'send']);
Route::post('/messages/{userId}/read', [\App\Http\Controllers\MessageController::class, 'markAsRead']);

Route::post('/trading-codes/generate', [\App\Http\Controllers\TradingCodeController::class, 'generate']);
Route::post('/trading-codes/redeem', [TradingCodeController::class, 'redeem']);
Route::post('/admin/simulate-midnight', [\App\Http\Controllers\Admin\MidnightController::class, 'simulate']);
Route::get('/earnings', [\App\Http\Controllers\EarningController::class, 'index']);

// ── Authenticated ─────────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
