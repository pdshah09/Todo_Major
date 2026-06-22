// auth-helpers.ts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => auth.api.getSession({ headers: await headers() });

export async function requireUser() {
  const s = await getSession();
  if (!s?.user?.id) redirect("/signin");
  // Fetch from DB to get isAdmin — BetterAuth session may not include custom fields
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: s.user.id },
    select: { id: true, name: true, email: true, isAdmin: true },
  });
  return user;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (!u.isAdmin) redirect("/dashboard");
  return u;
}

export async function getSessionTeamUserIds(): Promise<string[]> {
  const user = await requireUser();
  if (user.isAdmin) {
    // Admin sees all tasks of their team members
    const team = await prisma.team.findUnique({
      where: { adminId: user.id },
      include: { members: { select: { userId: true } } },
    });
    if (!team) return [user.id];
    return [user.id, ...team.members.map(m => m.userId)];
  }
  // Employee only sees own tasks
  return [user.id];
}
