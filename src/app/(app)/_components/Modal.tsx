// _components/Modal.tsx

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-[var(--radius-dashboard)] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light bg-column shrink-0">
          <h3 className="font-semibold text-text-main">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {/* Modal Body (Scrollable if content is too long) */}
        <div className="overflow-y-auto p-5">
          {children}
        </div>

      </div>
    </div>
  );
}