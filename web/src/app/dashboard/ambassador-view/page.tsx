"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { AmbassadorDashboard } from "@/components/referrals/AmbassadorDashboard";

export default function AmbassadorViewPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ambassador View
        </h1>
        <p className="mt-1.5 text-xs text-muted-2">
          (Preview of what an Ambassador sees when they log in)
        </p>
      </div>
      <AmbassadorDashboard />
    </AdminShell>
  );
}
