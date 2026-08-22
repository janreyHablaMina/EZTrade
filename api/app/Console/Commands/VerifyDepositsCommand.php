<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Deposit;
use App\Models\User;
use App\Services\OkxService;
use Illuminate\Support\Facades\Log;

class VerifyDepositsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deposits:verify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify pending deposits by checking OKX deposit history';

    /**
     * Execute the console command.
     */
    public function handle(OkxService $okxService)
    {
        $this->info("Fetching pending deposits...");
        
        // Fetch pending deposits that have a TXID
        $pendingDeposits = Deposit::where('status', 'Pending')
            ->whereNotNull('txid')
            ->get();

        if ($pendingDeposits->isEmpty()) {
            $this->info("No pending deposits found with a TXID.");
            return;
        }

        $this->info("Found {$pendingDeposits->count()} pending deposits. Fetching recent OKX deposits...");

        // Fetch recent deposits from OKX
        $okxDeposits = $okxService->getRecentDeposits('USDT');

        if (empty($okxDeposits)) {
            $this->error("Failed to fetch OKX deposits or no recent deposits found.");
            return;
        }

        $this->info("Fetched " . count($okxDeposits) . " recent deposits from OKX.");

        // Loop through each pending deposit and check against OKX data
        foreach ($pendingDeposits as $deposit) {
            $this->info("Checking deposit #{$deposit->id} with TXID: {$deposit->txid}");
            
            $match = collect($okxDeposits)->first(function ($okxDeposit) use ($deposit) {
                // Check if TXID matches (ignoring case)
                return strtolower($okxDeposit['txId']) === strtolower($deposit->txid);
            });

            if ($match) {
                // OKX status reference:
                // 1: pending, 2: success, 3: success (credited), 4: success (can be withdrawn), etc.
                // We'll consider status 2 or above as successful
                $status = (int) $match['state'];
                
                if ($status >= 2 && $status !== 11) { // 11 means frozen/abnormal
                    $this->info("Match found and is successful! Approving deposit...");
                    
                    // Approve deposit
                    $deposit->status = 'Approved';
                    $deposit->save();
                    
                    // Credit user balance (assuming user has a generic 'balance' field or similar)
                    // If you have a specific asset column like 'usdt_balance', update it accordingly.
                    $user = $deposit->user;
                    if ($user) {
                        // Using a simple increment. You might want to handle this in a transaction.
                        // For EZTrade, the typical balance column is 'balance'
                        $user->balance = ($user->balance ?? 0) + $deposit->amount;
                        $user->save();
                        
                        $this->info("User #{$user->id} credited with {$deposit->amount} USDT.");
                        Log::info("Deposit Auto-Verified", ['deposit_id' => $deposit->id, 'txid' => $deposit->txid, 'amount' => $deposit->amount]);
                    }
                } else {
                    $this->warn("Match found but OKX status is still pending or abnormal (State: {$status}).");
                }
            } else {
                $this->warn("No match found for TXID: {$deposit->txid}");
            }
        }

        $this->info("Verification complete.");
    }
}
