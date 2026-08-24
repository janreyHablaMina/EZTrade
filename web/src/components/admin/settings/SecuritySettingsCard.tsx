"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Loader2, Save } from "lucide-react";
import { webApi } from "@/lib/api";

type SecurityKyc = {
  require_kyc_withdrawal: boolean;
};

export function SecuritySettingsCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [controls, setControls] = useState<SecurityKyc>({
    require_kyc_withdrawal: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    webApi.get("/settings/system").then((data) => {
      if (data.security_kyc) {
        setControls(data.security_kyc);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await webApi.post("/settings/system/security_kyc", controls);
      if (onShowToast) onShowToast("Security settings saved successfully");
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
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Security & KYC</h2>
          <p className="text-sm text-muted-2">Enforce KYC policies</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Require KYC for Withdrawals</h3>
            <p className="text-sm text-muted-2">Users must have a verified identity before withdrawing funds</p>
          </div>
          <button
            onClick={() => setControls(c => ({ ...c, require_kyc_withdrawal: !c.require_kyc_withdrawal }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              controls.require_kyc_withdrawal ? 'bg-purple-bright' : 'bg-muted/30'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.require_kyc_withdrawal ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-purple-bright px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-bright/90 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
}
