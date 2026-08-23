<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VipPlan extends Model
{
    protected $fillable = [
        'level',
        'min_deposit',
        'daily_profit_percent',
        'duration_days',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
