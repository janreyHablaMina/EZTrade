import { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  icon?: ReactNode;
}

export function Button({ variant = "primary", icon, className = "", children, ...props }: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-purple hover:bg-purple-bright shadow-[0_4px_12px_rgba(123,44,255,0.25)] h-9 px-4",
    outline: "border border-border bg-card-elevated hover:bg-white/[0.04] h-9 px-4",
    ghost: "border border-border bg-card-elevated hover:bg-white/[0.04] h-9 w-9", // typically used for icon-only like the reset button
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon && icon}
      {children}
    </button>
  );
}
