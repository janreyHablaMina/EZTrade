import {
  TableActionsMenu,
  TableActionsMenuDivider,
  TableActionsMenuItem,
} from "@/components/admin/TableActionsMenu";
import type { UserRecord } from "@/types/admin";
import { vipBadgeStyles } from "@/types/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/admin/table/DataTable";
import React from "react";

type UsersTableProps = {
  users: UserRecord[];
  paginatedUsers: UserRecord[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  toggleSelectAll: () => void;
  toggleSelectRow: (id: string) => void;
  onViewUser?: (user: UserRecord) => void;
  onEditUser?: (user: UserRecord) => void;
  onMessageUser?: (user: UserRecord) => void;
  onSimulateTrade?: (user: UserRecord) => void;
  onSuspendUser?: (user: UserRecord) => void;
  onUnsuspendUser?: (user: UserRecord) => void;
  onDeactivateUser?: (user: UserRecord) => void;
  onReactivateUser?: (user: UserRecord) => void;
  onDeleteUser?: (user: UserRecord) => void;
  isDownlineView?: boolean;
};

export function UsersTable({
  users,
  paginatedUsers,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  selectedIds,
  toggleSelectAll,
  toggleSelectRow,
  onViewUser,
  onEditUser,
  onMessageUser,
  onSimulateTrade,
  onSuspendUser,
  onUnsuspendUser,
  onDeactivateUser,
  onReactivateUser,
  onDeleteUser,
  isDownlineView,
}: UsersTableProps) {
  
  const columns: ColumnDef<UserRecord>[] = [
    {
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
            {user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white leading-normal">{user.name}</p>
            {user.role === "Ambassador" ? (
              <p className="text-[10px] font-semibold text-amber-400 leading-none mt-1 uppercase">
                Ambassador
              </p>
            ) : (
              <p className="text-[10px] text-muted-2 leading-none mt-1">User</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      cell: (user) => <span className="text-muted-2">{user.email}</span>,
    },
    {
      header: "Level",
      cell: (user) => (
        <span
          className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
            vipBadgeStyles[user.vipLevel] || ""
          }`}
        >
          {user.vipLevel}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      header: "Balance",
      cell: (user) => {
        const balance = user.deposited - user.withdrawn + user.earnings;
        return (
          <>
            <div className="text-muted-2">
              {balance < 0 ? "-" : ""}${Math.abs(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            {user.pendingDeposit && user.pendingDeposit > 0 ? (
              <div className="text-[10px] text-warning font-semibold mt-1" title="Pending Deposit">
                +${user.pendingDeposit.toLocaleString()} Pending
              </div>
            ) : null}
          </>
        );
      },
    },
    {
      header: "Daily Profit",
      cell: (user) => (
        <span className="font-bold text-success">
          +${user.dailyProfit?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </span>
      ),
    },
  ];

  if (isDownlineView) {
    columns.push(
      {
        header: <span className="text-emerald-400">Cut %</span>,
        cell: (user) => (
          <span className="inline-flex rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
            {user.cutPercent || 10}%
          </span>
        ),
      },
      {
        header: <span className="text-emerald-400">Generated</span>,
        cell: (user) => (
          <span className="font-bold text-emerald-400">
            +${((user.deposited || 0) * ((user.cutPercent || 10) / 100)).toFixed(2)}
          </span>
        ),
      }
    );
  }

  columns.push({
    header: "Actions",
    headerClassName: "text-right pr-1",
    cellClassName: "text-right pr-1",
    cell: (user) => (
      <TableActionsMenu estimatedHeight={350}>
        <TableActionsMenuItem icon="👁" label="View User" onClick={() => onViewUser?.(user)} />
        <TableActionsMenuItem icon="✏️" label="Edit User" onClick={() => onEditUser?.(user)} />
        <TableActionsMenuItem
          icon="💬"
          label="Message User"
          onClick={() => onMessageUser?.(user)}
        />
        <TableActionsMenuDivider />
        {user.status === "Suspended" ? (
          <TableActionsMenuItem
            icon="▶️"
            label="Unsuspend Account"
            onClick={() => onUnsuspendUser?.(user)}
          />
        ) : (
          <TableActionsMenuItem
            icon="⏸"
            label="Suspend Account"
            onClick={() => onSuspendUser?.(user)}
          />
        )}
        {user.status === "Inactive" ? (
          <TableActionsMenuItem
            icon="✅"
            label="Reactivate Account"
            onClick={() => onReactivateUser?.(user)}
          />
        ) : (
          <TableActionsMenuItem
            icon="🚫"
            label="Deactivate Account"
            tone="danger"
            onClick={() => onDeactivateUser?.(user)}
          />
        )}
        <TableActionsMenuItem 
          icon="🗑️" 
          label="Delete User" 
          tone="danger" 
          onClick={() => onDeleteUser?.(user)}
        />
      </TableActionsMenu>
    ),
  });

  return (
    <DataTable
      data={paginatedUsers}
      columns={columns}
      keyExtractor={(user) => user.id}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemName="users"
      selectedIds={selectedIds}
      onToggleSelectAll={toggleSelectAll}
      onToggleSelectRow={toggleSelectRow}
      onRowClick={onViewUser}
      emptyStateMessage="No users found matching your filters."
    />
  );
}
