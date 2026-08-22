"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, User, FileText, ArrowRight } from "lucide-react";
import { webApi } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

type GlobalSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PAGES = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users Management", href: "/dashboard/users" },
  { label: "VIP Plans", href: "/dashboard/vip-plans" },
  { label: "Deposits", href: "/dashboard/deposits" },
  { label: "Withdrawals", href: "/dashboard/withdrawals" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Earnings", href: "/dashboard/earnings" },
  { label: "Referrals", href: "/dashboard/referrals" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "System Settings", href: "/dashboard/settings" },
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setUsers([]);
    }
    return () => {};
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedQuery.length < 2) {
        setUsers([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await webApi.get("/users");
        const filtered = response.filter((u: any) => 
          u.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
          u.email.toLowerCase().includes(debouncedQuery.toLowerCase())
        ).slice(0, 5);
        setUsers(filtered);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  if (!isOpen) return null;

  const filteredPages = PAGES.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);
  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Invisible Overlay for click-outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Modal */}
      <div className="absolute top-full left-0 mt-2 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
        {/* Search Input */}
        <div className="flex items-center border-b border-border/50 px-4">
          <Search className="h-5 w-5 text-purple-bright shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, transactions..."
            className="h-14 w-full bg-transparent px-4 text-sm text-white placeholder:text-muted-2 outline-none"
          />
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-2 hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query ? (
            <div className="p-6 text-center text-sm text-muted-2">
              Type to start searching...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pages */}
              {filteredPages.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-2 uppercase tracking-wider">
                    Pages
                  </div>
                  {filteredPages.map((page) => (
                    <button
                      key={page.href}
                      onClick={() => handleNavigate(page.href)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-white/[0.04] hover:text-white transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-2 group-hover:text-purple-bright transition" />
                        <span>{page.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              )}

              {/* Users */}
              {(users.length > 0 || isLoading) && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-2 uppercase tracking-wider">
                    Users
                  </div>
                  {isLoading ? (
                    <div className="px-3 py-2 text-sm text-muted-2">Searching users...</div>
                  ) : (
                    users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleNavigate("/dashboard/users")} 
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-muted hover:bg-white/[0.04] hover:text-white transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left flex flex-col">
                            <span className="font-medium text-white">{user.name}</span>
                            <span className="text-[11px] text-muted-2">{user.email}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))
                  )}
                </div>
              )}

              {query && filteredPages.length === 0 && users.length === 0 && !isLoading && (
                <div className="p-6 text-center text-sm text-muted-2">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t border-border/50 bg-bg-deep/50 px-4 py-3 text-[10px] text-muted-2 flex items-center justify-between">
          <span>Press ESC to close</span>
          <div className="flex gap-2">
            <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-card px-1 py-0.5">↑</kbd> <kbd className="rounded border border-border bg-card px-1 py-0.5">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-card px-1 py-0.5">↵</kbd> to select</span>
          </div>
        </div>
      </div>
    </>
  );
}
