<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Deposit;
use App\Models\EarningsLog;
use App\Helpers\SettingsHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AmbassadorController extends Controller
{
    /**
     * Get all downline IDs using an in-memory collection to avoid N+1 queries.
     */
    protected function getAllDownlineIds(int $userId, $allUsers): array
    {
        $allDownlineIds = [];
        $currentLevelIds = [$userId];

        while (!empty($currentLevelIds)) {
            $nextLevelIds = $allUsers
                ->whereIn('referred_by', $currentLevelIds)
                ->pluck('id')
                ->toArray();

            if (empty($nextLevelIds)) break;

            $allDownlineIds = array_merge($allDownlineIds, $nextLevelIds);
            $currentLevelIds = $nextLevelIds;
        }

        return $allDownlineIds;
    }

    public function index()
    {
        // Load all users once to avoid N+1 inside map
        $allUsers = User::all();
        $ambassadors = $allUsers->where('role', 'Ambassador')->sortByDesc('created_at');

        $data = $ambassadors->map(function ($ambassador) use ($allUsers) {
            $downlineIds = $this->getAllDownlineIds($ambassador->id, $allUsers);
            $totalDownlineAssets = $allUsers->whereIn('id', $downlineIds)->sum('balance');
            $dailyEarnings = $totalDownlineAssets * 0.05;

            return [
                'id'                  => 'AMB' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
                'dbId'                => $ambassador->id,
                'name'                => $ambassador->name,
                'email'               => $ambassador->email,
                'status'              => $ambassador->status ?? 'Active',
                'registeredAt'        => $ambassador->created_at,
                'teamSize'            => count($downlineIds) + 1,
                'downlineCount'       => count($downlineIds),
                'totalDownlineAssets' => $totalDownlineAssets,
                'dailyEarnings'       => $dailyEarnings,
                'referralCode'        => $ambassador->referral_code ?? 'N/A',
            ];
        })->values();

        return response()->json($data);
    }

    public function show($id)
    {
        $ambassador = User::findOrFail($id);

        // Pre-load all users once for tree traversal — eliminates N+1
        $allUsers = User::all()->keyBy('id');
        $downlineIds = $this->getAllDownlineIds($ambassador->id, User::all());

        $totalDownlineAssets = $allUsers->whereIn('id', $downlineIds)->sum('balance');
        $totalDownlineDeposits = Deposit::whereIn('user_id', $downlineIds)->where('status', 'Approved')->sum('amount');

        $activeTradeCapital = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get()
            ->sum(fn($u) => $u->vipPlan->min_deposit ?? 0);

        $directReferralEarnings = 0;
        $minusBonuses = 0;
        $totalReferralGiven = 0;
        $rates = SettingsHelper::getReferralRates();

        // Load first approved deposit per user in one query
        $firstDeposits = Deposit::where('status', 'Approved')
            ->whereIn('id', function($q) {
                $q->select(DB::raw('MIN(id)'))->from('deposits')->where('status', 'Approved')->groupBy('user_id');
            })->get();

        foreach ($firstDeposits as $firstDeposit) {
            $user = $allUsers->get($firstDeposit->user_id);
            if (!$user || !$user->referred_by) continue;

            $level = 1;
            $totalBonusPaidOut = 0;
            $currentUplineId = $user->referred_by;

            while ($currentUplineId && $level <= 3) {
                $upline = $allUsers->get($currentUplineId);
                if (!$upline) break;
                $bonus = $firstDeposit->amount * ($rates[$level] ?? 0);
                $totalBonusPaidOut += $bonus;
                if ($upline->id === $ambassador->id) $directReferralEarnings += $bonus;
                $currentUplineId = $upline->referred_by;
                $level++;
            }

            $uplineId = $user->referred_by;
            $foundAmbassadorId = null;
            while ($uplineId) {
                $upline = $allUsers->get($uplineId);
                if (!$upline) break;
                if ($upline->role === 'Ambassador') { $foundAmbassadorId = $upline->id; break; }
                $uplineId = $upline->referred_by;
            }

            if ($foundAmbassadorId === $ambassador->id) {
                $minusBonuses += $totalBonusPaidOut / 2;
                $totalReferralGiven += $totalBonusPaidOut;
            }
        }

        $earningsLogs = EarningsLog::where('user_id', $ambassador->id)->get();
        $grossAssets = $earningsLogs->sum('amount') + $directReferralEarnings;

        return response()->json([
            'id'               => 'EZT-' . str_pad($ambassador->id, 4, '0', STR_PAD_LEFT),
            'dbId'             => $ambassador->id,
            'name'             => $ambassador->name,
            'email'            => $ambassador->email,
            'phone'            => $ambassador->phone ?? 'N/A',
            'status'           => $ambassador->status ?? 'Active',
            'kycStatus'        => $ambassador->kyc_status ?? 'Not Verified',
            'registeredAt'     => $ambassador->created_at->format('M d, Y, h:i A'),
            'balance'          => $ambassador->balance ?? 0,
            'teamSize'         => count($downlineIds) + 1,
            'downlineCount'    => count($downlineIds),
            'activeTradeCapital' => $activeTradeCapital,
            'dailyEarnings'    => 0,
            'referralCode'     => $ambassador->referral_code ?? 'N/A',
            'financials'       => [
                'totalDownlineDeposits' => $totalDownlineDeposits,
                'activeTradeCapital'    => $activeTradeCapital,
                'grossAssets'           => $grossAssets,
                'minusBonuses'          => $minusBonuses,
                'totalReferralGiven'    => $totalReferralGiven,
                'netBalance'            => $ambassador->balance,
            ],
        ]);
    }

    public function downline($id)
    {
        $ambassador = User::findOrFail($id);
        $allUsers = User::all();
        $downlineIds = $this->getAllDownlineIds($ambassador->id, $allUsers);

        return response()->json(
            User::with('vipPlan')->whereIn('id', $downlineIds)->orderBy('created_at', 'desc')->get()
        );
    }

    public function earnings($id)
    {
        $ambassador = User::findOrFail($id);
        $allUsers = User::all();
        $rates = SettingsHelper::getReferralRates();

        $earningsLogs = EarningsLog::with('sourceUser')
            ->where('user_id', $ambassador->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $earnings = $earningsLogs->map(fn($log) => [
            'id'             => 'L' . $log->id,
            'user'           => $log->sourceUser,
            'deposit_amount' => $log->deposit_amount,
            'gross_cut'      => $log->amount,
            'deduction'      => 0,
            'direct_bonus'   => 0,
            'net_earnings'   => $log->amount,
            'created_at'     => $log->created_at,
        ])->toArray();

        $downlineIds = $this->getAllDownlineIds($ambassador->id, $allUsers);
        $usersWithPlans = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->orderBy('updated_at', 'desc')
            ->get();

        foreach ($usersWithPlans as $user) {
            if ($user->vipPlan) {
                $directBonus = $user->vipPlan->min_deposit * ($rates[1] ?? 0);
                $earnings[] = [
                    'id'             => 'D' . $user->id,
                    'user'           => $user,
                    'deposit_amount' => $user->vipPlan->min_deposit,
                    'gross_cut'      => $directBonus,
                    'deduction'      => 0,
                    'direct_bonus'   => $directBonus,
                    'net_earnings'   => $directBonus,
                    'created_at'     => $user->updated_at,
                ];
            }
        }

        usort($earnings, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));

        return response()->json($earnings);
    }

    public function simulateDay($id)
    {
        $ambassador = User::findOrFail($id);
        $allUsers = User::all();
        $downlineIds = $this->getAllDownlineIds($ambassador->id, $allUsers);

        $activeTradeCapital = 0;
        $users = User::with('vipPlan')
            ->whereIn('id', $downlineIds)
            ->where('status', 'Active')
            ->whereNotNull('vip_plan_id')
            ->get();

        foreach ($users as $user) {
            if ($user->vipPlan) {
                $user->balance += $user->vipPlan->min_deposit * ($user->vipPlan->daily_profit_percent / 100);
                $user->save();
                $activeTradeCapital += $user->vipPlan->min_deposit;
            }
        }

        $ambBonus = $activeTradeCapital * 0.05;

        return response()->json([
            'message'     => 'Simulated 1 day passing.',
            'amb_bonus'   => $ambBonus,
            'new_balance' => $ambassador->balance + $ambBonus,
        ]);
    }
}
