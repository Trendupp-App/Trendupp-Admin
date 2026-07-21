"use client";

import { Search, UserPlus } from "lucide-react";

interface TeamToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeRoleFilter: string;
  onRoleFilterChange: (value: string) => void;
  activeStatusFilter: string;
  onStatusFilterChange: (value: string) => void;
  canInvite: boolean;
  onInviteClick: () => void;
}

export default function TeamToolbar({
  searchQuery,
  onSearchChange,
  activeRoleFilter,
  onRoleFilterChange,
  activeStatusFilter,
  onStatusFilterChange,
  canInvite,
  onInviteClick,
}: TeamToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h3 className="text-sm font-bold text-[#1a1a2e]">
        Current Staff Members
      </h3>
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 sm:flex-initial">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full sm:w-[220px] bg-[#f4f3f6] rounded-full pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 border-none font-medium"
          />
        </div>

        {/* Role Filter */}
        <select
          value={activeRoleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="h-9 px-3 bg-[#f4f3f6] rounded-xl text-xs text-[#5a5a7a] focus:outline-none border border-[#e8e6f0] font-semibold cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="finance_admin">Finance Admin</option>
          <option value="moderator">Moderator</option>
          <option value="support_agent">Support Agent</option>
        </select>

        {/* Status Filter */}
        <select
          value={activeStatusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="h-9 px-3 bg-[#f4f3f6] rounded-xl text-xs text-[#5a5a7a] focus:outline-none border border-[#e8e6f0] font-semibold cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Add Member Shortcut — owner & super_admin only */}
        {canInvite && (
          <button
            onClick={onInviteClick}
            className="flex items-center gap-1 h-9 px-3 bg-[#fdf2f8] hover:bg-[#fbcfe8]/40 text-brand-pink text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <UserPlus size={13} /> Add Member
          </button>
        )}
      </div>
    </div>
  );
}
