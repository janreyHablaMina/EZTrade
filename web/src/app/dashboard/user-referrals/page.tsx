"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { UserReferralDashboard } from "@/components/referrals/UserReferralDashboard";

export default function UserReferralsPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          User Referral View
        </h1>
        <p className="mt-1.5 text-xs text-muted-2">
          (Preview of what a standard User sees when they log in)
        </p>
      </div>
      <UserReferralDashboard />
    </AdminShell>
  );
}
