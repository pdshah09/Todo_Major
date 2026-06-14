// app/(app)/team/_components/TeamManager.tsx
"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Mail, Phone, X } from "lucide-react";
import { addEmployee, updateEmployee, deleteEmployee } from "../team/actions";
import Modal from "./Modal";
import EmployeeForm from "./forms/EmployeeForm";

// Replace your imports with your actual types
type TeamMember = { id: string; name: string; email: string; number: string; role: string };

export default function TeamManager({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isPending, startTransition] = useTransition();

  const employeeCount = initialMembers.filter(m => m.role === "EMPLOYEE").length;
  // const canAddMore = employeeCount < 5;
  const canAddMore = true;

  const handleOpenModal = (member?: TeamMember) => {
    setEditingMember(member || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Wire up the Server Actions
  const handleActionSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (editingMember) {
          await updateEmployee(editingMember.id, formData);
        } else {
          await addEmployee(formData);
        }
        closeModal();
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      startTransition(() => {
        deleteEmployee(id);
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full opacity-100 transition-opacity" style={{ opacity: isPending ? 0.6 : 1 }}>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-[var(--radius-card)] shadow-lg">
        <div>
          <h2 className="text-lg font-semibold text-text-main">Team Members</h2>
          <p className="text-sm text-text-muted">{employeeCount} Employees configured</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={!canAddMore || isPending}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-canvas text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pb-4">
        {initialMembers.map((member) => (
          <div key={member.id} className="bg-card p-5 rounded-[var(--radius-card)] shadow-md flex flex-col gap-4 relative group">
            
            {member.role === "EMPLOYEE" && (
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(member)} className="text-text-subtle hover:text-brand p-1"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(member.id)} className="text-text-subtle hover:text-red-500 p-1"><Trash2 size={14} /></button>
              </div>
            )}

            {/* Profile Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-text-main leading-tight">{member.name}</h3>
                <span className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded w-max ${
                  member.role === "ADMIN" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                }`}>
                  {member.role === "ADMIN" ? "Admin" : "Employee"}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-light text-xs text-text-muted">
              <div className="flex items-center gap-2"><Mail size={12} className="text-text-subtle" /><span className="truncate">{member.email}</span></div>
              <div className="flex items-center gap-2"><Phone size={12} className="text-text-subtle" /><span>{member.number}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Reusable CRUD Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingMember ? "Edit Employee" : "Add New Employee"}>
        <EmployeeForm initialData={editingMember} action={handleActionSubmit} onClose={closeModal} />
      </Modal>
    </div>
  );
}