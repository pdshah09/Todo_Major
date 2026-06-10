// _components/RecentTasks.tsx

"use client";

import React from "react";
import { INITIAL_TASKS } from "./utils"; 
import TaskCard from "./TaskCard"; 

export default function RecentTasks() {
  // Filter/Sort logic: Sorting by least days left to simulate "recent/urgent"
  // Slicing to show only the top 4 recent tasks
  const recentTasks = [...INITIAL_TASKS]
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  return (
    <div className="flex flex-col bg-column rounded-[var(--radius-dashboard)] p-4 w-full max-w-full/50 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 px-1 shrink-0">
        <h2 className="font-semibold text-text-main text-[15px]">Recent Tasks</h2>
        <span className="text-sm text-text-muted">{recentTasks.length}</span>
      </div>

      {/* Task List (Scrollable if it exceeds widget height) */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-2">
        {recentTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}