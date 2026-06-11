// app/(app)/team/page.tsx

// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import TeamManager from "../_components/TeamManager";

// export default async function TeamPage() {
//   // --- Future Server Logic ---
//   // const admin = await requireAdmin();
//   // const team = await prisma.team.findUnique({
//   //   where: { adminId: admin.id },
//   //   include: { members: { include: { user: true } } }
//   // });
  
//   return (
//     <section className="space-y-4 h-[calc(100vh-2rem)] flex flex-col">
//       <div className="flex-1 overflow-hidden min-h-0">
//         <TeamManager />
//       </div>
//     </section>
//   );
// }

import { prisma } from "@/lib/prisma";
import TeamManager from "../_components/TeamManager";

export default async function TeamPage() {
  // Fetch all employees and their related user data
  const employees = await prisma.employee.findMany({
    include: { user: true },
    orderBy: { user: { createdAt: 'asc' } }
  });

  // Map to the TeamMember type your UI expects
  const liveMembers = employees.map((emp) => ({
    id: emp.user.id,
    name: emp.user.name,
    email: emp.user.email,
    number: emp.user.number,
    role: emp.user.isAdmin ? "ADMIN" : "EMPLOYEE",
  }));

  return (
    <section className="space-y-4 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex-1 overflow-hidden min-h-0">
        <TeamManager initialMembers={liveMembers} />
      </div>
    </section>
  );
}