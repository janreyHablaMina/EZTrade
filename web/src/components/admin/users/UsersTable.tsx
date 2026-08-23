import { PaginationFooter } from "@/components/admin/PaginationFooter";
import {
  TableActionsMenu,
  TableActionsMenuDivider,
  TableActionsMenuItem,
} from "@/components/admin/TableActionsMenu";
import type { UserRecord } from "@/types/admin";
import { vipBadgeStyles } from "@/types/admin";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { StatusBadge } from "@/components/ui/StatusBadge";

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
  onNotifyUser?: (user: UserRecord) => void;
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
  onNotifyUser,
  onSimulateTrade,
  onSuspendUser,
  onUnsuspendUser,
  onDeactivateUser,
  onReactivateUser,
  onDeleteUser,
  isDownlineView,
}: UsersTableProps) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 pr-6 font-medium w-14">
                <CustomCheckbox
                  checked={
                    paginatedUsers.length > 0 &&
                    selectedIds.length === paginatedUsers.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="pb-3.5 font-medium">User</th>
              <th className="pb-3.5 font-medium">Email</th>
              <th className="pb-3.5 font-medium">Level</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium">Balance</th>
              <th className="pb-3.5 font-medium">Joined</th>
              {isDownlineView && (
                <>
                  <th className="pb-3.5 font-medium text-emerald-400">Cut %</th>
                  <th className="pb-3.5 font-medium text-emerald-400">Generated</th>
                </>
              )}
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const isChecked = selectedIds.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition ${
                      isChecked ? "bg-purple/5" : ""
                    }`}
                  >
                    <td className="py-3.5 pl-1 pr-6">
                      <CustomCheckbox
                        checked={isChecked}
                        onChange={() => toggleSelectRow(user.id)}
                      />
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-normal">{user.name}</p>
                          {user.role === "Ambassador" ? (
                            <p className="text-[10px] font-semibold text-amber-400 leading-none mt-1 uppercase">
                              Ambassador
                            </p>
                          ) : (
                            <p className="text-[10px] text-muted-2 leading-none mt-1">
                              User
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-2">{user.email}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
                          vipBadgeStyles[user.vipLevel] || ""
                        }`}
                      >
                        {user.vipLevel}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-3.5">
                      <div className="text-muted-2">
                        {(user.deposited - user.withdrawn + user.earnings) < 0 ? "-" : ""}$
                        {Math.abs(user.deposited - user.withdrawn + user.earnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      {user.pendingDeposit && user.pendingDeposit > 0 && (
                        <div className="text-[10px] text-warning font-semibold mt-1" title="Pending Deposit">
                          +${user.pendingDeposit.toLocaleString()} Pending
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 text-muted-2">{user.registeredAt}</td>
                    {isDownlineView && (
                      <>
                        <td className="py-3.5">
                          <span className="inline-flex rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            {user.cutPercent || 10}%
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-emerald-400">
                          +${((user.deposited || 0) * ((user.cutPercent || 10) / 100)).toFixed(2)}
                        </td>
                      </>
                    )}
                    <td className="py-3.5 text-right pr-1">
                        <TableActionsMenu estimatedHeight={350}>
                          <TableActionsMenuItem icon="👁" label="View User" onClick={() => onViewUser?.(user)} />
                          <TableActionsMenuItem icon="✏️" label="Edit User" onClick={() => onEditUser?.(user)} />
                          <TableActionsMenuItem
                            icon="🔔"
                            label="Send Notification"
                            onClick={() => onNotifyUser?.(user)}
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
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isDownlineView ? 11 : 9} className="py-8 text-center text-muted-2">
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalCount}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="users"
        pageSizes={[5, 10, 20, 50, 250]}
      />
    </div>
  );
}
