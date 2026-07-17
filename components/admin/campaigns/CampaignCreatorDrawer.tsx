"use client";

import { useState } from "react";
import { X, ArrowRight, ExternalLink, Info, Send, Check } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import { Portal } from "@/components/ui/portal";

interface CreatorDrawerData {
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
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#7c3aed] text-white">
                  Micro
                </span>
                <span className="text-[10px] font-semibold text-white/90">
                  180K followers
                </span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="text-[10px] font-semibold text-white/90">
                  5.2% engagement
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
                      <div className="relative">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Ask a question or request a quick tweak..."
                          className="w-full min-h-[70px] p-3 pr-10 text-xs border border-[#e8e6f0] rounded-2xl focus:outline-none focus:border-brand-pink bg-white resize-none"
                        />
                        <button
                          onClick={handleSend}
                          className="absolute right-3.5 bottom-3.5 text-brand-pink hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    Instagram
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
                    Revision requested
                  </span>
                </div>
                <span className="text-[9px] text-[#9a99b0] font-semibold -mt-2.5">
                  Submitted 2 hours ago
                </span>

                <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2 bg-[#ffffff]">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Content Link
                  </span>
                  <a
                    href="https://instagram.com/p/example1"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 w-fit"
                  >
                    https://instagram.com/p/example1 <ExternalLink size={11} />
                  </a>
                  <p className="text-xs text-[#5a5a7a] font-medium italic mt-0.5">
                    “Shot at Lekki beach during golden hour. Used trending
                    audio. Caption ideas included in the doc.”
                  </p>

                  <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed text-[#92400e] font-medium mt-1">
                    <Info
                      size={13}
                      className="shrink-0 mt-0.5 text-[#f59e0b]"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#b45309]">
                        Revision Request
                      </span>
                      <span>
                        Great take overall! Please add the Audiomack app UI
                        briefly &mdash; it was missing from this submission.
                        Also, the hashtag #AudiomackAfrobeats needs to be in the
                        caption.
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#dbeafe] bg-[#eff6ff]/20 rounded-xl p-3 flex flex-col gap-1.5 mt-2 text-xs leading-relaxed text-[#2563eb]">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#1d4ed8]">
                      Revised Content
                    </span>
                    <a
                      href="https://instagram.com/p/example1"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold flex items-center gap-1 w-fit"
                    >
                      https://instagram.com/p/example1{" "}
                      <ExternalLink size={11} />
                    </a>
                    <p className="text-[#5a5a7a] font-medium italic mt-0.5">
                      “Shot at Lekki beach during golden hour. Used trending
                      audio. Caption ideas included in the doc.”
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sticky Bottom Actions */}
          {isSocial && (
            <div className="p-4 border-t border-[#e8e6f0]/40 bg-white flex gap-3 shrink-0">
              {isSelected ? (
                <div className="flex-1 h-10 bg-[#f0fdf4] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1 cursor-default select-none">
                  <Check size={14} /> Selected
                </div>
              ) : (
                <button
                  onClick={() => onToggleSelect(creator.id)}
                  className="flex-1 h-10 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Check size={14} /> Accept
                </button>
              )}
              <button
                onClick={() => {
                  onReject(creator.id);
                  onClose();
                }}
                className="flex-1 h-10 bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fee2e2]/60 text-xs font-bold text-[#dc2626] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <X size={14} className="shrink-0" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
