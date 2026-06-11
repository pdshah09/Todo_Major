// auth-helpers.ts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => auth.api.getSession({ headers: await headers() });

export async function requireUser() {
  const s = await getSession();
  if (!s?.user) redirect("/sign-in");
  return s.user;
}
export async function requireAdmin() {
  const u = await requireUser();
  const db = await prisma.user.findUnique({ where: { id: u.id } });
  if (!db?.isAdmin) redirect("/dashboard");
  return db;
}
export async function getSessionTeamUserIds() {
  const u = await requireUser();
  const db = await prisma.user.findUnique({
    where: { id: u.id },
    include: { managedTeam: { include: { members: true } },
      employeeProfile: { include: { team: { include: { members: true } } } } },
  });
  const team = db?.managedTeam ?? db?.employeeProfile?.team;
  return team ? [...team.members.map(m => m.userId), team.adminId!] : [u.id];
}