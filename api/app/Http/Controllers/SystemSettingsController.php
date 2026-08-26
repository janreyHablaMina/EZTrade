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
        'app_announcements',
        'referral_program',
        'deposit_addresses'
    ];

    private function getDefaultSettings($key)
    {
        switch ($key) {
            case 'platform_controls':
                return [
                    'maintenance_mode' => false,
                    'maintenance_title' => 'Under Maintenance',
                    'maintenance_message' => 'We are currently performing scheduled maintenance to improve the platform. Please check back later.',
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
            case 'deposit_addresses':
                return [
                    'trc20_address' => 'TYourTRC20DepositAddressHere123',
                    'erc20_address' => '0xYourERC20DepositAddressHere123',
                    'polygon_address' => '0xYourPolygonDepositAddressHere123',
                    'bep20_address' => '0xYourBEP20DepositAddressHere123'
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

        $payload = $request->except(array_keys($request->allFiles()));

        foreach ($request->allFiles() as $fileKey => $file) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/settings'), $filename);
            $payload[$fileKey] = 'uploads/settings/' . $filename;
        }

        // Get existing settings to merge, so we don't overwrite files if they weren't re-uploaded
        $existing = DB::table('settings')->where('key', $key)->first();
        if ($existing) {
            $existingData = json_decode($existing->value, true) ?: [];
            $payload = array_merge($existingData, $payload);
        }

        DB::table('settings')->updateOrInsert(
            ['key' => $key],
            ['value' => json_encode($payload), 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $payload
        ]);
    }

    public function getAppStatus()
    {
        $setting = DB::table('settings')->where('key', 'platform_controls')->first();
        
        $maintenanceMode = false;
        $maintenanceTitle = 'Under Maintenance';
        $maintenanceMessage = 'We are currently performing scheduled maintenance to improve the platform. Please check back later.';
        $minDeposit = 10;
        $minWithdrawal = 20;
        $withdrawalFeePercent = 1;

        if ($setting) {
            $data = json_decode($setting->value, true);
            if (isset($data['maintenance_mode'])) {
                $maintenanceMode = (bool) $data['maintenance_mode'];
            }
            if (!empty($data['maintenance_title'])) {
                $maintenanceTitle = $data['maintenance_title'];
            }
            if (!empty($data['maintenance_message'])) {
                $maintenanceMessage = $data['maintenance_message'];
            }
            if (isset($data['min_deposit'])) {
                $minDeposit = (float) $data['min_deposit'];
            }
            if (isset($data['min_withdrawal'])) {
                $minWithdrawal = (float) $data['min_withdrawal'];
            }
            if (isset($data['withdrawal_fee_percent'])) {
                $withdrawalFeePercent = (float) $data['withdrawal_fee_percent'];
            }
        }
        
        return response()->json([
            'maintenance_mode' => $maintenanceMode,
            'maintenance_title' => $maintenanceTitle,
            'maintenance_message' => $maintenanceMessage,
            'min_deposit' => $minDeposit,
            'min_withdrawal' => $minWithdrawal,
            'withdrawal_fee_percent' => $withdrawalFeePercent,
        ]);
    }
}
