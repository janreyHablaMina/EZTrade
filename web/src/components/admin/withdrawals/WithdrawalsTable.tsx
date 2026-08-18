import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import {
  TableActionsMenu,
  TableActionsMenuDivider,
  TableActionsMenuItem,
} from "@/components/admin/TableActionsMenu";
import {
  Copy,
} from "lucide-react";
import type { WithdrawalRequest } from "@/types/admin";
const networkBadgeStyles: Record<string, string> = {
  "TRC20": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  "ERC20": "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  "BEP20": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { StatusBadge } from "@/components/ui/StatusBadge";

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
                <CustomCheckbox
                  checked={
                    paginatedWithdrawals.length > 0 &&
                    selectedIds.length === paginatedWithdrawals.length
                  }
                  onChange={toggleSelectAll}
                />
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
                      <CustomCheckbox
                        checked={isChecked}
                        onChange={() => toggleSelectRow(withdrawal.id)}
                      />
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
                      <StatusBadge status={withdrawal.status} />
                    </td>
                    <td className="py-3.5 text-muted-2">{withdrawal.requestedAt}</td>
                    <td className="py-3.5 text-right pr-1 relative">
                      <TableActionsMenu estimatedHeight={220}>
                        <TableActionsMenuItem icon="👁" label="View Details" onClick={() => onViewDetails?.(withdrawal)} />
                        {withdrawal.status === "Pending" && (
                          <>
                            <TableActionsMenuItem icon="✅" label="Approve Withdrawal" onClick={() => onApprove?.(withdrawal)} className="text-success" />
                            <TableActionsMenuItem icon="❌" label="Reject Withdrawal" onClick={() => onReject?.(withdrawal)} className="text-danger" />
                          </>
                        )}
                        <TableActionsMenuDivider />
                        <TableActionsMenuItem icon="📝" label="History / Logs" onClick={() => onHistory?.(withdrawal)} />
                      </TableActionsMenu>
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
