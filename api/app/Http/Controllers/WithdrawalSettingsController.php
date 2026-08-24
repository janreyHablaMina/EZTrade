<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WithdrawalSettingsController extends Controller
{
    public function getSettings()
    {
        $setting = DB::table('settings')->where('key', 'withdrawal_settings')->first();
        
        if (!$setting) {
            return response()->json([
                'is_enabled' => false,
                'start_time' => '09:00',
                'end_time' => '17:00'
            ]);
        }

        $data = json_decode($setting->value, true);
        $data['current_server_time'] = now()->format('H:i');
        return response()->json($data);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'is_enabled' => 'required|boolean',
            'start_time' => 'required|string|regex:/^\d{2}:\d{2}$/',
            'end_time' => 'required|string|regex:/^\d{2}:\d{2}$/',
        ]);

        $payload = [
            'is_enabled' => $request->is_enabled,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time
        ];

        DB::table('settings')->updateOrInsert(
            ['key' => 'withdrawal_settings'],
            ['value' => json_encode($payload), 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json([
            'message' => 'Withdrawal settings updated successfully',
            'settings' => $payload
        ]);
    }
}
