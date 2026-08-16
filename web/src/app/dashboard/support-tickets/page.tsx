"use client";

import { useState, useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Ticket, MailOpen, Clock, CheckCircle, XCircle, Download, Plus } from "lucide-react";
import { initialTickets, type TicketRecord } from "@/lib/mock-data/supportData";
import { SupportFilters } from "@/components/admin/support/SupportFilters";
import { SupportTable } from "@/components/admin/support/SupportTable";
import { TicketDetails } from "@/components/admin/support/TicketDetails";

export default function SupportTicketsPage() {
  const [tickets] = useState<TicketRecord[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(initialTickets[0]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.userName.toLowerCase().includes(search.toLowerCase()) ||
        t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || t.status === status;
      const matchesPriority = priority === "all" || t.priority === priority;
      const matchesCategory = category === "all" || t.category === category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, search, status, priority, category]);

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategory("all");
    setDateRange("");
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Support Tickets</h1>
            <p className="mt-1.5 text-xs text-muted-2">
              Dashboard <span className="mx-1">&gt;</span> Support Tickets
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-purple hover:bg-purple-bright px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(123,44,255,0.25)] transition">
              <Plus className="h-3.5 w-3.5" />
              New Ticket
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Total Tickets" value="1,248" change="+18.6%" positive={true} icon={Ticket} iconClassName="text-purple-bright" />
          <KpiCard label="Open Tickets" value="342" change="+14.2%" positive={true} icon={MailOpen} iconClassName="text-blue-400" />
          <KpiCard label="Pending Tickets" value="168" change="+9.7%" positive={true} icon={Clock} iconClassName="text-amber-400" />
          <KpiCard label="Resolved Tickets" value="672" change="+21.3%" positive={true} icon={CheckCircle} iconClassName="text-emerald-400" />
          <KpiCard label="Closed Tickets" value="66" change="-8.4%" positive={false} icon={XCircle} iconClassName="text-red-400" />
        </div>

        {/* Filters */}
        <SupportFilters
          search={search} setSearch={setSearch}
          status={status} setStatus={setStatus}
          priority={priority} setPriority={setPriority}
          category={category} setCategory={setCategory}
          dateRange={dateRange} setDateRange={setDateRange}
          onFilter={() => {}}
          onReset={handleReset}
        />

        {/* Table + Details Panel */}
        <div className={`mt-5 grid gap-5 ${selectedTicket ? "grid-cols-1 xl:grid-cols-[1fr_400px]" : "grid-cols-1"}`}>
          <SupportTable
            tickets={filteredTickets}
            selectedId={selectedTicket?.id ?? null}
            onSelect={(ticket) => setSelectedTicket(ticket)}
          />
          {selectedTicket && (
            <div className="h-[700px] xl:sticky xl:top-5">
              <TicketDetails
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
              />
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
