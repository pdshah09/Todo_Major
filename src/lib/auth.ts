// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],
  emailAndPassword: { enabled: true },

  user: {
    additionalFields: {
      number:  { type: "string",  required: true },
      isAdmin: { type: "boolean", required: false, defaultValue: false },
    },
  },

  /**
   * SESSION PERSISTENCE
   * -------------------
   * BetterAuth persists sessions in PostgreSQL `Session` table.
   * Restoring a session after `npm run dev` restart works automatically:
   *   1. Browser sends the session cookie on the next request.
   *   2. BetterAuth looks up the token in the DB — if valid + not expired, session is restored.
   *   3. auth-helpers.ts then re-fetches the User row (including isAdmin) from DB.
   *
   * cookieCache (maxAge 5 min) avoids a DB hit on every single server request
   * while still re-validating frequently enough for security.
   *
   * Do NOT set cookieOptions.maxAge=0 — it would invalidate sessions on restart.
   */
  session: {
    expiresIn:   60 * 60 * 24 * 7,  // 7 days
    updateAge:   60 * 60 * 24,       // refresh cookie TTL daily
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // 5-min in-memory cache to skip DB
  },

  /**
   * isAdmin LIFECYCLE — THREE-STEP CONTRACT
   * ----------------------------------------
   * Step 1 (login)  → bulk-set isAdmin=false for ALL Employee-linked users.
   * Step 2 (login)  → set isAdmin=true for current user ONLY if they have no Employee record.
   * Step 3 (logout) → always set isAdmin=false for the departing user.
   */
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          // STEP 1 — strip admin from all employees
          const employees = await prisma.employee.findMany({
            select: { userId: true },
          });
          if (employees.length > 0) {
            await prisma.user.updateMany({
              where: { id: { in: employees.map(e => e.userId) } },
              data:  { isAdmin: false },
            });
          }

          // STEP 2 — grant admin only to non-employees
          const isEmployee = employees.some(e => e.userId === session.userId);
          if (!isEmployee) {
            await prisma.user.update({
              where: { id: session.userId },
              data:  { isAdmin: true },
            });

            // Ensure admin has a team on first login
            const existing = await prisma.team.findFirst({
              where: { adminId: session.userId },
            });
            if (!existing) {
              await prisma.team.create({ data: { adminId: session.userId } });
            }
          }
        },
      },

      delete: {
        // STEP 3 — always revoke admin on logout / session expiry
        after: async (session) => {
          await prisma.user.update({
            where: { id: session.userId },
            data:  { isAdmin: false },
          }).catch(() => { /* user deleted before session cleanup — safe to ignore */ });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
