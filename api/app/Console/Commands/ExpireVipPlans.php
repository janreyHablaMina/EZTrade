<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ExpireVipPlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expire-vip-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire VIP plans that have passed their duration_days and return capital to users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = \App\Models\User::whereNotNull('vip_plan_id')
            ->whereNotNull('vip_plan_unlocked_at')
            ->with('vipPlan')
            ->get();

        $expiredCount = 0;

        foreach ($users as $user) {
            $plan = $user->vipPlan;
            if (!$plan) continue;

            $unlockedAt = \Carbon\Carbon::parse($user->vip_plan_unlocked_at);
            $expiresAt = $unlockedAt->copy()->addDays($plan->duration_days);

            if (now()->greaterThanOrEqualTo($expiresAt)) {
                // Return the capital to the user
                $user->balance += $plan->min_deposit;
                
                // Reset their VIP plan
                $user->vip_plan_id = null;
                $user->vip_plan_unlocked_at = null;
                $user->save();

                // Log the capital return
                \App\Models\EarningsLog::create([
                    'user_id' => $user->id,
                    'amount' => $plan->min_deposit,
                    'type' => 'Capital Return',
                    'description' => 'Capital returned for expired ' . $plan->level . ' plan'
                ]);

                $expiredCount++;
                $this->info("Expired {$plan->level} for user ID {$user->id}. Returned \${$plan->min_deposit}.");
            }
        }

        $this->info("Successfully expired {$expiredCount} VIP plans.");
    }
}
