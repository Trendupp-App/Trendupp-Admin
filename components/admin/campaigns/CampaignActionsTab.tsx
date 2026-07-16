"use client";

import {
  Info,
  RefreshCw,
  Pause,
  Play,
  X,
  Lock,
  Unlock,
  Calendar,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignActionsTabProps {
  onSelectAction: (action: string) => void;
}

export default function CampaignActionsTab({
  onSelectAction,
}: CampaignActionsTabProps) {
  const actions = [
    {
      title: "Pause Campaign",
      desc: "Temporarily suspend all campaign activity",
      icon: Pause,
      color: "text-[#f59e0b] bg-[#fff7ed]",
    },
    {
      title: "Resume Campaign",
      desc: "Resume a paused campaign",
      icon: Play,
      color: "text-[#16a34a] bg-[#f0fdf4]",
    },
    {
      title: "Cancel Campaign",
      desc: "Permanently cancel this campaign",
      icon: X,
      color: "text-[#dc2626] bg-[#fef2f2]",
    },
    {
      title: "Hold Escrow Funds",
      desc: "Freeze escrow pending investigation",
      icon: Lock,
      color: "text-[#7c3aed] bg-[#f5f3ff]",
    },
    {
      title: "Release Escrow Funds",
      desc: "Manually release funds to creator",
      icon: Unlock,
      color: "text-[#2563eb] bg-[#eff6ff]",
    },
    {
      title: "Refund Campaign",
      desc: "Initiate refund to brand",
      icon: RefreshCw,
      color: "text-[#92400e] bg-[#fff7ed]",
    },
    {
      title: "Extend Application Deadline",
      desc: "Give more time for applications",
      icon: Calendar,
      color: "text-brand-pink bg-[#fff1f2]",
    },
    {
      title: "Trigger Manual Verification",
      desc: "Manually verify posted content",
      icon: Check,
      color: "text-[#16a34a] bg-[#f0fdf4]",
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-2xl p-4.5 flex items-start gap-3 text-xs leading-relaxed text-[#92400e] font-medium">
        <Info size={15} className="shrink-0 mt-0.5 text-[#ea580c]" />
        <span>
          All administrative actions require a reason and are permanently
          recorded in the audit log with your identity and timestamp. Financial
          actions require mandatory reasoning.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act, i) => (
          <button
            key={i}
            onClick={() => onSelectAction(act.title)}
            className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-brand-pink/30 hover:shadow-sm transition-all group w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center border border-transparent",
                  act.color,
                )}
              >
                <act.icon size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                  {act.title}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
                  {act.desc}
                </span>
              </div>
            </div>
            <RefreshCw
              size={13}
              className="text-[#9a99b0] opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
