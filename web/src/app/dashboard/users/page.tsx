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
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { initialUsers } from "@/components/admin/users/usersData";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { FloatingBulkActions } from "@/components/admin/users/FloatingBulkActions";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");

  // Applied filters state
  const [filters, setFilters] = useState({
    search: "",
    vipLevel: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Apply filters logic
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchSearch =
        !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone.includes(filters.search) ||
        user.id.toLowerCase().includes(filters.search.toLowerCase());

      const matchVip = filters.vipLevel === "all" || user.vipLevel === filters.vipLevel;
      const matchStatus = filters.status === "all" || user.status === filters.status;

      return matchSearch && matchVip && matchStatus;
    });
  }, [filters]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleFilter = () => {
    setFilters({
      search,
      vipLevel,
      status,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setVipLevel("all");
    setStatus("all");
    setDateRange("");
    setFilters({
      search: "",
      vipLevel: "all",
      status: "all",
    });
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map((u) => u.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
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
          value="1,248"
          change="+12.5%"
          icon={Users}
        />
        <KpiCard
          label="Active Users"
          value="892"
          change="+14.2%"
          icon={Wallet}
        />
        <KpiCard
          label="Total Deposits"
          value="$12,450"
          change="+18.4%"
          icon={CreditCard}
        />
        <KpiCard
          label="Total Withdrawals"
          value="$8,760"
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
            onFilter={handleFilter}
            onReset={handleReset}
          />

          {/* Table */}
          <UsersTable
            users={filteredUsers}
            paginatedUsers={paginatedUsers}
            totalCount={initialUsers.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            toggleSelectAll={toggleSelectAll}
            toggleSelectRow={toggleSelectRow}
          />
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <FloatingBulkActions
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onActionComplete={() => setSelectedIds([])}
        />
      )}
    </AdminShell>
  );
}
