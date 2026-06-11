
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Status {
  OPEN
  IN_PROGRESS @map("IN PROGRESS")
  CLOSED
  OVER_DUE @map("OVER DUE")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id        String   @id @default(uuid())
  name      String
  number    String   @unique
  email     String   @unique
  isAdmin   Boolean  @default(false) // Check if admin using boolean
  createdAt DateTime @default(now())

  // Relations
  managedTeam     Team?     @relation("TeamAdmin")
  employeeProfile Employee?
  assignedTasks   Task[]    @relation("TaskAssignee")
  createdTasks    Task[]    @relation("TaskCreator")
  emailVerified   Boolean   @default(false)
  image           String?
  updatedAt       DateTime  @updatedAt
  sessions        Session[]
  accounts        Account[]

  @@map("user")
}

model Team {
  id      String     @id @default(uuid())
  adminId String     @unique
  admin   User       @relation("TeamAdmin", fields: [adminId], references: [id], onDelete: Cascade)
  // Note: The maximum 5 employees constraint must be enforced in your API/application logic 
  // before running a Prisma `create` or `connect` query.
  members Employee[]
}

model Employee {
  id     String @id @default(uuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  teamId String
  team   Team   @relation(fields: [teamId], references: [id], onDelete: Cascade)
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  dueDate     DateTime // Native DateTime objects handle both Date and Time perfectly
  status      Status   @default(OPEN)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())

  // Tracking both the Creator and Assignee is essential for your ERP logic.
  // This allows the app to verify if an Employee is trying to assign to an Admin and block it.
  createdById String
  creator     User   @relation("TaskCreator", fields: [createdById], references: [id])

  assigneeId String
  assignee   User   @relation("TaskAssignee", fields: [assigneeId], references: [id])

  // --- Indexes for Optimized Sorting & Filtering ---
  // Sorting Indexes: (a-z/z-a, oldest/newest, soonest/latest)

  // Individual Filtering Indexes: (user, status, priority)
  // Composite Indexes: For high-performance queries when multiple filters are applied
  @@index([title])
  @@index([createdAt])
  @@index([dueDate])
  @@index([assigneeId])
  @@index([status])
  @@index([priority])
  @@index([status, priority])
  @@index([assigneeId, status, priority])
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
