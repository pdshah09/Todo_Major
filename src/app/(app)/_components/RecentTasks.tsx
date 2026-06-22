// _components/RecentTasks.tsx

import { Task } from "./utils";
import TaskCard from "./TaskCard";

export default function RecentTasks({ tasks }: { tasks: Task[] }) {
  // Most urgent first (least days left), top 4
  const recentTasks = [...tasks].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 4);

  return (
    <div className="flex flex-col bg-column rounded-[var(--radius-dashboard)] p-4 w-full h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-4 px-1 shrink-0">
        <h2 className="font-semibold text-text-main text-[15px]">Recent Tasks</h2>
        <span className="text-sm text-text-muted">{recentTasks.length}</span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-2">
        {recentTasks.length === 0 && (
          <p className="text-sm text-text-muted px-1">No tasks yet.</p>
        )}
        {recentTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            currentUserId=""
            currentUserIsAdmin={false}
            columnReadOnly
          />
        ))}
      </div>
    </div>
  );
}
