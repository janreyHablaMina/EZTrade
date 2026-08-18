<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AmbassadorController extends Controller
{
    public function index()
    {
        // Fetch all users with role 'Ambassador'
        $ambassadors = User::where('role', 'Ambassador')
            ->orderBy('created_at', 'desc')
            ->get();

        $data = $ambassadors->map(function ($ambassador) {
            // Get all downline users
            $downline = User::where('referred_by', $ambassador->id)->get();
            $downlineCount = $downline->count();
            
            // Total assets (balance) of downline
            $totalDownlineAssets = $downline->sum('balance');
            
            // "Daily Earnings (5%)" - as requested in mock, calculate 5% of downline assets as a placeholder admin earnings metric
            $dailyEarnings = $totalDownlineAssets * 0.05;

            return [
                'id' => 'AMB' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
                'dbId' => $ambassador->id,
                'name' => $ambassador->name,
                'email' => $ambassador->email,
                'status' => $ambassador->status ?? 'Active',
                'registeredAt' => $ambassador->created_at,
                'downlineCount' => $downlineCount,
                'totalDownlineAssets' => $totalDownlineAssets,
                'dailyEarnings' => $dailyEarnings,
                'referralCode' => $ambassador->referral_code ?? 'N/A',
            ];
        });

        return response()->json($data);
    }
}
