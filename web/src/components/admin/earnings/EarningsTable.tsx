"use client";

import { useState } from "react";
import { TrendingUp, Share2, Eye, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { EarningRecord } from "./earningsData";
import { vipLevelBadgeStyles, statusBadgeStyles } from "./earningsData";

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

  const totalPages = Math.max(1, Math.ceil(earnings.length / pageSize));
  const paginated = earnings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goTo = (p: number) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const pageNumbers: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
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
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${vipLevelBadgeStyles[er.vipLevel]}`}
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
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusBadgeStyles[er.status]}`}
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

      {/* Pagination Footer */}
      <div className="mt-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-2 border-t border-border/45 px-5 py-4">
        <div>
          Showing {earnings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, earnings.length)} of {earnings.length} earnings
        </div>
        <div className="flex items-center gap-3">
          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-muted-2">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(Number(p))}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                    currentPage === p
                      ? "border-purple-bright bg-purple/20 text-purple-bright"
                      : "border-border hover:bg-white/[0.04] text-muted-2"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Page Size */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none rounded-xl border border-border bg-card-elevated py-1.5 pl-3 pr-8 text-[11px] text-white outline-none transition cursor-pointer"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-3.5 w-3.5 text-muted-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
