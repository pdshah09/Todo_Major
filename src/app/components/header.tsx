// Header.tsx
"use client";

import { useSession } from "@/lib/auth-client";
import { Bell } from "lucide-react";
import InitialsBadge from "../(app)/_components/InitialsBadge";

export default function Header({ title = "TODONEST" }: { title?: string }) {

  const { data: session } = useSession();
  const displayName =  session?.user?.name || "";

  return (
    /* Added `hidden md:flex` to turn visibility off on mobile */
    <header className="hidden md:flex items-center border-b border-border-light bg-foreground px-4 py-3 sm:px-6">
      <h1 className="text-base font-semibold text-brand">{title}</h1>
      
      <div className="mx-4 h-5 w-[1px] bg-border-light" />

      <div className="ml-auto flex items-center gap-4"> 
        <button className="relative text-text-muted hover:text-brand" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-brand text-[10px] text-foreground">2</span>
        </button>
        <InitialsBadge name={displayName} />
      </div>
    </header>
  );
}