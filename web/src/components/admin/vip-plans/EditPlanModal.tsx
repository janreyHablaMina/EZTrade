import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { VipPlan } from "@/lib/mock-data/vipPlansData";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type EditPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: VipPlan | null;
  onSave: (updatedPlan: VipPlan) => void;
};

export function EditPlanModal({ isOpen, onClose, plan, onSave }: EditPlanModalProps) {
  const [formData, setFormData] = useState<VipPlan | null>(null);

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
  }, [plan]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof VipPlan, value: string | number | boolean) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleReferralChange = (level: "level1" | "level2" | "level3", value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        referralBonus: {
          ...prev.referralBonus,
          [level]: numValue,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-white">Edit VIP Plan - {formData.level}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-2">Plan Name</label>
              <Input 
                value={formData.planName}
                onChange={(e) => handleChange("planName", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-2">Status</label>
              <Select 
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-2">Min Deposit (USDT)</label>
              <Input 
                type="number"
                value={formData.minDeposit}
                onChange={(e) => handleChange("minDeposit", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-2">Max Deposit (USDT)</label>
              <Input 
                type="text"
                value={formData.maxDeposit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.toLowerCase() === "unlimited") {
                    handleChange("maxDeposit", "Unlimited");
                  } else {
                    handleChange("maxDeposit", parseFloat(val) || 0);
                  }
                }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-2">Daily Profit (%)</label>
              <Input 
                type="number"
                step="0.1"
                value={formData.dailyProfitPercent}
                onChange={(e) => handleChange("dailyProfitPercent", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-2">Duration (Days)</label>
              <Input 
                type="number"
                value={formData.durationDays}
                onChange={(e) => handleChange("durationDays", parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.05] p-4 bg-white/[0.02]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-2 mb-3">Referral Bonuses (%)</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-2 text-center">Level 1</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={formData.referralBonus?.level1 || 0}
                  onChange={(e) => handleReferralChange("level1", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-2 text-center">Level 2</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={formData.referralBonus?.level2 || 0}
                  onChange={(e) => handleReferralChange("level2", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-2 text-center">Level 3</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={formData.referralBonus?.level3 || 0}
                  onChange={(e) => handleReferralChange("level3", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
