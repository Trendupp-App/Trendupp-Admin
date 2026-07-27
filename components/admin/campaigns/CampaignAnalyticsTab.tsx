"use client";

import {
  Eye,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { useSubmissions } from "@/hooks/useCampaign";

interface CampaignAnalyticsTabProps {
  campaignId: string;
}

const METRICS = [
  { label: "Total Views", icon: Eye },
  { label: "Reach", icon: TrendingUp },
  { label: "Likes", icon: ThumbsUp },
  { label: "Comments", icon: MessageSquare },
] as const;

export default function CampaignAnalyticsTab({
  campaignId,
}: CampaignAnalyticsTabProps) {
  const { data: submissions, isLoading } = useSubmissions(campaignId);

  const livePosts = (submissions ?? []).flatMap((s) => {
    const creatorName = s.creator
      ? `${s.creator.firstName ?? ""} ${s.creator.lastName ?? ""}`.trim()
      : "Creator";
    return Object.entries(s.liveLink ?? {})
      .map(([platform, entry]) => ({
        creatorName,
        platform,
        url: typeof entry === "string" ? entry : entry?.url,
      }))
      .filter((p): p is typeof p & { url: string } => Boolean(p.url));
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 animate-pulse">
        <div className="w-40 h-4 bg-[#e8e6f0]/60 rounded-md" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#faf9fc] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
          LIVE POSTS
        </span>
        {livePosts.length === 0 && (
          <p className="text-xs text-[#9a99b0] py-2">
            No live posts submitted for this campaign yet.
          </p>
        )}
        {livePosts.map((post, i) => (
          <a
            key={i}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-[#1a1a2e] hover:text-brand-pink flex items-center gap-1.5 w-fit"
          >
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase w-16 shrink-0">
              {post.platform}
            </span>
            <span className="truncate max-w-md">{post.url}</span>
            <ExternalLink size={14} className="text-[#9a99b0] shrink-0" />
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <div
            key={i}
            className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#faf9fc] flex items-center justify-center border border-[#e8e6f0]/40 text-[#7a7a9a]">
              <m.icon size={15} />
            </div>
            <div className="flex flex-col mt-1">
              <span className="text-xl font-bold text-[#b0aec8]">—</span>
              <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
                {m.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[#9a99b0]">
        Post performance metrics are not connected yet — they require the social
        platforms&apos; analytics APIs.
      </p>
    </div>
  );
}
