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
Route::get('/vip-plans', [VipPlanController::class, 'index']);
Route::post('/vip-plans', [VipPlanController::class, 'store']);
Route::post('/vip-plans/unlock', [VipPlanController::class, 'unlock']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
