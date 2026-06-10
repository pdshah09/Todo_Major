import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Status, Priority, Task, INITIAL_TASKS, COLUMNS, BADGE } from "./utils";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status, tasks }: { status: Status; tasks: Task[] }) {
  const { setNodeRef } = useSortable({ id: status, data: { type: "Column" } });
  return (
    <div className="flex min-h-[600px] w-[340px] flex-shrink-0 flex-col rounded-dashboard bg-column p-4">
      <div className="mb-4 flex items-center gap-2 px-1">
        <h2 className="font-semibold text-text-main">{status}</h2>
        <span className="text-sm text-text-muted">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="flex flex-grow flex-col gap-3">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        </SortableContext>
      </div>
      <button className="mt-4 flex items-center gap-2 px-2 py-2 text-text-muted transition-colors hover:text-text-main">
        <Plus size={16} /> New
      </button>
    </div>
  );
}