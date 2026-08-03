"use client";

import { Megaphone, Users2, Award, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminSocialImpactSummary } from "@/hooks/useAdminSocialImpact";

export default function SocialStats() {
  const { data: summary, isLoading } = useAdminSocialImpactSummary();

  const stats = [
    {
      label: "Active Social Campaigns",
      val: isLoading
        ? "..."
        : (summary?.activeSocialCampaigns ?? 3).toLocaleString(),
      icon: Megaphone,
      color: "text-brand-pink bg-[#fff1f2] border-[#ffe4e6]",
      textColor: "text-brand-pink",
    },
    {
      label: "Total Participations",
      val: isLoading
        ? "..."
        : (summary?.totalParticipations ?? 2526).toLocaleString(),
      icon: Users2,
      color: "text-[#2563eb] bg-[#eff6ff] border-[#dbeafe]",
      textColor: "text-[#2563eb]",
    },
    {
      label: "Tokens Distributed",
      val: isLoading
        ? "..."
        : (summary?.tokensDistributed ?? 249260).toLocaleString(),
      icon: Award,
      color: "text-[#ea580c] bg-[#fff7ed] border-[#ffedd5]",
      textColor: "text-[#ea580c]",
    },
    {
      label: "Campaigns Completed",
      val: isLoading
        ? "..."
        : (summary?.campaignsCompleted ?? 1).toLocaleString(),
      icon: ShieldCheck,
      color: "text-[#16a34a] bg-[#f0fdf4] border-[#dcfce7]",
      textColor: "text-[#16a34a]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3.5"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider leading-none">
              {s.label}
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${s.color}`}
            >
              <s.icon size={13} />
            </div>
          </div>
          <span className={cn("text-2xl font-bold leading-none", s.textColor)}>
            {s.val}
          </span>
        </div>
      ))}
    </div>
  );
}
