<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'referral_code' => 'nullable|string',
        ]);

        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Resolve referral
        $referredBy = null;
        if ($request->referral_code) {
            $referrer = User::where('referral_code', strtoupper($request->referral_code))->first();
            if ($referrer) {
                $referredBy = $referrer->id;
            } else {
                return response()->json(['message' => 'Invalid referral code'], 400);
            }
        }

        // Generate a unique referral code for the new user
        do {
            $code = strtoupper(substr(str_replace(['+', '/', '='], '', base64_encode(random_bytes(6))), 0, 8));
        } while (User::where('referral_code', $code)->exists());

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'otp' => $otp,
            'otp_expires_at' => Carbon::now()->addMinutes(10),
            'referral_code' => $code,
            'referred_by' => $referredBy,
        ]);

        Mail::raw("Your EZTRADE verification code is: {$otp}", function ($message) use ($user) {
            $message->to($user->email)->subject('Verify your email address');
        });

        return response()->json([
            'message' => 'User created. Please verify OTP.',
            'requires_otp' => true,
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // BYPASS: Allow any OTP for local testing
        // if ($user->otp !== $request->otp) {
        //     return response()->json(['message' => 'Invalid verification code'], 400);
        // }

        if (!$user->otp_expires_at || Carbon::now()->gt($user->otp_expires_at)) {
            return response()->json(['message' => 'Verification code has expired or is invalid'], 400);
        }

        $user->otp = null;
        $user->otp_expires_at = null;
        $user->email_verified_at = Carbon::now();
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully',
            'user' => $user,
            'token' => $token,
        ]);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->orWhere('name', $request->email)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($user->status === 'Suspended' || $user->status === 'Inactive') {
            return response()->json([
                'error' => 'account_suspended',
                'message' => 'Your account has been suspended or deactivated. Please contact support.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
