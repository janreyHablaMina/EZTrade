"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";

type TableActionsMenuProps = {
  children: ReactNode;
  widthClass?: string;
  estimatedHeight?: number;
};

export function TableActionsMenu({
  children,
  widthClass = "w-48",
  estimatedHeight = 280,
}: TableActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleScroll(event: Event) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const toggleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < estimatedHeight && rect.top > spaceBelow;

      setMenuStyle({
        top: openUpward ? rect.top - 4 : rect.bottom + 4,
        right: window.innerWidth - rect.right,
        transform: openUpward ? "translateY(-100%)" : undefined,
      });
    }

    setIsOpen((open) => !open);
  };

  return (
    <div className="inline-flex justify-end" ref={rootRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
          isOpen
            ? "border-purple-bright/50 text-white bg-purple/10"
            : "border-border text-muted hover:text-white bg-card-elevated"
        }`}
        aria-label="Actions"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {isOpen ? (
        <div
          className={`fixed z-[100] ${widthClass} origin-top-right rounded-xl border border-border bg-card-elevated py-1.5 text-left shadow-[0_10px_35px_rgba(0,0,0,0.55)] animate-in fade-in zoom-in-95 duration-150`}
          style={menuStyle}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

type TableActionsMenuItemProps = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger";
  className?: string;
};

export function TableActionsMenuItem({
  icon,
  label,
  onClick,
  tone = "default",
  className = "",
}: TableActionsMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium transition cursor-pointer ${
        tone === "danger"
          ? "text-danger hover:bg-danger/10"
          : "text-muted hover:bg-white/[0.04] hover:text-white"
      } ${className}`}
    >
      {icon ? <span className="text-sm">{icon}</span> : null}
      {label}
    </button>
  );
}

export function TableActionsMenuDivider() {
  return <div className="my-1 border-t border-border/45" />;
}
