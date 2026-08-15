import { Search, Filter, ChevronDown } from "lucide-react";

type VipPlansFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  onFilter: () => void;
};

export function VipPlansFilters({
  search,
  setSearch,
  status,
  setStatus,
  onFilter,
}: VipPlansFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        {/* Left side: Search input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by plan name or level..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-10 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
          />
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-muted-2" />
        </div>

        {/* Right side: Status and Filter Button */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
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

          <button
            type="button"
            onClick={onFilter}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-5 text-xs font-semibold text-white transition shadow-[0_4px_12px_rgba(123,44,255,0.25)] cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
