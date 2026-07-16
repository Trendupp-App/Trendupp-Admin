"use client";

import { Users, CheckCircle, Lock, Clock } from "lucide-react";
import { AdminKpiCard } from "../AdminKpiCard";

export default function CreatorStats() {
  const stats = [
    {
      value: "3,847",
      label: "Total Creators",
      icon: Users,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-[#d7176f]",
    },
    {
      value: "3,124",
      label: "Active Creators",
      icon: CheckCircle,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: "187",
      label: "Suspended",
      icon: Lock,
      iconBg: "bg-[#fef2f2]",
      iconColor: "text-[#dc2626]",
    },
    {
      value: "536",
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
