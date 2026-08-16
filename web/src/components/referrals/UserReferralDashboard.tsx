"use client";

import { KpiCard } from "@/components/admin/KpiCard";
import { Users, DollarSign, Gift, Link as LinkIcon, Share2, Copy, TrendingUp } from "lucide-react";

export function UserReferralDashboard() {
  // Mock data for the User view
  const userData = {
    name: "Michael Smith",
    referralCode: "MIKESMITH",
    referralLink: "https://eztrade.app/ref/MIKESMITH",
    totalDirectInvites: 5,
    totalDeposits: 5000.0,
    dailyReturn: 500.0, // 10% daily
    oneTimeCommissions: 250.0, // 10% of direct invite's initial deposit
    directInvites: [
      { id: "D1", name: "Alice B.", initialDeposit: 1000, joinDate: "May 19, 2024", commission: 100 },
      { id: "D2", name: "Bob C.", initialDeposit: 1500, joinDate: "May 20, 2024", commission: 150 },
    ]
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome & Link Section */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-elevated p-6 md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white">Referrals</h2>
          <p className="mt-1 text-sm text-muted-2">Invite friends and earn a one-time commission.</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-2">Your Referral Link</p>
          <div className="flex items-center gap-2 rounded-lg bg-bg-deep px-3 py-2 border border-white/[0.05]">
            <LinkIcon className="h-4 w-4 text-purple-bright" />
            <span className="text-sm font-mono text-white/90 select-all">{userData.referralLink}</span>
            <button className="ml-2 rounded-md p-1.5 hover:bg-white/10 text-muted-2 hover:text-white transition">
              <Copy className="h-4 w-4" />
            </button>
            <button className="rounded-md bg-purple/20 px-3 py-1.5 text-xs font-semibold text-purple-bright hover:bg-purple/30 transition">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Direct Invites"
          value={userData.totalDirectInvites.toString()}
          change="+2 this week"
          positive={true}
          icon={Users}
          iconClassName="text-sky-400"
        />
        <KpiCard
          label="Your Total Deposits"
          value={`$${userData.totalDeposits.toLocaleString()}`}
          change="Active"
          positive={true}
          icon={DollarSign}
          iconClassName="text-emerald-400"
        />
        <KpiCard
          label="Daily Return (10%)"
          value={`$${userData.dailyReturn.toLocaleString()}`}
          change="Distributed daily"
          positive={true}
          icon={TrendingUp}
          iconClassName="text-purple-bright"
        />
        <KpiCard
          label="One-Time Commissions"
          value={`$${userData.oneTimeCommissions.toLocaleString()}`}
          change="From direct invites"
          positive={true}
          icon={Gift}
          iconClassName="text-amber-400"
        />
      </div>

      {/* Direct Invites List */}
      <div className="rounded-xl border border-border bg-card-elevated shadow-sm overflow-hidden">
        <div className="border-b border-white/[0.05] p-5">
          <h3 className="text-sm font-semibold text-white">Your Direct Referrals</h3>
          <p className="mt-1 text-xs text-muted-2">Earn 10% one-time commission on their initial deposit.</p>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-bg-deep/50 text-xs font-medium text-muted-2">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3 text-right">Initial Deposit</th>
                <th className="px-5 py-3 text-right">Commission Earned (10%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {userData.directInvites.map((invite, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-4 flex items-center gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                      {invite.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-white">{invite.name}</span>
                      <span className="block text-[11px] text-muted-2">Joined {invite.joinDate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-medium text-emerald-400">${invite.initialDeposit.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-amber-400">
                    +${invite.commission.toLocaleString()}
                  </td>
                </tr>
              ))}
              {userData.directInvites.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-muted-2">
                    No direct invites yet. Share your link to start earning!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
