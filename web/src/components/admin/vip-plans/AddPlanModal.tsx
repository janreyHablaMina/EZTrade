import { useState, useEffect } from "react";
import { X, Loader2, Crown, Settings2, CircleDollarSign } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type AddPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
};

export function AddPlanModal({ isOpen, onClose, onSave, initialData }: AddPlanModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    level: "",
    minDeposit: "",
    dailyProfitPercent: "",
    durationDays: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        level: initialData.level || "",
        minDeposit: initialData.minDeposit?.toString() || "",
        dailyProfitPercent: initialData.dailyProfitPercent?.toString() || "",
        durationDays: initialData.durationDays?.toString() || "",
      });
    } else if (isOpen) {
      setFormData({
        level: "",
        minDeposit: "",
        dailyProfitPercent: "",
        durationDays: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate network request
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isSaving ? onClose : undefined}
      />
      
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Premium subtle gradient header line */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-bright via-purple to-blue-glow/80" />
        
        <div className="flex items-center justify-between border-b border-border/60 p-6 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/15 text-purple-bright ring-1 ring-purple-bright/20 shadow-[0_0_15px_rgba(123,44,255,0.15)]">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">{initialData ? "Edit VIP Plan Configuration" : "Create New VIP Plan"}</h2>
              <p className="text-xs text-muted-2 mt-0.5">Configure the tiers and earning potential for users.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={!isSaving ? onClose : undefined}
            disabled={isSaving}
            className="rounded-lg p-2 text-muted-2 transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="flex flex-col p-6 gap-8" onSubmit={handleSubmit}>
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Settings2 className="h-4 w-4 text-muted-2" />
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">Basic Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-2 uppercase tracking-wider ml-1">Plan Level / Badge</label>
                <Input 
                  placeholder="e.g. VIP 1" 
                  required 
                  disabled={isSaving}
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="bg-black/20 focus:bg-card focus:ring-purple/50 border-border/60"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-2 uppercase tracking-wider ml-1">Duration (Days)</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="30" 
                    required 
                    disabled={isSaving}
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="bg-black/20 focus:bg-card focus:ring-purple/50 border-border/60 pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-2">Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <CircleDollarSign className="h-4 w-4 text-muted-2" />
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">Financial Settings</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-2 block text-xs font-semibold text-muted-2 uppercase tracking-wider ml-1">Deposit Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-2">$</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    required 
                    disabled={isSaving}
                    value={formData.minDeposit}
                    onChange={(e) => setFormData({ ...formData, minDeposit: e.target.value })}
                    className="bg-black/20 focus:bg-card focus:ring-purple/50 border-border/60 pl-8"
                  />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-2 block text-xs font-semibold text-muted-2 uppercase tracking-wider ml-1">Daily Profit</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="1.50" 
                    required 
                    disabled={isSaving}
                    value={formData.dailyProfitPercent}
                    onChange={(e) => setFormData({ ...formData, dailyProfitPercent: e.target.value })}
                    className="bg-black/20 focus:bg-card focus:ring-purple/50 border-border/60 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-2">%</span>
                </div>
                <p className="mt-1.5 ml-1 text-[10px] text-muted-2/80">Percentage earned on deposit amount per day.</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex items-center justify-end gap-3 pt-6 border-t border-border/50">
            <Button variant="outline" onClick={onClose} type="button" disabled={isSaving} className="px-5 font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="px-6 font-semibold bg-purple hover:bg-purple-bright shadow-[0_0_15px_rgba(123,44,255,0.3)]">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving Plan..." : (initialData ? "Update Plan" : "Create Plan")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
