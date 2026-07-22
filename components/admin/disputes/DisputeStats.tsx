"use client";

interface DisputeStatsProps {
  activeChatsCount: number;
  pendingRequestsCount: number;
  resolvedTodayCount: number;
}

export default function DisputeStats({
  activeChatsCount,
  pendingRequestsCount,
  resolvedTodayCount,
}: DisputeStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {/* Active Chats */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-[#1a1a2e]">
            {activeChatsCount}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Active Chats
          </span>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-[#1a1a2e]">
            {pendingRequestsCount}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Pending Requests
          </span>
        </div>
      </div>

      {/* Resolved Today */}
      <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-[#1a1a2e]">
            {resolvedTodayCount}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
            Resolved Today
          </span>
        </div>
      </div>
    </div>
  );
}
