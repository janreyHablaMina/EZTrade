"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, CheckCircle2, Users, Network, Mail, Phone, Calendar, ShieldAlert } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { webApi } from "@/lib/api";
import { type UserRecord } from "@/types/admin";

export default function AmbassadorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ambassadorId = params.id as string;
  const [ambassador, setAmbassador] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for the UI layout
  const mockFinancials = {
    downlineRevenue: 125000.00,
    grossCut: 6250.00,
    minusBonuses: 1250.00,
    netEarnings: 5000.00
  };

  useEffect(() => {
    // We mock fetching the ambassador here. Later we'll connect it to real API.
    setAmbassador({
      id: ambassadorId,
      dbId: 1,
      name: "Melvin James",
      email: "melvin@gmail.com",
      phone: "N/A",
      vipLevel: "None",
      role: "Ambassador",
      deposited: 0,
      withdrawn: 0,
      earnings: 0,
      kycStatus: "Not Verified",
      status: "Active",
      teamSize: 1240,
      referralCode: "8XERI11R",
      registeredAt: "Aug 18, 2026, 06:34 PM",
      pendingDeposit: 0,
      downlineCount: 1240,
      totalDownlineAssets: 125000,
      dailyEarnings: 6250
    } as UserRecord);
    setIsLoading(false);
  }, [ambassadorId]);

  return (
    <AdminShell>
      <div className="mx-auto flex flex-col gap-6">
        {/* Header & Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-xs font-medium text-muted hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple/15 text-lg font-semibold text-purple-bright ring-1 ring-purple-bright/20 shrink-0">
              {ambassador?.name.split(" ").map((p) => p[0]).join("").slice(0, 2) || "A"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                {ambassador?.name || "Ambassador Details"}
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Ambassador
                </span>
              </h1>
              <p className="mt-1 text-xs text-muted-2">
                UID: {ambassadorId.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Breakdown KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Downline Revenue"
            value={`$${mockFinancials.downlineRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Total volume from network"
            icon={Wallet}
          />
          <KpiCard
            label="Gross Cut (5%)"
            value={`+$${mockFinancials.grossCut.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Standard 5% commission"
            icon={TrendingUp}
            iconClassName="text-emerald-400"
          />
          <KpiCard
            label="Minus Bonuses"
            value={`-$${mockFinancials.minusBonuses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Paid to referrers"
            icon={AlertCircle}
            iconClassName="text-danger"
          />
          <KpiCard
            label="Net Pay"
            value={`$${mockFinancials.netEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Final cleared earnings"
            icon={CheckCircle2}
            iconClassName="text-purple-bright"
          />
        </div>

        {/* Profile Details section from ViewUserModal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contact Info */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Contact Information
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-2">Email Address</p>
                <p className="text-sm font-medium text-white truncate">{ambassador?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Phone Number</p>
                <p className="text-sm font-medium text-white">{ambassador?.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Joined Date</p>
                <p className="text-sm font-medium text-white">{ambassador?.registeredAt}</p>
              </div>
            </div>
          </div>

          {/* Security & Verification */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Security & Verification
            </h4>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                ambassador?.kycStatus === "Verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>
                {ambassador?.kycStatus === "Verified" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-[10px] text-muted-2">KYC Status</p>
                <p className={`text-sm font-medium ${ambassador?.kycStatus === "Verified" ? "text-white" : "text-warning"}`}>
                  {ambassador?.kycStatus}
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <button className="w-full rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-xs font-medium text-white transition hover:bg-white/[0.04]">
                Request Additional Docs
              </button>
            </div>
          </div>

          {/* Network Details */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Network & Referrals
            </h4>
            <div className="flex flex-col gap-4 mt-1">
              <div>
                <p className="text-[10px] text-muted-2 mb-1">Referral Code</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white font-mono">{ambassador?.referralCode}</p>
                  <button className="text-[10px] text-purple-bright hover:text-white transition">Copy</button>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-2 mb-1">Total Team Size</p>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-2" />
                  {ambassador?.teamSize?.toLocaleString()} Members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for actual downline table */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
             <h3 className="text-sm font-semibold text-white flex items-center gap-2">
               <Network className="h-4 w-4 text-purple-bright" /> Downline Network
             </h3>
          </div>
          <div className="py-12 text-center">
            <p className="text-sm text-muted-2">Network list and detailed deduction logs will appear here.</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
