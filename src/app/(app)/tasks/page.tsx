import { syncOverdueTasks, getTeamMembers } from "./actions";
import { requireUser, getSessionTeamUserIds } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import TasksPageClient from "./TasksPageClient";
import {
  daysLeft,
  type Task,
  type Status,
  type Priority,
  type DbStatus,
  type DbPriority,
} from "../_components/utils";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<DbStatus, Status> = {
  OPEN: "Open", IN_PROGRESS: "In Progress", CLOSED: "Closed", OVER_DUE: "Over Due",
};
const PRIORITY_MAP: Record<DbPriority, Priority> = {
  LOW: "Low", MEDIUM: "Medium", HIGH: "High",
};

export default async function TasksPage() {
  const user = await requireUser();
  const ids  = await getSessionTeamUserIds();
  await syncOverdueTasks();

  const [rawTasks, members] = await Promise.all([
    prisma.task.findMany({
      where:   { assigneeId: { in: ids } },
      include: { assignee: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getTeamMembers(),
  ]);

  const tasks: Task[] = rawTasks.map(t => ({
    id:          t.id,
    title:       t.title,
    description: t.description ?? "",
    dueDate:     t.dueDate.toISOString(),
    status:      STATUS_MAP[t.status as DbStatus],
    priority:    PRIORITY_MAP[t.priority as DbPriority],
    assigneeId:  t.assigneeId,
    assignee:    t.assignee.name,
    daysLeft:    daysLeft(t.dueDate.toISOString()),
  }));

  return (
    <TasksPageClient
      tasks={tasks}
      members={members}
      currentUserIsAdmin={user.isAdmin}
      currentUserId={user.id}
    />
  );
}
