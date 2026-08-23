"use client";

import { useState, useMemo, useCallback } from "react";
import { webApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
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
import { GenericFilters, FilterConfig } from "@/components/admin/GenericFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";
import { ViewUserModal } from "@/components/admin/users/ViewUserModal";
import { EditUserModal } from "@/components/admin/users/EditUserModal";
import { SendNotificationModal } from "@/components/admin/users/SendNotificationModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { UserRecord, RowStatus } from "@/types/admin";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [params, setParams] = useState<Record<string, string>>({
    search: '', vipLevel: 'all', status: 'all'
  });
  const { data: rawUsers, isLoading: isLoadingUsersData, mutate: mutateUsers } = useApi("/users");
  const { data: globalStats, isLoading: isLoadingStats, mutate: mutateStats } = useApi("/users/global/stats");

  const isLoadingUsers = isLoadingUsersData || isLoadingStats;

  const usersList = useMemo<UserRecord[]>(() => {
    if (!rawUsers) return [];
    return rawUsers.map((u: any) => ({
      id: `EZT-${u.id.toString().padStart(4, '0')}`,
      dbId: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "N/A",
      vipLevel: u.vip_plan ? u.vip_plan.level : "None",
      role: u.role || "User",
      deposited: parseFloat(u.balance) || 0,
      withdrawn: 0,
      earnings: 0,
      kycStatus: u.kyc_status || "Not Verified",
      status: u.status || "Active",
      teamSize: u.team_size || 0,
      referralCode: u.referral_code || null,
      registeredAt: new Date(u.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
    }));
  }, [rawUsers]);

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

  // Derive available filter options from loaded data
  const availableStatuses = useMemo(() => {
    return Array.from(new Set(usersList.map(u => u.status))).sort();
  }, [usersList]);

  const availableLevels = useMemo(() => {
    const levels = Array.from(new Set(usersList.map(u => u.role === 'Ambassador' ? 'Ambassador' : u.vipLevel))).filter(Boolean);
    return levels.sort((a, b) => {
      if (a === 'Ambassador') return -1;
      if (b === 'Ambassador') return 1;
      return a.localeCompare(b);
    });
  }, [usersList]);

  // Apply filters logic
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const search = params.search?.toLowerCase() || '';
      const matchSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone.includes(search) ||
        user.id.toLowerCase().includes(search);

      const vipLevel = params.vipLevel || 'all';
      const matchVip = 
        vipLevel === "all" || 
        (vipLevel === "Ambassador" ? user.role === "Ambassador" : user.vipLevel === vipLevel);
      
      const status = params.status || 'all';
      const matchStatus = status === "all" || user.status === status;

      return matchSearch && matchVip && matchStatus;
    });
  }, [params, usersList]);

  const updateFilter = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({ search: '', vipLevel: 'all', status: 'all' });
  };

  const filterConfig = useMemo<FilterConfig[]>(() => [
    { type: 'search', key: 'search', placeholder: 'Search users...' },
    { 
      type: 'select', 
      key: 'status', 
      defaultLabel: 'All Statuses',
      options: availableStatuses.map(s => ({ label: s, value: s }))
    },
    { 
      type: 'select', 
      key: 'vipLevel', 
      defaultLabel: 'All Levels',
      options: availableLevels.map(l => ({ label: l, value: l }))
    }
  ], [availableStatuses, availableLevels]);

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

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    setIsProcessingAction(true);
    
    try {
      const promises = selectedIds.map(id => {
        const user = usersList.find(u => u.id === id);
        const realId = user ? ((user as any).dbId || parseInt(user.id.replace('EZT-', ''))) : parseInt(id.replace('EZT-', ''));
        if (bulkAction === 'delete') {
          return webApi.delete(`/users/${realId}`);
        } else {
          const newStatus: RowStatus = bulkAction === 'suspend' ? 'Suspended' : 'Inactive';
          return webApi.patch(`/users/${realId}`, { status: newStatus });
        }
      });
      
      await Promise.all(promises);

      await Promise.all(promises);

      await mutateUsers();
      await mutateStats();
      setToastMessage(`Successfully ${bulkAction}d ${selectedIds.length} users`);
    } catch (err) {
      console.error("Failed to perform bulk action:", err);
      setToastMessage(`Failed to perform bulk action`);
    } finally {
      setIsProcessingAction(false);
      setBulkAction(null);
      setSelectedIds([]);
    }
  };

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [params]);


  const handleSaveUser = async (updatedUser: UserRecord) => {
    try {
      const realId = (updatedUser as any).dbId || parseInt(updatedUser.id.replace('EZT-', ''));
      await webApi.patch(`/users/${realId}`, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone !== "N/A" ? updatedUser.phone : null,
        vipLevel: updatedUser.vipLevel,
        role: updatedUser.role,
        status: updatedUser.status,
        kyc_status: updatedUser.kycStatus
      });
      await mutateUsers();
      setEditingUser(null);
      setToastMessage("User updated successfully");
    } catch (err) {
      console.error("Failed to update user:", err);
      setToastMessage("Failed to update user");
    }
  };

  const handleSendNotification = (notification: { title: string; message: string; type: string }) => {
    // In a real app, this would be an API call to send the notification
    console.log("Sending notification to user", notifyingUser?.id, notification);
    setNotifyingUser(null);
    setToastMessage("Notification sent successfully");
  };



  const handleAccountAction = async () => {
    if (!accountAction) return;
    setIsProcessingAction(true);
    
    try {
      const realId = (accountAction.user as any).dbId || parseInt(accountAction.user.id.replace('EZT-', ''));
      
      if (accountAction.action === 'delete') {
        await webApi.delete(`/users/${realId}`);
      } else {
        let newStatus: RowStatus = 'Active';
        if (accountAction.action === 'suspend') newStatus = 'Suspended';
        else if (accountAction.action === 'deactivate') newStatus = 'Inactive';
        else if (accountAction.action === 'unsuspend' || accountAction.action === 'reactivate') newStatus = 'Active';

        await webApi.patch(`/users/${realId}`, { status: newStatus });
      }
      
      await mutateUsers();
      await mutateStats();
      
      setToastMessage(`Successfully ${accountAction.action}d ${accountAction.user.name}`);
    } catch (err) {
      console.error("Failed to perform account action:", err);
      setToastMessage(`Failed to ${accountAction.action} user`);
    } finally {
      setIsProcessingAction(false);
      setAccountAction(null);
    }
  };

  return (
    <AdminShell>
      {/* Top Header section */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Users Management
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
            <span>Dashboard</span>
            <span className="text-[10px] text-muted-2/65">&gt;</span>
            <span className="text-muted">Users</span>
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Users"
          value={usersList.length.toString()}
          change="+12.5%"
          icon={Users}
        />
        <KpiCard
          label="Active Users"
          value={usersList.filter((u) => u.status === "Active").length.toString()}
          change="+14.2%"
          icon={UserCheck}
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

        {/* Filters */}
        <GenericFilters
          config={filterConfig}
          params={params}
          updateFilter={updateFilter}
          onReset={handleReset}
        />

      {/* Users Table Card */}
      {isLoadingUsers ? (
        <div className="py-8 text-center text-muted-2">Loading users...</div>
      ) : (
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
          onViewUser={(user) => {
            if (user.role === "Ambassador") {
              router.push(`/dashboard/ambassadors/${user.id}`);
            } else {
              setViewingUser(user);
            }
          }}
          onEditUser={setEditingUser}
          onNotifyUser={setNotifyingUser}
          onSuspendUser={(user) => setAccountAction({ user, action: 'suspend' })}
          onUnsuspendUser={(user) => setAccountAction({ user, action: 'unsuspend' })}
          onDeactivateUser={(user) => setAccountAction({ user, action: 'deactivate' })}
          onReactivateUser={(user) => setAccountAction({ user, action: 'reactivate' })}
          onDeleteUser={(user) => setAccountAction({ user, action: 'delete' })}
        />
      )}

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
