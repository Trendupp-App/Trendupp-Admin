"use client";

import { ArrowLeft, X } from "lucide-react";

interface DrawerSkeletonProps {
  onClose?: () => void;
  title?: string;
}

export function DrawerSkeleton({
  onClose,
  title = "Loading Details...",
}: DrawerSkeletonProps) {
  return (
    <div className="flex flex-col h-full bg-white relative z-10 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between border-b border-[#e8e6f0]/60 px-6 py-4 shrink-0">
        {onClose ? (
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} /> Back
          </button>
        ) : (
          <div className="w-16 h-4 bg-[#e8e6f0]/60 rounded-md" />
        )}

        <span className="text-sm font-bold text-[#1a1a2e]">{title}</span>

        {onClose ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#e8e6f0]/60" />
        )}
      </div>

      {/* Profile Header Summary Skeleton */}
      <div className="flex flex-col items-center justify-center py-7 border-b border-[#e8e6f0]/40 shrink-0 gap-2.5">
        <div className="w-18 h-18 rounded-full bg-[#e8e6f0]/60" />
        <div className="w-40 h-4 bg-[#e8e6f0]/60 rounded-md mt-1" />
        <div className="w-24 h-3 bg-[#e8e6f0]/40 rounded-md" />
        <div className="flex items-center gap-2 mt-1">
          <div className="w-16 h-5 rounded-md bg-[#e8e6f0]/50" />
          <div className="w-20 h-5 rounded-md bg-[#e8e6f0]/50" />
        </div>
      </div>

      {/* Navigation Tabs Bar Skeleton */}
      <div className="flex border-b border-[#e8e6f0]/40 px-6 py-3 gap-6 shrink-0 overflow-x-auto scrollbar-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-20 h-4 bg-[#e8e6f0]/60 rounded-md shrink-0"
          />
        ))}
      </div>

      {/* Drawer Body Skeleton Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        {/* Section 1: Grid Details Skeleton Card */}
        <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
          <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="w-20 h-3 bg-[#e8e6f0]/40 rounded-md" />
                <div className="w-28 h-4 bg-[#e8e6f0]/60 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Metrics Strip Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="w-24 h-4 bg-[#e8e6f0]/60 rounded-md" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
              >
                <div className="w-6 h-6 rounded-full bg-[#e8e6f0]/60" />
                <div className="w-10 h-4 bg-[#e8e6f0]/60 rounded-md mt-1" />
                <div className="w-12 h-2.5 bg-[#e8e6f0]/40 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Social Accounts Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-[#e8e6f0]/60 shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="w-24 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  <div className="w-36 h-3 bg-[#e8e6f0]/40 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
