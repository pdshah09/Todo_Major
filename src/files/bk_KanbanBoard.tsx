// _components/KanbanBoard.tsx

"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Aligning with your model requirements
export type Status = "Backlog" | "To Do" | "In Progress" | "Closed";
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  daysLeft: number;
  comments: number;
  attachments: number;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Feed Research", description: "Feed design is required for our new project. Let's research the best practices.", status: "Backlog", priority: "Low", daysLeft: 12, comments: 1, attachments: 0 },
  { id: "2", title: "Design System", description: "Design decisions need to be taken for our new project.", status: "Backlog", priority: "High", daysLeft: 15, comments: 2, attachments: 10 },
  { id: "3", title: "Update Last Design Folder", description: "", status: "Backlog", priority: "Medium", daysLeft: 12, comments: 2, attachments: 0 },
  { id: "4", title: "Create Dashboard Component", description: "Create of calendar and feed components for dashboard design.", status: "To Do", priority: "High", daysLeft: 26, comments: 1, attachments: 14 },
  { id: "5", title: "Calendar Research", description: "Researching for calendar design. Don't forget the timezone.", status: "To Do", priority: "Medium", daysLeft: 32, comments: 2, attachments: 6 },
  { id: "6", title: "Add Kanban Design to Your Portfolio", description: "Don't forget to design it nicely before adding it to your portfolio.", status: "In Progress", priority: "Low", daysLeft: 67, comments: 3, attachments: 43 },
  { id: "7", title: "Create Wireframe for Mobile", description: "", status: "In Progress", priority: "Medium", daysLeft: 12, comments: 2, attachments: 6 },
  { id: "8", title: "Create Wireframe for Kanban", description: "Kanban design is required for our new project, let's research the best practices.", status: "Closed", priority: "Low", daysLeft: 67, comments: 2, attachments: 11 },
  { id: "9", title: "Navigation Prototype", description: "", status: "Closed", priority: "High", daysLeft: 26, comments: 1, attachments: 16 },
];

const COLUMNS: Status[] = ["Backlog", "To Do", "In Progress", "Closed"];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(tasks.find((task) => task.id === active.id) || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a task into an empty column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId as Status;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      return arrayMove(tasks, activeIndex, overIndex);
    });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map((col) => (
          <Column
            key={col}
            status={col}
            tasks={tasks.filter((task) => task.status === col)}
          />
        ))}

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// --- Subcomponents ---

function Column({ status, tasks }: { status: Status; tasks: Task[] }) {
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: "Column", status },
  });

  return (
    <div className="flex flex-col bg-column rounded-[var(--radius-dashboard)] p-4 w-[340px] flex-shrink-0 min-h-[600px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <h2 className="font-semibold text-text-main">{status}</h2>
        <span className="text-sm text-text-muted">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 flex-grow">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      <button className="flex items-center gap-2 text-text-muted hover:text-text-main mt-4 px-2 py-2 transition-colors duration-200">
        <PlusIcon /> New
      </button>
    </div>
  );
}

function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const badgeStyles = {
    High: "bg-high-bg text-high-txt",
    Medium: "bg-med-bg text-med-txt",
    Low: "bg-low-bg text-low-txt",
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-card/50 border-2 border-dashed border-brand rounded-[var(--radius-card)] h-[140px] opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card p-4 rounded-[var(--radius-card)] border border-border-light shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isOverlay ? "rotate-2 scale-105 shadow-xl cursor-grabbing" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md ${
            badgeStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
        <div className="flex items-center text-text-subtle text-xs gap-1">
          <ClockIcon /> {task.daysLeft} days
        </div>
      </div>

      <h3 className="font-semibold text-text-main text-sm mb-1">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-text-muted text-xs line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-auto pt-2">
        <div className="flex items-center gap-3 text-text-subtle text-xs">
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageIcon /> {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <PaperclipIcon /> {task.attachments}
            </span>
          )}
        </div>
        
        {/* Mock Avatar Pile */}
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 border border-card flex items-center justify-center text-[10px] font-bold text-gray-600">
            A
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-300 border border-card flex items-center justify-center text-[10px] font-bold text-gray-700">
            B
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Icons (Minimal Inline SVGs) ---
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MessageIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);