import { ComponentProps, ReactNode } from "react";

interface InputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
}

export function Input({ icon, className = "", ...props }: InputProps) {
  return (
    <div className="relative flex-1">
      {icon && (
        <div className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2">
          {icon}
        </div>
      )}
      <input
        className={`w-full h-9 rounded-xl border border-border bg-card-elevated text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition ${
          icon ? "pl-10 pr-4" : "px-4"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
