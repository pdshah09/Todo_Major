// _components/KanbanBoard.tsx
"use client";

import { useMemo, useState } from "react";
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MessageSquare, Paperclip, Plus } from "lucide-react";
import { Status, Priority, Task, INITIAL_TASKS, COLUMNS, BADGE } from "./utils";
import TaskColumn from "./TaskColumn";



export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [active, setActive] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const byCol = useMemo(
    () => Object.fromEntries(COLUMNS.map(c => [c, tasks.filter(t => t.status === c)])) as Record<Status, Task[]>,
    [tasks],
  );

  const colOf = (id: string): Status | undefined =>
    COLUMNS.includes(id as Status) ? (id as Status) : tasks.find(t => t.id === id)?.status;

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeId = String(active.id), overId = String(over.id);
    if (activeId === overId) return;

    const from = colOf(activeId), to = colOf(overId);
    if (!from || !to || from === to) return;

    // cross-column: reassign status immutably
    setTasks(prev => prev.map(t => (t.id === activeId ? { ...t, status: to } : t)));
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActive(null);
    if (!over) return;
    const activeId = String(active.id), overId = String(over.id);
    if (activeId === overId) return;

    // same-column reorder
    setTasks(prev => {
      const a = prev.findIndex(t => t.id === activeId);
      const o = prev.findIndex(t => t.id === overId);
      if (a < 0 || o < 0 || prev[a].status !== prev[o].status) return prev;
      return arrayMove(prev, a, o);
    });
  }

  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }: DragStartEvent) => setActive(tasks.find(t => t.id === active.id) ?? null)}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {COLUMNS.map(col => <TaskColumn key={col} status={col} tasks={byCol[col]} />)}
        <DragOverlay>{active ? <TaskCard task={active} isOverlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "Task" } });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging && !isOverlay)
    return <div ref={setNodeRef} style={style}
      className="h-[140px] rounded-card border-2 border-dashed border-brand bg-card/50 opacity-50" />;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`cursor-grab rounded-card bg-card p-4 shadow-sm transition-shadow
        hover:shadow-md active:cursor-grabbing ${isOverlay ? "rotate-2 scale-105 cursor-grabbing shadow-xl" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${BADGE[task.priority]}`}>{task.priority}</span>
        <div className="flex items-center gap-1 text-xs text-text-subtle"><Clock size={12} /> {task.daysLeft} days</div>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-text-main">{task.title}</h3>
      {task.description && <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-text-muted">{task.description}</p>}
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-3 text-xs text-text-subtle">
          {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare size={12} /> {task.comments}</span>}
          {task.attachments > 0 && <span className="flex items-center gap-1"><Paperclip size={12} /> {task.attachments}</span>}
        </div>
        <div className="flex -space-x-2">
          <div className="flex size-6 items-center justify-center rounded-full border border-card bg-brand-light text-[10px] font-bold text-brand">A</div>
          <div className="flex size-6 items-center justify-center rounded-full border border-card bg-column text-[10px] font-bold text-text-muted">B</div>
        </div>
      </div>
    </div>
  );
}