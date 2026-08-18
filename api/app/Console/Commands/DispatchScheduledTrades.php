<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\TradingCode;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DispatchScheduledTrades extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trades:dispatch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatches scheduled trading codes if the time matches';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $setting = DB::table('settings')->where('key', 'trade_automation')->first();
        if (!$setting) {
            return;
        }

        $config = json_decode($setting->value, true);
        $schedules = $config['schedules'] ?? [];
        $tradesPerDay = $config['trades_per_day'] ?? 1;
        $durationMinutes = $config['duration_minutes'] ?? 30;

        $now = Carbon::now()->format('H:i');

        if (in_array($now, $schedules)) {
            $this->info("Schedule matched ($now). Generating trade code...");

            // Profit percentage is split evenly
            $profitPercentage = round(100 / $tradesPerDay, 2);

            $code = strtoupper(Str::random(8));

            $tradingCode = TradingCode::create([
                'code' => $code,
                'reward_type' => 'vip_yield',
                'profit_percentage' => $profitPercentage,
                'expires_at' => Carbon::now()->addMinutes($durationMinutes),
            ]);

            Notification::create([
                'user_id' => null,
                'title' => 'New Trading Signal Active!',
                'message' => "Hurry! Paste this code in the Trade tab to earn {$profitPercentage}% of your VIP plan limit. Code: {$code} (Expires in {$durationMinutes} mins)",
                'type' => 'Promotion',
                'is_read' => false,
            ]);

            $this->info("Dispatched code {$code} successfully.");
        } else {
            $this->info("No schedules match current time ($now).");
        }
    }
}
