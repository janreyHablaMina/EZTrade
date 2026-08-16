<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TradingCodeRedemption extends Model
{
    protected $fillable = [
        'user_id',
        'trading_code_id',
        'reward_amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tradingCode()
    {
        return $this->belongsTo(TradingCode::class);
    }
}
