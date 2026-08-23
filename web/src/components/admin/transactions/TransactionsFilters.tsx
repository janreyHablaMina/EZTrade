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
  dateFrom: string;
  setDateFrom: (d: string) => void;
  dateTo: string;
  setDateTo: (d: string) => void;
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
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onReset,
}: TransactionsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        <Input
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, txid, or reference..."
        />

        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
          </Select>

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </Select>

          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Currencies</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </Select>

          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="sm:w-36 [&::-webkit-calendar-picker-indicator]:invert-[0.6] cursor-pointer"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="sm:w-36 [&::-webkit-calendar-picker-indicator]:invert-[0.6] cursor-pointer"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onReset}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
