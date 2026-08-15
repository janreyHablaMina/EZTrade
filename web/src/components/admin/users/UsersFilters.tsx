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
  onFilter: () => void;
  onReset: () => void;
};

export function UsersFilters({
  search,
  setSearch,
  vipLevel,
  setVipLevel,
  status,
  setStatus,
  onFilter,
  onReset,
}: UsersFiltersProps) {
  return (
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
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
        </Select>

        <Select
          value={vipLevel}
          onChange={(e) => setVipLevel(e.target.value)}
          containerClassName="sm:w-[130px]"
        >
          <option value="all">All Levels</option>
          <option value="VIP 1">VIP 1</option>
          <option value="VIP 2">VIP 2</option>
          <option value="VIP 3">VIP 3</option>
          <option value="VIP 4">VIP 4</option>
          <option value="VIP 5">VIP 5</option>
        </Select>

        <Select containerClassName="sm:w-[130px] hidden md:block">
          <option value="all">All Countries</option>
        </Select>

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
