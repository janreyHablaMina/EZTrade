import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type AuditLogsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  action: string;
  setAction: (a: string) => void;
  status: string;
  setStatus: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function AuditLogsFilters({
  search,
  setSearch,
  action,
  setAction,
  status,
  setStatus,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: AuditLogsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
      <Input
        icon={<Search className="h-4 w-4" />}
        placeholder="Search by user, action, or resource..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          containerClassName="sm:w-[140px]"
        >
          <option value="all">All Actions</option>
          <option value="Login">Login</option>
          <option value="Export Data">Export Data</option>
          <option value="Configuration Change">Configuration Change</option>
          <option value="Withdrawal Request">Withdrawal Request</option>
          <option value="Deposit">Deposit</option>
        </Select>

        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          containerClassName="sm:w-[130px]"
        >
          <option value="all">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Warning">Warning</option>
        </Select>

        <div className="relative w-full sm:w-[150px] hidden md:block">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-2" />
          <input
            type="text"
            placeholder="Select date range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card-elevated pl-9 pr-3 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onFilter} icon={<Filter className="h-3.5 w-3.5" />}>
            Filter
          </Button>
          <Button variant="ghost" onClick={onReset} title="Reset Filters" icon={<RotateCcw className="h-3.5 w-3.5" />} />
        </div>
      </div>
    </div>
  );
}
