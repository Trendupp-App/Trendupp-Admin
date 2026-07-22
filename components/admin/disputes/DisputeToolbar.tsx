"use client";

import { Calendar, ChevronDown } from "lucide-react";

export type DisputeTab = "pending" | "active" | "closed";

interface DisputeToolbarProps {
  activeTab: DisputeTab;
  onTabChange: (tab: DisputeTab) => void;
  pendingCount: number;
  activeCount: number;
  closedCount: number;
}

export default function DisputeToolbar({
  activeTab,
  onTabChange,
  pendingCount,
  activeCount,
}: DisputeToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Pill Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTabChange("pending")}
          className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#c0185c] text-white shadow-sm"
              : "bg-[#f4f3f6] text-[#5a5a7a] hover:bg-[#ebe9f1]"
          }`}
        >
          Pending Requests ({pendingCount})
        </button>

        <button
          onClick={() => onTabChange("active")}
          className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "active"
              ? "bg-[#c0185c] text-white shadow-sm"
              : "bg-[#f4f3f6] text-[#5a5a7a] hover:bg-[#ebe9f1]"
          }`}
        >
          Active Chats ({activeCount})
        </button>

        <button
          onClick={() => onTabChange("closed")}
          className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "closed"
              ? "bg-[#c0185c] text-white shadow-sm"
              : "bg-[#f4f3f6] text-[#5a5a7a] hover:bg-[#ebe9f1]"
          }`}
        >
          Closed
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-[#e8e6f0] rounded-xl text-xs text-[#5a5a7a] font-semibold hover:bg-[#faf9fc] cursor-pointer">
          Custom <ChevronDown size={14} className="text-[#9a99b0]" />
        </button>

        <button className="flex items-center gap-2 h-9 px-3.5 bg-white border border-[#e8e6f0] rounded-xl text-xs text-[#5a5a7a] font-semibold hover:bg-[#faf9fc] cursor-pointer">
          <Calendar size={14} className="text-[#9a99b0]" />
          1 Jun, 2025 - 30 Jun, 2025
          <ChevronDown size={14} className="text-[#9a99b0]" />
        </button>
      </div>
    </div>
  );
}
