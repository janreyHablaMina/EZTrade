import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type ReferralsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  vipLevel: string;
  setVipLevel: (v: string) => void;
  dateFrom: string;
  setDateFrom: (d: string) => void;
  dateTo: string;
  setDateTo: (d: string) => void;
  onReset: () => void;
  vipPlans?: any[];
};

export function ReferralsFilters({
  search,
  setSearch,
  vipLevel,
  setVipLevel,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onReset,
  vipPlans = [],
}: ReferralsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        <Input
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, email or phone..."
        />

        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
          <Select
            value={vipLevel}
            onChange={(e) => setVipLevel(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Levels</option>
            {[...vipPlans].sort((a, b) => a.level.localeCompare(b.level)).map((plan: any) => (
              <option key={plan.id} value={plan.id}>
                {plan.level}
              </option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-2 pointer-events-none" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-36 rounded-xl border border-border bg-card-elevated py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-border-strong transition"
                placeholder="From"
              />
            </div>
            <span className="text-muted-2 text-xs">to</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-2 pointer-events-none" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-36 rounded-xl border border-border bg-card-elevated py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-border-strong transition"
                placeholder="To"
              />
            </div>
          </div>

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
