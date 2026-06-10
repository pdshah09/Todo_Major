// ../components/TaskCard.tsx

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MessageSquare, Paperclip, Clock } from "lucide-react";
import { Status, Priority, Task, INITIAL_TASKS, COLUMNS, BADGE } from "./utils";
import { CSS } from "@dnd-kit/utilities";


export default function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
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