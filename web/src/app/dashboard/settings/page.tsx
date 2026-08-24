"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsTabs } from "@/components/admin/settings/SettingsTabs";
import { ProfileAccountCard } from "@/components/admin/settings/ProfileAccountCard";
import { TradeAutomationCard } from "@/components/admin/settings/TradeAutomationCard";
import { GeneralSettingsForm } from "@/components/admin/general-settings/GeneralSettingsForm";
import { AboutCard } from "@/components/admin/general-settings/AboutCard";
import { SecurityTipsCard } from "@/components/admin/general-settings/SecurityTipsCard";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile & Account");

  return (
    <AdminShell>
      <div className="pb-10">
        {/* Page Header */}
        <div className="flex items-center justify-between pt-6 pb-0">
          <div>
            <h1 className="text-xl font-bold text-white">System Settings</h1>
            <p className="mt-0.5 text-xs text-muted-2">
              Manage your account preferences and system configuration
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-border bg-card-elevated px-4 py-2.5 text-sm font-medium text-white hover:border-purple-bright/40 hover:bg-purple/5 transition cursor-pointer"
          >
            <Lock className="h-4 w-4 text-purple-bright" />
            Change Password
          </button>
        </div>

        {/* Tabs */}
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        {activeTab === "Trade Automation" ? (
          <div className="mt-6 max-w-2xl">
            <TradeAutomationCard />
          </div>
        ) : activeTab === "General Settings" ? (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GeneralSettingsForm />
            </div>
            <div className="space-y-5">
              <AboutCard />
              <SecurityTipsCard />
            </div>
          </div>
        ) : (
          <div className="mt-6 max-w-2xl">
            <ProfileAccountCard />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
