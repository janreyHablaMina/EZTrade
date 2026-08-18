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
import type { DepositRecord } from "@/types/admin";
const networkBadgeStyles: Record<string, string> = {
  "TRC20": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  "ERC20": "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  "BEP20": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { StatusBadge } from "@/components/ui/StatusBadge";

type DepositsTableProps = {
  deposits: DepositRecord[];
  paginatedDeposits: DepositRecord[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  selectedIds: string[];
  toggleSelectAll: () => void;
  toggleSelectRow: (id: string) => void;
  onViewDetails?: (deposit: DepositRecord) => void;
  onVerify?: (deposit: DepositRecord) => void;
  onReject?: (deposit: DepositRecord) => void;
  onAddManual?: (deposit: DepositRecord) => void;
  onNotesHistory?: (deposit: DepositRecord) => void;
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
                <CustomCheckbox
                  checked={
                    paginatedDeposits.length > 0 &&
                    selectedIds.length === paginatedDeposits.length
                  }
                  onChange={toggleSelectAll}
                />
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
                      <CustomCheckbox
                        checked={isChecked}
                        onChange={() => toggleSelectRow(deposit.id)}
                      />
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
                        <StatusBadge status={deposit.status} />
                        <p className="text-[9px] text-muted-2 mt-1">{deposit.statusTime}</p>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-2">{deposit.submittedAt}</td>
                    <td className="py-3.5 text-right pr-1">
                      <TableActionsMenu estimatedHeight={220}>
                        <TableActionsMenuItem icon="👁" label="View Details" onClick={() => onViewDetails?.(deposit)} />
                        <TableActionsMenuItem icon="✅" label="Verify Deposit" onClick={() => onVerify?.(deposit)} className="text-success" />
                        <TableActionsMenuItem icon="❌" label="Reject Deposit" onClick={() => onReject?.(deposit)} className="text-danger" />
                        <TableActionsMenuItem icon="➕" label="Add Manual Deposit" onClick={() => onAddManual?.(deposit)} className="text-purple-bright" />
                        <TableActionsMenuDivider />
                        <TableActionsMenuItem icon="📝" label="Notes / History" onClick={() => onNotesHistory?.(deposit)} />
                      </TableActionsMenu>
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
