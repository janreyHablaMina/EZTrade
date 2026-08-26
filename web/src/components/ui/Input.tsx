import { ComponentProps, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
}

export function Input({ icon, className = "", type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative flex-1">
      {icon && (
        <div className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2">
          {icon}
        </div>
      )}
      <input
        type={isPassword && showPassword ? "text" : type}
        className={`w-full h-9 rounded-xl border border-border bg-card-elevated text-xs text-white placeholder:text-muted-2 outline-none focus:border-border-strong transition ${
          icon ? "pl-10" : "pl-4"
        } ${isPassword ? "pr-10" : "pr-4"} ${className}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 h-4 w-4 text-muted-2 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
