// _components/TasksToolbar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Plus } from "lucide-react";
import Modal from "./Modal";
import TaskForm from "./forms/TaskForm";

export default function TasksToolbar() {
  const [openDropdown, setOpenDropdown] = useState<'filter' | 'sort' | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: 'filter' | 'sort') => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div ref={toolbarRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Search Bar */}
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-card rounded-md focus:outline-none focus:border-brand text-text-main placeholder:text-text-subtle shadow-md"
        />
        </div>

      {/* Right Actions: Filter -> Add Task -> Sort */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('filter')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-main hover:bg-border-light rounded-md transition-colors"
          >
            <Filter size={16} /> Filter
          </button>
          
          {openDropdown === 'filter' && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border-light rounded-md shadow-lg z-20 p-4">
              <FilterSection title="User" options={['Unassigned', 'Param Shah', 'Alice']} />
              <FilterSection title="Priority" options={['High', 'Medium', 'Low']} />
              <FilterSection title="Status" options={['To Do', 'In Progress', 'Closed']} />
            </div>
          )}
        </div>

        {/* Add New Task Button */}
        <button onClick={() => setTaskModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-canvas text-text-card rounded-md hover:opacity-80 transition-opacity">
          <Plus size={16} /> Add New Task
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sort')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-main hover:bg-border-light rounded-md transition-colors"
          >
            Sort <ArrowUpDown size={14} />
          </button>

          {openDropdown === 'sort' && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border-light rounded-md shadow-lg z-20 py-2">
              <SortOption label="A-Z" />
              <SortOption label="Z-A" />
              <SortOption label="Latest Created" />
              <SortOption label="Oldest Created" />
              <SortOption label="Latest Updates" />
              <SortOption label="Oldest Updates" />
              <SortOption label="Soonest Due" />
              <SortOption label="Latest Due" />
            </div>
          )}
        </div>
      </div>
      <Modal 
        isOpen={isTaskModalOpen} 
        onClose={() => setTaskModalOpen(false)} 
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm initialData={editingTask} onClose={() => setTaskModalOpen(false)} />
      </Modal>
    </div>
  );
}

// --- Subcomponents for clean structure ---

function FilterSection({ title, options }: { title: string, options: string[] }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider">{title}</h4>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-[13px] text-text-main cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-border-light text-brand focus:ring-brand w-3.5 h-3.5" 
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function SortOption({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-4 py-1.5 text-[13px] text-text-main hover:bg-border-light transition-colors">
      {label}
    </button>
  );
}