// Header.tsx

import { Bell } from "lucide-react";
import InitialsBadge from "../(app)/_components/InitialsBadge";

export default function Header({ title = "TODONEST" }: { title?: string }) {
  return (
    <header className="flex items-center border-b border-border-light bg-foreground px-4 py-3 sm:px-6">
  <h1 className="text-base font-semibold text-brand">{title}</h1>
  
  <div className="mx-4 h-5 w-[1px] bg-border-light" />

  {/* Changed `mx-full` to `ml-auto` */}
  <div className="ml-auto flex items-center gap-4"> 
    <button className="relative text-text-muted hover:text-brand" aria-label="Notifications">
      <Bell size={20} />
      <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-high-txt text-[10px] text-text-main">2</span>
    </button>
    <InitialsBadge name="Param Shah" />
  </div>
</header>  );
}