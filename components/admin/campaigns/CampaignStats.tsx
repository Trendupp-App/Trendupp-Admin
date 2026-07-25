"use client";

import { cn } from "@/lib/utils";
import { useAdminCampaignsSummary } from "@/hooks/useAdminCampaigns";

interface CampaignStatsProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function CampaignStats({
  selectedStatus,
  onSelectStatus,
}: CampaignStatsProps) {
  const { data: summary, isLoading } = useAdminCampaignsSummary();

  const stats = [
    {
      label: "Total Campaigns",
      value: summary?.totalCampaigns ?? 0,
      statusKey: "All",
      bg: "bg-[#2f63eb] text-white border-transparent",
    },
    {
      label: "Live",
      value: summary?.live ?? 0,
      statusKey: "Live",
      bg: "bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]",
    },
    {
      label: "Completed",
      value: summary?.completed ?? 0,
      statusKey: "Completed",
      bg: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
    },
    {
      label: "Active",
      value: summary?.active ?? 0,
      statusKey: "Active",
      bg: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
    },
    {
      label: "Draft",
      value: summary?.draft ?? 0,
      statusKey: "Draft",
      bg: "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
    },
  ];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-[#1a1a2e]">
          Paid Campaigns Overview
        </h2>
        <span className="text-[10px] text-[#9a99b0] font-medium">
          Click any status to filter the list below
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4.5 rounded-2xl border border-[#e8e6f0]/60 animate-pulse"
              >
                <div className="w-16 h-2.5 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-8 h-5 bg-[#e8e6f0]/60 rounded-md" />
              </div>
            ))
          : stats.map((s, i) => (
              <button
                key={i}
                onClick={() => onSelectStatus(s.statusKey)}
                className={cn(
                  "flex flex-col gap-2 p-4.5 rounded-2xl border text-left cursor-pointer transition-all hover:brightness-[0.98]",
                  s.bg,
                  selectedStatus === s.statusKey
                    ? "ring-2 ring-brand-pink/40 ring-offset-1"
                    : "",
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-85">
                  {s.label}
                </span>
                <span className="text-xl font-bold leading-none">
                  {s.value}
                </span>
              </button>
            ))}
      </div>
    </div>
  );
}
