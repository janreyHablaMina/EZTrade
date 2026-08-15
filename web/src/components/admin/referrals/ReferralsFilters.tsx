import { Search, Filter, RotateCcw, ChevronDown, Calendar } from "lucide-react";

type ReferralsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  vipLevel: string;
  setVipLevel: (v: string) => void;
  status: string;
  setStatus: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function ReferralsFilters({
  search,
  setSearch,
  vipLevel,
  setVipLevel,
  status,
  setStatus,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: ReferralsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-3.5 xl:flex-row xl:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, email or phone..."
            className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong focus:ring-1 focus:ring-purple-bright/20 transition shadow-inner"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* VIP Level Select */}
          <div className="relative min-w-[120px]">
            <select
              value={vipLevel}
              onChange={(e) => setVipLevel(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-3.5 pr-9 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="1">VIP 1</option>
              <option value="2">VIP 2</option>
              <option value="3">VIP 3</option>
              <option value="4">VIP 4</option>
              <option value="5">VIP 5</option>
              <option value="6">VIP 6</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Status Select */}
          <div className="relative min-w-[120px]">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-3.5 pr-9 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Registration Date */}
          <div className="relative min-w-[150px]">
            <Calendar className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-2 pointer-events-none" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="All Time"
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong transition cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onFilter}
              className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-4 py-2.5 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.25)] hover:shadow-[0_8px_20px_rgba(123,44,255,0.4)] cursor-pointer"
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
