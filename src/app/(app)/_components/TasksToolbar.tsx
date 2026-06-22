"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Plus } from "lucide-react";
import Modal from "./Modal";
import TaskForm from "./forms/TaskForm";
import type { Priority, Status } from "./utils";

export type FilterState = {
  search:      string;
  priorities:  Priority[];
  statuses:    Status[];
  assigneeIds: string[];
};
export type SortKey = "az" | "za" | "dueAsc" | "dueDsc" | "createdAsc" | "createdDsc";

interface Props {
  members:            { id: string; name: string; isAdmin: boolean }[];
  currentUserIsAdmin: boolean;
  onFilterChange:     (f: FilterState) => void;
  onSortChange:       (s: SortKey) => void;
}

export default function TasksToolbar({
  members, currentUserIsAdmin, onFilterChange, onSortChange,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState<"filter" | "sort" | null>(null);
  const toolbarRef  = useRef<HTMLDivElement>(null);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [search,      setSearch]      = useState("");
  const [priorities,  setPriorities]  = useState<Priority[]>([]);
  const [statuses,    setStatuses]    = useState<Status[]>([]);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [sort,        setSort]        = useState<SortKey>("createdDsc");

  // Refs so effect closures always call the latest callback without re-running effects
  const onFilterRef = useRef(onFilterChange);
  const onSortRef   = useRef(onSortChange);
  useEffect(() => { onFilterRef.current = onFilterChange; });
  useEffect(() => { onSortRef.current   = onSortChange;   });

  useEffect(() => {
    onFilterRef.current({ search, priorities, statuses, assigneeIds });
  }, [search, priorities, statuses, assigneeIds]);

  useEffect(() => {
    onSortRef.current(sort);
  }, [sort]);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node))
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const activeFilterCount = priorities.length + statuses.length + assigneeIds.length;

  return (
    <div ref={toolbarRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Search */}
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-card rounded-md focus:outline-none focus:border-brand text-text-main placeholder:text-text-subtle shadow-md"
        />
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "filter" ? null : "filter")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              ${activeFilterCount > 0 ? "bg-brand/20 text-brand" : "text-text-main hover:bg-border-light"}`}
          >
            <Filter size={16} /> Filter
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-[10px] text-white">{activeFilterCount}</span>
            )}
          </button>
          {openDropdown === "filter" && (
            <div className="absolute right-0 top-full mt-1 w-60 bg-card border border-border-light rounded-md shadow-lg z-20 p-4 space-y-4">
              <CheckGroup
                title="Priority"
                options={["High", "Medium", "Low"] as Priority[]}
                selected={priorities}
                onChange={v => setPriorities(toggle(priorities, v as Priority))}
              />
              <CheckGroup
                title="Status"
                options={["Open", "In Progress", "Closed", "Over Due"] as Status[]}
                selected={statuses}
                onChange={v => setStatuses(toggle(statuses, v as Status))}
              />
              {/* Assignee filter only visible to admin (employees only see their own tasks) */}
              {currentUserIsAdmin && (
                <CheckGroup
                  title="Assignee"
                  options={members.map(m => m.name)}
                  selected={members.filter(m => assigneeIds.includes(m.id)).map(m => m.name)}
                  onChange={name => {
                    const id = members.find(m => m.name === name)?.id ?? "";
                    setAssigneeIds(toggle(assigneeIds, id));
                  }}
                />
              )}
              <button
                onClick={() => { setPriorities([]); setStatuses([]); setAssigneeIds([]); }}
                className="text-xs text-text-muted hover:text-high-txt"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Add New Task — admin only */}
        {currentUserIsAdmin && (
          <button
            onClick={() => setTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-brand text-text-main rounded-md hover:opacity-80 transition-opacity"
          >
            <Plus size={16} /> Add New Task
          </button>
        )}

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-main hover:bg-border-light rounded-md transition-colors"
          >
            Sort <ArrowUpDown size={14} />
          </button>
          {openDropdown === "sort" && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border-light rounded-md shadow-lg z-20 py-2">
              {([
                ["az",         "A \u2192 Z"],
                ["za",         "Z \u2192 A"],
                ["dueAsc",     "Soonest Due"],
                ["dueDsc",     "Latest Due"],
                ["createdAsc", "Oldest Created"],
                ["createdDsc", "Latest Created"],
              ] as [SortKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSort(key); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-1.5 text-[13px] transition-colors
                    ${sort === key ? "text-brand font-semibold" : "text-text-main hover:bg-border-light"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal — admin only */}
      {currentUserIsAdmin && (
        <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} title="Create New Task">
          <TaskForm
            members={members}
            currentUserIsAdmin={currentUserIsAdmin}
            onClose={() => setTaskModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function CheckGroup<T extends string>({
  title, options, selected, onChange,
}: { title: string; options: T[]; selected: T[]; onChange: (v: string) => void }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider">{title}</h4>
      <div className="flex flex-col gap-1.5">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-[13px] text-text-main cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt as unknown as T)}
              onChange={() => onChange(opt)}
              className="rounded border-border-light text-brand focus:ring-brand w-3.5 h-3.5"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
