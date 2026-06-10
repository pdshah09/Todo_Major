// _compoents/KpiCard.tsx

import type { LucideIcon } from "lucide-react";

export default function KpiCard({ label, value, icon: Icon, bg, txt }: {
  label: string; value: number; icon: LucideIcon; bg: string; txt: string;
}) {
  return (
    <div className="rounded-card border border-border-light bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{label}</p>
        <span className={`grid size-8 place-items-center rounded-card ${bg} ${txt}`}><Icon size={16} /></span>
      </div>
      <p className="mt-3 text-2xl font-bold text-text-main sm:text-3xl">{value}</p>
    </div>
  );
}