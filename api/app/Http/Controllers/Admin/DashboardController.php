<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use App\Models\Withdrawal;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function getStats(Request $request)
    {
        return response()->json($this->dashboardService->getStats());
    }

    public function visualizeStats(Request $request)
    {
        return response()->json($this->dashboardService->getVisualizedStats());
    }

    public function getChartData(Request $request)
    {
        $range = $request->query('range', 'today'); // today, week, month
        $now = now();

        if ($range === 'today') {
            $start = $now->copy()->startOfDay();
            $end   = $now->copy()->endOfDay();
            $pgFormat = 'HH24":00"';
        } elseif ($range === 'week') {
            $start = $now->copy()->startOfWeek();
            $end   = $now->copy()->endOfWeek();
            $pgFormat = 'YYYY-MM-DD';
        } else {
            $start = $now->copy()->startOfMonth();
            $end   = $now->copy()->endOfMonth();
            $pgFormat = 'YYYY-MM-DD';
        }

        $deposits = Deposit::where('status', 'Approved')
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw("TO_CHAR(created_at, '{$pgFormat}') as label"), DB::raw('SUM(amount) as total'))
            ->groupBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->orderBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->pluck('total', 'label');

        $withdrawals = Withdrawal::where('status', 'Completed')
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw("TO_CHAR(created_at, '{$pgFormat}') as label"), DB::raw('SUM(amount) as total'))
            ->groupBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->orderBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->pluck('total', 'label');

        $earnings = \App\Models\EarningsLog::whereBetween('created_at', [$start, $end])
            ->select(DB::raw("TO_CHAR(created_at, '{$pgFormat}') as label"), DB::raw('SUM(amount) as total'))
            ->groupBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->orderBy(DB::raw("TO_CHAR(created_at, '{$pgFormat}')"))
            ->pluck('total', 'label');

        $allLabels = collect($deposits->keys())
            ->merge($withdrawals->keys())
            ->merge($earnings->keys())
            ->unique()
            ->sort()
            ->values();

        $result = $allLabels->map(fn($label) => [
            'label'       => $label,
            'deposits'    => (float) ($deposits[$label] ?? 0),
            'withdrawals' => (float) ($withdrawals[$label] ?? 0),
            'earnings'    => (float) ($earnings[$label] ?? 0),
        ]);

        return response()->json([
            'range'  => $range,
            'points' => $result->values(),
        ]);
    }
}

