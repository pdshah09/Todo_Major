// _compoents/KpiGrid.tsx

import { CircleDot, Loader, CheckCircle2, AlertTriangle } from "lucide-react";
import KpiCard from "./KpiCard";
import type { Stats } from "@/lib/queries/stats";

const CFG = [
  { key: "open", label: "Open", icon: CircleDot, bg: "bg-brand-light", txt: "text-brand" },
  { key: "inProgress", label: "In Progress", icon: Loader, bg: "bg-med-bg", txt: "text-med-txt" },
  { key: "closed", label: "Closed", icon: CheckCircle2, bg: "bg-low-bg", txt: "text-low-txt" },
  { key: "overdue", label: "Overdue", icon: AlertTriangle, bg: "bg-high-bg", txt: "text-high-txt" },
] as const;

export default function KpiGrid({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {CFG.map(({ key, ...c }) => <KpiCard key={key} {...c} value={stats[key]} />)}
    </div>
  );
}