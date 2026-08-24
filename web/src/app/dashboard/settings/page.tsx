"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Users, CreditCard, Activity, Lock, CheckCircle2, X, Download } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { TradeAutomationCard } from "@/components/admin/settings/TradeAutomationCard";
import { WithdrawalSettingsCard } from "@/components/admin/settings/WithdrawalSettingsCard";

import { PlatformControlsCard } from "@/components/admin/settings/PlatformControlsCard";
import { SecuritySettingsCard } from "@/components/admin/settings/SecuritySettingsCard";
import { AppAnnouncementsCard } from "@/components/admin/settings/AppAnnouncementsCard";
import { ReferralSettingsCard } from "@/components/admin/settings/ReferralSettingsCard";
import { AppReleaseCard } from "@/components/admin/settings/AppReleaseCard";

const TABS = [
  { id: "Platform Controls", icon: Settings },
  { id: "App Announcements", icon: Bell },
  { id: "App Release", icon: Download },
  { id: "Referral Program", icon: Users },
  { id: "Withdrawal Settings", icon: CreditCard },
  { id: "Trade Automation", icon: Activity },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Platform Controls");
  const [toastMessage, setToastMessage] = useState("");

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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
        </div>

        {/* Main Layout */}
        <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 border-r border-border/50 pr-4 hidden md:flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? "bg-purple-bright/10 text-purple-bright"
                      : "text-muted-2 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.id}
                </button>
              );
            })}
          </div>

          {/* Mobile Tabs Dropdown/Scroll (optional, keeping it simple as flex-row) */}
          <div className="w-full md:hidden flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-bright text-white"
                    : "bg-card border border-border text-muted-2"
                }`}
              >
                {tab.id}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            {activeTab === "Platform Controls" && <PlatformControlsCard onShowToast={setToastMessage} />}
            {activeTab === "App Announcements" && <AppAnnouncementsCard onShowToast={setToastMessage} />}
            {activeTab === "App Release" && <AppReleaseCard onShowToast={setToastMessage} />}
            {activeTab === "Referral Program" && <ReferralSettingsCard onShowToast={setToastMessage} />}
            {activeTab === "Withdrawal Settings" && <WithdrawalSettingsCard onShowToast={setToastMessage} />}
            {activeTab === "Trade Automation" && <TradeAutomationCard onShowToast={setToastMessage} />}
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-card p-4 shadow-[0_10px_40px_rgba(34,197,94,0.15)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Success</p>
                <p className="text-xs text-muted-2">{toastMessage}</p>
              </div>
              <button 
                onClick={() => setToastMessage("")}
                className="ml-4 text-muted hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
