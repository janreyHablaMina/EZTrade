import { useState } from "react";
import { Activity, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function TradeAutomationCard() {
  const [dailyTrades, setDailyTrades] = useState("5");
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-5 bg-card-elevated">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-bright">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Trade Automation settings</h2>
          <p className="mt-0.5 text-xs text-muted-2">
            Configure how many trades will automatically execute per day.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Automation Status</h3>
            <p className="text-xs text-muted-2 mt-1">Enable or disable automated trading bot.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAutomationEnabled(!isAutomationEnabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              isAutomationEnabled ? "bg-purple-bright" : "bg-bg-deep"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                isAutomationEnabled ? "translate-x-2" : "-translate-x-2"
              }`}
            />
          </button>
        </div>

        <div className="border-t border-border/50 pt-5">
          <label className="block text-sm font-semibold text-white mb-2">
            Daily Trade Limit
          </label>
          <p className="text-xs text-muted-2 mb-4">
            Set the maximum number of automated trades the system will perform in a single day.
          </p>
          <div className="max-w-xs">
            <Input
              type="number"
              value={dailyTrades}
              onChange={(e) => setDailyTrades(e.target.value)}
              placeholder="e.g. 5"
              disabled={!isAutomationEnabled}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-bg-deep/50 flex justify-end">
        <Button icon={<Save className="h-4 w-4" />}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
