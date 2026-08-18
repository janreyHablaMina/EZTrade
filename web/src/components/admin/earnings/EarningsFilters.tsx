import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type EarningsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  type: string;
  setType: (t: string) => void;
  vipLevel: string;
  setVipLevel: (v: string) => void;
  status: string;
  setStatus: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function EarningsFilters({
  search,
  setSearch,
  type,
  setType,
  vipLevel,
  setVipLevel,
  status,
  setStatus,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: EarningsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        <Input
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, email or user ID..."
        />

        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Types</option>
            <option value="Trading Profit">Trading Profit</option>
            <option value="Referral Bonus">Referral Bonus</option>
          </Select>

          <Select
            value={vipLevel}
            onChange={(e) => setVipLevel(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Levels</option>
            <option value="1">VIP 1</option>
            <option value="2">VIP 2</option>
            <option value="3">VIP 3</option>
            <option value="4">VIP 4</option>
            <option value="5">VIP 5</option>
            <option value="6">VIP 6</option>
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

          <Input
            icon={<Calendar className="h-4 w-4" />}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="May 11, 2024 - May 18, 2024"
            className="cursor-pointer"
          />

          <div className="flex items-center gap-2">
            <Button onClick={onFilter} icon={<Filter className="h-3.5 w-3.5" />} className="flex-1 sm:flex-none">
              Filter
            </Button>
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
