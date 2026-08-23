import { useState, useRef, useEffect } from "react";
import {
  Edit2,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import { type VipPlan, vipBadgeStyles } from "@/types/admin";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";

const randomBadgeStyles = [
  "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  "bg-pink-500/10 text-pink-500 border border-pink-500/20",
  "bg-teal-400/10 text-teal-400 border border-teal-400/20",
  "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  "bg-indigo-400/10 text-indigo-400 border border-indigo-400/20",
  "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20",
  "bg-lime-400/10 text-lime-400 border border-lime-400/20",
];

function getBadgeStyleForLevel(level: string) {
  if (vipBadgeStyles[level]) {
    return vipBadgeStyles[level];
  }
  let hash = 0;
  for (let i = 0; i < level.length; i++) {
    hash = level.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % randomBadgeStyles.length;
  return randomBadgeStyles[index];
}

type VipPlansTableProps = {
  plans: VipPlan[];
  paginatedPlans: VipPlan[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  onEdit?: (plan: VipPlan) => void;
  onView?: (plan: VipPlan) => void;
  onDelete?: (plan: VipPlan) => void;
  onToggleStatus?: (plan: VipPlan) => void;
  selectedIds?: string[];
  onSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne?: (id: string) => void;
};

function RowActions({ 
  plan, 
  onEdit, 
  onView, 
  onDelete,
  onToggleStatus
}: { 
  plan: VipPlan; 
  onEdit?: (plan: VipPlan) => void; 
  onView?: (plan: VipPlan) => void; 
  onDelete?: (plan: VipPlan) => void;
  onToggleStatus?: (plan: VipPlan) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleScroll(event: Event) {
      // Don't close if the scroll was inside the dropdown itself
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // Use capture to catch all scroll events
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-2 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
        aria-label="More options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div 
          className="fixed z-[100] w-40 origin-top-right rounded-xl border border-border bg-card-elevated shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-150"
          style={{ top: position.top, right: position.right }}
        >
          <div className="p-1.5 flex flex-col gap-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit?.(plan);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-white transition hover:bg-white/[0.06] cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5 text-purple-bright" />
              Edit Plan
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onView?.(plan);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-white transition hover:bg-white/[0.06] cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-blue-400" />
              View Plan
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onToggleStatus?.(plan);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition hover:bg-white/[0.06] cursor-pointer ${
                plan.status === "Active" ? "text-amber-500" : "text-success"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5 hidden" />
              <div className={`h-3.5 w-3.5 rounded-full border-2 ${plan.status === "Active" ? "border-amber-500" : "border-success"}`} />
              {plan.status === "Active" ? "Deactivate Plan" : "Activate Plan"}
            </button>
            <div className="my-0.5 h-px bg-border/50" />
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete?.(plan);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-danger transition hover:bg-danger/10 hover:text-danger cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function VipPlansTable({
  plans,
  paginatedPlans,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  selectedIds = [],
  onSelectAll,
  onSelectOne,
}: VipPlansTableProps) {
  const isAllSelected = paginatedPlans.length > 0 && paginatedPlans.every(p => selectedIds.includes(p.id));
  const isSomeSelected = paginatedPlans.some(p => selectedIds.includes(p.id)) && !isAllSelected;

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-4 pr-2 font-medium w-[40px]">
                <CustomCheckbox 
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={onSelectAll}
                />
              </th>
              <th className="pb-3.5 pl-1 font-medium">Level</th>
              <th className="pb-3.5 font-medium">Deposit Amount (USDT)</th>
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
                    className={`border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition ${selectedIds.includes(plan.id) ? 'bg-white/[0.02]' : ''}`}
                  >
                    <td className="py-3.5 pl-4 pr-2">
                      <CustomCheckbox 
                        checked={selectedIds.includes(plan.id)}
                        onChange={() => onSelectOne?.(plan.id)}
                      />
                    </td>
                    <td className="py-3.5 pl-1">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold tracking-wider ${
                          getBadgeStyleForLevel(plan.level.toString())
                        }`}
                      >
                        {plan.level.toString()}
                      </span>
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.minDeposit.toLocaleString("en-US")}
                    </td>
                    <td className="py-3.5 font-semibold text-success">
                      {plan.dailyProfitPercent.toFixed(2)}%
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.dailyProfitUsdtMin.toFixed(2)}
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
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-1">
                        <RowActions 
                          plan={plan} 
                          onEdit={onEdit} 
                          onView={onView} 
                          onDelete={onDelete} 
                          onToggleStatus={onToggleStatus}
                        />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-2">
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
