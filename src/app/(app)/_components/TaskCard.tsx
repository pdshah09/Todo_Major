"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./utils";

// Exact badge colours from globals.css tokens
const PRIORITY_BADGE: Record<string, string> = {
  Low:    "bg-low-bg    text-low-txt",
  Medium: "bg-med-bg    text-med-txt",
  High:   "bg-high-bg   text-high-txt",
};

export default function TaskCard({
  task,
  onEdit,
  isOverlay,
  currentUserId,
  currentUserIsAdmin,
  columnReadOnly,
}: {
  task: Task;
  onEdit?: (task: Task) => void;
  isOverlay?: boolean;
  currentUserId?: string;
  currentUserIsAdmin?: boolean;
  columnReadOnly?: boolean;
}) {
  const isDraggable =
    !columnReadOnly &&
    task.status !== "Over Due" &&
    (currentUserIsAdmin || task.assigneeId === currentUserId);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const due     = new Date(task.dueDate);
  const isToday = due.toDateString() === new Date().toDateString();
  const isPast  = due < new Date() && !isToday;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
      className={`group relative rounded-[var(--radius-card)] bg-card p-3 shadow-sm ${
        isOverlay ? "rotate-2 shadow-lg" : ""
      } ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
    >
      {/* Priority badge top-left */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          PRIORITY_BADGE[task.priority] ?? "bg-gray-100 text-gray-500"
        }`}>
          {task.priority}
        </span>

        {/* Edit pencil — admin only, shown on hover */}
        {onEdit && currentUserIsAdmin && (
          <button
            onClick={e => { e.stopPropagation(); onEdit(task); }}
            className="shrink-0 rounded p-1 text-text-subtle opacity-0 transition hover:bg-border-light hover:text-text-main group-hover:opacity-100"
            aria-label="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      <p className="mb-1 line-clamp-2 text-sm font-semibold text-text-main leading-snug">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="mb-2 line-clamp-2 text-xs text-text-muted leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer: assignee initial + due date */}
      <div className="mt-2 flex items-center justify-between gap-2">
        {/* Assignee initials badge */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
          {task.assignee?.slice(0, 1).toUpperCase() ?? "?"}
        </span>

        {/* Days left / due date */}
        <span className={`text-[11px] font-medium ${
          isPast  ? "text-high-txt" :
          isToday ? "text-med-txt"  :
                    "text-text-subtle"
        }`}>
          {isPast
            ? `${Math.abs(task.daysLeft)}d overdue`
            : isToday
              ? "Due today"
              : `${task.daysLeft}d left`}
        </span>
      </div>
    </div>
  );
}
