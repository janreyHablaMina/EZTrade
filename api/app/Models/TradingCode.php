<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TradingCode extends Model
{
    protected $fillable = [
        'code',
        'reward_type',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
