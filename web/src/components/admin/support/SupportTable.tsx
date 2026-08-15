"use client";

import { Eye, MoreHorizontal, ArrowDownToLine, Crown, Share2, Shield, Wrench, ArrowLeftRight, FileCheck } from "lucide-react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import type { TicketRecord } from "./supportData";
import { priorityBadgeStyles, statusBadgeStyles, categoryIconColors } from "./supportData";
import { useState } from "react";

type SupportTableProps = {
  tickets: TicketRecord[];
  selectedId: string | null;
  onSelect: (ticket: TicketRecord) => void;
};

const PAGE_SIZES = [10, 20, 50];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-purple/40 text-purple-bright",
  "bg-sky-500/20 text-sky-400",
  "bg-teal-500/20 text-teal-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function CategoryIcon({ category }: { category: string }) {
  const cls = `h-3.5 w-3.5 ${categoryIconColors[category] ?? "text-muted-2"}`;
  switch (category) {
    case "Withdrawals": return <ArrowDownToLine className={cls} style={{ transform: "scaleY(-1)" }} />;
    case "Deposits": return <ArrowDownToLine className={cls} />;
    case "VIP Plans": return <Crown className={cls} />;
    case "Referrals": return <Share2 className={cls} />;
    case "Account": return <Shield className={cls} />;
    case "Technical": return <Wrench className={cls} />;
    case "Transactions": return <ArrowLeftRight className={cls} />;
    case "KYC": return <FileCheck className={cls} />;
    default: return null;
  }
}

export function SupportTable({ tickets, selectedId, onSelect }: SupportTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const paginated = tickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs" style={{ minWidth: "800px" }}>
          <thead>
            <tr className="border-b border-border/50 bg-white/[0.02] text-left text-muted">
              <th className="pb-3.5 pl-5 pt-4 font-medium">Ticket ID</th>
              <th className="pb-3.5 pt-4 font-medium w-44">User</th>
              <th className="pb-3.5 pt-4 font-medium">Subject</th>
              <th className="pb-3.5 pt-4 font-medium">Category</th>
              <th className="pb-3.5 pt-4 font-medium">Priority</th>
              <th className="pb-3.5 pt-4 font-medium">Status</th>
              <th className="pb-3.5 pt-4 font-medium w-32">Last Update</th>
              <th className="pb-3.5 pr-5 pt-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginated.length > 0 ? (
              paginated.map((ticket, index) => {
                const isSelected = selectedId === ticket.id;
                const isBottomRow = index >= paginated.length - 3 && paginated.length > 3;
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelect(ticket)}
                    className={`group transition-colors cursor-pointer ${isSelected ? "bg-purple/[0.08] hover:bg-purple/[0.10]" : "hover:bg-white/[0.025]"}`}
                  >
                    {/* Ticket ID */}
                    <td className="py-3.5 pl-5 font-mono text-muted-2 text-[11px]">{ticket.id}</td>

                    {/* User */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${avatarColor(ticket.userName)}`}>
                          {getInitials(ticket.userName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate text-[11px]">{ticket.userName}</p>
                          <p className="text-[10px] text-muted-2 truncate">{ticket.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 max-w-[220px]">
                      <p className="font-medium text-white text-[11px] truncate">{ticket.subjectTitle}</p>
                      <p className="text-[10px] text-muted-2 truncate">{ticket.subjectSummary}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon category={ticket.category} />
                        <span className="text-muted font-medium">{ticket.category}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${priorityBadgeStyles[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusBadgeStyles[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>

                    {/* Last Update */}
                    <td className="py-3.5 text-muted-2 text-[10px] leading-snug w-32">{ticket.lastUpdate}</td>

                    {/* Actions */}
                    <td className="py-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelect(ticket)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveDropdownId(activeDropdownId === ticket.id ? null : ticket.id)}
                            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition cursor-pointer"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                          {activeDropdownId === ticket.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId(null)} />
                              <div className={`absolute right-0 z-50 w-44 rounded-xl border border-border bg-card shadow-xl p-1.5 backdrop-blur-xl ${isBottomRow ? "bottom-full mb-1" : "top-full mt-1"}`}>
                                <button onClick={() => setActiveDropdownId(null)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer font-medium">
                                  View Details
                                </button>
                                <button onClick={() => setActiveDropdownId(null)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer font-medium">
                                  Mark as Resolved
                                </button>
                                <button onClick={() => setActiveDropdownId(null)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition cursor-pointer font-medium">
                                  Close Ticket
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-2">No tickets found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={tickets.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="tickets"
        pageSizes={PAGE_SIZES}
      />
    </div>
  );
}
