"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createTask, updateTask, deleteTask } from "../../tasks/actions";
import type { DbPriority } from "../utils";

type Member  = { id: string; name: string; isAdmin: boolean };
type Initial = {
  id?: string; title?: string; description?: string;
  dueDate?: string; priority?: DbPriority; assigneeId?: string;
};

const inputCls =
  "w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main";

/** Split an ISO datetime string into { date: "YYYY-MM-DD", time: "HH:MM" } */
function splitDateTime(iso?: string): { date: string; time: string } {
  if (!iso) return { date: "", time: "09:00" };
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-CA");           // "YYYY-MM-DD"
  const time = d.toTimeString().slice(0, 5);            // "HH:MM"
  return { date, time };
}

export default function TaskForm({
  initialData, members, onClose, currentUserIsAdmin,
}: {
  initialData?:       Initial;
  members:            Member[];
  onClose:            () => void;
  currentUserIsAdmin: boolean;
}) {
  const router  = useRouter();
  const [err,     setErr]     = useState("");
  const [pending, setPending] = useState(false);

  const { date: initDate, time: initTime } = splitDateTime(initialData?.dueDate);

  const handleDelete = async () => {
    if (!initialData?.id || !confirm("Delete this task?")) return;
    setErr(""); setPending(true);
    try {
      await deleteTask(initialData.id);
      router.refresh(); onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(""); setPending(true);
    const f = new FormData(e.currentTarget);

    // Combine date + time into a full ISO string
    const date = String(f.get("dueDate"));
    const time = String(f.get("dueTime") || "00:00");
    const dueDate = new Date(`${date}T${time}`).toISOString();

    const payload = {
      title:       String(f.get("title")),
      description: String(f.get("description") || ""),
      dueDate,
      priority:    f.get("priority") as DbPriority,
      assigneeId:  String(f.get("assigneeId")),
    };
    try {
      if (initialData?.id) await updateTask(initialData.id, payload);
      else                  await createTask(payload);
      router.refresh(); onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setPending(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Task Title</label>
        <input required name="title" defaultValue={initialData?.title} type="text"
          placeholder="Design new landing page" className={inputCls} />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
        <textarea name="description" defaultValue={initialData?.description} rows={3}
          placeholder="Add details..." className={`${inputCls} resize-none`} />
      </div>

      {/* Priority + Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Priority</label>
          <select name="priority" defaultValue={initialData?.priority || "MEDIUM"} className={inputCls}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Due Date</label>
          <input required name="dueDate" defaultValue={initDate} type="date" className={inputCls} />
        </div>
      </div>

      {/* Due Time */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Due Time</label>
        <input
          name="dueTime"
          type="time"
          defaultValue={initTime}
          className={inputCls}
        />
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Assignee</label>
        <select required name="assigneeId" defaultValue={initialData?.assigneeId || ""} className={inputCls}>
          <option value="" disabled>Select member</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}{m.isAdmin ? " (Admin)" : ""}
            </option>
          ))}
        </select>
      </div>

      {err && <p className="text-xs font-medium text-high-txt">{err}</p>}

      <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-border-light">
        {initialData?.id && (
          <button type="button" onClick={handleDelete} disabled={pending}
            className="mr-auto px-4 py-2 text-sm font-medium text-high-txt hover:opacity-80 transition-opacity disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={pending}
          className="px-4 py-2 text-sm font-medium bg-brand text-text-main rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
          {pending ? "Saving..." : initialData?.id ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
