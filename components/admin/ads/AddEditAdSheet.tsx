"use client";

import { useState, useRef, useEffect } from "react";
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
  "Brand",
];

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
  // `adImageUrl` holds a hosted URL (existing ad or pasted link); `pickedImage`
  // holds a freshly picked file that gets uploaded as multipart `adImage`,
  // paired with the object URL used to preview it.
  const [adImageUrl, setAdImageUrl] = useState(ad?.adImageUrl || "");
  const [pickedImage, setPickedImage] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);

  // Object URLs must be revoked or they leak for the lifetime of the document.
  // The URL is created together with the file and revoked when it is replaced
  // or cleared, plus on unmount below.
  const livePreviewUrlRef = useRef<string | null>(null);

  const setPickedFile = (file: File | null) => {
    const next = file ? { file, previewUrl: URL.createObjectURL(file) } : null;
    if (livePreviewUrlRef.current) {
      URL.revokeObjectURL(livePreviewUrlRef.current);
    }
    livePreviewUrlRef.current = next?.previewUrl ?? null;
    setPickedImage(next);
  };

  useEffect(() => {
    return () => {
      if (livePreviewUrlRef.current) {
        URL.revokeObjectURL(livePreviewUrlRef.current);
      }
    };
  }, []);

  const [linkUrl, setLinkUrl] = useState(ad?.linkUrl || "");
  const [startDate, setStartDate] = useState(
    ad?.startDate ? ad.startDate.split("T")[0] : "2026-06-01",
  );
  const [endDate, setEndDate] = useState(
    ad?.endDate ? ad.endDate.split("T")[0] : "2026-06-30",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const displayImage = pickedImage?.previewUrl || adImageUrl;

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }
    // The file itself is sent to the API on submit; clear any hosted URL so we
    // do not send both.
    setPickedFile(file);
    setAdImageUrl("");
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
    if (!pickedImage && !adImageUrl.trim()) {
      toast.error("An ad image is required — upload a file or paste a URL.");
      return;
    }

    const formattedStartDate = startDate.includes("T")
      ? startDate
      : `${startDate}T00:00:00.000Z`;

    const formattedEndDate = endDate.includes("T")
      ? endDate
      : `${endDate}T23:59:59.000Z`;

    const payload: CreateAdDto = {
      title: title.trim(),
      adType: adType || "Banner",
      targetAudience:
        targetAudience.length > 0 ? targetAudience : ["All Creators"],
      placement: placement.length > 0 ? placement : ["Home Page"],
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status: statusAction === "published" ? "active" : "draft",
    };

    // A newly picked file wins; otherwise keep whatever hosted URL is set.
    if (pickedImage) {
      payload.adImage = pickedImage.file;
    } else if (adImageUrl.trim()) {
      payload.adImageUrl = adImageUrl.trim();
    }

    if (linkUrl.trim()) {
      payload.linkUrl = linkUrl.trim();
    }

    onSubmit(payload, statusAction);
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
          {displayImage && (
            <button
              type="button"
              onClick={() => {
                setAdImageUrl("");
                setPickedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
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
          {displayImage ? (
            <div className="relative w-full h-[120px] rounded-xl overflow-hidden group">
              <Image
                src={displayImage}
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
            Or paste an image URL
          </label>
          <input
            type="text"
            value={adImageUrl}
            onChange={(e) => {
              setAdImageUrl(e.target.value);
              // A pasted URL replaces a picked file.
              setPickedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            placeholder="https://..."
            className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-3.5 py-2 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
          />
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
