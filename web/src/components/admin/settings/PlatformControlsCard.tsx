"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, Loader2, Save } from "lucide-react";
import { webApi } from "@/lib/api";

type PlatformControls = {
  maintenance_mode: boolean;
  min_deposit: number;
  min_withdrawal: number;
  deposit_fee_percent: number;
  withdrawal_fee_percent: number;
};

export function PlatformControlsCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [controls, setControls] = useState<PlatformControls>({
    maintenance_mode: false,
    min_deposit: 10,
    min_withdrawal: 20,
    deposit_fee_percent: 0,
    withdrawal_fee_percent: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    webApi.get("/settings/system").then((data) => {
      if (data.platform_controls) {
        setControls(data.platform_controls);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await webApi.post("/settings/system/platform_controls", controls);
      if (onShowToast) onShowToast("Platform controls saved successfully");
      else alert("Platform controls saved!");
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast("Failed to save settings");
      else alert("Failed to save controls");
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
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Platform Controls</h2>
          <p className="text-sm text-muted-2">Manage fees, limits, and maintenance mode</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between rounded-xl border border-danger/20 bg-danger/5 p-4">
          <div>
            <h3 className="font-semibold text-danger">Maintenance Mode</h3>
            <p className="text-sm text-danger/80">Turn off user access to the platform</p>
          </div>
          <button
            onClick={() => setControls(c => ({ ...c, maintenance_mode: !c.maintenance_mode }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              controls.maintenance_mode ? 'bg-danger' : 'bg-muted/30'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Minimum Deposit ($)</label>
            <input
              type="number"
              value={controls.min_deposit}
              onChange={(e) => setControls(c => ({ ...c, min_deposit: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Minimum Withdrawal ($)</label>
            <input
              type="number"
              value={controls.min_withdrawal}
              onChange={(e) => setControls(c => ({ ...c, min_withdrawal: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Deposit Fee (%)</label>
            <input
              type="number"
              value={controls.deposit_fee_percent}
              onChange={(e) => setControls(c => ({ ...c, deposit_fee_percent: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Withdrawal Fee (%)</label>
            <input
              type="number"
              value={controls.withdrawal_fee_percent}
              onChange={(e) => setControls(c => ({ ...c, withdrawal_fee_percent: Number(e.target.value) }))}
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
            Save Platform Controls
          </button>
        </div>
      </div>
    </div>
  );
}
