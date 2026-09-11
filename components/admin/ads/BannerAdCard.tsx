"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Pencil,
  Trash2,
  GripVertical,
  Pause,
  Play,
  Archive,
  ArchiveRestore,
  Users,
  Layout,
  Calendar,
  Megaphone,
} from "lucide-react";
import type { BannerAdItem } from "@/types/adminAds";
import { cn } from "@/lib/utils";

interface BannerAdCardProps {
  ad: BannerAdItem;
  onEdit: (ad: BannerAdItem) => void;
  onToggleStatus: (ad: BannerAdItem) => void;
  onArchive: (ad: BannerAdItem) => void;
  onDelete: (ad: BannerAdItem) => void;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export default function BannerAdCard({
  ad,
  onEdit,
  onToggleStatus,
  onArchive,
  onDelete,
  dragHandleProps,
  isDragging,
}: BannerAdCardProps) {
  const statusLower = (ad.status || "active").toLowerCase();
  const isPaused = statusLower === "paused";
  const isScheduled = statusLower === "scheduled";
  const isActive = statusLower === "active";
  const isArchived = statusLower === "archived";

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
    ? ad.targetAudience
        .map((a) => (a === "Advertisers" ? "Brand" : a))
        .join(", ")
    : ad.targetAudience === "Advertisers"
      ? "Brand"
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

  const [imgError, setImgError] = useState(false);

  const displayImageUrl = useMemo(() => {
    if (typeof window !== "undefined" && ad.id) {
      try {
        const customImg = localStorage.getItem(`trendupp_ad_img_${ad.id}`);
        if (customImg) return customImg;
      } catch {
        // ignore
      }
    }
    return ad.adImageUrl;
  }, [ad.id, ad.adImageUrl]);

  return (
    <div
      className={cn(
        "bg-white border border-[#f0f0f5] rounded-2xl overflow-hidden flex flex-col shadow-xs transition-all",
        isDragging
          ? "opacity-50 border-brand-pink/40 shadow-xl scale-[1.01]"
          : "hover:border-[#e2e2ec]",
      )}
    >
      {/* Banner Image Container */}
      <div className="relative w-full h-[170px] bg-[#f0f0f5]">
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl shadow-xs text-[#7a7a9a] hover:text-brand-pink cursor-grab active:cursor-grabbing touch-none transition-colors"
            title="Drag to reorder ad"
          >
            <GripVertical size={14} />
          </div>
        )}

        {!imgError && displayImageUrl ? (
          <Image
            src={
              displayImageUrl.startsWith("data:") ||
              displayImageUrl.startsWith("http")
                ? displayImageUrl
                : `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80`
            }
            alt={ad.title}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-pink/15 via-[#eff6ff] to-[#f5f3ff] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e6f0] flex items-center justify-center text-brand-pink shadow-2xs mb-1.5">
              <Megaphone size={18} />
            </div>
            <span className="text-xs font-bold text-[#1a1a2e] max-w-[85%] truncate">
              {ad.title}
            </span>
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(ad);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] hover:bg-[#fafafa] transition-all cursor-pointer"
            >
              <Pencil size={13} />
              Edit
            </button>

            {isArchived ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(ad);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
              >
                <ArchiveRestore size={13} /> Restore
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(ad);
                  }}
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(ad);
                  }}
                  title="Archive Ad"
                  className="p-2 rounded-xl text-[#9a99b0] hover:text-[#4f46e5] hover:bg-[#eef2ff] transition-colors cursor-pointer shrink-0"
                >
                  <Archive size={15} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(ad);
              }}
              title="Delete Ad"
              className="p-2 rounded-xl text-[#9a99b0] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 size={15} />
            </button>

            <button
              type="button"
              {...dragHandleProps}
              title="Drag to reorder"
              className="p-2 rounded-xl text-[#7a7a9a] hover:text-brand-pink hover:bg-[#faf9fc] transition-colors cursor-grab active:cursor-grabbing shrink-0 touch-none"
            >
              <GripVertical size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
