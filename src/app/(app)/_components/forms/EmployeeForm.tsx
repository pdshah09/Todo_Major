// _components/forms/EmployeeForm.tsx

import React from "react";

// Replace 'any' with your TeamMember type
export default function EmployeeForm({ initialData, onClose }: { initialData?: any, onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
    onClose();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Full Name</label>
        <input required defaultValue={initialData?.name} type="text" placeholder="John Doe" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Email Address</label>
        <input required defaultValue={initialData?.email} type="email" placeholder="john@company.com" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Phone Number</label>
        <input required defaultValue={initialData?.number} type="tel" placeholder="+1 234 567 8900" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
      </div>

      {!initialData && (
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Temporary Password</label>
          <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main" />
        </div>
      )}

      <div className="flex justify-end gap-3 mt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-canvas text-white rounded-md hover:opacity-90 transition-opacity">
          {initialData ? "Save Changes" : "Create Employee"}
        </button>
      </div>
    </form>
  );
}