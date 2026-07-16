"use client";

import { X, ArrowRight, ExternalLink, Info } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";

interface CreatorDrawerData {
  name: string;
  handle: string;
  rating: string;
  location: string;
  status: string;
  initials: string;
}

interface CampaignCreatorDrawerProps {
  creator: CreatorDrawerData | null;
  onClose: () => void;
}

export default function CampaignCreatorDrawer({
  creator,
  onClose,
}: CampaignCreatorDrawerProps) {
  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
        {/* Header dark card block */}
        <div className="bg-[#121026] text-white p-5 pt-8 relative flex flex-col gap-4 text-left">
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
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-brand-pink border border-[#ffe4e6] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
              {creator.status}
            </span>

            <a
              href="/admin/users/creators"
              className="text-[10px] font-bold text-white/90 hover:text-white flex items-center gap-1"
            >
              View profile <ArrowRight size={11} />
            </a>
          </div>
        </div>

        {/* Content details body */}
        <div className="p-5 flex flex-col gap-4 text-left flex-1 bg-[#faf9fc]">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs font-bold text-[#1a1a2e]">Instagram</span>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
              Revision requested
            </span>
          </div>
          <span className="text-[9px] text-[#9a99b0] font-semibold -mt-2.5">
            Submitted 2 hours ago
          </span>

          <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2">
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
              “Shot at Lekki beach during golden hour. Used trending audio.
              Caption ideas included in the doc.”
            </p>

            <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed text-[#92400e] font-medium mt-1">
              <Info size={13} className="shrink-0 mt-0.5 text-[#f59e0b]" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#b45309]">
                  Revision Request
                </span>
                <span>
                  Great take overall! Please add the Audiomack app UI briefly
                  &mdash; it was missing from this submission. Also, the hashtag
                  #AudiomackAfrobeats needs to be in the caption.
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
                https://instagram.com/p/example1 <ExternalLink size={11} />
              </a>
              <p className="text-[#5a5a7a] font-medium italic mt-0.5">
                “Shot at Lekki beach during golden hour. Used trending audio.
                Caption ideas included in the doc.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
