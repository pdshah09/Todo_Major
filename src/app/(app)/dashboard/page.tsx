import { getTaskStats } from "@/lib/queries/stats";
import { getSessionTeamUserIds } from "@/lib/auth-helpers";
import KpiGrid from "../_components/KpiGrid";

export default async function DashboardPage() {
  // const ids = await getSessionTeamUserIds();
  // const stats = await getTaskStats(ids);
  return (
    <section className="space-y-5">
      <h1 className="text-xl font-semibold text-text-main">Dashboard - Kpis Stats</h1>
      {/* <KpiGrid stats={stats} /> */}
    </section>
  );
}