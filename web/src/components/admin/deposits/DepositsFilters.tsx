import { Search, Calendar, Filter, ChevronDown } from "lucide-react";

type DepositsFiltersProps = {
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
};

export function DepositsFilters({
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
}: DepositsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12 items-end">
        {/* Search bar */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2 2xl:col-span-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user, email or TXID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-10 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
            />
            <Search className="absolute right-3.5 top-3 h-4 w-4 text-muted-2" />
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* Network filter */}
        <div className="xl:col-span-1 2xl:col-span-2">
          <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
            Network
          </p>
          <div className="relative">
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Networks</option>
              <option value="TRC20">TRC20</option>
              <option value="BEP20">BEP20</option>
              <option value="ERC20">ERC20</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* Currency filter */}
        <div className="xl:col-span-1 2xl:col-span-2">
          <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
            Currency
          </p>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Currencies</option>
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>
        </div>

        {/* Date Range filter */}
        <div className="xl:col-span-2 2xl:col-span-3">
          <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
            Date Range
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

        {/* Action Button */}
        <div className="xl:col-span-1 2xl:col-span-2 w-full">
          <button
            type="button"
            onClick={onFilter}
            className="w-full flex h-10 items-center justify-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright text-xs font-semibold text-white transition shadow-[0_4px_12px_rgba(123,44,255,0.25)] cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
