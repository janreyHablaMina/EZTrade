<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TradeSettingsController extends Controller
{
    public function getSettings()
    {
        $setting = DB::table('settings')->where('key', 'trade_automation')->first();
        
        if (!$setting) {
            return response()->json([
                'trades_per_day' => 1,
                'duration_minutes' => 30,
                'schedules' => []
            ]);
        }

        return response()->json(json_decode($setting->value, true));
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'trades_per_day' => 'required|integer|min:1',
            'duration_minutes' => 'required|integer|min:1',
            'schedules' => 'required|array',
            'schedules.*' => 'string|regex:/^\d{2}:\d{2}$/'
        ]);

        $payload = [
            'trades_per_day' => $request->trades_per_day,
            'duration_minutes' => $request->duration_minutes,
            'schedules' => $request->schedules
        ];

        DB::table('settings')->updateOrInsert(
            ['key' => 'trade_automation'],
            ['value' => json_encode($payload), 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $payload
        ]);
    }
}
