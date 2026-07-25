"use client";

import Image from "next/image";
import {
  Pencil,
  Trash2,
  GripVertical,
  Pause,
  Play,
  Users,
  Layout,
  Calendar,
} from "lucide-react";
import type { BannerAdItem } from "@/types/adminAds";
import { cn } from "@/lib/utils";

interface BannerAdCardProps {
  ad: BannerAdItem;
  onEdit: (ad: BannerAdItem) => void;
  onToggleStatus: (ad: BannerAdItem) => void;
  onDelete: (ad: BannerAdItem) => void;
}

export default function BannerAdCard({
  ad,
  onEdit,
  onToggleStatus,
  onDelete,
}: BannerAdCardProps) {
  const statusLower = (ad.status || "active").toLowerCase();
  const isPaused = statusLower === "paused";
  const isScheduled = statusLower === "scheduled";
  const isActive = statusLower === "active";

  const statusBadgeStyle = isPaused
    ? "bg-[#fff8e6] text-[#d68910]"
    : isScheduled
      ? "bg-[#eef2ff] text-[#4f46e5]"
      : isActive
        ? "bg-[#e8f8f0] text-[#1e8e3e]"
        : "bg-[#f0f0f8] text-[#7a7a9a]";

  const adTypeLower = (ad.adType || "Banner").toLowerCase();
  const adTypeBadgeStyle = adTypeLower.includes("announcement")
    ? "bg-[#fff2e6] text-[#f97316]"
    : adTypeLower.includes("sponsored")
      ? "bg-[#f3e8ff] text-[#a855f7]"
      : "bg-[#e0f2fe] text-[#0284c7]";

  const audienceLabel = Array.isArray(ad.targetAudience)
    ? ad.targetAudience.join(", ")
    : ad.targetAudience || "All Creators";

  const placementLabel = Array.isArray(ad.placement)
    ? ad.placement.join(", ")
    : ad.placement || "Home Page";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formattedStartDate = formatDate(ad.startDate) || "Jun 1, 2026";
  const formattedEndDate = formatDate(ad.endDate) || "Jun 30, 2026";

  const impressions = ad.impressions !== undefined ? ad.impressions : 48200;
  const clicks = ad.clicks !== undefined ? ad.clicks : 3100;
  const ctr = ad.ctr !== undefined ? ad.ctr : "6.5%";

  return (
    <div className="bg-white border border-[#f0f0f5] rounded-2xl overflow-hidden flex flex-col shadow-xs transition-all hover:border-[#e2e2ec]">
      {/* Banner Image Container */}
      <div className="relative w-full h-[170px] bg-[#f0f0f5]">
        {ad.adImageUrl ? (
          <Image
            src={ad.adImageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#9a99b0]">
            No image preview
          </div>
        )}

        {/* Status Pill Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs",
              statusBadgeStyle,
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {ad.status || "Active"}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-3">
          {/* Title and Type Tag */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold text-[#1a1a2e] leading-snug">
              {ad.title}
            </h3>

            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0",
                adTypeBadgeStyle,
              )}
            >
              {ad.adType || "Banner"}
            </span>
          </div>

          {/* Metadata list */}
          <div className="flex flex-col gap-1.5 text-xs text-[#7a7a9a]">
            <div className="flex items-center gap-2 truncate">
              <Users size={14} className="shrink-0 text-[#9a99b0]" />
              <span>
                <strong className="font-semibold text-[#55556a]">
                  Audience:
                </strong>{" "}
                {audienceLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <Layout size={14} className="shrink-0 text-[#9a99b0]" />
              <span>
                <strong className="font-semibold text-[#55556a]">
                  Placement:
                </strong>{" "}
                {placementLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0 text-[#9a99b0]" />
              <span>
                {formattedStartDate} — {formattedEndDate}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics & Actions */}
        <div className="flex flex-col gap-4 pt-3 border-t border-[#f0f0f5]">
          {/* Performance Numbers */}
          <div className="flex items-center gap-5 text-xs">
            <div className="flex flex-col">
              <span className="font-bold text-[#1a1a2e]">
                {typeof impressions === "number"
                  ? `${(impressions / 1000).toFixed(1)}K`
                  : impressions}
              </span>
              <span className="text-[10px] text-[#9a99b0]">Impressions</span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-[#1a1a2e]">
                {typeof clicks === "number"
                  ? `${(clicks / 1000).toFixed(1)}K`
                  : clicks}
              </span>
              <span className="text-[10px] text-[#9a99b0]">Clicks</span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-[#1a1a2e]">
                {typeof ctr === "number" ? `${ctr}%` : ctr}
              </span>
              <span className="text-[10px] text-[#9a99b0]">CTR</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onEdit(ad)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] hover:bg-[#fafafa] transition-all cursor-pointer"
            >
              <Pencil size={13} />
              Edit
            </button>

            <button
              onClick={() => onToggleStatus(ad)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                isPaused
                  ? "bg-[#e8f8f0] text-[#1e8e3e] hover:bg-[#d6f2e3]"
                  : "bg-[#fff8e6] text-[#d68910] hover:bg-[#fff0cb]",
              )}
            >
              {isPaused ? (
                <>
                  <Play size={13} /> Resume
                </>
              ) : (
                <>
                  <Pause size={13} /> Pause
                </>
              )}
            </button>

            <button
              onClick={() => onDelete(ad)}
              title="Delete Ad"
              className="p-2 rounded-xl text-[#9a99b0] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 size={15} />
            </button>

            <button
              title="Reorder"
              className="p-2 rounded-xl text-[#c0c0d0] hover:text-[#1a1a2e] transition-colors cursor-grab active:cursor-grabbing shrink-0"
            >
              <GripVertical size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
