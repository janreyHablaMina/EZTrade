import { Search, Calendar, Filter, RotateCcw, ChevronDown } from "lucide-react";

type UsersFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  vipLevel: string;
  setVipLevel: (l: string) => void;
  status: string;
  setStatus: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function UsersFilters({
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
}: UsersFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12 items-end">
        {/* Search bar */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2 2xl:col-span-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-10 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
            />
            <Search className="absolute right-3.5 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* VIP Level filter */}
        <div className="xl:col-span-1 2xl:col-span-2">
          <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
            VIP Level
          </p>
          <div className="relative">
            <select
              value={vipLevel}
              onChange={(e) => setVipLevel(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="VIP 1">VIP 1</option>
              <option value="VIP 2">VIP 2</option>
              <option value="VIP 3">VIP 3</option>
              <option value="VIP 4">VIP 4</option>
              <option value="VIP 5">VIP 5</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* Status filter */}
        <div className="xl:col-span-1 2xl:col-span-2">
          <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
            Status
          </p>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* Registered At date picker */}
        <div className="xl:col-span-1 2xl:col-span-2">
          <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
            Registered At
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Select date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-9 pr-3 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
            />
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* Filter / Reset actions */}
        <div className="flex items-center gap-2 lg:col-span-2 xl:col-span-1 2xl:col-span-2 w-full">
          <button
            type="button"
            onClick={onFilter}
            className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright text-xs font-semibold text-white transition shadow-[0_4px_12px_rgba(123,44,255,0.25)] cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] text-xs font-semibold text-white transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
