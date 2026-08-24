<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class SettingsHelper
{
    /**
     * Get the dynamic referral rates from the settings table.
     * Returns an array mapping level (1, 2, 3) to the decimal rate (e.g., 0.10).
     */
    public static function getReferralRates()
    {
        $setting = DB::table('settings')->where('key', 'referral_program')->first();
        
        if ($setting && $setting->value) {
            $data = json_decode($setting->value, true);
            return [
                1 => ($data['level_1_percent'] ?? 10) / 100,
                2 => ($data['level_2_percent'] ?? 5) / 100,
                3 => ($data['level_3_percent'] ?? 3) / 100,
            ];
        }

        // Fallback to defaults
        return [
            1 => 0.10,
            2 => 0.05,
            3 => 0.03,
        ];
    }
}
