"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Link2, Upload, X } from "lucide-react";
import { toast } from "sonner";
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
  onSubmit: (
    data: CreateAdDto,
    statusAction?: "published" | "draft",
    localDataUrl?: string,
  ) => void;
  isSubmitting?: boolean;
}

const AD_TYPE_OPTIONS = ["Banner", "Sponsored", "Announcement"];

const TARGET_AUDIENCE_OPTIONS = [
  "All Creators",
  "Nano",
  "Micro",
  "Macro",
  "Mega",
  "Brand",
];

function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 600,
  quality = 0.75,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function AdFormInner({
  ad,
  onSubmit,
  isSubmitting = false,
}: Omit<AddEditAdSheetProps, "isOpen">) {
  const [title, setTitle] = useState(ad?.title || "");
  const [adType, setAdType] = useState(ad?.adType || "Banner");
  const [targetAudience, setTargetAudience] = useState<string[]>(() => {
    if (!ad?.targetAudience) return ["All Creators"];
    return ad.targetAudience.map((a) => (a === "Advertisers" ? "Brand" : a));
  });
  const [placement] = useState<string[]>(ad?.placement || ["Home Page"]);
  const [adImageUrl, setAdImageUrl] = useState(() => {
    if (ad?.id && typeof window !== "undefined") {
      try {
        const custom = localStorage.getItem(`trendupp_ad_img_${ad.id}`);
        if (custom) return custom;
      } catch {
        // ignore
      }
    }
    return ad?.adImageUrl || "";
  });
  const [linkUrl, setLinkUrl] = useState(ad?.linkUrl || "");
  const [startDate, setStartDate] = useState(
    ad?.startDate ? ad.startDate.split("T")[0] : "2026-06-01",
  );
  const [endDate, setEndDate] = useState(
    ad?.endDate ? ad.endDate.split("T")[0] : "2026-06-30",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB");
      return;
    }
    try {
      const compressedDataUrl = await compressImageFile(file);
      setAdImageUrl(compressedDataUrl);
      toast.success("Image file uploaded successfully");
    } catch {
      toast.error("Failed to process image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

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

  const handleFormSubmit = (
    e: React.FormEvent,
    statusAction: "published" | "draft" = "published",
  ) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an ad title.");
      return;
    }

    const formattedStartDate = startDate.includes("T")
      ? startDate
      : `${startDate}T00:00:00.000Z`;

    const formattedEndDate = endDate.includes("T")
      ? endDate
      : `${endDate}T23:59:59.000Z`;

    const finalImageUrl = adImageUrl.trim();
    let localUploadedDataUrl: string | undefined = undefined;

    // POST/PATCH /admin/ads is JSON-only and requires adImageUrl to be a
    // string URL — it cannot accept a file. Until the endpoint takes
    // multipart/form-data (as /admin/social-impact already does for
    // coverImage), an uploaded file has nowhere to be hosted, so it is kept
    // in localStorage for preview and the save is blocked rather than
    // silently storing a placeholder every other admin would see instead.
    if (finalImageUrl.startsWith("data:")) {
      localUploadedDataUrl = finalImageUrl;
      toast.error(
        "Image uploads are not supported yet — the server has no endpoint to host the file. Paste a hosted image URL instead.",
      );
      return;
    }

    if (!finalImageUrl) {
      toast.error("An ad image is required.");
      return;
    }

    const payload: CreateAdDto = {
      title: title.trim(),
      adType: adType || "Banner",
      targetAudience:
        targetAudience.length > 0 ? targetAudience : ["All Creators"],
      placement: placement.length > 0 ? placement : ["Home Page"],
      adImageUrl: finalImageUrl,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status: statusAction === "published" ? "active" : "draft",
    };

    if (linkUrl.trim()) {
      payload.linkUrl = linkUrl.trim();
    }

    onSubmit(payload, statusAction, localUploadedDataUrl);
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

      {/* Ad Image Upload & Preview */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#1a1a2e]">Ad Image *</label>
          {adImageUrl && (
            <button
              type="button"
              onClick={() => setAdImageUrl("")}
              className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X size={12} /> Remove Image
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border border-dashed rounded-2xl p-4 bg-[#fafafa] flex flex-col items-center justify-center gap-2 text-center min-h-[130px] relative overflow-hidden transition-all cursor-pointer",
            isDragging
              ? "border-brand-pink bg-brand-pink/5"
              : "border-[#d0d0dc] hover:border-brand-pink/50 hover:bg-white",
          )}
        >
          {adImageUrl ? (
            <div className="relative w-full h-[120px] rounded-xl overflow-hidden group">
              <Image
                src={adImageUrl}
                alt="Ad preview"
                fill
                className="object-cover rounded-xl"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                <Upload size={16} /> Click or drop new file to replace
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <div className="w-10 h-10 rounded-full bg-white border border-[#ececf2] flex items-center justify-center text-brand-pink shadow-2xs">
                <Upload size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Click or drag & drop image here
                </span>
                <span className="text-[10px] text-[#9a99b0]">
                  Supports PNG, JPG, WEBP up to 5MB
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-0.5">
          <label className="text-[10px] font-semibold text-[#7a7a9a]">
            Image URL
          </label>
          <input
            type="text"
            value={adImageUrl.startsWith("data:") ? "" : adImageUrl}
            onChange={(e) => setAdImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-3.5 py-2 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
          />
          <span className="text-[10px] text-[#9a99b0] leading-relaxed">
            Paste a hosted image URL. Direct file uploads are not saved to the
            server yet, so an uploaded file would only be visible to you.
          </span>
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
