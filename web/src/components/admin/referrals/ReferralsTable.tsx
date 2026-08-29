"use client";

import { useState } from "react";
import { TableActionsMenu, TableActionsMenuItem } from "@/components/admin/TableActionsMenu";
import { Eye } from "lucide-react";
import { type ReferralRecord, vipBadgeStyles } from "@/types/admin";
import { DataTable, ColumnDef } from "@/components/admin/table/DataTable";

const levelBadgeStyles: Record<string, string> = {
  "1": "bg-purple-bright/15 text-purple-bright border border-purple-bright/25",
  "2": "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  "3": "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
};

const commissionStatusBadgeStyles: Record<string, string> = {
  "Paid": "bg-success/15 text-success",
  "Pending": "bg-warning/15 text-warning",
};

type ReferralsTableProps = {
  referrals: ReferralRecord[];
  vipPlans?: any[];
  onViewDetails?: (referral: ReferralRecord) => void;
};

const PAGE_SIZES = [10, 20, 50];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-purple/40 text-purple-bright",
  "bg-sky-500/20 text-sky-400",
  "bg-teal-500/20 text-teal-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
];

function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function ReferralsTable({ referrals, vipPlans, onViewDetails }: ReferralsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginated = referrals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: ColumnDef<ReferralRecord>[] = [
    {
      header: "ID",
      cellClassName: "font-mono text-muted-2 text-[11px] pl-5",
      headerClassName: "pl-5",
      cell: (ref) => ref.id,
    },
    {
      header: "Referred User",
      width: "w-56",
      cell: (ref) => (
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(ref.userName)}`}
          >
            {getInitials(ref.userName)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{ref.userName}</p>
            <p className="text-[10px] text-muted-2 truncate">{ref.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "VIP Level",
      cell: (ref) => {
        const levelName = vipPlans?.find((p: any) => p.id.toString() === ref.vipLevel.toString())?.level || `VIP ${ref.vipLevel}`;
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${vipBadgeStyles[levelName] || 'bg-gray-500/20 text-gray-400'}`}
          >
            {levelName}
          </span>
        );
      },
    },
    {
      header: "Registered At",
      width: "w-32",
      cellClassName: "text-muted-2 text-[10px] leading-snug w-32",
      cell: (ref) => ref.registeredAt,
    },
    {
      header: "Total Deposited",
      cell: (ref) => (
        <span className="font-semibold text-emerald-400">
          ${ref.totalDeposited.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Total Earnings",
      cell: (ref) => (
        <span className="font-semibold text-emerald-400">
          ${ref.totalEarnings.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Your Commission",
      cell: (ref) => (
        <span className="font-semibold text-emerald-400">
          ${ref.yourCommission.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Commission Status",
      cell: (ref) => (
        ref.commissionStatus === "None" ? (
          <span className="text-muted-2 px-3">--</span>
        ) : (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${commissionStatusBadgeStyles[ref.commissionStatus]}`}
          >
            {ref.commissionStatus}
          </span>
        )
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-right pr-5",
      cellClassName: "text-right pr-5",
      cell: (ref) => (
        <TableActionsMenu estimatedHeight={120}>
          <TableActionsMenuItem icon="👁" label="View Details" onClick={() => onViewDetails?.(ref)} />
        </TableActionsMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={paginated}
      columns={columns}
      keyExtractor={(r) => r.id}
      totalCount={referrals.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemName="referrals"
      pageSizes={PAGE_SIZES}
      emptyStateMessage="No referrals found matching your filters."
    />
  );
}
