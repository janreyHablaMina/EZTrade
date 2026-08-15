import { Search, Filter, RotateCcw, ChevronDown, Calendar } from "lucide-react";

type SupportFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  priority: string;
  setPriority: (s: string) => void;
  category: string;
  setCategory: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function SupportFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: SupportFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col gap-3.5 xl:flex-row xl:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, email or ticket ID..."
          className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong focus:ring-1 focus:ring-purple-bright/20 transition shadow-inner"
        />
      </div>

      {/* Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Status</label>
          <div className="relative min-w-[110px]">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
          </div>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Priority</label>
          <div className="relative min-w-[110px]">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Category</label>
          <div className="relative min-w-[120px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Category</option>
              <option value="Withdrawals">Withdrawals</option>
              <option value="Deposits">Deposits</option>
              <option value="VIP Plans">VIP Plans</option>
              <option value="Account">Account</option>
              <option value="Referrals">Referrals</option>
              <option value="Technical">Technical</option>
              <option value="Transactions">Transactions</option>
              <option value="KYC">KYC</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Date Range</label>
          <div className="relative min-w-[190px]">
            <Calendar className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2 pointer-events-none" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="May 11, 2024 - May 18, 2024"
              className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end pb-[2px] h-full gap-2 mt-4 xl:mt-0">
          <button
            type="button"
            onClick={onFilter}
            className="flex h-[34px] items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-4 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.25)] cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex h-[34px] items-center gap-1.5 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] px-4 text-xs font-semibold text-white transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
