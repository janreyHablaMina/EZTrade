import { Search, Calendar, Filter, RotateCcw, ChevronDown } from "lucide-react";

type WithdrawalsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  network: string;
  setNetwork: (n: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function WithdrawalsFilters({
  search,
  setSearch,
  status,
  setStatus,
  network,
  setNetwork,
  currency,
  setCurrency,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: WithdrawalsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by user, email, txid, or wallet address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-10 pr-3.5 text-xs text-white placeholder:text-muted-2 outline-none focus:border-purple-bright/50 focus:bg-purple/5 transition"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-2" />
        </div>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
          {/* Status filter */}
          <div className="relative w-full sm:w-36">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-9 text-xs text-white outline-none focus:border-purple-bright/50 focus:bg-purple/5 transition appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Network filter */}
          <div className="relative w-full sm:w-36">
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-9 text-xs text-white outline-none focus:border-purple-bright/50 focus:bg-purple/5 transition appearance-none cursor-pointer"
            >
              <option value="all">All Networks</option>
              <option value="TRC20">TRC20</option>
              <option value="BEP20">BEP20</option>
              <option value="ERC20">ERC20</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Currency filter */}
          <div className="relative w-full sm:w-36">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-9 text-xs text-white outline-none focus:border-purple-bright/50 focus:bg-purple/5 transition appearance-none cursor-pointer"
            >
              <option value="all">All Currencies</option>
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Date Picker Input */}
          <div className="relative w-full sm:w-48">
            <input
              type="text"
              placeholder="Select date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-10 pr-3.5 text-xs text-white placeholder:text-muted-2 outline-none focus:border-purple-bright/50 focus:bg-purple/5 transition"
            />
            <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={onFilter}
            className="w-full sm:w-auto flex h-10 items-center justify-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-4 text-xs font-semibold text-white transition shadow-[0_4px_12px_rgba(123,44,255,0.25)] cursor-pointer whitespace-nowrap"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-white/[0.04] px-4 text-xs font-semibold text-white transition cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
