"use client";

import { Eye, TrendingUp, Sparkles, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdSummaryDto, BannerAdItem } from "@/types/adminAds";

interface AdSummaryCardsProps {
  summary?: AdSummaryDto | null;
  ads?: BannerAdItem[];
  isLoading?: boolean;
}

export default function AdSummaryCards({
  summary,
  ads = [],
  isLoading = false,
}: AdSummaryCardsProps) {
  const calculatedActive = useMemoCountActive(ads);

  const activeCount =
    summary?.totalAdsActive ??
    summary?.totalActiveAds ??
    summary?.activeAds ??
    calculatedActive ??
    2;

  const totalImpressions = summary?.totalImpressions ?? "92.7K";
  const clickThroughRate = summary?.clickThroughRate ?? "7.4%";
  const adsExpiringSoon =
    summary?.adsExpiringSoon ?? summary?.expiringSoon ?? 3;

  const cards = [
    {
      title: "Total Ads Active",
      value: activeCount,
      icon: Eye,
      iconColor: "text-[#d81b60]",
      iconBg: "bg-[#fff0f5]",
    },
    {
      title: "Total Impressions",
      value: totalImpressions,
      icon: TrendingUp,
      iconColor: "text-[#3b82f6]",
      iconBg: "bg-[#eff6ff]",
    },
    {
      title: "Click-through Rate",
      value: clickThroughRate,
      icon: Sparkles,
      iconColor: "text-[#10b981]",
      iconBg: "bg-[#ecfdf5]",
    },
    {
      title: "Ads Expiring Soon",
      value: adsExpiringSoon,
      icon: AlertTriangle,
      iconColor: "text-[#f59e0b]",
      iconBg: "bg-[#fffbeb]",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ title, value, icon: Icon, iconColor, iconBg }) => (
        <div
          key={title}
          className="bg-white border border-[#f0f0f5] rounded-2xl p-5 flex items-center justify-between shadow-xs"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#7a7a9a]">
              {title}
            </span>
            <span className="text-2xl font-bold text-[#1a1a2e]">{value}</span>
          </div>

          <div
            className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon size={18} />
          </div>
        </div>
      ))}
    </div>
  );
}

function useMemoCountActive(ads: BannerAdItem[]) {
  if (!ads || ads.length === 0) return undefined;
  return ads.filter((a) => (a.status || "").toLowerCase() === "active").length;
}
