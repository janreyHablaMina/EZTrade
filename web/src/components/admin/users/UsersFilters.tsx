import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type UsersFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  vipLevel: string;
  setVipLevel: (l: string) => void;
  status: string;
  setStatus: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onReset: () => void;
  availableStatuses?: string[];
  availableLevels?: string[];
  cutPercent?: string;
  setCutPercent?: (c: string) => void;
  showCutFilter?: boolean;
};

export function UsersFilters({
  search,
  setSearch,
  vipLevel,
  setVipLevel,
  status,
  setStatus,
  onReset,
  availableStatuses = ["Active", "Inactive", "Suspended"],
  availableLevels = ["Ambassador", "VIP 1", "VIP 2", "VIP 3", "VIP 4", "VIP 5"],
  cutPercent = "all",
  setCutPercent,
  showCutFilter = false,
}: UsersFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            containerClassName="sm:w-[130px]"
          >
            <option value="all">All Status</option>
            {availableStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>

          <Select
            value={vipLevel}
            onChange={(e) => setVipLevel(e.target.value)}
            containerClassName="sm:w-[130px]"
          >
            <option value="all">All Levels</option>
            {availableLevels.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>

          {showCutFilter && setCutPercent && (
            <Select
              value={cutPercent}
              onChange={(e) => setCutPercent(e.target.value)}
              containerClassName="sm:w-[110px]"
            >
              <option value="all">All Cuts</option>
              <option value="10">10% Cut</option>
              <option value="5">5% Cut</option>
              <option value="3">3% Cut</option>
            </Select>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onReset} title="Reset Filters" icon={<RotateCcw className="h-3.5 w-3.5" />} />
          </div>
        </div>
      </div>
    </div>
  );
}
