"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Link2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { BannerAdItem, CreateAdDto } from "@/types/adminAds";

interface AddEditAdSheetProps {
  isOpen: boolean;
  ad: BannerAdItem | null;
  onClose: () => void;
  onSubmit: (data: CreateAdDto, statusAction?: "published" | "draft") => void;
  isSubmitting?: boolean;
}

const AD_TYPE_OPTIONS = ["Banner", "Sponsored", "Announcement"];

const TARGET_AUDIENCE_OPTIONS = [
  "All Creators",
  "Nano",
  "Micro",
  "Macro",
  "Mega",
  "Advertisers",
];

const PLACEMENT_OPTIONS = ["Home Page", "Explore", "Campaigns", "Profile"];

function AdFormInner({
  ad,
  onSubmit,
  isSubmitting = false,
}: Omit<AddEditAdSheetProps, "isOpen">) {
  const [title, setTitle] = useState(ad?.title || "");
  const [adType, setAdType] = useState(ad?.adType || "Banner");
  const [targetAudience, setTargetAudience] = useState<string[]>(
    ad?.targetAudience || ["All Creators"],
  );
  const [placement, setPlacement] = useState<string[]>(
    ad?.placement || ["Home Page"],
  );
  const [adImageUrl, setAdImageUrl] = useState(ad?.adImageUrl || "");
  const [linkUrl, setLinkUrl] = useState(ad?.linkUrl || "");
  const [startDate, setStartDate] = useState(
    ad?.startDate ? ad.startDate.split("T")[0] : "2026-06-01",
  );
  const [endDate, setEndDate] = useState(
    ad?.endDate ? ad.endDate.split("T")[0] : "2026-06-30",
  );

  const toggleAudience = (aud: string) => {
    if (aud === "All Creators") {
      setTargetAudience(["All Creators"]);
      return;
    }
    const filtered = targetAudience.filter((a) => a !== "All Creators");
    if (filtered.includes(aud)) {
      const next = filtered.filter((a) => a !== aud);
      setTargetAudience(next.length === 0 ? ["All Creators"] : next);
    } else {
      setTargetAudience([...filtered, aud]);
    }
  };

  const togglePlacement = (place: string) => {
    if (placement.includes(place)) {
      if (placement.length === 1) return; // keep at least 1
      setPlacement(placement.filter((p) => p !== place));
    } else {
      setPlacement([...placement, place]);
    }
  };

  const handleFormSubmit = (
    e: React.FormEvent,
    statusAction: "published" | "draft" = "published",
  ) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(
      {
        title: title.trim(),
        adType,
        targetAudience,
        placement,
        adImageUrl: adImageUrl.trim(),
        linkUrl: linkUrl.trim(),
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.000Z`,
        status: statusAction === "published" ? "active" : "draft",
      },
      statusAction,
    );
  };

  return (
    <form
      onSubmit={(e) => handleFormSubmit(e, "published")}
      className="flex-1 flex flex-col gap-5 overflow-y-auto p-6 pt-0 scrollbar-hide"
    >
      {/* Ad Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Ad Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter ad title..."
          required
          autoFocus
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Ad Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#1a1a2e]">Ad Type</label>
        <div className="flex items-center gap-2">
          {AD_TYPE_OPTIONS.map((type) => {
            const isActive = adType.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => setAdType(type)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-brand-pink text-white shadow-xs"
                    : "bg-[#f8f8fa] border border-[#ececf2] text-[#6b6b80] hover:bg-white",
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Audience */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#1a1a2e]">
          Target Audience
        </label>
        <div className="flex flex-wrap gap-2">
          {TARGET_AUDIENCE_OPTIONS.map((aud) => {
            const isSelected = targetAudience.includes(aud);
            return (
              <button
                key={aud}
                type="button"
                onClick={() => toggleAudience(aud)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-[#3b82f6] text-white shadow-xs"
                    : "bg-[#f8f8fa] border border-[#ececf2] text-[#6b6b80] hover:bg-white",
                )}
              >
                {aud}
              </button>
            );
          })}
        </div>
      </div>

      {/* Placement */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#1a1a2e]">Placement</label>
        <div className="flex flex-wrap gap-2">
          {PLACEMENT_OPTIONS.map((place) => {
            const isSelected = placement.includes(place);
            return (
              <button
                key={place}
                type="button"
                onClick={() => togglePlacement(place)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-[#2563eb] text-white shadow-xs"
                    : "bg-[#f8f8fa] border border-[#ececf2] text-[#6b6b80] hover:bg-white",
                )}
              >
                {place}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ad Image URL & Preview */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#1a1a2e]">Ad Image URL</label>
        <input
          type="text"
          value={adImageUrl}
          onChange={(e) => setAdImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-2.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />

        <div className="border border-dashed border-[#d0d0dc] rounded-2xl p-4 bg-[#fafafa] flex flex-col items-center justify-center gap-2 text-center min-h-[120px] relative overflow-hidden">
          {adImageUrl ? (
            <div className="relative w-full h-[120px]">
              <Image
                src={adImageUrl}
                alt="Ad preview"
                fill
                className="object-cover rounded-xl"
                unoptimized
              />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white border border-[#ececf2] flex items-center justify-center text-[#9a99b0]">
                <Camera size={18} />
              </div>
              <span className="text-xs text-[#7a7a9a]">
                Drag & drop image here or paste a URL above
              </span>
            </>
          )}
        </div>
      </div>

      {/* Link URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">
          Link URL (optional)
        </label>
        <div className="relative">
          <Link2
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://trendupp.com/..."
            className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a2e] focus:outline-none focus:border-brand-pink focus:bg-white transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a2e] focus:outline-none focus:border-brand-pink focus:bg-white transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#f0f0f5] mt-auto">
        <button
          type="button"
          onClick={(e) => handleFormSubmit(e, "draft")}
          disabled={isSubmitting || !title.trim()}
          className="flex-1 py-3 rounded-xl border border-[#d81b60] text-[#d81b60] hover:bg-[#fff0f5] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          Save Draft
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="flex-1 py-3 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish Ad"}
        </button>
      </div>
    </form>
  );
}

export default function AddEditAdSheet({
  isOpen,
  ad,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddEditAdSheetProps) {
  const isEditing = !!ad;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-white border-l border-[#f0f0f5] p-0 shadow-2xl flex flex-col h-full"
      >
        <SheetHeader className="p-6 pb-4 border-b border-[#f0f0f5]">
          <SheetTitle className="text-base font-bold text-[#1a1a2e]">
            {isEditing ? "Edit Ad" : "Create New Ad"}
          </SheetTitle>
        </SheetHeader>

        {isOpen && (
          <AdFormInner
            key={ad?.id || "new"}
            ad={ad}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
