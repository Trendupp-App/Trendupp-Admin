"use client";

export default function DisputeSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* 3 KPI Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center gap-4 shadow-xs"
          >
            <div className="w-10 h-10 rounded-full bg-[#e8e6f0]/80 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="w-12 h-6 rounded-md bg-[#e8e6f0]/80" />
              <div className="w-24 h-3 rounded-md bg-[#e8e6f0]/50" />
            </div>
          </div>
        ))}
      </div>

      {/* List Items Skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8e6f0]/80 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-32 h-4 rounded-md bg-[#e8e6f0]/80" />
                  <div className="w-24 h-3 rounded-md bg-[#e8e6f0]/50" />
                </div>
              </div>
              <div className="w-24 h-6 rounded-full bg-[#e8e6f0]/70" />
            </div>
            <div className="w-3/4 h-4 rounded-md bg-[#e8e6f0]/60" />
            <div className="w-full h-3 rounded-md bg-[#e8e6f0]/40" />
            <div className="flex items-center justify-between pt-2 border-t border-[#f4f3f6]">
              <div className="w-20 h-3 rounded-md bg-[#e8e6f0]/40" />
              <div className="flex items-center gap-2">
                <div className="w-24 h-8 rounded-xl bg-[#e8e6f0]/70" />
                <div className="w-24 h-8 rounded-xl bg-[#e8e6f0]/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
