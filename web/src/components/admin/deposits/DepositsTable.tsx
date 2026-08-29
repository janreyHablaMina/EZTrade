import { useState } from "react";
import {
  TableActionsMenu,
  TableActionsMenuItem,
} from "@/components/admin/TableActionsMenu";
import { Copy } from "lucide-react";
import type { DepositRecord } from "@/types/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/admin/table/DataTable";

const networkBadgeStyles: Record<string, string> = {
  TRC20: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  ERC20: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  BEP20: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

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
}: DepositsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTxid = (id: string, txid: string) => {
    navigator.clipboard.writeText(txid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: ColumnDef<DepositRecord>[] = [
    {
      header: "User",
      width: "w-64",
      cell: (deposit) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
            {deposit.userName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white leading-normal">{deposit.userName}</p>
            <p className="text-[10px] text-muted-2 leading-none mt-0.5">{deposit.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (deposit) => (
        <>
          <p className="font-semibold text-white">
            {deposit.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-muted-2 leading-none mt-0.5">{deposit.currency}</p>
        </>
      ),
    },
    {
      header: "Currency",
      cell: (deposit) => (
        <div className="flex items-center gap-1.5">
          <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold ring-1 ring-emerald-500/30">
            T
          </div>
          <span className="font-medium text-white">{deposit.currency}</span>
        </div>
      ),
    },
    {
      header: "Network",
      cell: (deposit) => (
        <span
          className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
            networkBadgeStyles[deposit.network] || ""
          }`}
        >
          {deposit.network}
        </span>
      ),
    },
    {
      header: "TXID",
      cell: (deposit) => (
        <div className="flex items-center gap-2 text-muted-2">
          <span className="font-mono">
            {deposit.txid.slice(0, 8)}...{deposit.txid.slice(-8)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyTxid(deposit.id, deposit.txid);
            }}
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
      ),
    },
    {
      header: "Status",
      cell: (deposit) => (
        <div>
          <StatusBadge status={deposit.status} />
          <p className="text-[9px] text-muted-2 mt-1">{deposit.statusTime}</p>
        </div>
      ),
    },
    {
      header: "Submitted At",
      cell: (deposit) => <span className="text-muted-2">{deposit.submittedAt}</span>,
    },
    {
      header: "Actions",
      headerClassName: "text-right pr-1",
      cellClassName: "text-right pr-1",
      cell: (deposit) => (
        <TableActionsMenu estimatedHeight={120}>
          <TableActionsMenuItem icon="👁" label="View Details" onClick={() => onViewDetails?.(deposit)} />
          <TableActionsMenuItem icon="✅" label="Verify Deposit" onClick={() => onVerify?.(deposit)} className="text-success" />
          <TableActionsMenuItem icon="❌" label="Reject Deposit" onClick={() => onReject?.(deposit)} className="text-danger" />
        </TableActionsMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={paginatedDeposits}
      columns={columns}
      keyExtractor={(d) => d.id}
      totalCount={deposits.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemName="deposits"
      pageSizes={[5, 10, 20]}
      selectedIds={selectedIds}
      onToggleSelectAll={toggleSelectAll}
      onToggleSelectRow={toggleSelectRow}
      emptyStateMessage="No deposits found matching your filters."
    />
  );
}
