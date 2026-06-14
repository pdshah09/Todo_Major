// _components/RecentTasks.tsx

import React from "react";
import { COLUMNS, INITIAL_TASKS } from "./utils"; // Adjust path if needed
import TaskCard from "./TaskCard";    // Adjust path if needed

export default function RecentTasks() {
  return (
    <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 w-full h-full">
      {COLUMNS.map((status) => {
        const columnTasks = INITIAL_TASKS.filter((task) => task.status === status);
        
        return (
          <div 
            key={status} 
            className="flex flex-col bg-column rounded-[var(--radius-dashboard)] p-4 w-[340px] flex-shrink-0 min-h-full overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-4 px-1">
              <h2 className="font-semibold text-text-main text-[15px]">{status}</h2>
              <span className="text-sm text-text-muted">{columnTasks.length}</span>
            </div>

            <div className="flex flex-col gap-3">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}