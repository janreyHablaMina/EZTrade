import { useState } from "react";
import {
  Copy,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import { TableActionsMenu, TableActionsMenuItem, TableActionsMenuDivider } from "@/components/admin/TableActionsMenu";
import type { TransactionRecord } from "@/types/admin";
import { webApi } from "@/lib/api";
import { DataTable, ColumnDef } from "@/components/admin/table/DataTable";

const typeBadgeStyles: Record<string, string> = {
  Deposit: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Withdrawal: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Transfer: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  Earning: "bg-success/15 text-success border border-success/25",
  Bonus: "bg-purple-bright/15 text-purple-bright border border-purple-bright/25",
};

const statusBadgeStyles: Record<string, string> = {
  Completed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Failed: "bg-danger/15 text-danger",
  Rejected: "bg-danger/15 text-danger",
};

type TransactionsTableProps = {
  transactions: TransactionRecord[];
  paginatedTransactions: TransactionRecord[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  selectedIds?: string[];
  toggleSelectAll?: () => void;
  toggleSelectRow?: (id: string) => void;
  onViewDetails?: (tx: TransactionRecord) => void;
  onRefresh?: () => void;
};

export function TransactionsTable({
  transactions,
  paginatedTransactions,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  selectedIds = [],
  toggleSelectAll,
  toggleSelectRow,
  onViewDetails,
  onRefresh,
}: TransactionsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpdateStatus = async (tx: any, status: 'Approved' | 'Rejected') => {
    try {
      await webApi.patch(`/deposits/${tx.dbId}`, { status });
      onRefresh?.();
    } catch (e) {
      console.error('Failed to update deposit status:', e);
    }
  };

  const handleCopyTxid = (id: string, txid: string) => {
    navigator.clipboard.writeText(txid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderTypeIcon = (type: TransactionRecord["type"]) => {
    switch (type) {
      case "Deposit":
        return <ArrowDownToLine className="h-3 w-3" />;
      case "Withdrawal":
        return <ArrowUpFromLine className="h-3 w-3" />;
      case "Transfer":
        return <ArrowLeftRight className="h-3 w-3" />;
      case "Earning":
        return <TrendingUp className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const columns: ColumnDef<TransactionRecord>[] = [
    {
      header: "ID",
      width: "w-24",
      cellClassName: "font-mono text-[10px] text-muted-2",
      cell: (tx) => tx.id,
    },
    {
      header: "Type",
      width: "w-28",
      cell: (tx) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
            typeBadgeStyles[tx.type] || ""
          }`}
        >
          {renderTypeIcon(tx.type)}
          {tx.type}
        </span>
      ),
    },
    {
      header: "User",
      width: "w-64",
      cell: (tx) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
            {tx.userName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white leading-normal">{tx.userName}</p>
            <p className="text-[10px] text-muted-2 leading-none mt-0.5">{tx.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Reference / TXID",
      cell: (tx) => (
        <div className="flex items-center gap-2 text-muted-2">
          <span className="font-mono">
            {tx.referenceTxid.slice(0, 8)}...{tx.referenceTxid.slice(-8)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyTxid(tx.id, tx.referenceTxid);
            }}
            className="p-1 hover:text-white transition cursor-pointer relative"
            title="Copy Transaction TXID"
          >
            <Copy className="h-3 w-3" />
            {copiedId === tx.id && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-black/85 text-[8px] text-success font-semibold whitespace-nowrap z-10">
                Copied!
              </span>
            )}
          </button>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (tx) => {
        const isPositive = tx.amount >= 0;
        return (
          <span className={`font-bold ${isPositive ? "text-success" : "text-danger"}`}>
            {isPositive ? "+" : ""}
            {tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      header: "Currency",
      cell: (tx) => (
        <div className="flex items-center gap-1.5">
          <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold ring-1 ring-emerald-500/30">
            T
          </div>
          <div>
            <span className="font-semibold text-white">{tx.currency}</span>
            <span className="ml-1.5 inline-flex rounded bg-card-elevated px-1 py-0.5 text-[8px] font-medium text-muted-2 tracking-wide ring-1 ring-border/50">
              {tx.network}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (tx) => (
        <span
          className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${
            statusBadgeStyles[tx.status] || ""
          }`}
        >
          {tx.status}
        </span>
      ),
    },
    {
      header: "Date & Time",
      width: "w-40",
      cellClassName: "text-muted-2",
      cell: (tx) => tx.dateTime,
    },
    {
      header: "Actions",
      headerClassName: "text-right pr-1",
      cellClassName: "text-right pr-1 relative",
      cell: (tx) => (
        <TableActionsMenu estimatedHeight={200}>
          {tx.status === 'Pending' && tx.type === 'Deposit' && (
            <>
              <TableActionsMenuItem 
                icon="✅" 
                label="Approve" 
                onClick={() => handleUpdateStatus(tx, 'Approved')} 
                className="text-success" 
              />
              <TableActionsMenuItem 
                icon="❌" 
                label="Reject" 
                onClick={() => handleUpdateStatus(tx, 'Rejected')} 
                className="text-danger" 
              />
              <TableActionsMenuDivider />
            </>
          )}
          <TableActionsMenuItem 
            icon="👁" 
            label="View Details" 
            onClick={() => onViewDetails?.(tx)} 
          />
        </TableActionsMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={paginatedTransactions}
      columns={columns}
      keyExtractor={(tx) => tx.id}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemName="transactions"
      pageSizes={[5, 10, 20]}
      selectedIds={selectedIds}
      onToggleSelectAll={toggleSelectAll}
      onToggleSelectRow={toggleSelectRow}
      emptyStateMessage="No transactions found matching your filters."
    />
  );
}
