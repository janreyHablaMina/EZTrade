"use client";

import { useState } from "react";
import type { UserRecord as AmbassadorRecord } from "@/types/admin";
import { Search, ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";

export function AmbassadorsTable({
  ambassadors,
}: {
  ambassadors: AmbassadorRecord[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(ambassadors.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = ambassadors.slice(startIndex, endIndex);

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="flex flex-col gap-4 border-b border-border/50 pb-5 mb-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-white">Ambassador List</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-bg-deep/50 text-xs font-medium text-muted-2">
            <tr>
              <th className="px-5 py-3 font-medium">Ambassador Name</th>
              <th className="px-5 py-3 font-medium">Referral Code</th>
              <th className="px-5 py-3 font-medium text-right">Downline Size</th>
              <th className="px-5 py-3 font-medium text-right">Total Assets</th>
              <th className="px-5 py-3 font-medium text-right">Daily Admin Earn (5%)</th>
              <th className="px-5 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {currentItems.map((ambassador, idx) => (
              <tr
                key={idx}
                className="group transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple/10 text-xs font-medium text-purple-bright border border-purple/20">
                      {ambassador.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{ambassador.name}</p>
                      <p className="text-[11px] text-muted-2">{ambassador.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">
                  <span className="font-mono text-white/80">{ambassador.referralCode}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-medium text-white">{ambassador.downlineCount}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-medium text-emerald-400">
                    ${ambassador.totalDownlineAssets.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-medium text-amber-400">
                    ${ambassador.dailyEarnings.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      ambassador.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {ambassador.status === "Active" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {ambassador.status}
                  </span>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-2">
                  No ambassadors found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={ambassadors.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="ambassadors"
        pageSizes={[5, 10, 20]}
      />
    </div>
  );
}
