"use server";

import { prisma } from "@/lib/prisma";
import { requireUser, getSessionTeamUserIds } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import type { DbStatus, DbPriority } from "../_components/utils";

type TaskInput = {
  title: string; description?: string; dueDate: string;
  priority: DbPriority; assigneeId: string;
};

/** Statuses that employees are allowed to move tasks into. */
const EMPLOYEE_ALLOWED_STATUSES: DbStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];

const revalidate = () => { revalidatePath("/tasks"); revalidatePath("/dashboard"); };

/** Admin-only guard for create/edit/delete mutations. */
async function requireAdminUser() {
  const u = await requireUser();
  if (!u.isAdmin) throw new Error("Only admins can create or edit tasks.");
  return u;
}

export async function createTask(d: TaskInput) {
  const u = await requireAdminUser();
  await prisma.task.create({
    data: {
      title:       d.title,
      description: d.description || null,
      dueDate:     new Date(d.dueDate),
      priority:    d.priority,
      createdById: u.id,
      assigneeId:  d.assigneeId,
    },
  });
  revalidate();
}

export async function updateTask(id: string, d: TaskInput) {
  await requireAdminUser();
  await prisma.task.update({
    where: { id },
    data: {
      title:       d.title,
      description: d.description || null,
      dueDate:     new Date(d.dueDate),
      priority:    d.priority,
      assigneeId:  d.assigneeId,
    },
  });
  revalidate();
}

/**
 * updateTaskStatus
 * ----------------
 * Admins  : can move any task to any non-OVER_DUE status.
 * Employees: can move only tasks assigned to them, into OPEN/IN_PROGRESS/CLOSED.
 *            OVER_DUE is system-managed and always blocked for both roles.
 */
export async function updateTaskStatus(id: string, status: DbStatus) {
  const user = await requireUser();

  // Block OVER_DUE for everyone — it is set only by syncOverdueTasks
  if (status === "OVER_DUE") throw new Error("OVER_DUE is system-managed.");

  if (user.isAdmin) {
    await prisma.task.update({ where: { id }, data: { status } });
  } else {
    if (!EMPLOYEE_ALLOWED_STATUSES.includes(status))
      throw new Error("Employees can only set OPEN, IN_PROGRESS, or CLOSED.");

    const task = await prisma.task.findUniqueOrThrow({ where: { id } });
    if (task.assigneeId !== user.id)
      throw new Error("You can only update tasks assigned to you.");
    if (task.status === "OVER_DUE")
      throw new Error("Overdue tasks cannot be moved by employees.");

    await prisma.task.update({ where: { id }, data: { status } });
  }

  revalidate();
}

export async function deleteTask(id: string) {
  await requireAdminUser();
  await prisma.task.delete({ where: { id } });
  revalidate();
}

/**
 * syncOverdueTasks
 * ----------------
 * Marks every task whose dueDate is in the past as OVER_DUE,
 * regardless of current status — including CLOSED.
 * Only OVER_DUE tasks already marked are skipped (idempotent).
 * Called inline on force-dynamic pages.
 */
export async function syncOverdueTasks() {
  const ids = await getSessionTeamUserIds();
  if (!ids.length) return;
  await prisma.task.updateMany({
    where: {
      assigneeId: { in: ids },
      dueDate:    { lt: new Date() },
      status:     { not: "OVER_DUE" }, // only skip already-overdue rows
    },
    data: { status: "OVER_DUE" },
  });
}

export async function getTeamMembers() {
  const user = await requireUser();
  if (user.isAdmin) {
    const team = await prisma.team.findUnique({
      where:   { adminId: user.id },
      include: { members: { select: { userId: true } } },
    });
    const memberIds = team ? [user.id, ...team.members.map(m => m.userId)] : [user.id];
    return prisma.user.findMany({
      where:   { id: { in: memberIds } },
      select:  { id: true, name: true, isAdmin: true },
      orderBy: { name: "asc" },
    });
  }
  return prisma.user.findMany({
    where:  { id: user.id },
    select: { id: true, name: true, isAdmin: true },
  });
}
