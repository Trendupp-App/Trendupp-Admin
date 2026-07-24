"use client";

import { useState, useMemo } from "react";
import { X, ArrowRight, Send, Check } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import { Portal } from "@/components/ui/portal";

export interface CreatorDrawerData {
  id: string;
  name: string;
  handle: string;
  rating: string;
  location: string;
  role: string;
  initials: string;
  pitch: string;
  contentIdea: string;
  platforms: string;
  questionComment: string;
  responseMessage?: string;
  isResponded?: boolean;
  followers?: string | number;
  totalFollowers?: string | number;
  tier?: string;
  metrics?: {
    totalFollowers?: number | string;
    "total followers"?: number | string;
    total_followers?: number | string;
    completedCampaigns?: number;
    totalEarnings?: number;
    onTimeSubmissionRate?: number;
  };
}

interface CampaignCreatorDrawerProps {
  creator: CreatorDrawerData | null;
  onClose: () => void;
  isSocial?: boolean;
  selectedIds?: string[];
  confirmedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onReject?: (id: string) => void;
  onSendReply?: (replyText: string) => void;
}

export default function CampaignCreatorDrawer({
  creator,
  onClose,
  isSocial = false,
  selectedIds = [],
  confirmedIds = [],
  onToggleSelect = () => {},
  onReject = () => {},
  onSendReply = () => {},
}: CampaignCreatorDrawerProps) {
  const [replyText, setReplyText] = useState("");

  const followerCount = useMemo(() => {
    if (!creator) return "0";
    const m = creator.metrics as Record<string, unknown> | undefined;
    if (m) {
      const val =
        m["total followers"] ?? m["total_followers"] ?? m["totalFollowers"];
      if (val !== undefined && val !== null) {
        const num = Number(val);
        if (!isNaN(num) && num > 0) {
          if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
          if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
          return String(num);
        }
        if (typeof val === "string" && val.trim()) return val;
      }
    }
    if (
      creator.totalFollowers !== undefined &&
      creator.totalFollowers !== null
    ) {
      const num = Number(creator.totalFollowers);
      if (!isNaN(num) && num > 0) {
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
        return String(num);
      }
      return String(creator.totalFollowers);
    }
    if (creator.followers) {
      return String(creator.followers);
    }
    return "0";
  }, [creator]);

  if (!creator) return null;

  const isSelected =
    selectedIds.includes(creator.id) || confirmedIds.includes(creator.id);

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSendReply(replyText);
    setReplyText("");
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Drawer Container */}
        <div className="relative z-10 w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
          {/* Header dark card block */}
          <div className="bg-[#121026] text-white p-5 pt-8 relative flex flex-col gap-4 text-left shrink-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="flex gap-4 items-center mt-3">
              <div className="w-16 h-16 rounded-full border-2 border-brand-pink flex items-center justify-center overflow-hidden bg-white shrink-0">
                <UserAvatar initials={creator.initials} size={64} />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[15px] font-bold leading-tight">
                    {creator.name}
                  </span>
                  <span className="text-[11px] font-bold text-[#f59e0b]">
                    ★ {creator.rating}
                  </span>
                </div>
                <span className="text-xs text-[#9a99b0] mt-0.5">
                  {creator.handle}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-semibold mt-1">
                  {creator.location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-white/90">
                  {followerCount.includes("follower")
                    ? followerCount
                    : `${followerCount} followers`}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="text-[10px] font-semibold text-white/90">
                  {creator.metrics?.onTimeSubmissionRate !== undefined
                    ? `${creator.metrics.onTimeSubmissionRate}% engagement`
                    : "5.2% engagement"}
                </span>
              </div>

              <a
                href="/admin/users/creators"
                className="text-[10px] font-bold text-white/90 hover:text-white flex items-center gap-1 shrink-0"
              >
                View profile <ArrowRight size={11} />
              </a>
            </div>
          </div>

          {/* Content details body */}
          <div className="p-5 flex flex-col gap-4 text-left flex-1 bg-[#faf9fc]">
            {isSocial ? (
              <div className="flex flex-col gap-4">
                {/* Pitch */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Pitch
                  </span>
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 text-xs text-[#5a5a7a] font-medium leading-relaxed bg-[#ffffff]">
                    {creator.pitch}
                  </div>
                </div>

                {/* Content Idea */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Content Idea
                  </span>
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 text-xs text-[#5a5a7a] font-medium leading-relaxed bg-[#ffffff]">
                    {creator.contentIdea}
                  </div>
                </div>

                {/* Platforms */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Platforms
                  </span>
                  <div className="text-xs text-[#1a1a2e] font-bold">
                    {creator.platforms}
                  </div>
                </div>

                {/* Question / Comment */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Question / Comment
                  </span>
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 text-xs text-[#5a5a7a] font-medium leading-relaxed bg-[#ffffff]">
                    {creator.questionComment}
                  </div>
                </div>

                {/* Reply Section */}
                <div className="flex flex-col gap-2 mt-2">
                  {creator.isResponded ? (
                    <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex flex-col gap-1.5 text-xs text-[#1e40af] font-medium">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                        Your Reply
                      </span>
                      <p className="text-[#1e3a8a] italic">
                        “{creator.responseMessage}”
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#5a5a7a]">
                        Reply to creator
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a response..."
                          className="flex-1 h-9 px-3 text-xs bg-white border border-[#e8e6f0] rounded-xl outline-none focus:border-brand-pink transition-colors"
                        />
                        <button
                          onClick={handleSend}
                          disabled={!replyText.trim()}
                          className="h-9 px-3 bg-brand-pink text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          <Send size={12} /> Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Non-social / Standard overview */
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Overview
                  </span>
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 text-xs text-[#5a5a7a] font-medium leading-relaxed">
                    {creator.pitch || "No pitch details provided."}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Role & Specialty
                  </span>
                  <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 text-xs text-[#1a1a2e] font-bold">
                    {creator.role}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#e8e6f0]/60 mt-auto">
              <button
                onClick={() => onReject(creator.id)}
                className="flex-1 h-10 rounded-xl border border-[#e8e6f0] bg-white hover:bg-[#fef2f2] hover:border-[#fecaca] text-[#dc2626] text-xs font-bold transition-all cursor-pointer"
              >
                Reject
              </button>

              <button
                onClick={() => onToggleSelect(creator.id)}
                className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#16a34a] text-white hover:bg-[#15803d]"
                    : "bg-brand-pink text-white hover:opacity-90"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={14} /> Selected
                  </>
                ) : (
                  "Select Creator"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
