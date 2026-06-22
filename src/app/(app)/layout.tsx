// layout.tsx

import Sidenav from "@/app/components/Sidenav";
import MobileHeader from "@/app/components/MobileHeader";
import Header from "../components/header";
import { requireUser } from "@/lib/auth-helpers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const isAdmin = !!user.isAdmin;

  return (
    <div className="flex h-screen bg-foreground md:gap-3 md:p-3">
      <aside className="hidden shrink-0 md:block">
        <Sidenav isAdmin={isAdmin} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden bg-primary-light md:rounded-dashboard">
        {/* Pass isAdmin so MobileHeader can gate the Team nav link */}
        <MobileHeader isAdmin={isAdmin} />
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
