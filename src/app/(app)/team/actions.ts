// app/(app)/team/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ── AUTH RESTRICTION ───────────────────────────────────────────────
export async function requireAdmin() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s?.user) throw new Error("Unauthorized");
  const u = await prisma.user.findUnique({ where: { id: s.user.id } });
  if (!u?.isAdmin) throw new Error("Forbidden");
  return u;
}

// Users not yet on any team (for the select dropdown)
export async function getUnassignedUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { isAdmin: false, employeeProfile: null },
    select: { id: true, name: true, email: true, number: true },
  });
}

// ADD: attach existing user as employee
export async function addEmployee(formData: FormData) {
  const admin = await requireAdmin();
  const userId = formData.get("userId") as string;
  if (!userId) throw new Error("Select a user");
  const team = await prisma.team.findUnique({ where: { adminId: admin.id } });
  if (!team) throw new Error("No team");
  await prisma.employee.create({ data: { userId, teamId: team.id } });
  revalidatePath("/team");
}

// UPDATE: edit the linked user's fields
export async function updateEmployee(employeeId: string, formData: FormData) {
  await requireAdmin();
  const emp = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!emp) throw new Error("Not found");
  await prisma.user.update({
    where: { id: emp.userId },
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      number: formData.get("number") as string,
    },
  });
  revalidatePath("/team");
}

// DELETE: remove employee link only (keep the user)
export async function deleteEmployee(employeeId: string) {
  await requireAdmin();
  await prisma.employee.delete({ where: { id: employeeId } });
  revalidatePath("/team");
}