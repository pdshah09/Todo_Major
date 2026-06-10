// tasks/page.tsx

import InitialsBadge from '../_components/InitialsBadge';
import KanbanBoard from '../_components/KanbanBoard';
import TasksToolbar from '../_components/TasksToolbar';

export default async function TaskPage() {
  return (
    <section className="space-y-2 p-2 h-[calc(100vh-2rem)] flex flex-col">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-main">Tasks - Kanban</h1>
        <InitialsBadge name="Param Shah"/>
      </div> */}
      
        {/* Search, Filter, Add Task, and Sort */}
      <TasksToolbar />

      {/* The Kanban board handles its own internal scrolling 
        so it doesn't break the main page layout 
      */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </section>
  );
}