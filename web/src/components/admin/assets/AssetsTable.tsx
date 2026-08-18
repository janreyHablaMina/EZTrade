"use client";

import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import { Search, RotateCcw, ChevronDown, Eye, MoreHorizontal } from "lucide-react";

type AssetsTableProps = {
  assets: any[];
  search: string;
  setSearch: (s: string) => void;
};

const PAGE_SIZES = [10, 20, 50];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-purple/40 text-purple-bright",
  "bg-sky-500/20 text-sky-400",
  "bg-teal-500/20 text-teal-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
];

function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

const vipLevelBadgeStyles: Record<number, string> = {
  1: "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  2: "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  3: "bg-purple/20 text-purple-bright border border-purple-bright/30",
  4: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  5: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  6: "bg-gradient-to-r from-amber-400/20 to-yellow-300/20 text-yellow-300 border border-yellow-400/30",
};

export function AssetsTable({ assets, search, setSearch }: AssetsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vipFilter, setVipFilter] = useState("all");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.userName.toLowerCase().includes(search.toLowerCase()) || asset.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesVip = vipFilter === "all" || asset.vipLevel.toString() === vipFilter;
    return matchesSearch && matchesVip;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginated = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearch("");
    setVipFilter("all");
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
      
      {/* Inline Filters */}
      <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or email..."
            className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong transition"
          />
        </div>
        
        <div className="relative min-w-[130px] sm:w-36">
          <select
            value={vipFilter}
            onChange={(e) => setVipFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="1">VIP 1</option>
            <option value="2">VIP 2</option>
            <option value="3">VIP 3</option>
            <option value="4">VIP 4</option>
            <option value="5">VIP 5</option>
            <option value="6">VIP 6</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
        </div>

        <button onClick={handleReset} className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition cursor-pointer">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Table Scroll Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: "800px" }}>
          <thead>
            <tr className="border-b border-border/50 bg-white/[0.02] text-left text-muted">
              <th className="pb-3.5 pl-5 pt-4 font-medium">User</th>
              <th className="pb-3.5 pt-4 font-medium">VIP Level</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Total Balance (USDT)</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Total Deposited</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Total Withdrawn</th>
              <th className="pb-3.5 pt-4 font-medium">Status</th>
              <th className="pb-3.5 pt-4 pr-5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginated.length > 0 ? (
              paginated.map((asset) => (
                <tr key={asset.id} className="group hover:bg-white/[0.025] transition-colors">
                  {/* User */}
                  <td className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(asset.userName)}`}>
                        {getInitials(asset.userName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{asset.userName}</p>
                        <p className="text-[10px] text-muted-2 truncate">{asset.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* VIP Level */}
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${vipLevelBadgeStyles[asset.vipLevel]}`}>
                      VIP {asset.vipLevel}
                    </span>
                  </td>
                  
                  <td className="py-3 text-right pr-4 text-emerald-400 font-bold text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asset.balance)}
                  </td>
                  <td className="py-3 text-right pr-4 text-muted">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asset.totalDeposited)}
                  </td>
                  <td className="py-3 text-right pr-4 text-muted">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asset.totalWithdrawn)}
                  </td>
                  
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${asset.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {asset.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-2">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredAssets.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="users"
        pageSizes={PAGE_SIZES}
      />
    </div>
  );
}
