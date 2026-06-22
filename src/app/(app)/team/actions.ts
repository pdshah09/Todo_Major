// app/(app)/team/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const revalidate = () => revalidatePath("/team");

export async function getUnassignedUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { isAdmin: false, employeeProfile: null },
    select: { id: true, name: true, email: true, number: true },
  });
}

export async function addEmployee(formData: FormData) {
  const admin = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const digits = String(formData.get("number") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!name || !email || !password || !digits)
    throw new Error("Name, email, phone and password are required.");

  if (!/^[0-9]{10}$/.test(digits))
    throw new Error("Phone number must be exactly 10 digits.");

  const number = `+91${digits}`; // Full E.164-style number stored in DB

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("An account with this email already exists.");

  const existingPhone = await prisma.user.findUnique({ where: { number } });
  if (existingPhone) throw new Error("An account with this phone number already exists.");

  // Ensure admin has a team
  let team = await prisma.team.findUnique({ where: { adminId: admin.id } });
  if (!team) {
    team = await prisma.team.create({ data: { adminId: admin.id } });
  }

  // Pass number directly in signUpEmail body — required by BetterAuth additionalFields
  const result = await auth.api.signUpEmail({
    headers: await headers(),
    body: { name, email, password, number },
  });
  if (!result?.user?.id) throw new Error("Failed to create user account.");

  // Newly created employees must NOT be admin — BetterAuth databaseHook may have set it
  await prisma.user.update({
    where: { id: result.user.id },
    data: { isAdmin: false },
  });

  await prisma.employee.create({ data: { userId: result.user.id, teamId: team.id } });
  revalidate();
}

export async function updateEmployee(employeeId: string, formData: FormData) {
  await requireAdmin();
  const emp = await prisma.employee.findUnique({ where: { userId: employeeId } });
  if (!emp) throw new Error("Employee not found");

  const digits = String(formData.get("number") ?? "").trim();
  if (!/^[0-9]{10}$/.test(digits))
    throw new Error("Phone number must be exactly 10 digits.");

  await prisma.user.update({
    where: { id: emp.userId },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      number: `+91${digits}`,
    },
  });
  revalidate();
}

export async function deleteEmployee(userId: string) {
  await requireAdmin();
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new Error("User not found.");
  if (target.isAdmin) throw new Error("Cannot remove an admin.");
  await prisma.employee.delete({ where: { userId } });
  revalidate();
}
