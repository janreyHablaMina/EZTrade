import { Eye, ShieldAlert, MonitorPlay, History } from "lucide-react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import type { AuditLogRecord } from "@/types/admin";

type AuditLogsTableProps = {
  logs: AuditLogRecord[];
  paginatedLogs: AuditLogRecord[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
};

export function AuditLogsTable({
  logs,
  paginatedLogs,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
}: AuditLogsTableProps) {
  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 font-medium w-40">Date &amp; Time</th>
              <th className="pb-3.5 font-medium">User / Admin</th>
              <th className="pb-3.5 font-medium">Action</th>
              <th className="pb-3.5 font-medium">Resource</th>
              <th className="pb-3.5 font-medium">IP Address</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium text-right pr-1">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/45 last:border-0 hover:bg-white/[0.015] transition group"
                >
                  <td className="py-3.5 pl-1 text-muted-2">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{log.timestamp.split(" ")[0]}</span>
                      <span className="text-[10px] mt-0.5">{log.timestamp.split(" ")[1]}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
                        {log.user.avatarInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-white leading-normal">{log.user.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] px-1.5 py-[1px] rounded-sm font-semibold tracking-wide ${
                            log.user.role.includes("Admin") 
                              ? "bg-amber-500/15 text-amber-500" 
                              : log.user.role === "System"
                              ? "bg-sky-500/15 text-sky-500"
                              : "bg-white/10 text-muted-2"
                          }`}>
                            {log.user.role}
                          </span>
                          <span className="text-[10px] text-muted-2 leading-none">{log.user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      {log.action.includes("Login") ? (
                        <MonitorPlay className="h-3.5 w-3.5 text-muted-2" />
                      ) : log.action.includes("Failed") ? (
                        <ShieldAlert className="h-3.5 w-3.5 text-danger" />
                      ) : (
                        <History className="h-3.5 w-3.5 text-muted-2" />
                      )}
                      <span className="font-medium text-white">{log.action}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-muted-2">{log.resource}</td>
                  <td className="py-3.5 font-mono text-[11px] text-muted-2">{log.ipAddress}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
                        log.status === "Success"
                          ? "bg-success/15 text-success"
                          : log.status === "Warning"
                          ? "bg-warning/15 text-warning"
                          : "bg-danger/15 text-danger"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card-elevated transition hover:border-purple-bright/50 hover:text-purple-bright text-muted-2"
                      title={log.details || "View details"}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-2">
                  No audit logs found matching your filters.
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
        itemName="logs"
        pageSizes={[10, 20, 50, 100]}
      />
    </div>
  );
}
