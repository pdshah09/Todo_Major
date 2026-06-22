import { prisma } from "@/lib/prisma";

export type Stats = { open: number; inProgress: number; closed: number; overdue: number };

export async function getTaskStats(ids: string[]): Promise<Stats> {
  if (!ids.length) return { open: 0, inProgress: 0, closed: 0, overdue: 0 };

  // Group by status to get counts for all buckets including OVER_DUE
  const rows = await prisma.task.groupBy({
    by: ["status"],
    where: { assigneeId: { in: ids } },
    _count: { _all: true },
  });

  const m = Object.fromEntries(rows.map(r => [r.status, r._count._all]));

  return {
    open:       m.OPEN       ?? 0,
    inProgress: m.IN_PROGRESS ?? 0,
    closed:     m.CLOSED     ?? 0,
    // Use the OVER_DUE status bucket directly — tasks are auto-synced to OVER_DUE on page load,
    // so this is always accurate and avoids double-counting with date-based calculation.
    overdue:    m.OVER_DUE   ?? 0,
  };
}
