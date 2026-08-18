"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { webApi } from "@/lib/api";
import { Clock, Loader2, Save, Activity, Settings2, CheckCircle2, X } from "lucide-react";

export default function TradeSignalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tradesPerDay, setTradesPerDay] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [schedules, setSchedules] = useState<string[]>(["12:00"]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    webApi.get("/settings/trade")
      .then(data => {
        setTradesPerDay(data.trades_per_day || 1);
        setDurationMinutes(data.duration_minutes || 30);
        
        const dbSchedules = data.schedules || [];
        // Ensure there are enough schedule inputs based on tradesPerDay
        const newSchedules = Array(data.trades_per_day || 1).fill("12:00").map((def, i) => dbSchedules[i] || def);
        setSchedules(newSchedules);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleTradesPerDayChange = (val: number) => {
    setTradesPerDay(val);
    setSchedules(prev => {
      const newSchedules = [...prev];
      while (newSchedules.length < val) newSchedules.push("12:00");
      return newSchedules.slice(0, val);
    });
  };

  const handleScheduleChange = (index: number, val: string) => {
    setSchedules(prev => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await webApi.post("/settings/trade", {
        trades_per_day: tradesPerDay,
        duration_minutes: durationMinutes,
        schedules: schedules
      });
      setToastMessage("Trade Automation settings saved successfully!");
    } catch (e) {
      console.error(e);
      setToastMessage("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-bright" />
        </div>
      </AdminShell>
    );
  }

  const profitSplit = (100 / tradesPerDay).toFixed(0);

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Trade Automation</h1>
          <p className="mt-1.5 text-xs text-muted-2">
            Dashboard <span className="mx-1">&gt;</span> Settings <span className="mx-1">&gt;</span> Trade Automation
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(123,44,255,0.3)] transition hover:bg-purple-bright hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Configuration
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        
        {/* Main Configuration Form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple/20">
              <Settings2 className="h-5 w-5 text-purple-bright" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Global Rules</h2>
              <p className="text-xs text-muted-2">Configure how the automated trading system behaves.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Trades Per Day */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Trades Per Day</label>
              <p className="mb-3 text-xs text-muted-2">
                This dictates how many trade signals are sent out each day. The daily VIP profit limit is automatically divided by this number (e.g. {tradesPerDay} trades = {profitSplit}% yield per trade).
              </p>
              <input
                type="number"
                min="1"
                max="50"
                value={tradesPerDay}
                onChange={(e) => handleTradesPerDayChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full sm:w-1/2 rounded-xl border border-border bg-bg-deep/50 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-bright/50 focus:ring-1 focus:ring-purple-bright/50"
              />
            </div>

            {/* Code Duration */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Signal Validity Duration</label>
              <p className="mb-3 text-xs text-muted-2">
                How long (in minutes) will a trade signal remain valid after it is generated?
              </p>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full sm:w-1/2 appearance-none rounded-xl border border-border bg-bg-deep/50 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-bright/50 focus:ring-1 focus:ring-purple-bright/50"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
                <option value="360">6 Hours</option>
                <option value="1440">24 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Schedule</h2>
                <p className="text-xs text-muted-2">Set the exact time for each trade.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {schedules.map((time, idx) => (
                <div key={idx}>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Trade Signal {idx + 1}
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleScheduleChange(idx, e.target.value)}
                      className="w-full rounded-xl border border-border bg-bg-deep/50 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ffaa00]/20 bg-[#ffaa00]/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-[#ffaa00]" />
              <h3 className="font-semibold text-[#ffaa00] text-sm">Cron Job Required</h3>
            </div>
            <p className="text-xs text-muted-2 leading-relaxed">
              For this automated schedule to work, ensure your server is running the Laravel Task Scheduler. 
              Usually configured via cron: <code className="bg-black/20 px-1 py-0.5 rounded text-[#ffaa00]">* * * * * cd /path-to-project && php artisan schedule:run</code>
            </p>
          </div>
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
              className="ml-4 text-muted hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
