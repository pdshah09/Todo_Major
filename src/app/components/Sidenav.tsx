// Sidenav.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import iconAsset from '../assets/icon.png';
import { signOut } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { LayoutDashboard, KanbanSquare, PanelLeftClose, PanelLeftOpen, Users, LogOut } from "lucide-react";

const ALL_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/tasks",     label: "Tasks",     icon: KanbanSquare,    adminOnly: false },
  { href: "/team",      label: "Team",      icon: Users,           adminOnly: true  },
];

export default function Sidenav({
  onNavigate, expanded, isAdmin = false,
}: { onNavigate?: () => void; expanded?: boolean; isAdmin?: boolean }) {
  const path = usePathname();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: { onSuccess: () => { window.location.href = "/signin"; } },
    });
  };

  const nav = ALL_NAV.filter(n => !n.adminOnly || isAdmin);

  return (
    <nav className={`group flex h-full flex-col gap-2 rounded-dashboard bg-foreground p-3 shadow-sm transition-all duration-300
      ${expanded ? "w-56" : "w-16 hover:w-56"}`}>
      <div className="mb-2 flex items-center gap-3 px-2 py-2">
        <div className="grid size-9 shrink-0 place-items-center rounded-card text-primary-light">
          <Image src={iconAsset} alt="TodoNest" className="h-auto max-w-full" />
        </div>
        <span className={`overflow-hidden whitespace-nowrap text-lg font-bold text-brand transition-all
          ${expanded ? "w-auto opacity-100" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"}`}>
          TodoNest
        </span>
      </div>

      {nav.map(({ href, label, icon: Icon }) => {
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

      <button
        onClick={handleSignOut}
        title="Sign Out"
        className="mt-auto bg-brand-light flex justify-items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium text-high-txt transition hover:bg-column hover:text-brand"
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
