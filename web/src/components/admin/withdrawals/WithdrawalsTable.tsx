import { useState } from "react";
import {
  TableActionsMenu,
  TableActionsMenuDivider,
  TableActionsMenuItem,
} from "@/components/admin/TableActionsMenu";
import { Copy } from "lucide-react";
import type { WithdrawalRequest } from "@/types/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/admin/table/DataTable";

const networkBadgeStyles: Record<string, string> = {
  TRC20: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  ERC20: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  BEP20: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: ColumnDef<WithdrawalRequest>[] = [
    {
      header: "User",
      width: "w-64",
      cell: (withdrawal) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
            {withdrawal.userName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white leading-normal">{withdrawal.userName}</p>
            <p className="text-[10px] text-muted-2 leading-none mt-0.5">{withdrawal.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (withdrawal) => (
        <>
          <p className="font-semibold text-white">
            {withdrawal.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-muted-2 leading-none mt-0.5">{withdrawal.currency}</p>
        </>
      ),
    },
    {
      header: "Receive Amount",
      cell: (withdrawal) => (
        <>
          <p className="font-semibold text-white">
            {withdrawal.receiveAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-muted-2 leading-none mt-0.5">{withdrawal.currency}</p>
        </>
      ),
    },
    {
      header: "Network",
      cell: (withdrawal) => (
        <span
          className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
            networkBadgeStyles[withdrawal.network] || ""
          }`}
        >
          {withdrawal.network}
        </span>
      ),
    },
    {
      header: "Wallet Address",
      cell: (withdrawal) => (
        <div className="flex items-center gap-2 text-muted-2">
          <span className="font-mono">
            {withdrawal.walletAddress.slice(0, 6)}...{withdrawal.walletAddress.slice(-6)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyAddress(withdrawal.id, withdrawal.walletAddress);
            }}
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
      ),
    },
    {
      header: "Status",
      cell: (withdrawal) => <StatusBadge status={withdrawal.status} />,
    },
    {
      header: "Requested At",
      cell: (withdrawal) => <span className="text-muted-2">{withdrawal.requestedAt}</span>,
    },
    {
      header: "Actions",
      headerClassName: "text-right pr-1",
      cellClassName: "text-right pr-1 relative",
      cell: (withdrawal) => (
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
      ),
    },
  ];

  return (
    <DataTable
      data={paginatedWithdrawals}
      columns={columns}
      keyExtractor={(w) => w.id}
      totalCount={withdrawals.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemName="withdrawals"
      pageSizes={[5, 10, 20]}
      selectedIds={selectedIds}
      onToggleSelectAll={toggleSelectAll}
      onToggleSelectRow={toggleSelectRow}
      emptyStateMessage="No withdrawals found matching your filters."
    />
  );
}
