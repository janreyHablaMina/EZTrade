"use client";

import { useState } from "react";
import { Globe, DollarSign, Monitor, Sun, Moon } from "lucide-react";

type Theme = "Light" | "Dark" | "System";

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

export function PreferencesCard() {
  const [theme, setTheme] = useState<Theme>("Dark");
  const [dashboardOverview, setDashboardOverview] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [transactionEmails, setTransactionEmails] = useState(true);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white">Preferences</h2>
        <p className="mt-0.5 text-xs text-muted-2">Customize your experience and interface preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
        {/* Left column: Language, Currency, Theme */}
        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Language</label>
            <p className="mb-2.5 text-xs text-muted-2">Choose your preferred language</p>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2 z-10" />
              <select
                defaultValue="English"
                className="w-full appearance-none rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-8 text-sm text-white outline-none focus:border-purple-bright/50 transition cursor-pointer"
              >
                <option>English</option>
                <option>Filipino</option>
                <option>Spanish</option>
                <option>Japanese</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Currency</label>
            <p className="mb-2.5 text-xs text-muted-2">Choose your display currency</p>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2 z-10" />
              <select
                defaultValue="USDT"
                className="w-full appearance-none rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-8 text-sm text-white outline-none focus:border-purple-bright/50 transition cursor-pointer"
              >
                <option>USDT</option>
                <option>BTC</option>
                <option>ETH</option>
                <option>USD</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Theme</label>
            <p className="mb-2.5 text-xs text-muted-2">Choose your preferred theme</p>
            <div className="flex items-center gap-2">
              {(["Light", "Dark", "System"] as Theme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition cursor-pointer ${
                    theme === t
                      ? "bg-purple text-white shadow-[0_4px_12px_rgba(123,44,255,0.4)]"
                      : "border border-border bg-card-elevated text-muted hover:text-white"
                  }`}
                >
                  {t === "Light" && <Sun className="h-3.5 w-3.5" />}
                  {t === "Dark" && <Moon className="h-3.5 w-3.5" />}
                  {t === "System" && <Monitor className="h-3.5 w-3.5" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Notification toggles */}
        <div className="space-y-5 pt-1">
          {[
            {
              label: "Dashboard Overview",
              desc: "Show overview summary on dashboard",
              value: dashboardOverview,
              set: setDashboardOverview,
            },
            {
              label: "Email Notifications",
              desc: "Receive email updates and alerts",
              value: emailNotifications,
              set: setEmailNotifications,
            },
            {
              label: "Marketing Updates",
              desc: "Receive updates about promotions",
              value: marketingUpdates,
              set: setMarketingUpdates,
            },
            {
              label: "Transaction Emails",
              desc: "Receive emails for all transactions",
              value: transactionEmails,
              set: setTransactionEmails,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-muted-2">{item.desc}</p>
              </div>
              <Toggle enabled={item.value} onToggle={() => item.set(!item.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
