<?php

namespace App\Http\Controllers;

use App\Models\TradingCodeRedemption;
use Illuminate\Http\Request;

class EarningController extends Controller
{
    public function index()
    {
        // Load user and the trading code associated with the redemption
        $earnings = TradingCodeRedemption::with(['user', 'tradingCode'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($earnings);
    }
}
