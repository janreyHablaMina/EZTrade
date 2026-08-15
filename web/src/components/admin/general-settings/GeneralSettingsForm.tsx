"use client";

import { useState } from "react";
import { Globe, Clock, DollarSign, Calendar, UserCircle2, Edit3 } from "lucide-react";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        enabled ? "bg-purple" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between border-b border-border/50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 ring-1 ring-purple-bright/20">
            <Icon className="h-5 w-5 text-purple-bright" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-2">{description}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-white transition cursor-pointer">
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function DisabledSelect({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-muted">{label}</label>
      <div className="relative">
        <select disabled className="w-full appearance-none rounded-xl border border-border bg-card-elevated px-4 py-2.5 pr-8 text-sm text-white opacity-80 cursor-not-allowed">
          <option>{value}</option>
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-muted">{label}</label>
      <div className="rounded-xl border border-border bg-card-elevated px-4 py-2.5 text-sm text-white opacity-80">
        {value}
      </div>
    </div>
  );
}

export function GeneralSettingsForm() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <SettingsSection
        icon={Globe}
        title="Site Information"
        description="Manage the basic information of EZTRADE platform."
      >
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
          <ReadOnlyField label="Platform Name" value="EZTRADE" />
          <ReadOnlyField label="Support Email" value="support@eztrade.com" />
          <ReadOnlyField label="Contact Number" value="+63 912 345 6789" />
        </div>
      </SettingsSection>

      <SettingsSection
        icon={Globe}
        title="Timezone & Language"
        description="Configure your preferred timezone and language."
      >
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <DisabledSelect label="Timezone" value="(GMT+08:00) Asia/Manila" />
          <DisabledSelect label="Language" value="English" />
        </div>
      </SettingsSection>

      <SettingsSection
        icon={DollarSign}
        title="Currency Settings"
        description="Set your default currency and related preferences."
      >
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <DisabledSelect label="Default Currency" value="USDT (Tether)" />
          <DisabledSelect label="Currency Display Format" value="$1,234.56" />
        </div>
      </SettingsSection>

      <SettingsSection
        icon={Calendar}
        title="Date & Time Format"
        description="Choose how dates and times are displayed."
      >
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <DisabledSelect label="Date Format" value="May 18, 2024" />
          <DisabledSelect label="Time Format" value="10:45 AM (12-hour)" />
        </div>
      </SettingsSection>

      <SettingsSection
        icon={UserCircle2}
        title="Account Preferences"
        description="Manage general account preferences."
      >
        <div className="grid grid-cols-1 gap-8 p-5 sm:grid-cols-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Email Notifications</p>
              <p className="text-[11px] text-muted-2">Receive important updates via email</p>
            </div>
            <Toggle enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Marketing Updates</p>
              <p className="text-[11px] text-muted-2">Receive news and promotions</p>
            </div>
            <Toggle enabled={marketingUpdates} onToggle={() => setMarketingUpdates(!marketingUpdates)} />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
