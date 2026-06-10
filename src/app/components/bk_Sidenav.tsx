// Sidenav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, KanbanSquare, PanelLeftClose, PanelLeftOpen, Users } from "lucide-react";

export const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: KanbanSquare },
  { href: "/team", label: "Team", icon: Users },
];

export default function Sidenav({ onNavigate, expanded }: { onNavigate?: () => void; expanded?: boolean }) {
  
  const path = usePathname();

  const handleSignOut = () => {
    console.log("Signing out...");
  };

  return (
    <nav className={`group flex h-full flex-col gap-2 rounded-dashboard bg-card p-3 shadow-sm transition-all duration-300
      ${expanded ? "w-56" : "w-16 hover:w-56"}`}>
      <div className="mb-2 flex items-center gap-3 px-2 py-2">
        <div className="grid size-9 shrink-0 place-items-center rounded-card bg-brand text-text-main">
          <LayoutDashboard size={18} />
        </div>
        <span className={`overflow-hidden whitespace-nowrap text-lg font-bold text-brand transition-all
          ${expanded ? "w-auto opacity-100" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"}`}>
          TodoNest
        </span>
      </div>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = path.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate} title={label}
            className={`flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition
              ${active ? "bg-brand-light text-brand" : "text-text-muted hover:bg-column hover:text-brand"}`}>
            <Icon size={18} className="shrink-0" />
            <span className={`overflow-hidden whitespace-nowrap transition-all
              ${expanded ? "w-auto opacity-100" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"}`}>
              {label}
            </span>
          </Link>
        );
      })}

      {/* Sign Out Button */}
      <button 
        onClick={handleSignOut}
        title="Sign Out"
        className="mt-auto flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium text-text-muted transition hover:bg-column hover:text-brand"
      >
        <LogOut size={18} className="shrink-0" />
        <span className={`overflow-hidden whitespace-nowrap transition-all
          ${expanded ? "w-auto opacity-100" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"}`}>
          Sign Out
        </span>
      </button>

    </nav>
  );
}