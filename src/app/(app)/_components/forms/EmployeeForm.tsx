// _components/forms/EmployeeForm.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Strip the +91 prefix when pre-filling an edit form
function stripCountryCode(val?: string) {
  if (!val) return "";
  return val.startsWith("+91") ? val.slice(3) : val;
}

const inputBase =
  "w-full px-3 py-2 text-sm bg-card border border-border-light rounded-md focus:outline-none focus:border-brand text-text-main";

export default function EmployeeForm({
  initialData,
  action,
  onClose,
}: {
  initialData?: { name: string; email: string; number: string } | null;
  action: (data: FormData) => void;
  onClose: () => void;
}) {
  const editing = !!initialData;
  const [showPass, setShowPass] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Full Name</label>
        <input
          required
          name="name"
          type="text"
          defaultValue={initialData?.name}
          placeholder="John Doe"
          autoComplete="name"
          className={inputBase}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Email Address</label>
        <input
          required
          name="email"
          type="email"
          defaultValue={initialData?.email}
          placeholder="john@company.com"
          autoComplete="email"
          className={inputBase}
        />
      </div>

      {/* Phone — +91 prefix, 10-digit Indian mobile */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Phone Number</label>
        <div className="flex items-center border border-border-light rounded-md overflow-hidden focus-within:border-brand bg-card transition-colors">
          <span className="px-3 py-2 text-sm font-medium text-text-muted bg-card border-r border-border-light select-none shrink-0">
            +91
          </span>
          <input
            required
            name="number"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            defaultValue={stripCountryCode(initialData?.number)}
            placeholder="9876543210"
            autoComplete="tel-national"
            onInput={(e) => {
              const t = e.currentTarget;
              t.value = t.value.replace(/[^0-9]/g, "").slice(0, 10);
            }}
            className="flex-1 px-3 py-2 text-sm bg-card focus:outline-none text-text-main placeholder:text-text-subtle"
          />
        </div>
        <p className="mt-1 text-[11px] text-text-subtle">Enter 10-digit mobile number without country code.</p>
      </div>

      {/* Temporary Password — only when creating */}
      {!editing && (
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Temporary Password</label>
          <div className="flex items-center border border-border-light rounded-md overflow-hidden focus-within:border-brand bg-card transition-colors">
            <input
              required
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              minLength={8}
              autoComplete="new-password"
              className="flex-1 px-3 py-2 text-sm bg-card focus:outline-none text-text-main placeholder:text-text-subtle"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="px-3 text-text-muted hover:text-text-main transition-colors"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-brand text-text-main rounded-md hover:opacity-90 transition-opacity"
        >
          {editing ? "Save Changes" : "Create Employee"}
        </button>
      </div>
    </form>
  );
}
