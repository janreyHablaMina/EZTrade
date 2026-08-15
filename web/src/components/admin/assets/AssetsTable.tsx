"use client";

import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import { Search, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import type { AssetRecord } from "./assetsData";

type AssetsTableProps = {
  assets: AssetRecord[];
  search: string;
  setSearch: (s: string) => void;
};

const PAGE_SIZES = [10, 20, 50];

export function AssetsTable({ assets, search, setSearch }: AssetsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assetFilter, setAssetFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.assetName.toLowerCase().includes(search.toLowerCase()) || asset.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesSearch; // In a real app, apply network and status filters here
  });

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginated = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goTo = (p: number) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col h-full overflow-hidden">
      
      {/* Inline Filters */}
      <div className="p-4 border-b border-border/50 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset name or symbol..."
            className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong transition"
          />
        </div>
        
        <div className="relative min-w-[130px]">
          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Assets</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
        </div>

        <div className="relative min-w-[130px]">
          <select
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Networks</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
        </div>

        <div className="relative min-w-[120px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
          >
            <option value="all">Status: All</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-2" />
        </div>

        <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition cursor-pointer">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Table Scroll Wrapper */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-[11px]" style={{ minWidth: "900px" }}>
          <thead>
            <tr className="border-b border-border/50 bg-white/[0.02] text-left text-muted">
              <th className="pb-3.5 pl-5 pt-4 font-medium">Asset</th>
              <th className="pb-3.5 pt-4 font-medium">Symbol</th>
              <th className="pb-3.5 pt-4 font-medium">Network</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Total Balance</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Available Balance</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Locked</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">In Orders</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">USD Value</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-4">Change (7D)</th>
              <th className="pb-3.5 pt-4 pr-5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginated.length > 0 ? (
              paginated.map((asset) => (
                <tr key={asset.id} className="group hover:bg-white/[0.025] transition-colors">
                  {/* Asset */}
                  <td className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${asset.bgColor} ${asset.textColor}`}>
                        {asset.logoText}
                      </div>
                      <span className="font-medium text-white">{asset.assetName}</span>
                    </div>
                  </td>
                  
                  <td className="py-3 text-muted">{asset.symbol}</td>
                  <td className="py-3 text-muted-2">{asset.network}</td>
                  
                  <td className="py-3 text-right pr-4 text-white">{asset.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                  <td className="py-3 text-right pr-4 text-muted">{asset.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                  <td className="py-3 text-right pr-4 text-muted-2">{asset.locked.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                  <td className="py-3 text-right pr-4 text-muted-2">{asset.inOrders.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                  
                  <td className="py-3 text-right pr-4 font-medium text-white">${asset.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  
                  <td className="py-3 text-right pr-4">
                    <div className={`flex items-center justify-end gap-1 font-medium ${asset.change7d >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {asset.change7d >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(asset.change7d)}%
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition">
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-muted-2">
                  No assets found.
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
        itemName="assets"
        pageSizes={PAGE_SIZES}
      />
    </div>
  );
}
