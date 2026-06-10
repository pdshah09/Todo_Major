// _compoents/KpiCard.tsx

import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  bg: string;
  txt: string;
}

export default function KpiCard({ label, value, icon: Icon, bg, txt }: KpiCardProps) {
  return (
    <div className="rounded-[var(--radius-card)] border bg-card p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <span className={`grid size-8 place-items-center rounded-[var(--radius-card)] ${bg} ${txt}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-text-main sm:text-3xl">{value}</p>
    </div>
  );
}