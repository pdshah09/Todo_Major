"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext, DragOverlay, closestCorners,
  KeyboardSensor, PointerSensor,
  useSensor, useSensors,
  type DragStartEvent, type DragOverEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Status, Task, COLUMNS, STATUS_TO_DB, PRIORITY_TO_DB } from "./utils";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import Modal from "./Modal";
import TaskForm from "./forms/TaskForm";
import { updateTaskStatus } from "../tasks/actions";
import type { FilterState, SortKey } from "./TasksToolbar";

type Member = { id: string; name: string; isAdmin: boolean };

/**
 * Columns that employees may drag tasks between.
 * Over Due is always system-managed and read-only for everyone.
 */
const EMPLOYEE_DRAGGABLE_COLS: Status[] = ["Open", "In Progress", "Closed"];

export default function KanbanBoard({
  initial, members, currentUserIsAdmin, currentUserId, filters, sort,
}: {
  initial: Task[];
  members: Member[];
  currentUserIsAdmin: boolean;
  currentUserId: string;
  filters?: FilterState;
  sort?: SortKey;
}) {
  const [tasks, setTasks]           = useState<Task[]>(initial);
  const [active, setActive]         = useState<Task | null>(null);
  const [fromStatus, setFromStatus] = useState<Status | null>(null);
  const [editing, setEditing]       = useState<Task | null>(null);

  useEffect(() => { setTasks(initial); }, [initial]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /**
   * canDragTask — determines whether a specific task card is draggable.
   *   Admin    : can drag any task in any non-OverDue column.
   *   Employee : can drag only tasks assigned to them, in OPEN/IN_PROGRESS/CLOSED.
   */
  function canDragTask(task: Task): boolean {
    if (task.status === "Over Due") return false;
    if (currentUserIsAdmin) return true;
    return task.assigneeId === currentUserId && EMPLOYEE_DRAGGABLE_COLS.includes(task.status);
  }

  const displayed = useMemo(() => {
    let t = [...tasks];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      t = t.filter(x =>
        x.title.toLowerCase().includes(q) ||
        x.description.toLowerCase().includes(q)
      );
    }
    if (filters?.priorities?.length)  t = t.filter(x => filters.priorities.includes(x.priority));
    if (filters?.statuses?.length)    t = t.filter(x => filters.statuses.includes(x.status));
    if (filters?.assigneeIds?.length) t = t.filter(x => filters.assigneeIds.includes(x.assigneeId));
    if (sort === "az")          t.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "za")     t.sort((a, b) => b.title.localeCompare(a.title));
    else if (sort === "dueAsc") t.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    else if (sort === "dueDsc") t.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    return t;
  }, [tasks, filters, sort]);

  const byCol = useMemo(
    () => Object.fromEntries(
      COLUMNS.map(c => [c, displayed.filter(t => t.status === c)])
    ) as Record<Status, Task[]>,
    [displayed],
  );

  const colOf = (id: string): Status | undefined =>
    COLUMNS.includes(id as Status) ? (id as Status) : tasks.find(t => t.id === id)?.status;

  function onDragStart({ active: a }: DragStartEvent) {
    const t = tasks.find(t => t.id === String(a.id)) ?? null;
    if (!t || !canDragTask(t)) return;
    setActive(t);
    setFromStatus(t.status);
  }

  function onDragOver({ active: a, over }: DragOverEvent) {
    if (!active || !over) return;
    const activeId = String(a.id), overId = String(over.id);
    if (activeId === overId) return;
    const from = colOf(activeId), to = colOf(overId);
    if (!from || !to || from === to) return;
    // Both source and target must be in employee-allowed cols
    if (!currentUserIsAdmin) {
      if (!EMPLOYEE_DRAGGABLE_COLS.includes(from) || !EMPLOYEE_DRAGGABLE_COLS.includes(to)) return;
    }
    if (to === "Over Due" || from === "Over Due") return;
    setTasks(prev => prev.map(t => (t.id === activeId ? { ...t, status: to } : t)));
  }

  function onDragEnd({ active: a, over }: DragEndEvent) {
    setActive(null);
    if (!over) { setFromStatus(null); return; }
    const activeId = String(a.id), overId = String(over.id);
    const moved = tasks.find(t => t.id === activeId);
    if (!moved || moved.status === "Over Due") { setFromStatus(null); return; }
    const targetCol = colOf(overId);
    if (targetCol === "Over Due") { setFromStatus(null); return; }

    if (moved && fromStatus && moved.status !== fromStatus) {
      updateTaskStatus(activeId, STATUS_TO_DB[moved.status]).catch(() => setTasks(initial));
    }
    setFromStatus(null);

    if (activeId === overId) return;
    setTasks(prev => {
      const ai = prev.findIndex(t => t.id === activeId);
      const oi = prev.findIndex(t => t.id === overId);
      if (ai < 0 || oi < 0 || prev[ai].status !== prev[oi].status) return prev;
      return arrayMove(prev, ai, oi);
    });
  }

  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {COLUMNS.map(col => (
          <TaskColumn
            key={col}
            status={col}
            tasks={byCol[col]}
            currentUserId={currentUserId}
            currentUserIsAdmin={currentUserIsAdmin}
            // Edit pencil: admin only, not on Over Due
            onEdit={currentUserIsAdmin && col !== "Over Due" ? setEditing : undefined}
            // Column drag disabled only for Over Due
            readOnly={col === "Over Due"}
          />
        ))}
        <DragOverlay>
          {active ? <TaskCard task={active} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Edit modal — admin only */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Task">
        {editing && (
          <TaskForm
            members={members}
            currentUserIsAdmin={currentUserIsAdmin}
            onClose={() => setEditing(null)}
            initialData={{
              id:          editing.id,
              title:       editing.title,
              description: editing.description,
              dueDate:     editing.dueDate.slice(0, 10),
              priority:    PRIORITY_TO_DB[editing.priority],
              assigneeId:  editing.assigneeId,
            }}
          />
        )}
      </Modal>
    </div>
  );
}
