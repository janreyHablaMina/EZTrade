"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Users,
  UserCheck,
  Wallet,
  ArrowUpRight,
  Crown,
  Clock,
  Plus,
  Download,
  ChevronDown
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";

type RowStatus = "Active" | "Inactive";
type KycStatus = "Verified" | "Not Verified";

type UserRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vipLevel: string;
  deposited: number;
  withdrawn: number;
  earnings: number;
  kycStatus: KycStatus;
  status: RowStatus;
  registeredAt: string;
  pendingDeposit?: number;
};

const initialUsers: UserRecord[] = [
  {
    id: "EZT100254",
    name: "John Smith",
    phone: "+63 912 345 6789",
    email: "johnsmith@gmail.com",
    vipLevel: "VIP 2",
    deposited: 610.00,
    withdrawn: 210.00,
    earnings: 45.20,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 17, 2024 10:45 AM",
  },
  {
    id: "EZT100253",
    name: "Maria Garcia",
    phone: "+63 917 555 1234",
    email: "mariagarcia@gmail.com",
    vipLevel: "VIP 1",
    deposited: 10.00,
    withdrawn: 0.00,
    earnings: 0.80,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 17, 2024 09:32 AM",
    pendingDeposit: 100.00,
  },
  {
    id: "EZT100252",
    name: "Michael Lee",
    phone: "+63 918 777 8888",
    email: "michael.lee@gmail.com",
    vipLevel: "VIP 3",
    deposited: 258.00,
    withdrawn: 120.00,
    earnings: 18.50,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 16, 2024 04:21 PM",
  },
  {
    id: "EZT100251",
    name: "Sarah Johnson",
    phone: "+63 919 333 4444",
    email: "sarahjohnson@gmail.com",
    vipLevel: "VIP 2",
    deposited: 136.00,
    withdrawn: 50.00,
    earnings: 7.60,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 16, 2024 02:11 PM",
    pendingDeposit: 50.00,
  },
  {
    id: "EZT100250",
    name: "David Brown",
    phone: "+63 915 222 1111",
    email: "davidbrown@gmail.com",
    vipLevel: "VIP 1",
    deposited: 10.00,
    withdrawn: 0.00,
    earnings: 0.60,
    kycStatus: "Not Verified",
    status: "Inactive",
    registeredAt: "May 15, 2024 11:08 AM",
  },
  {
    id: "EZT100249",
    name: "Emily Davis",
    phone: "+63 916 888 9999",
    email: "emilydavis@gmail.com",
    vipLevel: "VIP 4",
    deposited: 800.00,
    withdrawn: 300.00,
    earnings: 96.00,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 15, 2024 10:22 AM",
  },
  {
    id: "EZT100248",
    name: "James Wilson",
    phone: "+63 914 666 7777",
    email: "jameswilson@gmail.com",
    vipLevel: "VIP 3",
    deposited: 258.00,
    withdrawn: 80.00,
    earnings: 15.30,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 14, 2024 07:05 PM",
    pendingDeposit: 300.00,
  },
  {
    id: "EZT100247",
    name: "Olivia Martinez",
    phone: "+63 913 444 5555",
    email: "oliviamartinez@gmail.com",
    vipLevel: "VIP 1",
    deposited: 10.00,
    withdrawn: 0.00,
    earnings: 5.50,
    kycStatus: "Not Verified",
    status: "Inactive",
    registeredAt: "May 14, 2024 07:05 PM",
  },
  {
    id: "EZT100246",
    name: "Daniel Martinez",
    phone: "+63 926 123 4567",
    email: "danielmartinez@gmail.com",
    vipLevel: "VIP 2",
    deposited: 75.00,
    withdrawn: 20.00,
    earnings: 5.10,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 14, 2024 06:40 PM",
  },
  {
    id: "EZT100245",
    name: "Sophia Anderson",
    phone: "+63 927 987 6543",
    email: "sophiaanderson@gmail.com",
    vipLevel: "VIP 5",
    deposited: 1200.00,
    withdrawn: 450.00,
    earnings: 150.30,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 13, 2024 05:28 PM",
  },
  // Extra items for pagination demonstration
  {
    id: "EZT100244",
    name: "Liam Taylor",
    phone: "+63 930 111 2222",
    email: "liam.taylor@gmail.com",
    vipLevel: "VIP 2",
    deposited: 340.00,
    withdrawn: 140.00,
    earnings: 24.50,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 13, 2024 02:15 PM",
  },
  {
    id: "EZT100243",
    name: "Emma Wilson",
    phone: "+63 931 222 3333",
    email: "emma.wilson@gmail.com",
    vipLevel: "VIP 1",
    deposited: 50.00,
    withdrawn: 0.00,
    earnings: 2.10,
    kycStatus: "Not Verified",
    status: "Inactive",
    registeredAt: "May 12, 2024 11:30 AM",
  },
  {
    id: "EZT100242",
    name: "Lucas Jones",
    phone: "+63 932 333 4444",
    email: "lucas.jones@gmail.com",
    vipLevel: "VIP 3",
    deposited: 450.00,
    withdrawn: 200.00,
    earnings: 33.80,
    kycStatus: "Verified",
    status: "Active",
    registeredAt: "May 12, 2024 09:12 AM",
  }
];

