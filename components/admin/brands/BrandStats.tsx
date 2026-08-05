"use client";

import { Users, CheckCircle, Lock, Clock } from "lucide-react";
import { AdminKpiCard, type AdminKpiCardProps } from "../AdminKpiCard";
import { useBrandSummary } from "@/hooks/useAdminBrands";

export default function BrandStats() {
  const { data: summaryData, isLoading } = useBrandSummary();

  const summary = summaryData?.summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center gap-4 animate-pulse"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#e8e6f0]/60 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="w-16 h-6 rounded-md bg-[#e8e6f0]/60" />
              <div className="w-24 h-3 rounded-md bg-[#e8e6f0]/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const kpis: AdminKpiCardProps[] = [
    {
      value: (
        summary?.totalAdvertisers ??
        summary?.totalBrands ??
        0
      ).toLocaleString(),
      label: "Brand",
      icon: Users,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-[#d7176f]",
    },
    {
      value: (summary?.profileCompleted ?? 0).toLocaleString(),
      label: "Profile Completion",
      icon: CheckCircle,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: (
        summary?.suspendedAdvertisers ??
        summary?.suspendedBrands ??
        0
      ).toLocaleString(),
      label: "Suspended",
      icon: Lock,
      iconBg: "bg-[#fef2f2]",
      iconColor: "text-[#dc2626]",
    },
    {
      value: (summary?.pendingProfileCompletion ?? 0).toLocaleString(),
      label: "Pending Profile Completion",
      icon: Clock,
      iconBg: "bg-[#fff7ed]",
      iconColor: "text-[#ea580c]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((card) => (
        <AdminKpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
