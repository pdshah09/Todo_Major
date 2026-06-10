// MobileHeader.tsx

"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidenav from "./Sidenav";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="flex items-center justify-between border-b border-border-light bg-card px-4 py-3 md:hidden">
        <span className="font-bold text-brand">TodoNest</span>
        <button onClick={() => setOpen(true)} aria-label="Menu"><Menu size={22} /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56 bg-card shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10" aria-label="Close"><X size={20} /></button>
            <Sidenav onNavigate={() => setOpen(false)} expanded />
          </div>
        </div>
      )}
    </>
  );
}