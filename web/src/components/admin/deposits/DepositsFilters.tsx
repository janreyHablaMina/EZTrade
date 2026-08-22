import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type DepositsFiltersProps = {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  network: string;
  setNetwork: (n: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
};

export function DepositsFilters({
  search,
  setSearch,
  status,
  setStatus,
  network,
  setNetwork,
  currency,
  setCurrency,
}: DepositsFiltersProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Search by user, email or TXID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </Select>

          <Select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Networks</option>
            <option value="TRC20">TRC20</option>
            <option value="BEP20">BEP20</option>
            <option value="ERC20">ERC20</option>
          </Select>

          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            containerClassName="sm:w-36"
          >
            <option value="all">All Currencies</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
