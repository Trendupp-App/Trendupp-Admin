"use client";

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
    <div className="flex items-center">
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
    </div>
  );
}
