import {
  Edit2,
  Copy,
  Trash2,
} from "lucide-react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import type { VipPlan } from "./vipPlansData";
import { vipPlanBadgeStyles } from "./vipPlansData";

type VipPlansTableProps = {
  plans: VipPlan[];
  paginatedPlans: VipPlan[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  onEdit?: (plan: VipPlan) => void;
  onDuplicate?: (plan: VipPlan) => void;
  onDelete?: (plan: VipPlan) => void;
};

export function VipPlansTable({
  plans,
  paginatedPlans,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onEdit,
  onDuplicate,
  onDelete,
}: VipPlansTableProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 font-medium">Level</th>
              <th className="pb-3.5 font-medium">Plan Name</th>
              <th className="pb-3.5 font-medium">Min Deposit (USDT)</th>
              <th className="pb-3.5 font-medium">Max Deposit (USDT)</th>
              <th className="pb-3.5 font-medium">Daily Profit (%)</th>
              <th className="pb-3.5 font-medium">Daily Profit (USDT)</th>
              <th className="pb-3.5 font-medium">Duration (Days)</th>
              <th className="pb-3.5 font-medium">Total Users</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlans.length > 0 ? (
              paginatedPlans.map((plan) => {
                return (
                  <tr
                    key={plan.id}
                    className="border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition"
                  >
                    <td className="py-3.5 pl-1">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
                          vipPlanBadgeStyles[plan.level] || ""
                        }`}
                      >
                        {plan.level}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-white">
                      {plan.planName}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.minDeposit.toLocaleString("en-US")}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {typeof plan.maxDeposit === "number"
                        ? plan.maxDeposit.toLocaleString("en-US")
                        : plan.maxDeposit}
                    </td>
                    <td className="py-3.5 font-semibold text-success">
                      {plan.dailyProfitPercent.toFixed(2)}%
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {typeof plan.dailyProfitUsdtMax === "number"
                        ? `${plan.dailyProfitUsdtMin.toFixed(2)} - ${plan.dailyProfitUsdtMax.toFixed(2)}`
                        : `${plan.dailyProfitUsdtMin.toLocaleString("en-US", { minimumFractionDigits: 2 })}+`}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.durationDays}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.totalUsers.toLocaleString("en-US")}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
                          plan.status === "Active"
                            ? "bg-success/15 text-success"
                            : "bg-white/[0.06] text-muted-2"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-1">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => onEdit?.(plan)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card-elevated text-purple-bright hover:bg-purple/10 hover:border-purple-bright/35 transition cursor-pointer"
                          aria-label="Edit Plan"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicate?.(plan)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer"
                          aria-label="Duplicate Plan"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(plan)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-danger/25 bg-card-elevated text-danger hover:bg-danger/10 hover:border-danger/45 transition cursor-pointer"
                          aria-label="Delete Plan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-muted-2">
                  No plans found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={plans.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="plans"
        pageSizes={[5, 10, 20]}
      />
    </div>
  );
}
