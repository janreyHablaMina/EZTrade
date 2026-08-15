import { Search, Filter, RotateCcw, ChevronDown, Calendar } from "lucide-react";

type TransactionsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  type: string;
  setType: (t: string) => void;
  status: string;
  setStatus: (s: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function TransactionsFilters({
  search,
  setSearch,
  type,
  setType,
  status,
  setStatus,
  currency,
  setCurrency,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: TransactionsFiltersProps) {
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
            placeholder="Search by user, txid, or reference..."
            className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong focus:ring-1 focus:ring-purple-bright/20 transition shadow-inner"
          />
        </div>

        {/* Filters Group - Type, Status, Currency, Date Range */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Select */}
          <div className="relative min-w-[125px]">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-3.5 pr-9 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Transfer">Transfer</option>
              <option value="Earning">Earning</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Status Select */}
          <div className="relative min-w-[125px]">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-3.5 pr-9 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Currency Select */}
          <div className="relative min-w-[135px]">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-3.5 pr-9 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
            >
              <option value="all">All Currencies</option>
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
          </div>

          {/* Date Range Picker */}
          <div className="relative min-w-[200px]">
            <Calendar className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-2 pointer-events-none" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="May 11, 2024 - May 18, 2024"
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
