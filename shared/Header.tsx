"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import UserAvatar from "./UserAvatar";

interface HeaderUser {
  displayName: string;
  initials: string;
  avatarUrl?: string;
}

interface HeaderProps {
  title?: string;
  user?: HeaderUser;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({
  title = "Dashboard",
  user = { displayName: "User", initials: "U" },
  onNotificationClick,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-[#e8e6f0]/60 flex items-center justify-between px-4 md:px-8 shrink-0 select-none">
      {/* Mobile view header: hamburger, search, notifications */}
      <div className="flex md:hidden items-center gap-3 w-full">
        {/* Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-full hover:bg-[#f4f3f6]/60 text-[#5a5a7a] active:scale-95 transition-transform cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 bg-[#f4f3f6] border-none rounded-full pl-9 pr-4 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0]"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-full bg-[#f4f3f6]/60 border border-[#e8e6f0]/40 text-[#5a5a7a] active:scale-95 transition-transform shrink-0"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-[#5a5a7a]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full border border-white" />
        </button>
      </div>

      {/* Desktop view header: title & actions */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Title */}
        <h2 className="text-lg font-semibold text-[#1a1a2e]">{title}</h2>

        {/* Action Area */}
        <div className="flex items-center gap-3.5 lg:gap-6">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-full hover:bg-[#f4f3f6] transition-colors text-[#5a5a7a]"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-[#5a5a7a]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full border border-white" />
          </button>

          {/* User Dropdown */}
          <div className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-[#f4f3f6]/60 rounded-xl transition-all">
            <UserAvatar
              avatarUrl={user.avatarUrl}
              initials={user.initials}
              size={44}
            />
            <span className="text-xs font-medium text-[#1a1a2e] hidden sm:inline truncate max-w-[120px]">
              {user.displayName}
            </span>
            <ChevronDown size={14} className="text-[#9a99b0] shrink-0" />
          </div>
        </div>
      </div>
    </header>
  );
}
