import { Search, ChevronDown, Filter, RotateCcw, Calendar } from "lucide-react";

type AuditLogsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  action: string;
  setAction: (a: string) => void;
  status: string;
  setStatus: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function AuditLogsFilters({
  search,
  setSearch,
  action,
  setAction,
  status,
  setStatus,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: AuditLogsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2" />
        <input
          type="text"
          placeholder="Search by user, action, or resource..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 rounded-xl border border-border bg-card-elevated pl-10 pr-4 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Action filter */}
        <div className="relative w-full sm:w-[140px]">
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="Login">Login</option>
            <option value="Export Data">Export Data</option>
            <option value="Configuration Change">Configuration Change</option>
            <option value="Withdrawal Request">Withdrawal Request</option>
            <option value="Deposit">Deposit</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-2" />
        </div>

        {/* Status filter */}
        <div className="relative w-full sm:w-[130px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Warning">Warning</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-2" />
        </div>

        {/* Date Range filter */}
        <div className="relative w-full sm:w-[150px] hidden md:block">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-2" />
          <input
            type="text"
            placeholder="Select date range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card-elevated pl-9 pr-3 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition cursor-pointer"
          />
        </div>

        {/* Filter actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFilter}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-4 text-xs font-semibold text-white transition shadow-[0_4px_12px_rgba(123,44,255,0.25)] cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] text-xs font-semibold text-white transition cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
