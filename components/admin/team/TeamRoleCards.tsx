"use client";

import { UserPlus } from "lucide-react";

interface TeamRoleCardsProps {
  roleTypes: Array<{ title: string; description: string }>;
  canInvite: boolean;
  onInviteClick: () => void;
}

export default function TeamRoleCards({
  roleTypes,
  canInvite,
  onInviteClick,
}: TeamRoleCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#1a1a2e]">Staff Role Types</h3>
        {canInvite && (
          <button
            onClick={onInviteClick}
            className="flex items-center gap-1.5 h-9 px-4 bg-brand-pink text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer"
          >
            <UserPlus size={14} /> Invite Staff Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleTypes.map((role) => (
          <div
            key={role.title}
            className="bg-white border border-[#e8e6f0]/60 p-4.5 rounded-2xl flex flex-col gap-1.5 hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-bold text-[#1a1a2e]">
              {role.title}
            </span>
            <p className="text-[11px] text-[#7a7a9a] leading-relaxed font-medium">
              {role.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
