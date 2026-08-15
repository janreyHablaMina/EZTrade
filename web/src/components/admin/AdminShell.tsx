import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-7">
          {children}
        </main>
        <footer className="flex flex-col gap-2 border-t border-border px-6 py-4 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 EZTRADE. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-danger">♥</span> by EZTRADE Team.
          </p>
        </footer>
      </div>
    </div>
  );
}
