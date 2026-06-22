# STRUCTURE.md — Todo_Major Project Architecture

> **Snapshot commit:** `2b6d46d` — Keep this file updated whenever routes, models, or lib utilities change.

---

## Repository Layout

```
Todo_Major/
├── prisma/
│   ├── schema.prisma          # Single source of truth for DB models
│   └── migrations/            # Auto-generated migration history
│
├── src/
│   ├── proxy.ts               # Edge middleware — auth session proxy
│   ├── generated/prisma/      # Prisma client output (do not edit)
│   │
│   ├── lib/
│   │   ├── auth.ts            # BetterAuth config + isAdmin lifecycle hooks
│   │   ├── auth-client.ts     # Browser-side auth client (sign in/out)
│   │   ├── auth-helpers.ts    # requireUser · requireAdmin · getSessionTeamUserIds
│   │   ├── prisma.ts          # Prisma singleton (dev hot-reload safe)
│   │   └── queries/
│   │       └── stats.ts       # getTaskStats(ids) — KPI aggregation
│   │
│   └── app/
│       ├── layout.tsx         # Root HTML shell (fonts, global CSS)
│       ├── globals.css        # Tailwind base + custom tokens
│       ├── page.tsx           # Public landing / redirect to /dashboard
│       ├── not-found.tsx      # 404 page
│       │
│       ├── components/        # Shared UI (used across routes)
│       │   ├── Sidenav.tsx       # Desktop sidebar — hides Team link for employees
│       │   ├── MobileHeader.tsx  # Mobile top-bar with hamburger nav
│       │   ├── header.tsx        # In-app top header (user info, logout)
│       │   ├── entryField.tsx    # Reusable input field component
│       │   └── buttons.tsx       # Reusable button components
│       │
│       ├── api/
│       │   └── auth/[...all]/route.ts   # BetterAuth catch-all API handler
│       │
│       ├── signin/page.tsx    # Sign-in form (email + password)
│       ├── signup/page.tsx    # Sign-up form (admin registration only)
│       │
│       └── (app)/             # Route group — guarded by requireUser()
│           ├── layout.tsx         # App shell: Sidenav + Header + main
│           │
│           ├── dashboard/
│           │   └── page.tsx       # KPI grid + recent tasks (force-dynamic)
│           │
│           ├── tasks/
│           │   ├── page.tsx           # Server: fetch tasks, sync overdue, pass to client
│           │   ├── TasksPageClient.tsx # Client shell: toolbar + kanban board
│           │   └── actions.ts         # Server actions: createTask · updateTask · deleteTask · syncOverdueTasks
│           │
│           ├── team/
│           │   ├── page.tsx           # Server: requireAdmin + fetch members (force-dynamic)
│           │   └── actions.ts         # Server actions: addEmployee · updateEmployee · deleteEmployee
│           │
│           └── _components/          # Feature UI components (tasks + team)
│               ├── utils.tsx              # Shared enums, type maps, helpers
│               ├── KanbanBoard.tsx        # DnD board — read-only for employees
│               ├── TaskCard.tsx           # Single task card with due-date logic
│               ├── TaskColumn.tsx         # Droppable column wrapper
│               ├── TasksToolbar.tsx       # Search · Filter · Sort · Add Task (admin only)
│               ├── TeamManager.tsx        # Employee CRUD table (admin only view)
│               ├── KpiGrid.tsx            # Dashboard KPI cards grid
│               ├── KpiCard.tsx            # Single KPI metric card
│               ├── RecentTasks.tsx        # Dashboard recent-tasks list
│               ├── NotificationBanner.tsx # Employee alert banner (overdue/high-priority)
│               ├── Modal.tsx              # Generic modal wrapper
│               ├── InitialsBadge.tsx      # Avatar initials circle
│               └── forms/
│                   ├── TaskForm.tsx       # Create/Edit task form (admin only)
│                   └── EmployeeForm.tsx   # Create/Edit employee form (+91 phone field)
```

---

## Database Models

```
User ──────────────────────────────────────────────────────
  id, name, email, number (unique), isAdmin (default false)
  emailVerified, image, createdAt, updatedAt
  → managedTeam (Team)         — admin has one team
  → employeeProfile (Employee) — employee has one record
  → assignedTasks, createdTasks (Task[])
  → sessions (Session[]), accounts (Account[])

Team ──────────────────────────────────────────────────────
  id, adminId (→ User, unique)
  → members (Employee[])

Employee ──────────────────────────────────────────────────
  id, userId (→ User, unique), teamId (→ Team)
  Cascade delete on user/team removal.

Task ──────────────────────────────────────────────────────
  id, title, description?, dueDate, status (OPEN|IN_PROGRESS|CLOSED|OVER_DUE)
  priority (LOW|MEDIUM|HIGH), createdAt
  createdById (→ User), assigneeId (→ User)
  Indexes: title, createdAt, dueDate, assigneeId, status, priority,
           (status,priority), (assigneeId,status,priority)

Session / Account / Verification — managed by BetterAuth
```

---

## Auth & Role System

| Concept | Value | Where stored |
|---|---|---|
| Admin account | `User.isAdmin = true` | DB (set on session create) |
| Employee account | `User.isAdmin = false` + `Employee` record | DB |
| Session persistence | BetterAuth `Session` table | DB (survives server restart) |
| `isAdmin` flag | Toggled by `auth.ts` hooks, read from DB on every request | DB — never from JWT |

**`isAdmin` lifecycle (enforced in `lib/auth.ts` databaseHooks):**
1. `session.create.after` — set all known employee `userId`s to `isAdmin=false`, set current user `isAdmin=true` only if no `Employee` record exists.
2. `session.delete.after` — strip `isAdmin=false` from the logging-out user.

**Session survives `npm run dev` restart** because BetterAuth reads the `Session` table from PostgreSQL — there is no in-memory session store.

---

## Data Flow

```
Browser request
  → proxy.ts (edge middleware — session cookie check)
  → Next.js route
  → requireUser() / requireAdmin()   [lib/auth-helpers.ts]
       ↓ reads User from DB (isAdmin live, not from cookie)
  → Server Component / Server Action
       ↓ Prisma query scoped to getSessionTeamUserIds()
  → Client Component (receives serialised data as props)
```

---

## Key Invariants (Do Not Break)

- **`isAdmin` is never derived from the JWT/session token** — always fetched fresh from `User` table via `requireUser()`.
- **Overdue sync is automatic** — triggered inline on every `/dashboard` and `/tasks` page render via `force-dynamic`. No cron, no manual button.
- **Employees have zero write access** — all mutating Server Actions call `requireAdminUser()` and throw if `isAdmin=false`.
- **Over Due column is system-only** — drag into/out of it is blocked both client-side (KanbanBoard) and server-side (status cannot be set to OVER_DUE via UI).
- **Team page is admin-only** — `requireAdmin()` redirects employees to `/dashboard` before any data is fetched.
