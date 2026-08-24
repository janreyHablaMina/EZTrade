import { useState, useEffect } from "react";
import { Clock, Save, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { webApi } from "@/lib/api";

export function WithdrawalSettingsCard() {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await webApi.get('/settings/withdrawal');
        if (data) {
          setIsAutomationEnabled(data.is_enabled ?? false);
          setStartTime(data.start_time || "09:00");
          setEndTime(data.end_time || "17:00");
        }
      } catch (error) {
        console.error("Failed to fetch withdrawal settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await webApi.post('/settings/withdrawal', {
        is_enabled: isAutomationEnabled,
        start_time: startTime,
        end_time: endTime
      });
      // Optionally trigger a success toast here
    } catch (error) {
      console.error("Failed to save withdrawal settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-bright" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-5 bg-card-elevated">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-bright">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Withdrawal Time Limits</h2>
          <p className="mt-0.5 text-xs text-muted-2">
            Restrict user withdrawals to a specific time window.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Enforce Time Limits</h3>
            <p className="text-xs text-muted-2 mt-1">If disabled, users can withdraw 24/7.</p>
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-end pt-6 border-t border-border/50">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Start Time
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={!isAutomationEnabled}
              className="[&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
            />
          </div>
          
          <div className="hidden lg:flex items-center justify-center pb-3 px-2">
            <ArrowRight className="h-5 w-5 text-muted-2" />
          </div>

          <div className="hidden sm:flex lg:hidden items-center justify-center w-full col-span-2">
             <ArrowRight className="h-5 w-5 text-muted-2 rotate-90 sm:rotate-0" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              End Time
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={!isAutomationEnabled}
              className="[&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-bg-deep/50 flex justify-end">
        <Button 
          icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}
