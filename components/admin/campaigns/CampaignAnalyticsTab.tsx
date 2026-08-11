"use client";

import { CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { useCampaignMetrics } from "@/hooks/useCampaign";
import type { MetricValueDto, PlatformMetricsDto } from "@/types/postMetrics";

interface CampaignAnalyticsTabProps {
  campaignId?: string;
  isSocial?: boolean;
}

const METRIC_LABELS: Record<string, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  saves: "Saves",
  reach: "Reach",
  followerCount: "Followers",
};

const RESOLUTION_LABEL: Record<string, string> = {
  pending: "Pending capture",
  resolved: "Verified",
  unowned: "Not in creator's account",
  unsupported: "Platform unsupported",
  unauthorized: "Unauthorized",
  error: "Error resolving post",
};

const getMetricNumber = (v: MetricValueDto | number | undefined) => {
  if (typeof v === "number") return v;
  if (v && typeof v.value === "number") return v.value;
  return null;
};

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

const formatLabel = (key: string) =>
  METRIC_LABELS[key] ??
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function PostMetricsCard({
  post,
  notComparable,
}: {
  post: PlatformMetricsDto;
  notComparable: string[];
}) {
  const metricEntries = Object.entries(post.metrics).filter(
    ([, v]) => getMetricNumber(v) !== null,
  );

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[#1a1a2e]">
            {post.platformLabel}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-medium">
            Published {formatDate(post.publishedAt)}
          </span>
        </div>
        {post.ownershipVerified ? (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7] flex items-center gap-1">
            <CheckCircle2 size={11} /> Verified
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] flex items-center gap-1">
            <AlertTriangle size={11} />{" "}
            {RESOLUTION_LABEL[post.resolutionStatus] ?? post.resolutionStatus}
          </span>
        )}
      </div>

      <a
        href={post.url}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 w-fit"
      >
        View post <ExternalLink size={11} />
      </a>

      {metricEntries.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {metricEntries.map(([key, v]) => {
            const num = getMetricNumber(v) ?? 0;
            return (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  {formatNumber(num)}
                  {notComparable.includes(key) && (
                    <span className="text-[#9a99b0]">*</span>
                  )}
                </span>
                <span className="text-[9px] text-[#9a99b0] font-semibold uppercase tracking-wider">
                  {formatLabel(key)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[11px] text-[#9a99b0]">
          No metrics captured for this post yet.
        </p>
      )}
    </div>
  );
}

export default function CampaignAnalyticsTab({
  campaignId,
  isSocial,
}: CampaignAnalyticsTabProps) {
  const { data, isLoading } = useCampaignMetrics(
    !isSocial && campaignId ? campaignId : null,
  );

  if (isSocial) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl py-10 flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-xs font-bold text-[#1a1a2e]">
          Analytics not available
        </p>
        <p className="text-[11px] text-[#9a99b0]">
          Post performance metrics aren&apos;t supported for Social Impact
          campaigns yet.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 h-16 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 h-36 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const posts = data?.posts ?? [];
  const totals = data?.totals ?? {};
  const notComparable = data?.notComparableAcrossPlatforms ?? [];
  const totalEntries = Object.entries(totals);

  if (posts.length === 0) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl py-10 flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-xs font-bold text-[#1a1a2e]">
          No published posts yet
        </p>
        <p className="text-[11px] text-[#9a99b0]">
          Analytics will appear here once creators submit verified live links.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {totalEntries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {totalEntries.map(([key, value]) => (
            <div
              key={key}
              className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-1"
            >
              <span className="text-lg font-bold text-[#1a1a2e]">
                {formatNumber(value)}
                {notComparable.includes(key) && (
                  <span className="text-[#9a99b0]">*</span>
                )}
              </span>
              <span className="text-[9px] text-[#9a99b0] font-bold uppercase tracking-wider">
                {formatLabel(key)}
              </span>
            </div>
          ))}
        </div>
      )}

      {notComparable.length > 0 && (
        <p className="text-[10px] text-[#9a99b0]">
          * Not directly comparable across platforms:{" "}
          {notComparable.map(formatLabel).join(", ")}.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post, i) => (
          <PostMetricsCard
            key={`${post.url}-${i}`}
            post={post}
            notComparable={notComparable}
          />
        ))}
      </div>
      <p className="text-[10px] text-[#9a99b0]">
        Post performance metrics are not connected yet — they require the social
        platforms&apos; analytics APIs.
      </p>
    </div>
  );
}
