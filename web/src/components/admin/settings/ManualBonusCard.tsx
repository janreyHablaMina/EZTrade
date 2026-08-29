import { useState, useEffect } from "react";
import { Send, Clock, Loader2, Sparkles, CheckCircle2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { webApi } from "@/lib/api";

export function ManualBonusCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [profitPercentage, setProfitPercentage] = useState(50);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [messageTitle, setMessageTitle] = useState("Bonus Trading Signal Active!");
  const [messageContent, setMessageContent] = useState("🚨 SURPRISE BONUS! 🚨\n\n📅 Generated on: {dateStr}\n\nPaste this code in the Trade tab NOW to earn {profit}% of your VIP plan limit!\n\n🎟️ Code: {code}\n⏳ Expires in: {duration} minutes");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await webApi.get('/settings/system');
        if (data && data.bonus_automation) {
          const config = data.bonus_automation;
          setProfitPercentage(config.profit_percentage || 50);
          setDurationMinutes(config.duration_minutes || 60);
          setMessageTitle(config.message_title || "Bonus Trading Signal Active!");
          setMessageContent(config.message_content || "🚨 SURPRISE BONUS! 🚨\n\n📅 Generated on: {dateStr}\n\nPaste this code in the Trade tab NOW to earn {profit}% of your VIP plan limit!\n\n🎟️ Code: {code}\n⏳ Expires in: {duration} minutes");
        }
      } catch (error) {
        console.error("Failed to fetch bonus settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await webApi.post('/settings/system/bonus_automation', {
        profit_percentage: profitPercentage,
        duration_minutes: durationMinutes,
        message_title: messageTitle,
        message_content: messageContent
      });
      if (onShowToast) onShowToast("Bonus configuration saved successfully!");
    } catch (error: any) {
      console.error("Failed to save bonus config:", error);
      if (onShowToast) onShowToast(error.message || "Failed to save configuration");
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Manual Bonus Trading Code</h2>
          <p className="mt-0.5 text-xs text-muted-2">
            Instantly generate and broadcast a massive one-off bonus code to all users.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-8">


        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Profit Percentage (%)
            </label>
            <p className="text-xs text-muted-2 mb-4">
              What percentage of their VIP limit they will earn.
            </p>
            <Input
              type="number"
              min="1"
              max="1000"
              value={profitPercentage.toString()}
              onChange={(e) => setProfitPercentage(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Expiry Time (Minutes)
            </label>
            <p className="text-xs text-muted-2 mb-4">
              How long this code is valid for before it expires.
            </p>
            <Input
              type="number"
              min="1"
              value={durationMinutes.toString()}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 1)}
              icon={<Clock className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Dynamic Message Content */}
        <div className="pt-6 border-t border-border/50">
           <label className="block text-sm font-semibold text-white mb-2">
             Broadcast Message Template
           </label>
           <p className="text-xs text-muted-2 mb-4">
             This message will be instantly sent to all users globally. Use these exact placeholders:<br/>
             <span className="text-purple-bright font-mono">{'{code}'}</span> (Trading Code),{' '}
             <span className="text-purple-bright font-mono">{'{profit}'}</span> (Profit %),{' '}
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
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-muted mb-1">Message Content</label>
               <textarea
                 value={messageContent}
                 onChange={(e) => setMessageContent(e.target.value)}
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
          disabled={saving || profitPercentage <= 0 || durationMinutes <= 0}
          className="bg-purple-bright hover:bg-purple-bright/90 text-white"
        >
          {saving ? "Saving Configuration..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}
