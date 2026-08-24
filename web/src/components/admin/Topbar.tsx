import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Maximize2, Search, Calendar, ArrowUpRight, Check, X, ChevronDown, User, Settings, LogOut, Clock, MessageCircle } from "lucide-react";
import { webApi } from "@/lib/api";
import { GlobalSearchModal } from "./GlobalSearchModal";

export function Topbar() {
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSimulatingAmbassador, setIsSimulatingAmbassador] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const pathname = usePathname();
  const params = useParams();
  const isAmbassadorPage = pathname?.includes("/ambassadors/") && params?.id;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Fetch recent conversations and notifications for the dropdowns
    webApi.get("/messages/conversations").then(data => setConversations(data)).catch(console.error);
    // webApi.get("/admin/notifications").then(data => setNotifications(data)).catch(console.error);
    
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSimulateDailyTrade = async () => {
    try {
      setIsProcessingAction(true);
      const response = await webApi.post('/users/simulate-trade');
      setToastMessage(`Simulated daily trade for ${response.processed} users. Total Profit: +$${Number(response.total_profit).toFixed(2)}`);
      
      // Auto-hide toast
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err) {
      console.error("Failed to simulate daily trade:", err);
      setToastMessage("Failed to simulate daily trade");
      setTimeout(() => setToastMessage(""), 5000);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleSimulateAmbassador = async () => {
    try {
      setIsSimulatingAmbassador(true);
      const realId = parseInt(String(params.id).replace(/\D/g, ''));
      const res = await webApi.post(`/admin/ambassadors/${realId}/simulate`, {});
      
      // Use the raw toast notification from the Topbar
      setToastMessage(`Simulation complete. New Balance: $${Number(res.data?.new_balance || 0).toFixed(2)}`);
      
      // Auto-hide toast
      setTimeout(() => setToastMessage(""), 5000);

      // Reload the page to reflect new data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Failed to simulate ambassador:", err);
      setToastMessage("Failed to simulate ambassador");
      setTimeout(() => setToastMessage(""), 5000);
    } finally {
      setIsSimulatingAmbassador(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-7">
      <div className="relative flex min-w-0 flex-1">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="relative flex min-w-0 flex-1 items-center cursor-pointer group text-left"
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-2 group-hover:text-purple-bright transition" />
          <div className="flex h-11 w-full max-w-xl items-center rounded-xl border border-border bg-card px-10 pr-4 text-sm text-muted-2 transition group-hover:border-purple-bright/30">
            Search users, transactions...
          </div>
        </button>

        <GlobalSearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {isAmbassadorPage && (
          <button
            type="button"
            onClick={handleSimulateAmbassador}
            disabled={isSimulatingAmbassador}
            className="hidden sm:flex items-center gap-2 rounded-xl bg-purple-bright/20 px-4 py-2 text-xs font-semibold text-purple-bright transition hover:bg-purple-bright/30 cursor-pointer disabled:opacity-50 border border-purple-bright/30"
          >
            <Clock className="h-4 w-4" />
            {isSimulatingAmbassador ? 'Simulating...' : 'Simulate Ambassador'}
          </button>
        )}

        <button
          type="button"
          onClick={handleSimulateDailyTrade}
          disabled={isProcessingAction}
          className="hidden sm:flex items-center gap-2 rounded-xl bg-success/20 px-4 py-2 text-xs font-semibold text-success transition hover:bg-success/30 cursor-pointer disabled:opacity-50 border border-success/30"
        >
          <ArrowUpRight className="h-4 w-4" />
          {isProcessingAction ? 'Simulating...' : 'Simulate Daily Trade'}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-muted-2 hover:bg-white/[0.02] hover:text-purple-bright transition cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-success"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-medium">
                    {notifications.filter(n => !n.is_read).length} New
                  </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-2">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n, i) => (
                      <div
                        key={n.id || i}
                        className={`flex items-start gap-3 p-3 border-b border-border/30 hover:bg-white/[0.04] transition ${!n.is_read ? 'bg-success/5' : ''}`}
                      >
                        <div className="h-8 w-8 shrink-0 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.is_read ? 'font-semibold text-white' : 'font-medium text-white/90'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-2 mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-muted-2 block mt-1">
                            {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="border-t border-border/50 p-2">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="block w-full text-center rounded-lg py-2 text-xs font-semibold text-success hover:bg-success/10 transition"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsMessagesOpen(!isMessagesOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-muted-2 hover:bg-white/[0.02] hover:text-purple-bright transition cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            {conversations.some(c => c.unread_count > 0) && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-purple-bright"></span>
            )}
          </button>

          {isMessagesOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMessagesOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Messages</p>
                  <span className="text-xs bg-purple-bright/20 text-purple-bright px-2 py-0.5 rounded-full font-medium">
                    {conversations.reduce((acc, c) => acc + c.unread_count, 0)} New
                  </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-2">
                      No messages yet.
                    </div>
                  ) : (
                    conversations.slice(0, 5).map((c) => (
                      <Link
                        key={c.user.id}
                        href="/dashboard/messages"
                        onClick={() => setIsMessagesOpen(false)}
                        className={`flex items-start gap-3 p-3 border-b border-border/30 hover:bg-white/[0.04] transition ${c.unread_count > 0 ? 'bg-purple-bright/5' : ''}`}
                      >
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-purple-soft to-purple-bright flex items-center justify-center text-white font-bold text-sm">
                          {c.user.first_name[0]}{c.user.last_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className={`text-sm truncate ${c.unread_count > 0 ? 'font-semibold text-white' : 'font-medium text-white/90'}`}>
                              {c.user.first_name} {c.user.last_name}
                            </span>
                            {c.last_message && (
                              <span className="text-[10px] text-muted-2">
                                {new Date(c.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate ${c.unread_count > 0 ? 'text-white/80 font-medium' : 'text-muted-2'}`}>
                            {c.last_message ? c.last_message.content : "No messages"}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                
                <div className="border-t border-border/50 p-2">
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setIsMessagesOpen(false)}
                    className="block w-full text-center rounded-lg py-2 text-xs font-semibold text-purple-bright hover:bg-purple-bright/10 transition"
                  >
                    View All Messages
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="group flex items-center gap-2.5 rounded-full border border-transparent hover:border-border/50 hover:bg-white/[0.02] transition-all py-1 pr-3 pl-1 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-bright to-purple-soft text-[13px] font-bold text-white shadow-md">
              JD
            </div>
            <div className="hidden leading-tight sm:flex flex-col items-start justify-center">
              <p className="text-[13px] font-semibold text-white group-hover:text-purple-bright transition-colors">John Doe</p>
              <p className="text-[11px] font-medium text-muted-2">Super Admin</p>
            </div>
            <ChevronDown className={`hidden sm:block h-4 w-4 text-muted-2 group-hover:text-purple-bright transition-all ml-1 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <>
              {/* Invisible Overlay for click-outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)}
              />
              
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-2 duration-200 z-50 py-1">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-muted-2 truncate">johndoe@example.com</p>
                </div>
                
                <div className="px-1">
                  <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-2 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-2 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>
                </div>
                
                <div className="mt-1 border-t border-border/50 px-1 pt-1">
                  <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-danger hover:bg-danger/10 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-card p-4 shadow-[0_10px_40px_rgba(34,197,94,0.15)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">System Update</p>
              <p className="text-xs text-muted-2">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage("")}
              className="ml-4 text-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
