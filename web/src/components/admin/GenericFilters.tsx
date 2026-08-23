import { Search, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export type FilterConfig = 
  | { type: 'search'; key: string; placeholder?: string }
  | { type: 'select'; key: string; options: { label: string; value: string }[]; defaultLabel?: string }
  | { type: 'dateRange'; fromKey: string; toKey: string };

type GenericFiltersProps = {
  config: FilterConfig[];
  params: Record<string, string>;
  updateFilter: (key: string, value: string) => void;
  onReset: () => void;
};

export function GenericFilters({ config, params, updateFilter, onReset }: GenericFiltersProps) {
  const searchFilter = config.find(f => f.type === 'search') as { type: 'search'; key: string; placeholder?: string } | undefined;
  const otherFilters = config.filter(f => f.type !== 'search');

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {searchFilter && (
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder={searchFilter.placeholder || "Search..."}
            value={params[searchFilter.key] || ''}
            onChange={(e) => updateFilter(searchFilter.key, e.target.value)}
          />
        )}

        {otherFilters.length > 0 && (
          <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
            {otherFilters.map((filter, index) => {
              if (filter.type === 'select') {
                return (
                  <Select
                    key={index}
                    value={params[filter.key] || 'all'}
                    onChange={(e) => updateFilter(filter.key, e.target.value)}
                    containerClassName="sm:w-36"
                  >
                    <option value="all">{filter.defaultLabel || "All"}</option>
                    {filter.options.map((opt, i) => (
                      <option key={i} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                );
              }

              if (filter.type === 'dateRange') {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-2 pointer-events-none" />
                      <input
                        type="date"
                        value={params[filter.fromKey] || ''}
                        onChange={(e) => updateFilter(filter.fromKey, e.target.value)}
                        className="w-36 rounded-xl border border-border bg-card-elevated py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-border-strong transition"
                        placeholder="From"
                      />
                    </div>
                    <span className="text-muted-2 text-xs">to</span>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-2 pointer-events-none" />
                      <input
                        type="date"
                        value={params[filter.toKey] || ''}
                        onChange={(e) => updateFilter(filter.toKey, e.target.value)}
                        className="w-36 rounded-xl border border-border bg-card-elevated py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-border-strong transition"
                        placeholder="To"
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              onClick={onReset}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
