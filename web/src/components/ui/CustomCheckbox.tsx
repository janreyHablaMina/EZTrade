import React from "react";

type CustomCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export function CustomCheckbox({ checked, onChange, className = "" }: CustomCheckboxProps) {
  return (
    <label className={`relative flex items-center justify-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-purple border-purple-bright shadow-[0_0_8px_rgba(123,44,255,0.4)]"
            : "border-border bg-card-elevated hover:border-purple-bright/50"
        }`}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </label>
  );
}
