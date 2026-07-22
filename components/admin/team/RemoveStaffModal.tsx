"use client";

import { AlertTriangle } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface RemoveStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffName: string;
  onConfirm: () => void;
}

export default function RemoveStaffModal({
  isOpen,
  onClose,
  staffName,
  onConfirm,
}: RemoveStaffModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="relative z-10 w-full max-w-[360px] bg-white rounded-[32px] p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
          {/* Warning Icon wrapper */}
          <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fee2e2]">
            <AlertTriangle size={20} className="text-[#dc2626]" />
          </div>

          {/* Heading & Text */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Remove {staffName}?
            </h3>
            <p className="text-xs text-[#7a7a9a] leading-relaxed">
              This will revoke their access to the admin portal. This action
              cannot be undone.
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            <button
              onClick={onClose}
              className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="h-10 rounded-xl bg-[#dc2626] text-white text-xs font-bold hover:bg-[#b91c1c] cursor-pointer"
            >
              Yes, Remove
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
