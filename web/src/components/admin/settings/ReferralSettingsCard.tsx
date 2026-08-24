"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, Save } from "lucide-react";
import { webApi } from "@/lib/api";

type ReferralProgram = {
  level_1_percent: number;
  level_2_percent: number;
  level_3_percent: number;
  flat_bonus_amount: number;
};

export function ReferralSettingsCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [controls, setControls] = useState<ReferralProgram>({
    level_1_percent: 5,
    level_2_percent: 3,
    level_3_percent: 1,
    flat_bonus_amount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    webApi.get("/settings/system").then((data) => {
      if (data.referral_program) {
        setControls(data.referral_program);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await webApi.post("/settings/system/referral_program", controls);
      if (onShowToast) onShowToast("Referral settings saved successfully");
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast("Failed to save referral settings");
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
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Referral Program</h2>
          <p className="text-sm text-muted-2">Configure default bonuses for multi-level referrals</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Level 1 Bonus (%)</label>
            <input
              type="number"
              value={controls.level_1_percent}
              onChange={(e) => setControls(c => ({ ...c, level_1_percent: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Level 2 Bonus (%)</label>
            <input
              type="number"
              value={controls.level_2_percent}
              onChange={(e) => setControls(c => ({ ...c, level_2_percent: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Level 3 Bonus (%)</label>
            <input
              type="number"
              value={controls.level_3_percent}
              onChange={(e) => setControls(c => ({ ...c, level_3_percent: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Flat Bonus Amount ($)</label>
            <input
              type="number"
              value={controls.flat_bonus_amount}
              onChange={(e) => setControls(c => ({ ...c, flat_bonus_amount: Number(e.target.value) }))}
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
            Save Referral Settings
          </button>
        </div>
      </div>
    </div>
  );
}
