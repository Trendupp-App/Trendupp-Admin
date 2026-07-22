"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StatusCard {
  count: number;
  label: string;
  status: string;
  color: string;
  bg: string;
}

import { CampaignOverviewDto } from "@/types/adminOverview";

interface AdminCampaignOverviewProps {
  overview?: CampaignOverviewDto;
}

export function AdminCampaignOverview({
  overview,
}: AdminCampaignOverviewProps) {
  const [active, setActive] = useState("");

  const statusCards: StatusCard[] = [
    {
      count: overview?.total ?? 284,
      label: "Total Campaigns",
      status: "",
      color: "text-[#2f63eb]",
      bg: "bg-[#edf2fe]",
    },
    {
      count: overview?.draft ?? 18,
      label: "Draft",
      status: "draft",
      color: "text-[#7a7a9a]",
      bg: "bg-[#f4f3f6]",
    },
    {
      count: 34,
      label: "Pending Review",
      status: "submitted",
      color: "text-[#ca8a04]",
      bg: "bg-[#fef9e7]",
    },
    {
      count: overview?.live ?? 41,
      label: "Live",
      status: "live",
      color: "text-[#d7176f]",
      bg: "bg-[#fdf2f6]",
    },
    {
      count: overview?.active ?? 62,
      label: "Active",
      status: "active",
      color: "text-[#16a34a]",
      bg: "bg-[#f0fdf4]",
    },
    {
      count: 14,
      label: "Content Review",
      status: "content_review",
      color: "text-[#ea580c]",
      bg: "bg-[#fff7ed]",
    },
    {
      count: overview?.postPending ?? 9,
      label: "Post Pending",
      status: "post_pending",
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
    },
    {
      count: overview?.completed ?? 128,
      label: "Completed",
      status: "completed",
      color: "text-[#2f63eb]",
      bg: "bg-[#edf2fe]",
    },
  ];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">
            Campaign Overview
          </h2>
          <p className="text-[10px] text-[#9a99b0]">
            Click any status to filter campaigns.
          </p>
        </div>
        <button className="text-[10px] text-brand-pink font-semibold hover:underline flex items-center gap-0.5">
          View All ›
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            <span className="text-[11px] text-[#7a7a9a] mt-0.5 block">
              {card.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
