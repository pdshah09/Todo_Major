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
  
  emailAndPassword: { enabled: true },
  
  user: {
    additionalFields: {
      number: { type: "string", required: true },
      isAdmin: { type: "boolean", required: false, defaultValue: false },
    },
  },
});

export type Session = typeof auth.$Infer.Session;