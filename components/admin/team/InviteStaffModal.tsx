"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { name: string; email: string; role: string }) => void;
  isLoading?: boolean;
}

const ROLES_LIST = [
  {
    id: "Support Agent",
    label: "Support Agent",
    description: "Handles disputes, tickets, chat approvals",
  },
  {
    id: "Finance Admin",
    label: "Finance Admin",
    description: "Manages escrow, payouts, financial reports",
  },
  {
    id: "Super Admin",
    label: "Super Admin",
    description: "Full platform access and management",
  },
  {
    id: "Moderator",
    label: "Moderator",
    description: "Reviews user-generated content & reports",
  },
];

export default function InviteStaffModal({
  isOpen,
  onClose,
  onSuccess,
  isLoading = false,
}: InviteStaffModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Support Agent");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !selectedRole || isLoading) return;
    onSuccess({ name: fullName, email, role: selectedRole });
    // Reset fields
    setFullName("");
    setEmail("");
    setSelectedRole("Support Agent");
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[8vh] overflow-y-auto pb-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-[440px] bg-white rounded-3xl shadow-2xl p-6.5 flex flex-col gap-4 text-left">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h2 className="text-sm font-bold text-[#1a1a2e]">
              Invite Staff Member
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#f4f3f6] rounded-lg transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#5a5a7a] uppercase tracking-wider">
                Full Name <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="e.g. Adaeze Okonkwo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9.5 px-4 rounded-xl border border-[#e8e6f0] text-xs placeholder-[#b0aec8] text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#5a5a7a] uppercase tracking-wider">
                Work Email <span className="text-brand-pink">*</span>
              </label>
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="staff@trendupp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9.5 px-4 rounded-xl border border-[#e8e6f0] text-xs placeholder-[#b0aec8] text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium disabled:opacity-60"
              />
            </div>

            {/* Assign Role */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#5a5a7a] uppercase tracking-wider">
                Assign Role <span className="text-brand-pink">*</span>
              </label>
              <div className="flex flex-col gap-2">
                {ROLES_LIST.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <label
                      key={role.id}
                      onClick={() => !isLoading && setSelectedRole(role.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        isLoading
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${
                        isSelected
                          ? "border-[#4f46e5] bg-[#f5f3ff]"
                          : "border-[#e8e6f0] hover:bg-[#faf9fc]"
                      }`}
                    >
                      <div className="mt-0.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? "border-[#4f46e5]" : "border-[#b0aec8]"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-[#1a1a2e]">
                          {role.label}
                        </span>
                        <span className="text-[9px] text-[#9a99b0] font-medium leading-normal">
                          {role.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Info Message Card */}
            <div className="bg-[#f0f9ff] border border-[#e0f2fe] text-[#0369a1] text-[9.5px] font-semibold leading-relaxed p-3.5 rounded-xl">
              An invitation email will be sent with a link to set up their
              account. They will only see sections assigned to their role.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!fullName || !email || !selectedRole || isLoading}
              className="h-10 w-full bg-brand-pink hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-1"
            >
              {isLoading ? "Sending Invitation..." : "Send Invitation →"}
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
}
