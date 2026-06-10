// layout.tsx

import Sidenav from "@/app/components/Sidenav";
import MobileHeader from "@/app/components/MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-canvas md:gap-3 md:p-3">
      <aside className="hidden shrink-0 md:block">
        <Sidenav />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden bg-card md:rounded-dashboard">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}