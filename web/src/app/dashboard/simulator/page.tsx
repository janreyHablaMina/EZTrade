"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ReferralSimulator } from "@/components/referrals/ReferralSimulator";

export default function SimulatorPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Referral Flow Simulator
        </h1>
        <p className="mt-1.5 text-xs text-muted-2">
          Interactively test the revenue splits when adding new users to an Ambassador's downline.
        </p>
      </div>
      <ReferralSimulator />
    </AdminShell>
  );
}
