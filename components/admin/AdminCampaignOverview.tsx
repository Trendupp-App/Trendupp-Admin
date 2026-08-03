"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignOverviewDto } from "@/types/adminOverview";

interface StatusCard {
  count: number;
  label: string;
  status: string;
  color: string;
  bg: string;
}

interface AdminCampaignOverviewProps {
  overview?: CampaignOverviewDto;
}

export function AdminCampaignOverview({
  overview,
}: AdminCampaignOverviewProps) {
  const [active, setActive] = useState("");

  const statusCards: StatusCard[] = [
    {
      count: overview?.total ?? 0,
      label: "Total Campaigns",
      status: "",
      color: "text-[#2f63eb]",
      bg: "bg-[#edf2fe]",
    },
    {
      count: overview?.draft ?? 0,
      label: "Draft",
      status: "draft",
      color: "text-[#7a7a9a]",
      bg: "bg-[#f4f3f6]",
    },
    {
      count: overview?.live ?? 0,
      label: "Live",
      status: "live",
      color: "text-[#d7176f]",
      bg: "bg-[#fdf2f6]",
    },
    {
      count: overview?.active ?? 0,
      label: "Active",
      status: "active",
      color: "text-[#16a34a]",
      bg: "bg-[#f0fdf4]",
    },
    {
      count: overview?.postPending ?? 0,
      label: "Post Pending",
      status: "post_pending",
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
    },
    {
      count: overview?.completed ?? 0,
      label: "Completed",
      status: "completed",
      color: "text-[#2f63eb]",
      bg: "bg-[#edf2fe]",
    },
  ];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">
            Campaign Overview
          </h2>
          <p className="text-[10px] text-[#9a99b0]">
            Click any status to filter campaigns
          </p>
        </div>
        <Link
          href="/admin/campaigns"
          className="h-7 px-3 bg-[#edf3ff] hover:bg-[#dbe9ff] text-[#2f63eb] text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight size={13} className="stroke-[2.5]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusCards.map((card) => (
          <button
            key={card.label}
            onClick={() => setActive(active === card.status ? "" : card.status)}
            className={cn(
              "rounded-2xl p-4 text-left transition-all duration-200 border-2 cursor-pointer",
              active === card.status
                ? `${card.bg} border-current/30`
                : "bg-[#faf9fc] border-transparent hover:border-[#e8e6f0]",
            )}
          >
            <span className={cn("text-2xl font-bold block", card.color)}>
              {card.count}
            </span>
            <span className="text-[10px] text-[#7a7a9a] font-medium block mt-1">
              {card.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
