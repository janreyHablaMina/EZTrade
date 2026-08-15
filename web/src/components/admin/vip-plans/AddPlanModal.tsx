import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
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
    maxDeposit: "",
    dailyProfitPercent: "",
    durationDays: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        level: initialData.level || "",
        minDeposit: initialData.minDeposit?.toString() || "",
        maxDeposit: initialData.maxDeposit?.toString() || "",
        dailyProfitPercent: initialData.dailyProfitPercent?.toString() || "",
        durationDays: initialData.durationDays?.toString() || "",
      });
    } else if (isOpen) {
      setFormData({
        level: "",
        minDeposit: "",
        maxDeposit: "",
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
      
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-white">{initialData ? "Edit VIP Plan" : "Add New VIP Plan"}</h2>
          <button
            type="button"
            onClick={!isSaving ? onClose : undefined}
            disabled={isSaving}
            className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="flex flex-col gap-5 p-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-2 ml-1">Level (Badge Text)</label>
            <Input 
              placeholder="e.g. VIP 1" 
              required 
              disabled={isSaving}
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-2 ml-1">Min Deposit (USDT)</label>
              <Input 
                type="number" 
                placeholder="0" 
                required 
                disabled={isSaving}
                value={formData.minDeposit}
                onChange={(e) => setFormData({ ...formData, minDeposit: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-2 ml-1">Max Deposit (USDT)</label>
              <Input 
                type="number" 
                placeholder="1000" 
                required 
                disabled={isSaving}
                value={formData.maxDeposit}
                onChange={(e) => setFormData({ ...formData, maxDeposit: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-2 ml-1">Daily Profit (%)</label>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="1.5" 
                required 
                disabled={isSaving}
                value={formData.dailyProfitPercent}
                onChange={(e) => setFormData({ ...formData, dailyProfitPercent: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-2 ml-1">Duration (Days)</label>
              <Input 
                type="number" 
                placeholder="30" 
                required 
                disabled={isSaving}
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-5">
            <Button variant="outline" onClick={onClose} type="button" disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
