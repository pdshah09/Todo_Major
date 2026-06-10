// team/page.tsx

// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
import TeamManager from "../_components/TeamManager";

export default async function TeamPage() {
  // --- Future Server Logic ---
  // const admin = await requireAdmin();
  // const team = await prisma.team.findUnique({
  //   where: { adminId: admin.id },
  //   include: { members: { include: { user: true } } }
  // });
  
  return (
    <section className="space-y-4 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex-1 overflow-hidden min-h-0">
        <TeamManager />
      </div>
    </section>
  );
}