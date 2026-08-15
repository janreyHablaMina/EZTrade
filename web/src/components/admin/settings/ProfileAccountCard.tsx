"use client";

import { User, AtSign, Mail, Globe, Phone, Clock } from "lucide-react";

const COUNTRIES = ["Philippines", "United States", "Singapore", "Malaysia", "Indonesia", "Thailand", "Vietnam", "Japan", "South Korea", "Australia"];
const TIMEZONES = ["(GMT+08:00) Asia/Manila", "(GMT+00:00) UTC", "(GMT+08:00) Asia/Singapore", "(GMT+09:00) Asia/Tokyo", "(GMT-05:00) America/New_York", "(GMT-08:00) America/Los_Angeles"];

export function ProfileAccountCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white">Profile & Account</h2>
        <p className="mt-0.5 text-xs text-muted-2">Manage your personal information and account details.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted-2 outline-none focus:border-purple-bright/50 transition"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted">Username</label>
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              type="text"
              defaultValue="johndoe_123"
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted-2 outline-none focus:border-purple-bright/50 transition"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              type="email"
              defaultValue="john.doe@email.com"
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted-2 outline-none focus:border-purple-bright/50 transition"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted">Country</label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2 z-10" />
            <select
              defaultValue="Philippines"
              className="w-full appearance-none rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-8 text-sm text-white outline-none focus:border-purple-bright/50 transition cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              type="tel"
              defaultValue="+63 912 345 6789"
              className="w-full rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted-2 outline-none focus:border-purple-bright/50 transition"
            />
          </div>
        </div>

        {/* Time Zone */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted">Time Zone</label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2 z-10" />
            <select
              defaultValue="(GMT+08:00) Asia/Manila"
              className="w-full appearance-none rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-8 text-sm text-white outline-none focus:border-purple-bright/50 transition cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          type="button"
          className="rounded-xl bg-purple px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(123,44,255,0.4)] hover:bg-purple/90 transition cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
