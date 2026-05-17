"use client";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Target, ClipboardCheck, Users, Settings, BarChart3,
  Brain, LogOut, Bell, ChevronDown, Menu, X, FileText, Shield, Building2, ArrowUpDown,
  Activity, PieChart
} from "lucide-react";
import { Providers } from "@/components/providers";

const navItems: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  EMPLOYEE: [
    { label: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { label: "My Goals", href: "/employee/goals", icon: Target },
    { label: "Check-ins", href: "/employee/checkins", icon: ClipboardCheck },
    { label: "Analytics", href: "/analytics", icon: PieChart },
    { label: "Pulse AI", href: "/pulse", icon: Brain },
  ],
  MANAGER: [
    { label: "Dashboard", href: "/manager", icon: LayoutDashboard },
    { label: "Team Review", href: "/manager/review", icon: Users },
    { label: "Check-ins", href: "/manager/checkins", icon: ClipboardCheck },
    { label: "Shared Goals", href: "/manager/shared", icon: ArrowUpDown },
    { label: "Analytics", href: "/analytics", icon: PieChart },
    { label: "Pulse AI", href: "/pulse", icon: Brain },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Cycles", href: "/admin/cycles", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit", icon: FileText },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Organization", href: "/admin/org", icon: Building2 },
    { label: "Analytics", href: "/analytics", icon: PieChart },
    { label: "Pulse AI", href: "/pulse", icon: Brain },
  ],
};

function SidebarContent({ role, pathname, onClose }: { role: string; pathname: string; onClose?: () => void }) {
  const items = navItems[role] || navItems.EMPLOYEE;
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-graphite flex items-center justify-center">
            <span className="text-white font-outfit font-bold text-sm">A</span>
          </div>
          <span className="font-outfit font-semibold text-lg tracking-tight text-graphite">ALIGN</span>
        </Link>
        {onClose && <button onClick={onClose} className="lg:hidden text-graphite-soft"><X size={20} /></button>}
      </div>
      <div className="px-4 mb-2">
        <div className="badge badge-gold text-xs uppercase tracking-wider">{role}</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== `/${role.toLowerCase()}` && pathname.startsWith(item.href + "/"));
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.label === "Pulse AI" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-gold animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-black/[0.04]">
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-link w-full text-rose hover:text-rose hover:bg-rose/5">
          <LogOut size={18} /><span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; type: string; read: boolean; createdAt: string }>>([]);

  const role = session?.user?.role || "EMPLOYEE";
  const userName = session?.user?.name || "User";

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/notifications").then(r => r.json()).then(d => { if (d.notifications) setNotifications(d.notifications); }).catch(() => {});
    }
  }, [status]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[260px] bg-white border-r border-black/[0.04] fixed h-screen overflow-y-auto">
        <SidebarContent role={role} pathname={pathname} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-[280px] h-screen bg-white z-50 shadow-xl lg:hidden">
              <SidebarContent role={role} pathname={pathname} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-ivory/80 backdrop-blur-xl border-b border-black/[0.03]">
          <div className="flex items-center justify-between px-6 lg:px-8 py-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-graphite-soft"><Menu size={22} /></button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-black/[0.03] transition-colors">
                  <Bell size={20} className="text-graphite-soft" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 top-12 w-[360px] bg-white rounded-2xl shadow-lg border border-black/[0.05] overflow-hidden z-50">
                      <div className="p-4 border-b border-black/[0.04] flex items-center justify-between">
                        <span className="font-semibold text-sm">Notifications</span>
                        <button onClick={() => { fetch("/api/notifications", { method: "PATCH" }); setNotifications(n => n.map(x => ({ ...x, read: true }))); }}
                          className="text-xs text-gold hover:text-gold-dark">Mark all read</button>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-sm text-slate">No notifications</div>
                        ) : notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 border-b border-black/[0.02] hover:bg-ivory/50 transition-colors ${!n.read ? "bg-gold/[0.03]" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-gold" : "bg-transparent"}`} />
                              <div>
                                <div className="text-sm font-medium text-graphite">{n.title}</div>
                                <div className="text-xs text-graphite-muted mt-0.5">{n.message}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User */}
              <div className="flex items-center gap-3 pl-3 border-l border-black/[0.06]">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark font-outfit font-semibold text-sm">
                  {userName.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-graphite leading-tight">{userName}</div>
                  <div className="text-[11px] text-graphite-muted">{role}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8 max-w-[1280px]"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Providers>
  );
}
