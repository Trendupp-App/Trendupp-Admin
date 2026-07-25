"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import { useAuthStore } from "@/store/authStore";

interface AdminHeaderProps {
  title?: string;
  onNotificationClick?: () => void;
}

export default function AdminHeader({
  title = "Dashboard",
  onNotificationClick,
}: AdminHeaderProps) {
  const { user } = useAuthStore();
  const displayName = user?.firstName || "Admin";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "AD"
    : "AD";

  return (
    <header className="h-[60px] bg-white border-b border-[#e8e6f0]/60 flex items-center justify-between px-6 shrink-0 select-none">
      {/* Page title */}
      <h2 className="text-base font-semibold text-[#1a1a2e]">{title}</h2>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-[#9a99b0]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-[220px] bg-[#f4f3f6] rounded-full pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 border-none"
          />
        </div>

        {/* Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-full hover:bg-[#f4f3f6] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-[#5a5a7a]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-pink rounded-full" />
        </button>

        {/* Avatar + Admin label */}
        <div className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-[#f4f3f6]/60 rounded-xl transition-all">
          <UserAvatar
            avatarUrl={user?.avatarUrl}
            initials={initials}
            size={32}
          />
          <span className="text-xs font-medium text-[#1a1a2e] hidden sm:inline">
            {displayName}
          </span>
          <ChevronDown size={13} className="text-[#9a99b0]" />
        </div>
      </div>
    </header>
  );
}
