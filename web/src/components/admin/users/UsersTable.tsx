import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit
} from "lucide-react";
import type { UserRecord } from "./usersData";
import { vipBadgeStyles } from "./usersData";

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
  setSelectedIds,
  toggleSelectAll,
  toggleSelectRow,
}: UsersTableProps) {
  const [activeDropdownUserId, setActiveDropdownUserId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 pr-6 font-medium w-14">
                <label className="relative flex items-center justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      paginatedUsers.length > 0 &&
                      selectedIds.length === paginatedUsers.length
                    }
                    onChange={toggleSelectAll}
                    className="sr-only"
                  />
                  <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    paginatedUsers.length > 0 && selectedIds.length === paginatedUsers.length
                      ? "bg-purple border-purple-bright shadow-[0_0_8px_rgba(123,44,255,0.4)]"
                      : "border-border bg-card-elevated hover:border-purple-bright/50"
                  }`}>
                    {paginatedUsers.length > 0 && selectedIds.length === paginatedUsers.length && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>
              </th>
              <th className="pb-3.5 font-medium">User</th>
              <th className="pb-3.5 font-medium">Email</th>
              <th className="pb-3.5 font-medium">Level</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium">Balance</th>
              <th className="pb-3.5 font-medium">Joined</th>
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => {
                const isChecked = selectedIds.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition ${
                      isChecked ? "bg-purple/5" : ""
                    }`}
                  >
                    <td className="py-3.5 pl-1 pr-6">
                      <label className="relative flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(user.id)}
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
                          {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-normal">{user.name}</p>
                          <p className="text-[10px] text-muted-2 leading-none mt-0.5">UID: {user.id.toUpperCase().substring(0, 7)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-2">{user.email}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${vipBadgeStyles[user.vipLevel] || ""}`}>
                        {user.vipLevel}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
                          user.status === "Active"
                            ? "bg-success/15 text-success"
                            : user.status === "Pending"
                            ? "bg-warning/15 text-warning"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-muted-2">
                      ${(user.deposited - user.withdrawn + user.earnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 text-muted-2">{user.registeredAt}</td>
                    <td className="py-3.5 text-right pr-1 relative">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-white text-[11px] font-medium hover:bg-white/[0.04] transition">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownUserId(activeDropdownUserId === user.id ? null : user.id);
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                            activeDropdownUserId === user.id
                              ? "border-purple-bright/50 text-white bg-purple/10"
                              : "border-border text-muted hover:text-white bg-card-elevated"
                          }`}
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {activeDropdownUserId === user.id && (
                        <>
                          {/* Backdrop/invisible layer to close on click outside */}
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={() => setActiveDropdownUserId(null)}
                          />
                          <div className={`absolute right-1.5 w-48 rounded-xl bg-card-elevated border border-border py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.55)] z-30 text-left ${
                            index >= paginatedUsers.length - 4 && paginatedUsers.length > 4
                              ? "bottom-full mb-1"
                              : "mt-1"
                          }`}>
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">👁</span>
                              View User
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">✏️</span>
                              Edit User
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">🔔</span>
                              Send Notification
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">🔑</span>
                              Reset Password
                            </button>
                            
                            <div className="my-1 border-t border-border/45" />
                            
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">⏸</span>
                              Suspend Account
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">🚫</span>
                              Deactivate Account
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDropdownUserId(null)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <span className="text-sm">🗃️</span>
                              Archive User
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
