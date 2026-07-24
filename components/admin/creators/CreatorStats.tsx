"use client";

import { Users, CheckCircle, Lock, Clock } from "lucide-react";
import { AdminKpiCard } from "../AdminKpiCard";
import { useCreatorSummary } from "@/hooks/useAdminCreators";

export default function CreatorStats() {
  const { data: summaryData, isLoading } = useCreatorSummary();
  const summary = summaryData?.summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 animate-pulse shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#f4f3f6]" />
              <div className="w-12 h-4 rounded-md bg-[#f4f3f6]" />
            </div>
            <div className="w-24 h-7 rounded-lg bg-[#f4f3f6] mt-1" />
            <div className="w-32 h-3.5 rounded-md bg-[#f4f3f6]" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      value: summary ? summary.totalCreators.toLocaleString() : "0",
      label: "Total Creators",
      icon: Users,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-[#d7176f]",
    },
    {
      value: summary ? summary.profileCompleted.toLocaleString() : "0",
      label: "Active Creators",
      icon: CheckCircle,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: summary ? summary.suspendedCreators.toLocaleString() : "0",
      label: "Suspended",
      icon: Lock,
      iconBg: "bg-[#fef2f2]",
      iconColor: "text-[#dc2626]",
    },
    {
      value: summary ? summary.pendingProfileCompletion.toLocaleString() : "0",
      label: "Pending Profile Completion",
      icon: Clock,
      iconBg: "bg-[#fff7ed]",
      iconColor: "text-[#ea580c]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <AdminKpiCard key={i} {...stat} />
      ))}
    </div>
  );
}