const vipBadgeStyles: Record<string, string> = {
  "VIP 1": "bg-blue-glow/10 text-blue-glow border border-blue-glow/20",
  "VIP 2": "bg-purple-bright/10 text-purple-bright border border-purple-bright/20",
  "VIP 3": "bg-warning/10 text-warning border border-warning/20",
  "VIP 4": "bg-danger/10 text-danger border border-danger/20",
  "VIP 5": "bg-amber-400/10 text-amber-400 border border-amber-400/20",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");
  
  // Applied filters state (set only on clicking "Filter")
  const [filters, setFilters] = useState({
    search: "",
    vipLevel: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownUserId, setActiveDropdownUserId] = useState<string | null>(null);

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

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

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
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.04]"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-3.5 py-2 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.3)] hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)]"
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
      <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12 items-end">
          {/* Search bar */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-3 2xl:col-span-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3.5 pr-10 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
              />
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-muted-2" />
            </div>
          </div>

          {/* VIP Level filter */}
          <div className="xl:col-span-1 2xl:col-span-2">
            <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
              VIP Level
            </p>
            <div className="relative">
              <select
                value={vipLevel}
                onChange={(e) => setVipLevel(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="VIP 1">VIP 1</option>
                <option value="VIP 2">VIP 2</option>
                <option value="VIP 3">VIP 3</option>
                <option value="VIP 4">VIP 4</option>
                <option value="VIP 5">VIP 5</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
            </div>
          </div>

          {/* Status filter */}
          <div className="xl:col-span-1 2xl:col-span-2">
            <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
              Status
            </p>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-2" />
            </div>
          </div>

          {/* Registered At date picker */}
          <div className="xl:col-span-1 2xl:col-span-2">
            <p className="mb-1 text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
              Registered At
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Select date range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card-elevated pl-9 pr-3 text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition"
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-2" />
            </div>
          </div>

          {/* Filter / Reset actions */}
          <div className="flex items-center gap-2 lg:col-span-2 xl:col-span-1 2xl:col-span-2 w-full">
            <button
              type="button"
              onClick={handleFilter}
              className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright text-xs font-semibold text-white transition shadow-[0_4px_12px_rgba(123,44,255,0.25)]"
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] text-xs font-semibold text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
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
                <th className="pb-3.5 font-medium">VIP Level</th>
                <th className="pb-3.5 font-medium">Email / Phone</th>
                <th className="pb-3.5 font-medium">Total Assets</th>
                <th className="pb-3.5 font-medium">Deposit Request</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium">Registered At</th>
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
                            {user.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-white leading-normal">{user.name}</p>
                            <p className="text-[10px] text-muted-2 leading-none mt-0.5">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
                            vipBadgeStyles[user.vipLevel] || ""
                          }`}
                        >
                          {user.vipLevel}
                        </span>
                      </td>
                      <td className="py-3.5 text-muted-2">{user.email}</td>
                      <td className="py-3.5 font-semibold text-success">
                        ${(user.deposited - user.withdrawn + user.earnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5">
                        {user.pendingDeposit ? (
                          <span className="inline-flex rounded-md bg-warning/15 text-warning px-2.5 py-0.5 text-[10px] font-semibold">
                            Pending (${user.pendingDeposit.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                          </span>
                        ) : (
                          <span className="text-muted-2">-</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
                            user.status === "Active"
                              ? "bg-success/15 text-success"
                              : "bg-white/[0.06] text-muted-2"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-muted-2">{user.registeredAt}</td>
                      <td className="py-3.5 text-right pr-1 relative">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownUserId(
                                activeDropdownUserId === user.id ? null : user.id
                              );
                            }}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-card-elevated transition cursor-pointer ${
                              activeDropdownUserId === user.id
                                ? "border-purple-bright/50 text-white bg-purple/10"
                                : "border-border text-muted hover:text-white"
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

        {/* Table Footer / Pagination */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-2 border-t border-border/45 pt-4">
          <div>
            Showing {filteredUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
            <span className="text-white font-medium">
              {filteredUsers.length === initialUsers.length ? "100,254" : filteredUsers.length}
            </span>{" "}
            users
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:text-white transition disabled:opacity-40 disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-purple border-purple-bright/35 text-white shadow-[0_4px_12px_rgba(123,44,255,0.3)]"
                        : "border-border bg-card-elevated text-muted hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:text-white transition disabled:opacity-40 disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 rounded-lg border border-border bg-card-elevated pl-2.5 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-4 w-4 text-muted-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-2xl border border-border bg-card-elevated/95 px-5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300">
          <div className="flex items-center gap-2 border-r border-border/50 pr-4">
            <span className="h-2 w-2 rounded-full bg-purple animate-pulse" />
            <p className="text-xs font-semibold text-white">
              {selectedIds.length} {selectedIds.length === 1 ? "user" : "users"} selected
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-lg text-muted-2 hover:text-white transition cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-purple/10 text-purple-bright hover:bg-purple/20 transition cursor-pointer"
            >
              <span>⏸</span> Suspend
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer"
            >
              <span>🚫</span> Deactivate
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-purple-bright/10 text-purple-bright hover:bg-purple-bright/20 transition cursor-pointer"
            >
              <span>🗃️</span> Archive
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
