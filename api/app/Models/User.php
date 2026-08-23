<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'otp',
        'otp_expires_at',
        'balance',
        'vip_plan_id',
        'phone',
        'role',
        'status',
        'kyc_status',
        'referral_code',
        'referred_by',
    ];
    protected $hidden = ['password', 'remember_token', 'otp'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function vipPlan()
    {
        return $this->belongsTo(VipPlan::class);
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function tradingCodeRedemptions()
    {
        return $this->hasMany(TradingCodeRedemption::class);
    }

    protected $appends = ['team_size'];

    public function getTeamSizeAttribute()
    {
        $size = 1; // Includes self
        
        // Eager load up to 3 levels of descendants to avoid N+1 queries during counting
        $this->loadMissing('referrals.referrals.referrals');
        
        foreach ($this->referrals as $level1) {
            $size += 1;
            foreach ($level1->referrals as $level2) {
                $size += 1;
                foreach ($level2->referrals as $level3) {
                    $size += 1;
                }
            }
        }
        
        return $size;
    }
}
