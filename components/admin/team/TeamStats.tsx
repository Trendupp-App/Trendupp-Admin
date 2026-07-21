"use client";

import { Users, UserCheck, Clock, ShieldCheck } from "lucide-react";

interface TeamStatsProps {
  totalStaff: number;
  activeStaff: number;
  pendingStaff: number;
  rolesAvailable: number;
  isLoading: boolean;
}

export default function TeamStats({
  totalStaff,
  activeStaff,
  pendingStaff,
  rolesAvailable,
  isLoading,
}: TeamStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4 animate-pulse"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#f4f3f6]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-12 bg-[#f4f3f6] rounded-md" />
              <div className="h-3 w-20 bg-[#f4f3f6] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Staff */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-[#fdf2f8] flex items-center justify-center text-brand-pink shrink-0">
          <Users size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-[#1a1a2e]">
            {totalStaff}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Total Staff
          </span>
        </div>
      </div>

      {/* Active */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
          <UserCheck size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-[#1a1a2e]">
            {activeStaff}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>

      {/* Pending Setup */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
          <Clock size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-[#1a1a2e]">
            {pendingStaff}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Pending Setup
          </span>
        </div>
      </div>

      {/* Roles Available */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-[#1a1a2e]">
            {rolesAvailable}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Roles Available
          </span>
        </div>
      </div>
    </div>
  );
}
