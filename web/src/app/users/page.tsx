"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Wallet,
  ArrowUpRight,
  Crown,
  Clock,
  Plus,
  Download,
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
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Users
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
            <span>Dashboard</span>
            <span className="text-[10px] text-muted-2/65">&gt;</span>
            <span className="text-muted">Users</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.04] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-3.5 py-2 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.3)] hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New User
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Users"
          value="100,254"
          change="+12.5%"
          icon={Users}
        />
        <KpiCard
          label="Active Users"
          value="78,952"
          change="+10.3%"
          icon={UserCheck}
        />
        <KpiCard
          label="Total Deposited"
          value="$1,234,567.89"
          change="+18.7%"
          icon={Wallet}
        />
        <KpiCard
          label="Total Withdrawn"
          value="$657,890.20"
          change="+8.3%"
          icon={ArrowUpRight}
        />
        <KpiCard
          label="Active VIP Users"
          value="12,364"
          change="+11.4%"
          icon={Crown}
        />
        <KpiCard
          label="Pending Verification"
          value="37,803"
          change="-6.8%"
          positive={false}
          icon={Clock}
          iconClassName="text-danger"
        />
      </div>

      {/* Filters Card */}
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

      {/* Users Table Card */}
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
