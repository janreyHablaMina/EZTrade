import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Crown, ShieldCheck, CreditCard, Activity, Pencil } from "lucide-react";
import type { UserRecord, RowStatus, KycStatus } from "@/lib/mock-data/usersData";
import { initialVipPlans } from "@/lib/mock-data/vipPlansData";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserRecord | null;
  onSave: (updatedUser: UserRecord) => void;
};

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<UserRecord | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof UserRecord, value: string) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
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
      
      <div className="relative z-10 w-full max-w-[550px] rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/50 p-5 bg-white/[0.01] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-bright border border-purple/20">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Edit User Details</h2>
              <p className="text-xs text-muted-2">Update information for ID: <span className="text-white">{formData.id}</span></p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-2 transition-colors hover:bg-white/10 hover:text-white cursor-pointer self-start"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Section 1: Personal Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-2 flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              Personal Information
            </h3>
            <div className="rounded-xl border border-border/50 bg-white/[0.01] p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-2">Full Name</label>
                <Input 
                  icon={<User className="h-4 w-4" />}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2">Email Address</label>
                  <Input 
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2">Phone Number</label>
                  <Input 
                    type="tel"
                    icon={<Phone className="h-4 w-4" />}
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 234 567 890"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account Settings */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-2 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Account Settings
            </h3>
            <div className="rounded-xl border border-border/50 bg-white/[0.01] p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2">VIP Level</label>
                  <Select 
                    value={formData.vipLevel}
                    onChange={(e) => handleChange("vipLevel", e.target.value)}
                  >
                    {initialVipPlans.map(plan => (
                      <option key={plan.id} value={plan.level}>{plan.level} - {plan.planName}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2">Role</label>
                  <Select 
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Ambassador">Ambassador</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2">Account Status</label>
                  <Select 
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value as RowStatus)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2">KYC Verification</label>
                  <Select 
                    value={formData.kycStatus}
                    onChange={(e) => handleChange("kycStatus", e.target.value as KycStatus)}
                  >
                    <option value="Verified">Verified</option>
                    <option value="Not Verified">Not Verified</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
