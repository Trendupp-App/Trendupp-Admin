"use client";

import { Users, CheckCircle, Lock, Clock } from "lucide-react";
import { AdminKpiCard } from "../AdminKpiCard";
import { useCreatorSummary } from "@/hooks/useAdminCreators";

export default function CreatorStats() {
  const { data: summaryData } = useCreatorSummary();
  const summary = summaryData?.summary;

  const stats = [
    {
      value: summary ? summary.totalCreators.toLocaleString() : "3,847",
      label: "Total Creators",
      icon: Users,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-[#d7176f]",
    },
    {
      value: summary ? summary.profileCompleted.toLocaleString() : "3,124",
      label: "Active Creators",
      icon: CheckCircle,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: summary ? summary.suspendedCreators.toLocaleString() : "187",
      label: "Suspended",
      icon: Lock,
      iconBg: "bg-[#fef2f2]",
      iconColor: "text-[#dc2626]",
    },
    {
      value: summary
        ? summary.pendingProfileCompletion.toLocaleString()
        : "536",
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
