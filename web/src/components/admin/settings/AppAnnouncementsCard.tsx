"use client";

import { useState, useEffect } from "react";
import { Megaphone, Loader2, Save } from "lucide-react";
import { webApi } from "@/lib/api";

type AppAnnouncements = {
  banner_enabled: boolean;
  banner_text: string;
  support_email: string;
  telegram_link: string;
};

export function AppAnnouncementsCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [controls, setControls] = useState<AppAnnouncements>({
    banner_enabled: false,
    banner_text: "",
    support_email: "",
    telegram_link: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    webApi.get("/settings/system").then((data) => {
      if (data.app_announcements) {
        setControls(data.app_announcements);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await webApi.post("/settings/system/app_announcements", controls);
      if (onShowToast) onShowToast("App announcements saved successfully");
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-purple-bright" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border/50 px-6 py-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-bright/10 text-purple-bright">
          <Megaphone className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">App Announcements</h2>
          <p className="text-sm text-muted-2">Manage mobile app banners and contact info</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Enable App Banner</h3>
            <p className="text-sm text-muted-2">Show an announcement banner on the mobile home screen</p>
          </div>
          <button
            onClick={() => setControls(c => ({ ...c, banner_enabled: !c.banner_enabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              controls.banner_enabled ? 'bg-purple-bright' : 'bg-muted/30'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.banner_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Banner Text</label>
          <input
            type="text"
            value={controls.banner_text}
            onChange={(e) => setControls(c => ({ ...c, banner_text: e.target.value }))}
            disabled={!controls.banner_enabled}
            placeholder="e.g. ⚠️ OKX Maintenance happening tonight"
            className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Support Email</label>
            <input
              type="email"
              value={controls.support_email}
              onChange={(e) => setControls(c => ({ ...c, support_email: e.target.value }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Telegram Link</label>
            <input
              type="text"
              value={controls.telegram_link}
              onChange={(e) => setControls(c => ({ ...c, telegram_link: e.target.value }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-purple-bright px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-bright/90 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Announcements
          </button>
        </div>
      </div>
    </div>
  );
}
