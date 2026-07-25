"use client";

import { Bell, Send, Calendar, FileText } from "lucide-react";
import type { AdminBroadcastItem } from "@/types/adminNotifications";

interface BroadcastStatsCardsProps {
  broadcasts?: AdminBroadcastItem[];
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function BroadcastStatsCards({
  broadcasts = [],
  selectedStatus,
  onSelectStatus,
}: BroadcastStatsCardsProps) {
  const total = broadcasts.length;
  const sent = broadcasts.filter((b) => b.status === "sent").length;
  const scheduled = broadcasts.filter((b) => b.status === "scheduled").length;
  const draft = broadcasts.filter((b) => b.status === "draft").length;

  const cards = [
    {
      label: "Total Broadcasts",
      value: total,
      statusKey: "All",
      icon: Bell,
      bg: "bg-[#2f63eb]/10 text-[#2f63eb]",
    },
    {
      label: "Sent",
      value: sent,
      statusKey: "Sent",
      icon: Send,
      bg: "bg-[#f0fdf4] text-[#16a34a]",
    },
    {
      label: "Scheduled",
      value: scheduled,
      statusKey: "Scheduled",
      icon: Calendar,
      bg: "bg-[#fff7ed] text-[#ea580c]",
    },
    {
      label: "Drafts",
      value: draft,
      statusKey: "Draft",
      icon: FileText,
      bg: "bg-[#faf9fc] text-[#5a5a7a]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {cards.map((card, idx) => {
        const isSelected =
          selectedStatus.toLowerCase() === card.statusKey.toLowerCase();
        return (
          <button
            key={idx}
            onClick={() => onSelectStatus(card.statusKey)}
            className={`bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between transition-all cursor-pointer hover:border-brand-pink/30 ${
              isSelected ? "ring-2 ring-brand-pink/40" : ""
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                {card.label}
              </span>
              <span className="text-xl font-bold text-[#1a1a2e]">
                {card.value}
              </span>
            </div>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.bg}`}
            >
              <card.icon size={18} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
