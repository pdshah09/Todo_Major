// dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { getTaskStats } from "@/lib/queries/stats";
import { requireUser, getSessionTeamUserIds } from "@/lib/auth-helpers";
import { DB_TO_STATUS, DB_TO_PRIORITY, daysLeft, type Task } from "../_components/utils";
import KpiGrid from "../_components/KpiGrid";
import RecentTasks from "../_components/RecentTasks";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireUser();
  const ids = await getSessionTeamUserIds();

  // Auto-sync overdue for current user's visible scope (no revalidatePath — force-dynamic render)
  if (ids.length) {
    await prisma.task.updateMany({
      where: {
        assigneeId: { in: ids },
        dueDate:    { lt: new Date() },
        status:     { notIn: ["CLOSED", "OVER_DUE"] },
      },
      data: { status: "OVER_DUE" },
    });
  }

  const [stats, rows] = await Promise.all([
    getTaskStats(ids),
    prisma.task.findMany({
      where:   { assigneeId: { in: ids } },
      include: { assignee: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
      take: 8,
    }),
  ]);

  const tasks: Task[] = rows.map(t => ({
    id:          t.id,
    title:       t.title,
    description: t.description ?? "",
    status:      DB_TO_STATUS[t.status],
    priority:    DB_TO_PRIORITY[t.priority],
    dueDate:     t.dueDate.toISOString(),
    assigneeId:  t.assigneeId,
    assignee:    t.assignee.name,
    daysLeft:    daysLeft(t.dueDate.toISOString()),
  }));

  return (
    <section className="flex h-[calc(100vh-2rem)] flex-col space-y-6">
      <KpiGrid stats={stats} />
      <div className="min-h-0 flex-1 overflow-hidden">
        <RecentTasks tasks={tasks} />
      </div>
    </section>
  );
}
