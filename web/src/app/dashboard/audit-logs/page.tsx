"use client";

import { useState, useMemo } from "react";
import { ScrollText, Download } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { initialAuditLogs } from "@/lib/mock-data/auditLogsData";
import { AuditLogsFilters } from "@/components/admin/audit-logs/AuditLogsFilters";
import { AuditLogsTable } from "@/components/admin/audit-logs/AuditLogsTable";

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    action: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredLogs = useMemo(() => {
    return initialAuditLogs.filter((log) => {
      const matchSearch =
        !filters.search ||
        log.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.resource.toLowerCase().includes(filters.search.toLowerCase());

      const matchAction = filters.action === "all" || log.action === filters.action;
      const matchStatus = filters.status === "all" || log.status === filters.status;

      return matchSearch && matchAction && matchStatus;
    });
  }, [filters]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const handleFilter = () => {
    setFilters({
      search,
      action,
      status,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setAction("all");
    setStatus("all");
    setDateRange("");
    setFilters({
      search: "",
      action: "all",
      status: "all",
    });
    setCurrentPage(1);
  };

  return (
    <AdminShell>
      {/* Top Header section */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          <ScrollText className="h-6 w-6 text-purple-bright" />
          Audit Logs
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
          <span>Dashboard</span>
          <span className="text-[10px] text-muted-2/65">&gt;</span>
          <span>Admin</span>
          <span className="text-[10px] text-muted-2/65">&gt;</span>
          <span className="text-purple-bright">Audit Logs</span>
        </p>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple-bright">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">System Activity Logs</h2>
              <p className="mt-0.5 text-xs text-muted-2">Monitor all admin and user actions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card-elevated px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.04] cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Filters */}
          <AuditLogsFilters
            search={search}
            setSearch={setSearch}
            action={action}
            setAction={setAction}
            status={status}
            setStatus={setStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onFilter={handleFilter}
            onReset={handleReset}
          />

          {/* Table */}
          <AuditLogsTable
            logs={filteredLogs}
            paginatedLogs={paginatedLogs}
            totalCount={initialAuditLogs.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    </AdminShell>
  );
}
