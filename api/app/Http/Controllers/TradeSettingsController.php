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
                'schedules' => [],
                'message_title' => 'New Trading Signal Active!',
                'message_content' => "🚨 New Trading Code Available! 🚨\n\n📅 Generated on: {dateStr}\n\nHurry! Paste this code in the Trade tab to earn {profit}% of your VIP plan limit.\n\n🎟️ Code: {code}\n⏳ Expires in: {duration} minutes"
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
            'schedules.*' => 'string|regex:/^\d{2}:\d{2}$/',
            'message_title' => 'nullable|string',
            'message_content' => 'nullable|string'
        ]);

        $payload = [
            'trades_per_day' => $request->trades_per_day,
            'duration_minutes' => $request->duration_minutes,
            'schedules' => $request->schedules,
            'message_title' => $request->message_title,
            'message_content' => $request->message_content
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
