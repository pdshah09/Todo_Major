// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // Ensure your Prisma client is imported from your lib

export const auth = betterAuth({
  // The Prisma adapter automatically uses the DATABASE_URL from your .env 
  // via your instantiated Prisma Client
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  
  // Best practice: Load this from env to prevent issues when deploying
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],
  emailAndPassword: { enabled: true },
  
  user: {
    additionalFields: {
      number: { type: "string", required: true },
      isAdmin: { type: "boolean", required: false, defaultValue: false },
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 days
    updateAge: 60 * 60 * 24,       // refresh daily
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // cache 5 min, avoids DB read each request
  },
  // Intercept session creation and deletion
  databaseHooks: {
    session: {
     create: {
       after: async (session) => {
         // Only update if they are currently NOT an admin
         const team = await prisma.team.findFirst();

         await prisma.user.updateMany({
            where: { isAdmin: true }, // Optimized: Only writes if currently true
            data: { isAdmin: false }
          });

         await prisma.user.updateMany({ 
           where: { id: session.userId, isAdmin: false }, 
           data: { isAdmin: true } 
          });
          
          // First user ever → admin + team owner (not an employee)
          if (!team) {
            await prisma.team.create({ data: { adminId: session.userId } });
            return;
          }

        },
      },
      delete: {
        after: async (session) => {
          // Only update if they are currently an admin
          await prisma.user.updateMany({ 
            where: { id: session.userId, isAdmin: true }, 
            data: { isAdmin: false } 
          });
        },
      },
    },
},
  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user) => {
  //         // const team = await prisma.team.findFirst();
  //         // First user ever → admin + team owner (not an employee)
  //         // if (!team) {
  //           await prisma.team.create({ data: { adminId: user.id } });
  //           await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } });
  //           // return;
  //         // }

  //         // Everyone else → employee
  //         // await prisma.employee.create({ data: { userId: user.id, teamId: team.id } });
  //       },
  //     },
  //   },
  // },


});

export type Session = typeof auth.$Infer.Session;