import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type VipPlansFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  onClear: () => void;
};

export function VipPlansFilters({
  search,
  setSearch,
  status,
  setStatus,
  onClear,
}: VipPlansFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Search by plan name or level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              containerClassName="w-full"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>

          <Button 
            onClick={onClear} 
            variant="outline"
            className="text-muted-2 hover:text-white"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
