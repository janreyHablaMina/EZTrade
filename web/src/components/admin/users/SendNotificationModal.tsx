import { useState } from "react";
import { X, Send, Bell } from "lucide-react";
import type { UserRecord } from "@/types/admin";import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type SendNotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserRecord | null;
  onSend: (notification: { title: string; message: string; type: string }) => void;
};

export function SendNotificationModal({ isOpen, onClose, user, onSend }: SendNotificationModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !user) return null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate network delay
    setTimeout(() => {
      onSend(formData);
      setIsSending(false);
      setFormData({ title: "", message: "", type: "info" });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/50 p-5 bg-white/[0.01] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-bright border border-purple/20">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Send Notification</h2>
              <p className="text-xs text-muted-2">To: <span className="text-white font-medium">{user.name}</span> ({user.id})</p>
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

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-2">Notification Type</label>
            <Select 
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="info">System Info</option>
              <option value="warning">Account Warning</option>
              <option value="success">Success Alert</option>
              <option value="promotion">Promotional Offer</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-2">Title</label>
            <Input 
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. KYC Verification Approved"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-2">Message Content</label>
            <textarea
              className="w-full rounded-xl border border-border bg-card-elevated p-3 text-sm text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition min-h-[120px] resize-none"
              placeholder="Type your notification message here..."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50 mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]" disabled={isSending}>
              {isSending ? "Sending..." : (
                <>
                  <Send className="h-4 w-4 mr-1.5" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
