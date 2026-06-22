// app/(app)/team/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import TeamManager from "../_components/TeamManager";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  // Only admins can reach this page — employees get redirected by requireAdmin()
  const admin = await requireAdmin();

  // Fetch admin's team with all employees
  const team = await prisma.team.findUnique({
    where: { adminId: admin.id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, number: true, isAdmin: true } } },
        orderBy: { user: { createdAt: "asc" } },
      },
    },
  });

  // Admin always appears first in the list
  const adminMember = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    number: "", // admin number not strictly needed in this view
    role: "ADMIN" as const,
  };

  const employeeMembers = (team?.members ?? []).map(emp => ({
    id: emp.user.id,
    name: emp.user.name,
    email: emp.user.email,
    number: emp.user.number,
    role: "EMPLOYEE" as const,
  }));

  // Fetch admin's full number for display
  const adminUser = await prisma.user.findUnique({
    where: { id: admin.id },
    select: { number: true },
  });

  const liveMembers = [
    { ...adminMember, number: adminUser?.number ?? "" },
    ...employeeMembers,
  ];

  redirect('whatsapp/connect');

}
