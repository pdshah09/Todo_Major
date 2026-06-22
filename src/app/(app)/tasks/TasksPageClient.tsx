"use client";

import { useState } from "react";
import TasksToolbar, { type FilterState, type SortKey } from "../_components/TasksToolbar";
import KanbanBoard from "../_components/KanbanBoard";
import type { Task } from "../_components/utils";

type Member = { id: string; name: string; isAdmin: boolean };

const EMPTY_FILTERS: FilterState = {
  search:      "",
  priorities:  [],
  statuses:    [],
  assigneeIds: [],
};

export default function TasksPageClient({
  tasks, members, currentUserIsAdmin, currentUserId,
}: {
  tasks: Task[];
  members: Member[];
  currentUserIsAdmin: boolean;
  currentUserId: string;
}) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort,    setSort]    = useState<SortKey>("dueAsc");

  return (
    <div className="flex h-full flex-col gap-4">
      <TasksToolbar
        members={members}
        currentUserIsAdmin={currentUserIsAdmin}
        onFilterChange={setFilters}
        onSortChange={setSort}
      />
      <div className="min-h-0 flex-1">
        <KanbanBoard
          initial={tasks}
          members={members}
          currentUserIsAdmin={currentUserIsAdmin}
          currentUserId={currentUserId}
          filters={filters}
          sort={sort}
        />
      </div>
    </div>
  );
}
