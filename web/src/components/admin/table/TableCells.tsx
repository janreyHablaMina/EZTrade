import { ReactNode } from "react";
import { Copy } from "lucide-react";

export function UserCell({ name, email, avatarInitials }: { name: string; email: string; avatarInitials?: string }) {
  const initials = avatarInitials || name.substring(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-sky-500/20 border border-white/5 font-semibold text-purple-bright shrink-0 shadow-inner">
        {initials}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-white truncate">{name}</span>
        <span className="text-[10px] text-muted-2 truncate">{email}</span>
      </div>
    </div>
  );
}

export function StatusBadgeCell({ status, styles }: { status: string; styles: Record<string, string> }) {
  const defaultStyle = "bg-gray-500/20 text-gray-400";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${styles[status] || defaultStyle}`}
    >
      {status}
    </span>
  );
}

export function CurrencyCell({ amount, currency, prefix = "", isPositive = true }: { amount: number; currency: string; prefix?: string; isPositive?: boolean }) {
  return (
    <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
      {prefix}{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '')} {currency}
    </span>
  );
}

export function CopyableCell({ text, label }: { text: string; label?: string }) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => navigator.clipboard.writeText(text)}>
        <span className="text-white truncate font-medium">{text}</span>
        <Copy className="h-3 w-3 text-muted-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {label && <span className="text-[10px] text-muted-2">{label}</span>}
    </div>
  );
}
