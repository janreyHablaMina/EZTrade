import { useState, useEffect } from "react";
import { Activity, Save, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { webApi } from "@/lib/api";

export function TradeAutomationCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [tradesPerDay, setTradesPerDay] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [schedules, setSchedules] = useState<string[]>(["12:00"]);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
  const [messageTitle, setMessageTitle] = useState("New Trading Signal Active!");
  const [messageContent, setMessageContent] = useState("🚨 New Trading Code Available! 🚨\n\n📅 Generated on: {dateStr}\n\nHurry! Paste this code in the Trade tab to earn {profit}% of your VIP plan limit.\n\n🎟️ Code: {code}\n⏳ Expires in: {duration} minutes");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await webApi.get('/settings/trade');
        if (data) {
          setTradesPerDay(data.trades_per_day || 1);
          setDurationMinutes(data.duration_minutes || 30);
          setSchedules(data.schedules || ["12:00"]);
          if (data.message_title) setMessageTitle(data.message_title);
          if (data.message_content) setMessageContent(data.message_content);
        }
      } catch (error) {
        console.error("Failed to fetch trade settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleTradesPerDayChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) {
      setTradesPerDay(1);
      setSchedules(["12:00"]);
      return;
    }
    
    setTradesPerDay(num);
    
    // Adjust schedules array length
    setSchedules(prev => {
      if (prev.length === num) return prev;
      if (prev.length > num) return prev.slice(0, num);
      
      const newSchedules = [...prev];
      for (let i = prev.length; i < num; i++) {
        // Default new schedules to something like 12:00
        newSchedules.push("12:00");
      }
      return newSchedules;
    });
  };

  const handleScheduleChange = (index: number, val: string) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[index] = val;
      return newSchedules;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await webApi.post('/settings/trade', {
        trades_per_day: tradesPerDay,
        duration_minutes: durationMinutes,
        schedules: schedules,
        message_title: messageTitle,
        message_content: messageContent
      });
      if (onShowToast) onShowToast("Trade automation settings saved successfully");
    } catch (error) {
      console.error("Failed to save trade settings:", error);
      if (onShowToast) onShowToast("Failed to save settings");
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
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-5 bg-card-elevated">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-bright">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Trade Automation Configuration</h2>
          <p className="mt-0.5 text-xs text-muted-2">
            Configure how many trades execute per day, their exact times, and trade duration.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-8">
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

        <div className="grid gap-6 sm:grid-cols-2 pt-6 border-t border-border/50">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Trades Per Day
            </label>
            <p className="text-xs text-muted-2 mb-4">
              How many automated trades will execute daily.
            </p>
            <Input
              type="number"
              min="1"
              max="24"
              value={tradesPerDay.toString()}
              onChange={(e) => handleTradesPerDayChange(e.target.value)}
              disabled={!isAutomationEnabled}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Trade Duration (Minutes)
            </label>
            <p className="text-xs text-muted-2 mb-4">
              How long each trade session lasts before finishing.
            </p>
            <Input
              type="number"
              min="1"
              value={durationMinutes.toString()}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 1)}
              disabled={!isAutomationEnabled}
              icon={<Clock className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Dynamic Schedules */}
        <div className="pt-6 border-t border-border/50">
           <label className="block text-sm font-semibold text-white mb-4">
             Auto-Send Message Schedule (Server Time)
           </label>
           
           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
             {schedules.map((time, index) => (
               <div key={index} className="flex flex-col gap-1">
                 <span className="text-xs font-medium text-muted">Auto-Send Time {index + 1}</span>
                   <Input
                     type="time"
                     value={time}
                     onChange={(e) => handleScheduleChange(index, e.target.value)}
                     disabled={!isAutomationEnabled}
                     className="[&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                   />
               </div>
             ))}
           </div>
        </div>

        {/* Dynamic Message Content */}
        <div className="pt-6 border-t border-border/50">
           <label className="block text-sm font-semibold text-white mb-2">
             Announcement Template
           </label>
           <p className="text-xs text-muted-2 mb-4">
             Customize the message sent for automated trading codes. Use these exact placeholders in your text to inject the real values:<br/>
             <span className="text-purple-bright font-mono">{'{code}'}</span> (Trading Code),{' '}
             <span className="text-purple-bright font-mono">{'{profit}'}</span> (Profit % limit),{' '}
             <span className="text-purple-bright font-mono">{'{duration}'}</span> (Expiry Minutes),{' '}
             <span className="text-purple-bright font-mono">{'{dateStr}'}</span> (Current Date)
           </p>
           
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-medium text-muted mb-1">Message Title</label>
               <Input
                 type="text"
                 value={messageTitle}
                 onChange={(e) => setMessageTitle(e.target.value)}
                 disabled={!isAutomationEnabled}
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-muted mb-1">Message Content</label>
               <textarea
                 value={messageContent}
                 onChange={(e) => setMessageContent(e.target.value)}
                 disabled={!isAutomationEnabled}
                 rows={6}
                 className="w-full bg-bg-deep border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-bright/50 transition-colors resize-none disabled:opacity-50"
               />
             </div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-bg-deep/50 flex justify-end">
        <Button 
          icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={!isAutomationEnabled || saving}
        >
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}
