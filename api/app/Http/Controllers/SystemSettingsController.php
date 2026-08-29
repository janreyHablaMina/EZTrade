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
                    'maintenance_message' => 'We are currently performing scheduled maintenance to improve the platform. Please check back later.'
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
                    'min_deposit' => 10,
                    'deposit_fee_percent' => 0,
                    'wallets' => [
                        [
                            'id' => 'trc20',
                            'name' => 'TRC20 (Tether/Tron)',
                            'address' => 'TYourTRC20DepositAddressHere123',
                            'qr_url' => null
                        ],
                        [
                            'id' => 'erc20',
                            'name' => 'ERC20 (Ethereum)',
                            'address' => '0xYourERC20DepositAddressHere123',
                            'qr_url' => null
                        ],
                        [
                            'id' => 'polygon',
                            'name' => 'Polygon',
                            'address' => '0xYourPolygonDepositAddressHere123',
                            'qr_url' => null
                        ],
                        [
                            'id' => 'bep20',
                            'name' => 'BEP20 (Binance Smart Chain)',
                            'address' => '0xYourBEP20DepositAddressHere123',
                            'qr_url' => null
                        ]
                    ]
                ];
            default:
                return [];
        }
    }

    private function migrateDepositAddresses($data)
    {
        // If it already has the new 'wallets' structure, return as is
        if (isset($data['wallets']) && is_array($data['wallets'])) {
            return $data;
        }

        // Migrate flat legacy keys to the dynamic 'wallets' structure
        $wallets = [];
        $legacyNetworks = [
            'trc20' => 'TRC20 (Tether/Tron)',
            'erc20' => 'ERC20 (Ethereum)',
            'polygon' => 'Polygon',
            'bep20' => 'BEP20 (Binance Smart Chain)'
        ];

        foreach ($legacyNetworks as $id => $name) {
            $addressKey = $id . '_address';
            $qrKey = $id . '_qr';
            
            if (isset($data[$addressKey])) {
                $wallets[] = [
                    'id' => $id,
                    'name' => $name,
                    'address' => $data[$addressKey],
                    'qr_url' => $data[$qrKey] ?? null
                ];
                unset($data[$addressKey], $data[$qrKey]);
            }
        }

        // If no legacy networks found but also no 'wallets', fallback to defaults
        if (empty($wallets)) {
            $defaults = $this->getDefaultSettings('deposit_addresses');
            $wallets = $defaults['wallets'];
        }

        $data['wallets'] = $wallets;
        return $data;
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
                $data = json_decode($settings[$key]->value, true);
                if ($key === 'deposit_addresses') {
                    $data = $this->migrateDepositAddresses($data);
                }
                $result[$key] = $data;
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

        // Parse JSON strings if necessary (e.g. dynamic wallets array)
        if (isset($payload['wallets']) && is_string($payload['wallets'])) {
            $payload['wallets'] = json_decode($payload['wallets'], true) ?? [];
        }

        // Upload files
        $uploadedFiles = [];
        foreach ($request->allFiles() as $fileKey => $file) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/settings'), $filename);
            $uploadedFiles[$fileKey] = 'uploads/settings/' . $filename;
        }

        // If updating deposit_addresses, map QR codes back to dynamic wallets array
        if ($key === 'deposit_addresses' && isset($payload['wallets'])) {
            foreach ($payload['wallets'] as &$wallet) {
                $qrFileKey = 'qr_' . $wallet['id'];
                if (isset($uploadedFiles[$qrFileKey])) {
                    $wallet['qr_url'] = $uploadedFiles[$qrFileKey];
                }
            }
            unset($wallet);
        } else {
            // For other settings, merge files to root level
            $payload = array_merge($payload, $uploadedFiles);
        }

        // Get existing settings to merge, so we don't overwrite files if they weren't re-uploaded
        $existing = DB::table('settings')->where('key', $key)->first();
        if ($existing) {
            $existingData = json_decode($existing->value, true) ?: [];
            if ($key === 'deposit_addresses') {
                $existingData = $this->migrateDepositAddresses($existingData);
                // Retain existing QR URLs if new ones weren't uploaded
                if (isset($payload['wallets']) && isset($existingData['wallets'])) {
                    $existingQrs = collect($existingData['wallets'])->pluck('qr_url', 'id')->toArray();
                    foreach ($payload['wallets'] as &$wallet) {
                        if (empty($wallet['qr_url']) && !empty($existingQrs[$wallet['id']])) {
                            $wallet['qr_url'] = $existingQrs[$wallet['id']];
                        }
                    }
                    unset($wallet);
                }
            }
            // Merge scalar fields (min_deposit, deposit_fee_percent, etc)
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
        $platformControls = DB::table('settings')->where('key', 'platform_controls')->first();
        $depositAddresses = DB::table('settings')->where('key', 'deposit_addresses')->first();
        $withdrawalSettings = DB::table('settings')->where('key', 'withdrawal_settings')->first();
        
        $maintenanceMode = false;
        $maintenanceTitle = 'Under Maintenance';
        $maintenanceMessage = 'We are currently performing scheduled maintenance to improve the platform. Please check back later.';
        $minDeposit = 10;
        $minWithdrawal = 20;
        $withdrawalFeePercent = 1;
        $wallets = [];

        if ($platformControls) {
            $data = json_decode($platformControls->value, true);
            if (isset($data['maintenance_mode'])) {
                $maintenanceMode = (bool) $data['maintenance_mode'];
            }
            if (!empty($data['maintenance_title'])) {
                $maintenanceTitle = $data['maintenance_title'];
            }
            if (!empty($data['maintenance_message'])) {
                $maintenanceMessage = $data['maintenance_message'];
            }
        }

        if ($depositAddresses) {
            $data = json_decode($depositAddresses->value, true);
            $data = $this->migrateDepositAddresses($data);
            
            if (isset($data['min_deposit'])) {
                $minDeposit = (float) $data['min_deposit'];
            }
            if (isset($data['wallets'])) {
                $wallets = $data['wallets'];
            }
        } else {
            $defaults = $this->getDefaultSettings('deposit_addresses');
            $wallets = $defaults['wallets'];
        }

        if ($withdrawalSettings) {
            $data = json_decode($withdrawalSettings->value, true);
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
            'wallets' => $wallets,
        ]);
    }
}
