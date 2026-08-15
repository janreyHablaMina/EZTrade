import { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends ComponentProps<"select"> {
  containerClassName?: string;
}

export function Select({ children, className = "", containerClassName = "", ...props }: SelectProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <select
        className={`w-full h-9 rounded-xl border border-border bg-card-elevated pl-3 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-2" />
    </div>
  );
}
