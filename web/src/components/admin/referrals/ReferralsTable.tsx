"use client";

import { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, ChevronDown, MoreHorizontal } from "lucide-react";
import type { ReferralRecord } from "./referralsData";
import { vipLevelBadgeStyles, statusBadgeStyles, commissionStatusBadgeStyles } from "./referralsData";

type ReferralsTableProps = {
  referrals: ReferralRecord[];
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

export function ReferralsTable({ referrals }: ReferralsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(referrals.length / pageSize));
  const paginated = referrals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <table className="w-full text-xs" style={{ minWidth: "1150px" }}>
          <thead>
            <tr className="border-b border-border/50 bg-white/[0.02] text-left text-muted">
              <th className="pb-3.5 pl-5 pt-4 font-medium">ID</th>
              <th className="pb-3.5 pt-4 font-medium w-56">Referred User</th>
              <th className="pb-3.5 pt-4 font-medium">VIP Level</th>
              <th className="pb-3.5 pt-4 font-medium">Status</th>
              <th className="pb-3.5 pt-4 font-medium w-32">Registered At</th>
              <th className="pb-3.5 pt-4 font-medium">Total Deposited</th>
              <th className="pb-3.5 pt-4 font-medium">Total Earnings</th>
              <th className="pb-3.5 pt-4 font-medium">Your Commission</th>
              <th className="pb-3.5 pt-4 font-medium">Commission Status</th>
              <th className="pb-3.5 pt-4 pr-5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginated.length > 0 ? (
              paginated.map((ref, index) => {
                const isBottomRow = index >= paginated.length - 4 && paginated.length > 4;

                return (
                  <tr key={ref.id} className="group hover:bg-white/[0.025] transition-colors relative">
                    {/* ID */}
                    <td className="py-3.5 pl-5 font-mono text-muted-2 text-[11px]">{ref.id}</td>

                    {/* Referred User */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(ref.userName)}`}
                        >
                          {getInitials(ref.userName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{ref.userName}</p>
                          <p className="text-[10px] text-muted-2 truncate">{ref.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* VIP Level */}
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${vipLevelBadgeStyles[ref.vipLevel]}`}
                      >
                        VIP {ref.vipLevel}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusBadgeStyles[ref.status]}`}
                      >
                        {ref.status}
                      </span>
                    </td>

                    {/* Registered At */}
                    <td className="py-3.5 text-muted-2 text-[10px] leading-snug w-32">
                      {ref.registeredAt}
                    </td>

                    {/* Total Deposited */}
                    <td className="py-3.5">
                      <span className="font-semibold text-emerald-400">
                        ${ref.totalDeposited.toFixed(2)}
                      </span>
                    </td>

                    {/* Total Earnings */}
                    <td className="py-3.5">
                      <span className="font-semibold text-emerald-400">
                        ${ref.totalEarnings.toFixed(2)}
                      </span>
                    </td>

                    {/* Your Commission */}
                    <td className="py-3.5">
                      <span className="font-semibold text-emerald-400">
                        ${ref.yourCommission.toFixed(2)}
                      </span>
                    </td>

                    {/* Commission Status */}
                    <td className="py-3.5">
                      {ref.commissionStatus === "None" ? (
                        <span className="text-muted-2 px-3">--</span>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${commissionStatusBadgeStyles[ref.commissionStatus]}`}
                        >
                          {ref.commissionStatus}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-5 text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveDropdownId(activeDropdownId === ref.id ? null : ref.id)
                            }
                            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition cursor-pointer"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdownId === ref.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveDropdownId(null)}
                              />
                              <div
                                className={`absolute right-0 z-50 mt-1 w-48 rounded-xl border border-border bg-card shadow-xl p-1.5 backdrop-blur-xl ${
                                  isBottomRow ? "bottom-full mb-1" : "top-full mt-1"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdownId(null)}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer font-medium"
                                >
                                  View Commission Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdownId(null)}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer font-medium"
                                >
                                  Message User
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-muted-2">
                  No referrals found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-2 border-t border-border/45 px-5 py-4">
        <div>
          Showing {referrals.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, referrals.length)} of {referrals.length} referrals
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
