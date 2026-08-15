import { Bell, Maximize2, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-7">
      <label className="relative flex min-w-0 flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-2" />
        <input
          type="search"
          placeholder="Search anything..."
          className="h-11 w-full max-w-xl rounded-xl border border-border bg-card px-10 pr-16 text-sm text-white outline-none placeholder:text-muted-2 focus:border-border-strong"
        />
        <kbd className="pointer-events-none absolute right-3 rounded-md border border-border bg-bg-deep px-1.5 py-0.5 text-[10px] text-muted-2">
          ⌘K
        </kbd>
      </label>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted transition hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-purple px-1 text-[10px] font-semibold text-white">
            8
          </span>
        </button>

        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted transition hover:text-white sm:flex"
          aria-label="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1.5 pr-3 pl-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-bright to-purple-soft text-xs font-bold">
            JD
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-[11px] text-muted-2">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
