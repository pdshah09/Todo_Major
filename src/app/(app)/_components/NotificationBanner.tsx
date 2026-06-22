"use client";
import { useState } from "react";
import { Bell, X } from "lucide-react";
import type { Task } from "./utils";

export default function NotificationBanner({ tasks }: { tasks: Task[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const alerts = tasks.filter(t => {
    if (dismissed.includes(t.id)) return false;
    if (t.status === "Closed" || t.status === "Over Due") return false;
    const soon = t.daysLeft <= 2 && t.daysLeft >= 0;
    return t.priority === "High" || soon;
  });

  if (!alerts.length) return null;

  return (
    <div className="flex flex-col gap-2 mb-3">
      {alerts.slice(0, 3).map(t => (
        <div key={t.id}
          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-md bg-high-bg border border-high-txt/20 text-sm text-high-txt shadow-sm">
          <Bell size={14} className="shrink-0" />
          <span className="flex-1">
            <strong>{t.title}</strong>
            {t.priority === "High" && " — High priority"}
            {t.daysLeft <= 2 && t.daysLeft >= 0 && ` · due in ${t.daysLeft}d`}
          </span>
          <button onClick={() => setDismissed(p => [...p, t.id])} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
