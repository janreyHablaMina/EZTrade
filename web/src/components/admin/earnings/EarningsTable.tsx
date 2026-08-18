"use client";

import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import { TrendingUp, Share2, Eye } from "lucide-react";
import type { EarningRecord } from "@/types/admin";
import { vipBadgeStyles } from "@/types/admin";

const statusBadgeStyles: Record<string, string> = {
  "Completed": "bg-success/15 text-success",
  "Paid": "bg-success/15 text-success",
  "Pending": "bg-warning/15 text-warning",
};

const typeBadgeStyles: Record<string, string> = {
  "Daily Yield": "bg-purple-bright/15 text-purple-bright border border-purple-bright/25",
  "Referral Level 1": "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  "Referral Level 2": "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  "Referral Level 3": "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  "Bonus": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

type EarningsTableProps = {
  earnings: EarningRecord[];
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

export function EarningsTable({ earnings }: EarningsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginated = earnings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      {/* Table Scroll Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: "980px" }}>
          <thead>
            <tr className="border-b border-border/50 bg-white/[0.02] text-left text-muted">
              <th className="pb-3.5 pl-5 pt-4 font-medium w-56">User</th>
              <th className="pb-3.5 pt-4 font-medium">VIP Level</th>
              <th className="pb-3.5 pt-4 font-medium">Type</th>
              <th className="pb-3.5 pt-4 font-medium">Source</th>
              <th className="pb-3.5 pt-4 font-medium text-right pr-3">Amount</th>
              <th className="pb-3.5 pt-4 font-medium">Currency</th>
              <th className="pb-3.5 pt-4 font-medium">Status</th>
              <th className="pb-3.5 pt-4 font-medium w-36">Date &amp; Time</th>
              <th className="pb-3.5 pt-4 pr-5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginated.length > 0 ? (
              paginated.map((er) => (
                <tr key={er.id} className="group hover:bg-white/[0.025] transition-colors">
                  {/* User */}
                  <td className="py-3.5 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(er.userName)}`}
                      >
                        {getInitials(er.userName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{er.userName}</p>
                        <p className="text-[10px] text-muted-2 truncate">{er.userEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* VIP Level */}
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${vipBadgeStyles[er.vipLevel]}`}
                    >
                      VIP {er.vipLevel}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      {er.type === "Trading Profit" ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Share2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      )}
                      <span className="text-white font-medium">{er.type}</span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 text-muted">{er.source}</td>

                  {/* Amount */}
                  <td className="py-3.5 text-right pr-3">
                    <span className="font-semibold text-emerald-400">
                      +{er.amount.toFixed(2)}
                    </span>
                  </td>

                  {/* Currency */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/15 text-[9px] font-bold text-teal-400 border border-teal-400/20">
                        T
                      </span>
                      <div>
                        <p className="font-medium text-white text-[11px]">{er.currency}</p>
                        <p className="text-[9px] text-muted-2">{er.network}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${statusBadgeStyles[er.status] || ""}`}
                    >
                      {er.status}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 text-muted-2 text-[10px] leading-snug w-36">
                    {er.dateTime}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pr-5 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-muted-2">
                  No earnings found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={earnings.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="earnings"
        pageSizes={PAGE_SIZES}
      />
    </div>
  );
}
