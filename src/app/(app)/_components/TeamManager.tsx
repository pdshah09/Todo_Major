// _components/TeamManager.tsx

"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Mail, Phone, Shield, User as UserIcon, X } from "lucide-react";
import { Role, TeamMember, INITIAL_MEMBERS } from "./utils";
import Modal from "./Modal";
import EmployeeForm from "./forms/EmployeeForm";

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Maximum 5 employees + 1 Admin = 6 Total allowed in UI conceptually
  // Adjust logic based on if your '5 limit' includes the admin or not.
  const employeeCount = members.filter(m => m.role === "EMPLOYEE").length;
  const canAddMore = employeeCount < 5;

  const handleOpenModal = (member?: TeamMember) => {
    setEditingMember(member || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-[var(--radius-card)] shadow-md">
        <div>
          <h2 className="text-lg font-semibold text-text-main">Team Members</h2>
          <p className="text-sm text-text-muted">
            {employeeCount} / 5 Employees configured
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={!canAddMore}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-canvas text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pb-4">
        {members.map((member) => (
          <div key={member.id} className="bg-card p-5 rounded-[var(--radius-card)] shadow-sm flex flex-col gap-4 relative group">
            
            {/* Action Buttons (Hidden for Admin) */}
            {member.role === "EMPLOYEE" && (
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(member)} className="text-text-subtle hover:text-brand transition-colors p-1" aria-label="Edit">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(member.id)} className="text-text-subtle hover:text-high-txt transition-colors p-1" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
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
                  member.role === "ADMIN" ? "bg-med-bg text-med-txt" : "bg-low-bg text-low-txt"
                }`}>
                  {member.role === "ADMIN" ? "Admin" : "Employee"}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-light text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-text-subtle" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-text-subtle" />
                <span>{member.number}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-[var(--radius-dashboard)] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border-light bg-column">
              <h3 className="font-semibold text-text-main">
                {editingMember ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button onClick={closeModal} className="text-text-muted hover:text-text-main">
                <X size={18} />
              </button>
            </div>
            
            <form className="p-5 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Full Name</label>
                <input required defaultValue={editingMember?.name} type="text" placeholder="John Doe" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Email Address</label>
                <input required defaultValue={editingMember?.email} type="email" placeholder="john@company.com" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Phone Number</label>
                <input required defaultValue={editingMember?.number} type="tel" placeholder="+1 234 567 8900" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
              </div>

              
              {!editingMember && (
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Temporary Password</label>
                  <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-canvas text-white rounded-md hover:opacity-90 transition-opacity">
                  {editingMember ? "Save Changes" : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      */}

        {/* Reusable CRUD Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingMember ? "Edit Employee" : "Add New Employee"}
      >
        <EmployeeForm
          initialData={editingMember} 
          onClose={closeModal} 
        />
      </Modal>

    </div>
  );
}