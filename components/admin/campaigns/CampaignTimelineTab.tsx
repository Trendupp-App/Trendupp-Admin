"use client";

import { cn } from "@/lib/utils";
import { useActivityTimeline } from "@/hooks/useCampaign";

interface CampaignTimelineTabProps {
  campaignId?: string;
}

const ROLE_DOT: Record<string, string> = {
  Brand: "bg-brand-pink",
  Creator: "bg-[#7c3aed]",
  Admin: "bg-[#f59e0b]",
  System: "bg-[#7a7a9a]",
};

const ROLE_BADGE: Record<string, string> = {
  Brand: "bg-[#fff1f2] text-brand-pink",
  Creator: "bg-[#f5f3ff] text-[#7c3aed]",
  Admin: "bg-[#fff7ed] text-[#ea580c]",
  System: "bg-[#faf9fc] text-[#5a5a7a]",
};

export default function CampaignTimelineTab({
  campaignId,
}: CampaignTimelineTabProps) {
  const { data, isLoading } = useActivityTimeline(campaignId ?? null);
  const activities = data?.activities ?? [];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-6 text-left">
      <h3 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider border-b border-[#e8e6f0]/40 pb-3">
        ACTIVITY TIMELINE &mdash; ALL EVENTS ARE IMMUTABLE AND TIMESTAMPED
      </h3>

      {isLoading ? (
        <div className="relative pl-6 flex flex-col gap-6.5">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#e8e6f0]" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="w-40 h-3 bg-[#e8e6f0]/60 rounded-md" />
              <div className="w-2/3 h-3.5 bg-[#e8e6f0]/50 rounded-md" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-xs text-[#9a99b0] text-center py-6">
          No activity has been recorded for this campaign yet.
        </p>
      ) : (
        <div className="relative pl-6 flex flex-col gap-6.5">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#e8e6f0]" />

          {activities.map((ev) => (
            <div
              key={ev.id}
              className="relative flex flex-col gap-1 items-start text-left"
            >
              <div
                className={cn(
                  "absolute -left-5.5 top-1 w-3.5 h-3.5 rounded-full border-4 border-white shadow-sm ring-1 ring-[#e8e6f0]",
                  ROLE_DOT[ev.actorType] ?? "bg-[#7a7a9a]",
                )}
              />

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                    ROLE_BADGE[ev.actorType] ?? "bg-[#faf9fc] text-[#5a5a7a]",
                  )}
                >
                  {ev.actorType}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-semibold">
                  {ev.formattedTime}
                </span>
              </div>
              <p className="text-xs text-[#1a1a2e] font-bold mt-0.5">
                {ev.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
