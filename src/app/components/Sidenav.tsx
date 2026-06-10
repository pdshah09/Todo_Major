"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, KanbanSquare, Users } from "lucide-react";

export const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: KanbanSquare },
  { href: "/teams", label: "Teams", icon: Users },
];

export default function Sidenav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <div className="px-3 py-4 text-lg font-bold text-brand">TodoNest</div>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = path.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate}
            className={`flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition
              ${active ? "bg-brand-light text-brand" : "text-text-muted hover:bg-column"}`}>
            <Icon size={18} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}