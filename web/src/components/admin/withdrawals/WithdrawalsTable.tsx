import { useState } from "react";
import {
  MoreVertical,
  Copy,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import type { WithdrawalRequest } from "@/lib/mock-data/withdrawalsData";
import { networkBadgeStyles, statusBadgeStyles } from "@/lib/mock-data/withdrawalsData";

type WithdrawalsTableProps = {
  withdrawals: WithdrawalRequest[];
  paginatedWithdrawals: WithdrawalRequest[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  selectedIds: string[];
  toggleSelectAll: () => void;
  toggleSelectRow: (id: string) => void;
  onViewDetails?: (withdrawal: WithdrawalRequest) => void;
  onApprove?: (withdrawal: WithdrawalRequest) => void;
  onReject?: (withdrawal: WithdrawalRequest) => void;
  onHistory?: (withdrawal: WithdrawalRequest) => void;
};

export function WithdrawalsTable({
  withdrawals,
  paginatedWithdrawals,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  selectedIds,
  toggleSelectAll,
  toggleSelectRow,
  onViewDetails,
  onApprove,
  onReject,
  onHistory,
}: WithdrawalsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 pr-6 font-medium w-14">
                <label className="relative flex items-center justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      paginatedWithdrawals.length > 0 &&
                      selectedIds.length === paginatedWithdrawals.length
                    }
                    onChange={toggleSelectAll}
                    className="sr-only"
                  />
                  <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    paginatedWithdrawals.length > 0 && selectedIds.length === paginatedWithdrawals.length
                      ? "bg-purple border-purple-bright shadow-[0_0_8px_rgba(123,44,255,0.4)]"
                      : "border-border bg-card-elevated hover:border-purple-bright/50"
                  }`}>
                    {paginatedWithdrawals.length > 0 && selectedIds.length === paginatedWithdrawals.length && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>
              </th>
              <th className="pb-3.5 font-medium w-64">User</th>
              <th className="pb-3.5 font-medium">Amount</th>
              <th className="pb-3.5 font-medium">Receive Amount</th>
              <th className="pb-3.5 font-medium">Network</th>
              <th className="pb-3.5 font-medium">Wallet Address</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium">Requested At</th>
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWithdrawals.length > 0 ? (
              paginatedWithdrawals.map((withdrawal, index) => {
                const isChecked = selectedIds.includes(withdrawal.id);
                return (
                  <tr
                    key={withdrawal.id}
                    className={`border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition ${
                      isChecked ? "bg-purple/5" : ""
                    }`}
                  >
                    <td className="py-3.5 pl-1 pr-6">
                      <label className="relative flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(withdrawal.id)}
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
                          {withdrawal.userName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-normal">{withdrawal.userName}</p>
                          <p className="text-[10px] text-muted-2 leading-none mt-0.5">{withdrawal.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-white">
                        {withdrawal.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-muted-2 leading-none mt-0.5">{withdrawal.currency}</p>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-white">
                        {withdrawal.receiveAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-muted-2 leading-none mt-0.5">{withdrawal.currency}</p>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
                          networkBadgeStyles[withdrawal.network] || ""
                        }`}
                      >
                        {withdrawal.network}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2 text-muted-2">
                        <span className="font-mono">
                          {withdrawal.walletAddress.slice(0, 6)}...{withdrawal.walletAddress.slice(-6)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(withdrawal.id, withdrawal.walletAddress)}
                          className="p-1 hover:text-white transition cursor-pointer relative"
                          title="Copy Wallet Address"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === withdrawal.id && (
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-black/85 text-[8px] text-success font-semibold whitespace-nowrap z-10">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          statusBadgeStyles[withdrawal.status] || ""
                        }`}
                      >
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-muted-2">{withdrawal.requestedAt}</td>
                    <td className="py-3.5 text-right pr-1 relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(
                            activeDropdownId === withdrawal.id ? null : withdrawal.id
                          );
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-card-elevated transition cursor-pointer ml-auto ${
                          activeDropdownId === withdrawal.id
                            ? "border-purple-bright/50 text-white bg-purple/10"
                            : "border-border text-muted hover:text-white"
                        }`}
                        aria-label="More options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {activeDropdownId === withdrawal.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className={`absolute right-1.5 w-48 rounded-xl bg-card-elevated border border-border py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.55)] z-30 text-left ${
                            index >= paginatedWithdrawals.length - 4 && paginatedWithdrawals.length > 4
                              ? "bottom-full mb-1"
                              : "mt-1"
                          }`}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onViewDetails?.(withdrawal);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              View Details
                            </button>
                            {withdrawal.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    onApprove?.(withdrawal);
                                  }}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 text-success mr-2 inline" />
                                  Approve Withdrawal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    onReject?.(withdrawal);
                                  }}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                                >
                                  <XCircle className="h-3.5 w-3.5 text-danger mr-2 inline" />
                                  Reject Withdrawal
                                </button>
                              </>
                            )}
                            <div className="my-1 border-t border-border/45" />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onHistory?.(withdrawal);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              History / Logs
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
                  No withdrawals found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={withdrawals.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="withdrawals"
        pageSizes={[5, 10, 20]}
      />
    </div>
  );
}
