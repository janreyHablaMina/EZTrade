"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Wallet,
  ArrowUpRight,
  Plus,
  Download,
  CreditCard,
  Coins,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { initialUsers } from "@/lib/mock-data/usersData";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";
import { ViewUserModal } from "@/components/admin/users/ViewUserModal";
import { EditUserModal } from "@/components/admin/users/EditUserModal";
import { SendNotificationModal } from "@/components/admin/users/SendNotificationModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { UserRecord, RowStatus } from "@/lib/mock-data/usersData";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [usersList, setUsersList] = useState<UserRecord[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [notifyingUser, setNotifyingUser] = useState<UserRecord | null>(null);
  const [accountAction, setAccountAction] = useState<{ user: UserRecord; action: 'suspend' | 'unsuspend' | 'deactivate' | 'reactivate' | 'delete' } | null>(null);
  const [bulkAction, setBulkAction] = useState<'suspend' | 'deactivate' | 'delete' | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Auto-hide toast
  useMemo(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Apply filters logic
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchSearch =
        !search ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        user.id.toLowerCase().includes(search.toLowerCase());

      const matchVip = 
        vipLevel === "all" || 
        (vipLevel === "Ambassador" ? user.role === "Ambassador" : user.vipLevel === vipLevel);
      const matchStatus = status === "all" || user.status === status;

      return matchSearch && matchVip && matchStatus;
    });
  }, [search, vipLevel, status, usersList]);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems: paginatedUsers,
    totalCount
  } = usePagination(filteredUsers, 10);

  const {
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection,
    hasSelection,
    isAllSelected
  } = useTableSelection(paginatedUsers);

  const [viewingUser, setViewingUser] = useState<UserRecord | null>(null);

  const handleBulkAction = () => {
    if (!bulkAction || selectedIds.length === 0) return;
    setIsProcessingAction(true);
    
    setTimeout(() => {
      if (bulkAction === 'delete') {
        setUsersList((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      } else {
        const newStatus: RowStatus = bulkAction === 'suspend' ? 'Suspended' : 'Inactive';
        setUsersList((prev) => prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: newStatus } : u)));
      }
      setIsProcessingAction(false);
      setBulkAction(null);
      setSelectedIds([]);
      setToastMessage(`Successfully ${bulkAction}d ${selectedIds.length} users`);
    }, 600);
  };

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, vipLevel, status]);

  const handleReset = () => {
    setSearch("");
    setVipLevel("all");
    setStatus("all");
    setDateRange("");
    setCurrentPage(1);
  };

  const handleSaveUser = (updatedUser: UserRecord) => {
    setUsersList(usersList.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null);
    setToastMessage("User updated successfully");
  };

  const handleSendNotification = (notification: { title: string; message: string; type: string }) => {
    // In a real app, this would be an API call to send the notification
    console.log("Sending notification to user", notifyingUser?.id, notification);
    setNotifyingUser(null);
    setToastMessage("Notification sent successfully");
  };

  const handleAccountAction = () => {
    if (!accountAction) return;
    setIsProcessingAction(true);
    
    setTimeout(() => {
      if (accountAction.action === 'delete') {
        setUsersList((prev) => prev.filter((u) => u.id !== accountAction.user.id));
      } else {
        let newStatus: RowStatus = 'Active';
        if (accountAction.action === 'suspend') newStatus = 'Suspended';
        else if (accountAction.action === 'deactivate') newStatus = 'Inactive';
        else if (accountAction.action === 'unsuspend' || accountAction.action === 'reactivate') newStatus = 'Active';

        setUsersList((prev) => prev.map((u) => (u.id === accountAction.user.id ? { ...u, status: newStatus } : u)));
      }
      
      setIsProcessingAction(false);
      setAccountAction(null);
      setToastMessage(`User account ${accountAction.action}d successfully`);
    }, 600);
  };

  return (
    <AdminShell>
      {/* Top Header section */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          <Users className="h-6 w-6 text-purple-bright" />
          Admin Users
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
          <span>Dashboard</span>
          <span className="text-[10px] text-muted-2/65">&gt;</span>
          <span>Admin</span>
          <span className="text-[10px] text-muted-2/65">&gt;</span>
          <span className="text-purple-bright">Users</span>
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Users"
          value={usersList.length.toLocaleString()}
          change="+12.5%"
          icon={Users}
        />
        <KpiCard
          label="Active Users"
          value={usersList.filter(u => u.status === 'Active').length.toLocaleString()}
          change="+14.2%"
          icon={Wallet}
        />
        <KpiCard
          label="Total Deposits"
          value={`$${usersList.reduce((acc, user) => acc + user.deposited, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          change="+18.4%"
          icon={CreditCard}
        />
        <KpiCard
          label="Total Withdrawals"
          value={`$${usersList.reduce((acc, user) => acc + user.withdrawn, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          change="+16.7%"
          icon={Coins}
        />
      </div>

      {/* Main Users Management Container */}
      <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple-bright">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Users Management</h2>
              <p className="mt-0.5 text-xs text-muted-2">View and manage all platform users</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-4 py-2 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.3)] hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card-elevated px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.04] cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Filters */}
          <UsersFilters
            search={search}
            setSearch={setSearch}
            vipLevel={vipLevel}
            setVipLevel={setVipLevel}
            status={status}
            setStatus={setStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onReset={handleReset}
          />

          {/* Table */}
          <UsersTable
            users={filteredUsers}
            paginatedUsers={paginatedUsers}
            totalCount={usersList.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            toggleSelectAll={toggleSelectAll}
            toggleSelectRow={toggleSelectRow}
            onViewUser={setViewingUser}
            onEditUser={setEditingUser}
            onNotifyUser={setNotifyingUser}
            onSuspendUser={(user) => setAccountAction({ user, action: 'suspend' })}
            onUnsuspendUser={(user) => setAccountAction({ user, action: 'unsuspend' })}
            onDeactivateUser={(user) => setAccountAction({ user, action: 'deactivate' })}
            onReactivateUser={(user) => setAccountAction({ user, action: 'reactivate' })}
            onDeleteUser={(user) => setAccountAction({ user, action: 'delete' })}
          />
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      <GenericFloatingActions
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
      >
        <button
          type="button"
          onClick={() => setBulkAction('suspend')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-purple/10 text-purple-bright hover:bg-purple/20 transition cursor-pointer text-xs font-medium"
        >
          <span>⏸</span> Suspend
        </button>
        <button
          type="button"
          onClick={() => setBulkAction('deactivate')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer text-xs font-medium"
        >
          <span>🚫</span> Deactivate
        </button>
        <button
          type="button"
          onClick={() => setBulkAction('delete')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer text-xs font-medium"
        >
          <span>🗑️</span> Delete
        </button>
      </GenericFloatingActions>

      {/* View User Modal */}
      <ViewUserModal 
        isOpen={!!viewingUser} 
        onClose={() => setViewingUser(null)} 
        user={viewingUser} 
      />
      
      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={handleSaveUser}
      />

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={!!notifyingUser}
        onClose={() => setNotifyingUser(null)}
        user={notifyingUser}
        onSend={handleSendNotification}
      />

      {/* Account Action Confirmation Modal */}
      <ConfirmModal
        isOpen={!!accountAction}
        onClose={() => setAccountAction(null)}
        onConfirm={handleAccountAction}
        title={
          accountAction?.action === 'suspend' ? "Suspend User Account" : 
          accountAction?.action === 'deactivate' ? "Deactivate User Account" : 
          accountAction?.action === 'delete' ? "Delete User Account" : 
          accountAction?.action === 'unsuspend' ? "Unsuspend User Account" : 
          "Reactivate User Account"
        }
        description={
          accountAction?.action === 'suspend' 
            ? `Are you sure you want to suspend the account for ${accountAction?.user.name} (${accountAction?.user.id})? They will no longer be able to log in or perform actions.`
            : accountAction?.action === 'deactivate'
            ? `Are you sure you want to deactivate the account for ${accountAction?.user.name} (${accountAction?.user.id})? This is usually a permanent or long-term measure.`
            : accountAction?.action === 'delete'
            ? `Are you sure you want to permanently delete the account for ${accountAction?.user.name} (${accountAction?.user.id})? This action cannot be undone and all associated data will be removed.`
            : accountAction?.action === 'unsuspend'
            ? `Are you sure you want to unsuspend the account for ${accountAction?.user.name} (${accountAction?.user.id})? They will regain access to all platform features.`
            : `Are you sure you want to reactivate the account for ${accountAction?.user.name} (${accountAction?.user.id})? They will regain full access to the platform.`
        }
        confirmText={
          accountAction?.action === 'suspend' ? "Suspend Account" : 
          accountAction?.action === 'deactivate' ? "Deactivate Account" : 
          accountAction?.action === 'delete' ? "Delete Account" : 
          accountAction?.action === 'unsuspend' ? "Unsuspend Account" : 
          "Reactivate Account"
        }
        isDestructive={accountAction?.action === 'suspend' || accountAction?.action === 'deactivate' || accountAction?.action === 'delete'}
        isLoading={isProcessingAction}
      />

      {/* Bulk Action Confirmation Modal */}
      <ConfirmModal
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        onConfirm={handleBulkAction}
        title={
          bulkAction === 'suspend' ? "Suspend Users" : 
          bulkAction === 'deactivate' ? "Deactivate Users" : 
          "Delete Users"
        }
        description={
          bulkAction === 'suspend'
            ? `Are you sure you want to suspend ${selectedIds.length} users? They will be temporarily unable to access the platform.`
            : bulkAction === 'deactivate'
            ? `Are you sure you want to deactivate ${selectedIds.length} users? This is a permanent measure and will restrict their access.`
            : `Are you sure you want to permanently delete ${selectedIds.length} users? This action is irreversible and all their data will be removed.`
        }
        confirmText={
          bulkAction === 'suspend' ? "Suspend Users" : 
          bulkAction === 'deactivate' ? "Deactivate Users" : 
          "Delete Users"
        }
        isDestructive={true}
        isLoading={isProcessingAction}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-card p-4 shadow-[0_10px_40px_rgba(34,197,94,0.15)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Success</p>
              <p className="text-xs text-muted-2">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage("")}
              className="ml-4 text-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
