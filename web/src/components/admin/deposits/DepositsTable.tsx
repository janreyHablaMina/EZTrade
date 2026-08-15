import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import {
  MoreVertical,
  Copy,
  Eye,
  CheckCircle2,
  XCircle,
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { DepositRequest } from "./depositsData";
import { networkBadgeStyles, statusBadgeStyles } from "./depositsData";

type DepositsTableProps = {
  deposits: DepositRequest[];
  paginatedDeposits: DepositRequest[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  selectedIds: string[];
  toggleSelectAll: () => void;
  toggleSelectRow: (id: string) => void;
  onViewDetails?: (deposit: DepositRequest) => void;
  onVerify?: (deposit: DepositRequest) => void;
  onReject?: (deposit: DepositRequest) => void;
  onAddManual?: (deposit: DepositRequest) => void;
  onNotesHistory?: (deposit: DepositRequest) => void;
};

export function DepositsTable({
  deposits,
  paginatedDeposits,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  selectedIds,
  toggleSelectAll,
  toggleSelectRow,
  onViewDetails,
  onVerify,
  onReject,
  onAddManual,
  onNotesHistory,
}: DepositsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(deposits.length / pageSize));

  const handleCopyTxid = (id: string, txid: string) => {
    navigator.clipboard.writeText(txid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 pr-6 font-medium w-14">
                <label className="relative flex items-center justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      paginatedDeposits.length > 0 &&
                      selectedIds.length === paginatedDeposits.length
                    }
                    onChange={toggleSelectAll}
                    className="sr-only"
                  />
                  <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    paginatedDeposits.length > 0 && selectedIds.length === paginatedDeposits.length
                      ? "bg-purple border-purple-bright shadow-[0_0_8px_rgba(123,44,255,0.4)]"
                      : "border-border bg-card-elevated hover:border-purple-bright/50"
                  }`}>
                    {paginatedDeposits.length > 0 && selectedIds.length === paginatedDeposits.length && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>
              </th>
              <th className="pb-3.5 font-medium w-64">User</th>
              <th className="pb-3.5 font-medium">Amount</th>
              <th className="pb-3.5 font-medium">Currency</th>
              <th className="pb-3.5 font-medium">Network</th>
              <th className="pb-3.5 font-medium">TXID</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium">Submitted At</th>
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDeposits.length > 0 ? (
              paginatedDeposits.map((deposit, index) => {
                const isChecked = selectedIds.includes(deposit.id);
                return (
                  <tr
                    key={deposit.id}
                    className={`border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition ${
                      isChecked ? "bg-purple/5" : ""
                    }`}
                  >
                    <td className="py-3.5 pl-1 pr-6">
                      <label className="relative flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(deposit.id)}
                          className="sr-only"
                        />
                        <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                          isChecked
                            ? "bg-purple border-purple-bright shadow-[0_0_8px_rgba(123,44,255,0.4)]"
                            : "border-border bg-card-elevated hover:border-purple-bright/50"
                        }`}>
                          {isChecked && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </label>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
                          {deposit.userName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-normal">{deposit.userName}</p>
                          <p className="text-[10px] text-muted-2 leading-none mt-0.5">{deposit.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-white">
                        {deposit.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-muted-2 leading-none mt-0.5">{deposit.currency}</p>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        {/* Mock currency coin graphics */}
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold ring-1 ring-emerald-500/30">
                          T
                        </div>
                        <span className="font-medium text-white">{deposit.currency}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
                          networkBadgeStyles[deposit.network] || ""
                        }`}
                      >
                        {deposit.network}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2 text-muted-2">
                        <span className="font-mono">
                          {deposit.txid.slice(0, 8)}...{deposit.txid.slice(-8)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTxid(deposit.id, deposit.txid)}
                          className="p-1 hover:text-white transition cursor-pointer relative"
                          title="Copy TXID"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === deposit.id && (
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-black/85 text-[8px] text-success font-semibold whitespace-nowrap z-10">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div>
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            statusBadgeStyles[deposit.status] || ""
                          }`}
                        >
                          {deposit.status}
                        </span>
                        <p className="text-[9px] text-muted-2 mt-1">{deposit.statusTime}</p>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-2">{deposit.submittedAt}</td>
                    <td className="py-3.5 text-right pr-1 relative">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(
                              activeDropdownId === deposit.id ? null : deposit.id
                            );
                          }}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-card-elevated transition cursor-pointer ${
                            activeDropdownId === deposit.id
                              ? "border-purple-bright/50 text-white bg-purple/10"
                              : "border-border text-muted hover:text-white"
                          }`}
                          aria-label="More options"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {activeDropdownId === deposit.id && (
                        <>
                          {/* Close backdrop */}
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className={`absolute right-1.5 w-48 rounded-xl bg-card-elevated border border-border py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.55)] z-30 text-left ${
                            index >= paginatedDeposits.length - 4 && paginatedDeposits.length > 4
                              ? "bottom-full mb-1"
                              : "mt-1"
                          }`}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onViewDetails?.(deposit);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onVerify?.(deposit);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-success mr-2 inline" />
                              Verify Deposit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onReject?.(deposit);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <XCircle className="h-3.5 w-3.5 text-danger mr-2 inline" />
                              Reject Deposit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onAddManual?.(deposit);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <Plus className="h-3.5 w-3.5 text-purple-bright mr-2 inline" />
                              Add Manual Deposit
                            </button>
                            <div className="my-1 border-t border-border/45" />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onNotesHistory?.(deposit);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              Notes / History
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-muted-2">
                  No deposits found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={deposits.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="deposits"
        pageSizes={[5, 10, 20]}
      />
    </div>
  );
}
