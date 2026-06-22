"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import type { Status, Task } from "./utils";

// Column header dot colour — matches priority/status semantics in the design
const DOT: Record<Status, string> = {
  "Open":        "bg-[#6b7280]",
  "In Progress": "bg-[#f59e0b]",
  "Closed":      "bg-[#10b981]",
  "Over Due":    "bg-[#ef4444]",
};

export default function TaskColumn({
  status, tasks, onEdit, readOnly, currentUserId, currentUserIsAdmin,
}: {
  status: Status;
  tasks: Task[];
  onEdit?: (task: Task) => void;
  readOnly?: boolean;
  currentUserId: string;
  currentUserIsAdmin: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status, disabled: readOnly });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[300px] max-w-[400px] flex-col rounded-[var(--radius-dashboard)] bg-column transition-shadow duration-200 ${
        isOver && !readOnly ? "ring-2 ring-brand ring-offset-2" : ""
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${DOT[status]}`} />
          <h3 className="text-sm font-semibold text-text-main">{status}</h3>
        </div>
        <span className="text-sm text-text-muted font-medium">{tasks.length}</span>
      </div>

      {/* Cards */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3">
          {tasks.length === 0 && (
            <p className="py-8 text-center text-xs text-text-subtle">No tasks</p>
          )}
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              currentUserId={currentUserId}
              currentUserIsAdmin={currentUserIsAdmin}
              columnReadOnly={readOnly}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
