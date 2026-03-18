import { useState } from "react";
import { clsx } from "clsx";
import {
  LayoutDashboard, Users, CheckSquare, Bell, MessageSquare,
  Settings, Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { ALERTS } from "../data/mockData";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { id: "patients",  label: "Patients",   icon: Users },
  { id: "tasks",     label: "My Tasks",   icon: CheckSquare,   badge: 7 },
  { id: "alerts",    label: "Alerts",     icon: Bell,          badge: 4 },
  { id: "messages",  label: "Messages",   icon: MessageSquare, badge: 2 },
];
const NAV_BOTTOM = [{ id: "settings", label: "Settings", icon: Settings }];

function NavItem({ item, active, collapsed, onClick }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      title={collapsed ? item.label : undefined}
      className={clsx(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer",
        collapsed ? "justify-center" : "justify-start",
        active ? "sidebar-item-active" : "sidebar-item"
      )}
    >
      <div className="relative flex-shrink-0">
        <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} />
        {item.badge > 0 && collapsed && !active && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-mw-primary-500 text-white text-[8px] font-bold flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </div>
      {!collapsed && (
        <>
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {item.badge > 0 && (
            <span className={clsx(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center",
              active ? "bg-white/20 text-white" : "bg-mw-primary-900 text-mw-primary-300"
            )}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}

function SidebarContent({ collapsed, activeNav, onNavChange, onMobileClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className={clsx(
        "flex items-center gap-3 px-4 py-5 border-b border-mw-ink-800",
        collapsed && "justify-center px-3"
      )}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366F1, #4338CA)" }}
        >
          <span className="text-white font-black text-sm">C</span>
        </div>
        {!collapsed && (
          <div>
            <div className="text-base font-bold tracking-tight text-white">CARA</div>
            <div className="text-[9px] font-medium text-mw-ink-500 uppercase tracking-widest">Care Coordination</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.id} item={item}
            active={activeNav === item.id}
            collapsed={collapsed}
            onClick={(id) => { onNavChange(id); onMobileClose?.(); }}
          />
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-mw-ink-800 flex flex-col gap-0.5">
        {NAV_BOTTOM.map(item => (
          <NavItem key={item.id} item={item} active={false} collapsed={collapsed} onClick={() => {}} />
        ))}
      </div>

      {!collapsed && (
        <div className="mx-2 mb-3 bg-mw-ink-900 border border-mw-ink-800 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-mw-primary-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            SC
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">Sarah Chen, RN</div>
            <div className="text-[10px] text-mw-ink-500">Care Coordinator</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CoordinatorLayout({ children, activeNav, onNavChange }) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadAlerts = ALERTS.filter(a => !a.acknowledged).length;

  return (
    <div className="flex h-screen overflow-hidden bg-mw-surface-soft">
      <aside className={clsx(
        "hidden md:flex flex-col sidebar transition-all duration-200",
        collapsed ? "w-[52px]" : "w-[220px]"
      )}>
        <SidebarContent collapsed={collapsed} activeNav={activeNav} onNavChange={onNavChange} />
      </aside>

      <button
        onClick={() => setCollapsed(v => !v)}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-50 w-5 h-5 bg-mw-ink-800 border border-mw-ink-700 text-mw-ink-300 rounded-full items-center justify-center hover:bg-mw-ink-700 transition-colors"
        style={{ left: collapsed ? "40px" : "208px" }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-[220px] h-full sidebar">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-md hover:bg-mw-ink-800 text-mw-ink-400">
              <X size={16} />
            </button>
            <SidebarContent collapsed={false} activeNav={activeNav} onNavChange={onNavChange} onMobileClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-mw-ink-950 border-b border-mw-ink-800">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-md hover:bg-mw-ink-800 text-mw-ink-400">
            <Menu size={20} />
          </button>
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #4338CA)" }}>
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-white">CARA</span>
          <div className="ml-auto relative">
            <button className="p-1.5 rounded-md hover:bg-mw-ink-800 text-mw-ink-400"><Bell size={18} /></button>
            {unreadAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-mw-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
      </div>
    </div>
  );
}
