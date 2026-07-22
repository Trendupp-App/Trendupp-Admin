"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffName: string;
  currentRole: string;
  onSuccess: (newRole: string) => void;
}

const EDIT_ROLES_LIST = [
  { id: "Support Agent", label: "Support Agent" },
  { id: "Finance Admin", label: "Finance Admin" },
  { id: "Moderator", label: "Moderator" },
  { id: "Super Admin", label: "Super Admin" },
];

// Helper to map incoming display roles to Edit choices
const mapDisplayRoleToEditRole = (role: string): string => {
  const r = role.toLowerCase();
  if (r.includes("finance")) return "Finance Admin";
  if (r.includes("super")) return "Super Admin";
  if (r.includes("moderator")) return "Moderator";
  return "Support Agent"; // Default fallback
};

export default function EditStaffModal({
  isOpen,
  onClose,
  staffName,
  currentRole,
  onSuccess,
}: EditStaffModalProps) {
  const [selectedRole, setSelectedRole] = useState("Support Agent");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRole(mapDisplayRoleToEditRole(currentRole));
    }
  }, [isOpen, currentRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(selectedRole);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh] overflow-y-auto pb-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-[400px] bg-white rounded-3xl shadow-2xl p-6.5 flex flex-col gap-4 text-left">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h2 className="text-sm font-bold text-[#1a1a2e]">
              Edit — {staffName}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#f4f3f6] rounded-lg transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Change Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#5a5a7a] uppercase tracking-wider">
                Change Role
              </label>
              <div className="flex flex-col gap-2">
                {EDIT_ROLES_LIST.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <label
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#4f46e5] bg-[#f5f3ff]"
                          : "border-[#e8e6f0] hover:bg-[#faf9fc]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? "border-[#4f46e5]" : "border-[#b0aec8]"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#1a1a2e]">
                        {role.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 w-full mt-1">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-xl bg-brand-pink hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
