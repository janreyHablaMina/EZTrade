import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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
        <Input
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, txid, or reference..."
        />

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            containerClassName="min-w-[125px]"
          >
            <option value="all">All Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Transfer">Transfer</option>
            <option value="Earning">Earning</option>
          </Select>

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            containerClassName="min-w-[125px]"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </Select>

          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            containerClassName="min-w-[135px]"
          >
            <option value="all">All Currencies</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </Select>

          <Input
            icon={<Calendar className="h-4 w-4" />}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="May 11, 2024 - May 18, 2024"
            className="cursor-pointer"
          />

          <div className="flex items-center gap-2">
            <Button onClick={onFilter} icon={<Filter className="h-3.5 w-3.5" />}>
              Filter
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
