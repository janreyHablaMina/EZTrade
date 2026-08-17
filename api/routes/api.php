<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VipPlanController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TradingCodeController;

// ── Auth ──────────────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);

// ── Users ─────────────────────────────────────────────────────────────────────
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::patch('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/users/{id}/stats', [UserController::class, 'stats']);
Route::post('/users/simulate-trade', [\App\Http\Controllers\Admin\SimulatorController::class, 'simulateTrade']);

// ── VIP Plans ─────────────────────────────────────────────────────────────────
Route::get('/vip-plans/stats', [VipPlanController::class, 'stats']);
Route::get('/vip-plans', [VipPlanController::class, 'index']);
Route::post('/vip-plans', [VipPlanController::class, 'store']);
Route::delete('/vip-plans/{id}', [VipPlanController::class, 'destroy']);

    // ── Deposits ─────────────────────────────────────────────────────────────────
    Route::get('/deposits', [\App\Http\Controllers\DepositController::class, 'index']);
    Route::post('/deposits', [\App\Http\Controllers\DepositController::class, 'store']);
    Route::patch('/deposits/{id}', [\App\Http\Controllers\DepositController::class, 'update']);
Route::post('/vip-plans/unlock', [VipPlanController::class, 'unlock']);

// ── Notifications ─────────────────────────────────────────────────────────────
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

// ── Trading Codes ─────────────────────────────────────────────────────────────
Route::post('/trading-codes/generate', [TradingCodeController::class, 'generate']);
Route::post('/trading-codes/redeem', [TradingCodeController::class, 'redeem']);

// ── Authenticated ─────────────────────────────────────────────────────────────
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
