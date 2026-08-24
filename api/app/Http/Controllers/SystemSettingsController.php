<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemSettingsController extends Controller
{
    private $validKeys = [
        'platform_controls',
        'security_kyc',
        'app_announcements',
        'referral_program'
    ];

    private function getDefaultSettings($key)
    {
        switch ($key) {
            case 'platform_controls':
                return [
                    'maintenance_mode' => false,
                    'min_deposit' => 10,
                    'min_withdrawal' => 20,
                    'deposit_fee_percent' => 0,
                    'withdrawal_fee_percent' => 1
                ];
            case 'security_kyc':
                return [
                    'require_kyc_withdrawal' => false
                ];
            case 'app_announcements':
                return [
                    'banner_enabled' => false,
                    'banner_text' => 'Welcome to EZTrade!',
                    'support_email' => 'support@eztrade.com',
                    'telegram_link' => 'https://t.me/eztrade'
                ];
            case 'referral_program':
                return [
                    'level_1_percent' => 5,
                    'level_2_percent' => 3,
                    'level_3_percent' => 1,
                    'flat_bonus_amount' => 0
                ];
            default:
                return [];
        }
    }

    public function getAllSettings()
    {
        $settings = DB::table('settings')
            ->whereIn('key', $this->validKeys)
            ->get()
            ->keyBy('key');

        $result = [];
        foreach ($this->validKeys as $key) {
            if (isset($settings[$key])) {
                $result[$key] = json_decode($settings[$key]->value, true);
            } else {
                $result[$key] = $this->getDefaultSettings($key);
            }
        }

        return response()->json($result);
    }

    public function updateSettings(Request $request, $key)
    {
        if (!in_array($key, $this->validKeys)) {
            return response()->json(['message' => 'Invalid setting key'], 400);
        }

        $payload = $request->all();

        DB::table('settings')->updateOrInsert(
            ['key' => $key],
            ['value' => json_encode($payload), 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $payload
        ]);
    }
}
