import React from "react";

// Replace 'any' with your Task type
export default function TaskForm({ initialData, onClose }: { initialData?: any, onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
    onClose();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Task Title</label>
        <input required defaultValue={initialData?.title} type="text" placeholder="Design new landing page" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
        <textarea defaultValue={initialData?.description} rows={3} placeholder="Add details..." className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main resize-none" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
          <select defaultValue={initialData?.status || "OPEN"} className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main">
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Priority</label>
          <select defaultValue={initialData?.priority || "MEDIUM"} className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-xs font-medium text-text-muted mb-1">Due Date</label>
           <input required defaultValue={initialData?.dueDate} type="date" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
        </div>
        <div>
           <label className="block text-xs font-medium text-text-muted mb-1">Assignee</label>
           {/* You would populate this select with actual team members */}
           <select defaultValue={initialData?.assigneeId} className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main">
             <option value="">Unassigned</option>
             <option value="user_1">Param Shah</option>
           </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-light">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-canvas text-white rounded-md hover:opacity-90 transition-opacity">
          {initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}