// _components/forms/EmployeeForm.tsx
"use client";

import { useEffect, useState } from "react";
import { getUnassignedUsers } from "../../team/actions";

type U = { id: string; name: string; email: string; number: string };
const input =
  "w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main";

export default function EmployeeForm({
  initialData, action, onClose,
}: {
  initialData?: { name: string; email: string; number: string } | null;
  action: (data: FormData) => void;
  onClose: () => void;
}) {
  const editing = !!initialData;
  const [users, setUsers] = useState<U[]>([]);

  useEffect(() => {
    if (!editing) getUnassignedUsers().then(setUsers).catch(() => setUsers([]));
  }, [editing]);

  return (
    <form action={action} className="flex flex-col gap-4">
      {editing ? (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Full Name</label>
            <input required name="name" defaultValue={initialData?.name} className={input} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Email</label>
            <input required name="email" type="email" defaultValue={initialData?.email} className={input} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Phone Number</label>
            <input required name="number" type="tel" defaultValue={initialData?.number} className={input} />
          </div>
        </>
      ) : (
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Select User</label>
          <select required name="userId" defaultValue="" className={input}>
            <option value="" disabled>Choose a user…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
            ))}
          </select>
          {users.length === 0 && (
            <p className="mt-1 text-xs text-text-subtle">No unassigned users available.</p>
          )}
        </div>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-main">
          Cancel
        </button>
        <button type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-text-main transition-opacity hover:opacity-90">
          {editing ? "Save Changes" : "Add to Team"}
        </button>
      </div>
    </form>
  );
}