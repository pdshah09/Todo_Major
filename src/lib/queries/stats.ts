import { prisma } from "@/lib/prisma";

export type Stats = { open: number; inProgress: number; closed: number; overdue: number };

export async function getTaskStats(ids: string[]): Promise<Stats> {
  if (!ids.length) return { open: 0, inProgress: 0, closed: 0, overdue: 0 };
  const [rows, overdue] = await Promise.all([
    prisma.task.groupBy({
      by: ["status"],
      where: { assigneeId: { in: ids } },
      _count: { _all: true },
    }),
    prisma.task.count({
      where: { assigneeId: { in: ids }, status: { not: "CLOSED" }, dueDate: { lt: new Date() } },
    }),
  ]);
  const m = Object.fromEntries(rows.map(r => [r.status, r._count._all]));
  return { open: m.OPEN ?? 0, inProgress: m.IN_PROGRESS ?? 0, closed: m.CLOSED ?? 0, overdue };
}