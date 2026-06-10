// dashboard/page.tsx

import { getTaskStats } from "@/lib/queries/stats";
import { getSessionTeamUserIds } from "@/lib/auth-helpers";
import KpiGrid from "../_components/KpiGrid";
import RecentTasks from "../_components/RecentTasks";
import { MOCK_STATS } from "../_components/utils";

export default async function DashboardPage() {
  // const ids = await getSessionTeamUserIds();
  // const stats = await getTaskStats(ids);

  return (
    <section className="flex h-[calc(100vh-2rem)] flex-col space-y-6">
      <h1 className="text-xl font-semibold text-text-main">Dashboard - KPIs & Stats</h1>
      
      {/* Use the mock stats here */}
      <KpiGrid stats={MOCK_STATS} /> 
      
      <div className="min-h-0 flex-1 overflow-hidden">
        <RecentTasks />
      </div>
    </section>
  );
}