"use client";

import {
  Eye,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export default function CampaignAnalyticsTab() {
  const metrics = [
    { label: "Total Views", icon: Eye, val: "3241" },
    { label: "Reach", icon: TrendingUp, val: "3241" },
    { label: "Likes", icon: ThumbsUp, val: "3241" },
    { label: "Comments", icon: MessageSquare, val: "3241" },
  ];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
          CREATOR&apos;S POST
        </span>
        <a
          href="https://instagram.com/p/example1"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-[#1a1a2e] hover:text-brand-pink flex items-center gap-1.5 w-fit"
        >
          https://instagram.com/p/example1{" "}
          <ExternalLink size={14} className="text-[#9a99b0]" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#faf9fc] flex items-center justify-center border border-[#e8e6f0]/40 text-[#7a7a9a]">
              <m.icon size={15} />
            </div>
            <div className="flex flex-col mt-1">
              <span className="text-xl font-bold text-[#1a1a2e]">{m.val}</span>
              <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
                {m.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
