"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { GeneralSettingsForm } from "@/components/admin/general-settings/GeneralSettingsForm";
import { AboutCard } from "@/components/admin/general-settings/AboutCard";
import { SecurityTipsCard } from "@/components/admin/general-settings/SecurityTipsCard";

export default function GeneralSettingsPage() {
  return (
    <AdminShell>
      <div className="pb-10">
        {/* Page Header */}
        <div className="mb-6 pt-2">
          <h1 className="text-xl font-bold text-white mb-2">General Settings</h1>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-2">
            <span>System Settings</span>
            <span className="text-muted-2/65">&gt;</span>
            <span className="text-purple-bright font-medium">General Settings</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Main Form (2 cols) */}
          <div className="lg:col-span-2">
            <GeneralSettingsForm />
          </div>

          {/* Right: Summary Cards (1 col) */}
          <div className="space-y-6">
            <AboutCard />
            <SecurityTipsCard />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
