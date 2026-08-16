import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type SupportFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  priority: string;
  setPriority: (s: string) => void;
  category: string;
  setCategory: (s: string) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  onFilter: () => void;
  onReset: () => void;
};

export function SupportFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
  dateRange,
  setDateRange,
  onFilter,
  onReset,
}: SupportFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col gap-3.5 xl:flex-row xl:items-center">
      <Input
        icon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by user, email or ticket ID..."
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Status</label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            containerClassName="min-w-[110px]"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Priority</label>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            containerClassName="min-w-[110px]"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Category</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            containerClassName="min-w-[120px]"
          >
            <option value="all">All Category</option>
            <option value="Withdrawals">Withdrawals</option>
            <option value="Deposits">Deposits</option>
            <option value="VIP Plans">VIP Plans</option>
            <option value="Account">Account</option>
            <option value="Referrals">Referrals</option>
            <option value="Technical">Technical</option>
            <option value="Transactions">Transactions</option>
            <option value="KYC">KYC</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-2 ml-1">Date Range</label>
          <Input
            icon={<Calendar className="h-4 w-4" />}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="May 11, 2024 - May 18, 2024"
            className="cursor-pointer min-w-[190px]"
          />
        </div>

        <div className="flex items-end pb-[2px] h-full gap-2 mt-4 xl:mt-0">
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
  );
}
