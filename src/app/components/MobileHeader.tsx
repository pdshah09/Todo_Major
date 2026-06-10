// MobileHeader.tsx

"use client";
import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import Sidenav from "./Sidenav";
import InitialsBadge from "../(app)/_components/InitialsBadge";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <header className="flex border-b border-border-light bg-foreground px-4 py-3 md:hidden">
        <span className="font-bold text-brand">TodoNest</span>
        <div className="mx-4 h-5 w-[1px] bg-border-light" />
        {/* Right side grouped elements */}
        <div className="ml-auto flex items-center gap-3">
          
          
          <button className="relative text-text-muted hover:text-brand" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-high-txt text-[10px] text-text-main">2</span>
          </button>
          
          <InitialsBadge name="Param Shah" />
          
          <button className="ml-1 text-brand" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground opacity-50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56 bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10" aria-label="Close">
              <X size={20} />
            </button>
            <Sidenav onNavigate={() => setOpen(false)} expanded />
          </div>
        </div>
      )}
    </>
  );
}