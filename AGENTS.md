# AGENTS.md — AI Agent & Codegen Rules for Todo_Major

> This file tells any AI coding agent (Copilot, Claude, Cursor, Perplexity, etc.)
> how this codebase works, what it must never break, and the exact patterns to follow.

---

## Project Identity

- **Stack:** Next.js 15 (App Router) · TypeScript · Prisma · PostgreSQL · BetterAuth · Tailwind CSS · dnd-kit
- **Auth library:** `better-auth` — session stored in DB (`Session` table), not stateless JWT
- **ORM:** Prisma with output path `src/generated/prisma` (never import from `@prisma/client`)
- **Style:** Tailwind utility classes only — no inline `style={}` except for dnd-kit transforms

---

## Role Model — Read This First

```
User table = ALL human accounts (both admins and employees)

Admin   → User row with isAdmin=true  + NO Employee record
Employee→ User row with isAdmin=false + Employee record pointing to a Team

isAdmin is a DB column, NOT a JWT claim.
It is set/unset exclusively inside lib/auth.ts databaseHooks.
Never set isAdmin anywhere else.
```

**The three-step login contract (must be preserved in `lib/auth.ts`):**
1. Bulk-set `isAdmin=false` for ALL users who have an `Employee` record.
2. Set `isAdmin=true` for the user who just logged in — ONLY if they have no `Employee` record.
3. On logout (`session.delete.after`) — set `isAdmin=false` for the departing user.

---

## File Ownership Map

| File | What it owns | What it must NOT do |
|---|---|---|
| `lib/auth.ts` | isAdmin lifecycle, session config | Business logic, Prisma queries beyond user/employee/team |
| `lib/auth-helpers.ts` | `requireUser`, `requireAdmin`, `getSessionTeamUserIds` | Side effects, mutations |
| `tasks/actions.ts` | Task CRUD server actions | Skip `requireAdminUser()` guard |
| `team/actions.ts` | Employee CRUD server actions | Allow employees to call them |
| `_components/KanbanBoard.tsx` | Board read-only state, drag logic | Fetch data, call actions directly |
| `_components/TasksToolbar.tsx` | Search/filter/sort UI, Add Task button | Show Add Task to non-admins |
| `app/components/Sidenav.tsx` | Navigation links, Team link gating | Hard-code isAdmin |

---

## Patterns to Follow

### Server Components (pages)
```typescript
// Always force-dynamic on pages that read session
export const dynamic = "force-dynamic";

// Always gate with requireUser() or requireAdmin()
const user = await requireUser();

// Always scope DB queries to team
const ids = await getSessionTeamUserIds();
const tasks = await prisma.task.findMany({ where: { assigneeId: { in: ids } } });
```

### Server Actions
```typescript
"use server";
// Admin-only actions: always guard first
async function requireAdminUser() {
  const u = await requireUser();
  if (!u.isAdmin) throw new Error("Admins only");
  return u;
}
export async function createTask(...) {
  await requireAdminUser();
  // ... rest of action
}
```

### Overdue Sync Pattern
```typescript
// Inline in any force-dynamic page that shows tasks — NO revalidatePath needed
if (ids.length) {
  await prisma.task.updateMany({
    where: {
      assigneeId: { in: ids },
      dueDate:    { lt: new Date() },
      status:     { notIn: ["CLOSED", "OVER_DUE"] },
    },
    data: { status: "OVER_DUE" },
  });
}
```

### Phone Number Field
```tsx
{/* Always use split-field pattern — never a plain text input for phone */}
<div className="input-box input-box-mobile">
  <span className="input-group-text">+91</span>
  <input
    type="tel" id="phoneNumber" placeholder="Enter Phone Number"
    pattern="[0-9]{10}" maxLength={10} required
    onInput={e => {
      const t = e.currentTarget;
      t.value = t.value.replace(/[^0-9]/g, "").slice(0, 10);
    }}
  />
  <i className="bx bxs-phone" />
</div>
{/* Server-side validation: /^[0-9]{10}$/.test(number) */}
{/* Storage: prepend +91 before saving → "+91" + number */}
{/* Display / edit: strip +91 prefix before pre-filling the input */}
```

---

## Invariants — Never Break These

1. **`isAdmin` comes from DB, not session token.**
   Always call `requireUser()` which does `prisma.user.findUniqueOrThrow` — never trust `session.user.isAdmin`.

2. **Session persists across `npm run dev` restarts.**
   BetterAuth reads `Session` from PostgreSQL. Do not add `cookieOptions: { maxAge: 0 }` or other session-killing config. The browser cookie stays valid as long as the DB row exists.

3. **Employees are read-only everywhere.**
   - No `createTask`, `updateTask`, `deleteTask`, `updateTaskStatus` calls succeed for non-admins.
   - `KanbanBoard` receives `boardReadOnly=true` → no drag handles, no edit pencil.
   - `TasksToolbar` receives `currentUserIsAdmin=false` → Add Task button absent.

4. **Over Due is system-managed.**
   - Never render an edit button or drag handle on Over Due cards.
   - Never allow `updateTaskStatus` to set `status = "OVER_DUE"` — it is set only by the inline sync block.
   - Drag from any column into Over Due is blocked (client + server).

5. **Admin self-assign is valid.**
   `getTeamMembers()` returns the admin themselves in the list. `TaskForm` assignee dropdown includes admin. No guard blocks `assigneeId === createdById`.

6. **Team page is admin-only.**
   `team/page.tsx` calls `requireAdmin()` as first statement. Sidebar hides the Team link when `isAdmin=false`.

7. **Prisma import path.**
   Always: `import { prisma } from "@/lib/prisma"` — never `import { PrismaClient } from "@prisma/client"`.

---

## What Agents Must Ask Before Changing

Before modifying any of these files, confirm the full impact:

| File | Why it's risky |
|---|---|
| `lib/auth.ts` | Changes affect login/logout for ALL users |
| `prisma/schema.prisma` | Requires migration — never change without `prisma migrate dev` |
| `lib/auth-helpers.ts` | `requireUser` is called on every protected page |
| `tasks/actions.ts` | All task mutations go through here — breaking it affects both admin and employee views |
| `app/(app)/layout.tsx` | Wraps every protected page — performance and auth bugs surface here |

---

## Do Not Add

- `localStorage` or `sessionStorage` — not available in sandboxed/SSR contexts.
- A separate `isAdmin` cookie — the DB is the single source of truth.
- Client-side `isAdmin` checks as the **only** guard — always pair with a server-side `requireAdminUser()`.
- Any new page under `(app)/` without `requireUser()` or `requireAdmin()` at the top.
- Manual `revalidatePath` inside `syncOverdueTasks` — it's called during a `force-dynamic` render.
