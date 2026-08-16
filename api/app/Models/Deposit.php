<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'network',
        'txid',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
