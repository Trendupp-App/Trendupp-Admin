"use client";

import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Info,
  ArrowRight,
  Check,
} from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";

interface CampaignDeliverablesTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails: (c: any) => void;
  isSocial?: boolean;
  deliverableStatus?: "Awaiting" | "Approved";
  onApprove?: () => void;
  onRequestRevision?: () => void;
}

export default function CampaignDeliverablesTab({
  onViewDetails,
  isSocial = false,
  deliverableStatus = "Awaiting",
  onApprove = () => {},
  onRequestRevision = () => {},
}: CampaignDeliverablesTabProps) {
  const [filter, setFilter] = useState("Revision");

  const subs = [
    {
      name: "Adaeze Obi",
      time: "Submitted 2 hours ago",
      initials: "AO",
      link: "https://instagram.com/p/example1",
      desc: "“Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.”",
      revision:
        "Great take overall! Please add the Audiomack app UI briefly — it was missing from this submission. Also, the hashtag #AudiomackAfrobeats needs to be in the caption.",
      revised: null,
    },
    {
      name: "Emeka Chukwu",
      time: "Submitted 2 hours ago",
      initials: "EC",
      link: "https://instagram.com/p/example1",
      desc: "“Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.”",
      revision:
        "Great take overall! Please add the Audiomack app UI briefly — it was missing from this submission. Also, the hashtag #AudiomackAfrobeats needs to be in the caption.",
      revised: {
        link: "https://instagram.com/p/example1",
        desc: "“Shot at Lekki beach during golden hour. Used trending audio. Caption ideas included in the doc.”",
      },
    },
  ];

  if (isSocial) {
    return (
      <div className="flex flex-col gap-6 text-left">
        {/* Awaiting Section */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Awaiting
          </h4>
          {deliverableStatus === "Awaiting" ? (
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col gap-4 text-left">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <UserAvatar initials="AO" size={36} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1a2e]">
                      Adaeze Obi
                    </span>
                    <span className="text-[10px] text-[#9a99b0] font-medium">
                      Instagram reels &bull; Submitted 2 hours ago
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#f3f4f6] text-[#5a5a7a] border border-[#e5e7eb]">
                  Awaiting review
                </span>
              </div>

              <div className="border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2 bg-[#faf9fc]/40">
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
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onApprove}
                  className="h-9 px-4 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check size={14} /> Approve content
                </button>
                <button
                  onClick={onRequestRevision}
                  className="h-9 px-4 bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#ffedd5]/60 text-xs font-bold text-[#ea580c] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Request revision
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#9a99b0]">
              No deliverables awaiting review.
            </p>
          )}
        </div>

        {/* Approved Section */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Approved
          </h4>
          {deliverableStatus === "Approved" ? (
            <div className="flex flex-col gap-4">
              {/* Campaign Complete Banner */}
              <div className="bg-[#f0fdf4] border border-[#dcfce7] text-[#15803d] text-xs font-bold p-4.5 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                  <Check size={14} />
                </div>
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="font-bold text-xs">CAMPAIGN COMPLETE</span>
                  <span className="text-[10px] text-[#16a34a] font-medium">
                    Content is live and verified. No further action needed.
                  </span>
                </div>
              </div>

              {/* Creator Card */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <UserAvatar initials="AO" size={36} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#1a1a2e]">
                        Adaeze Obi
                      </span>
                      <span className="text-[10px] text-[#9a99b0] font-medium">
                        @adaeze_eats
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]">
                        Micro
                      </span>
                      <span className="text-[10px] font-bold text-[#5a5a7a]">
                        180K{" "}
                        <span className="text-[#9a99b0] font-medium">
                          followers
                        </span>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9a99b0] shrink-0" />
                      <span className="text-[10px] font-bold text-[#5a5a7a]">
                        5.2%{" "}
                        <span className="text-[#9a99b0] font-medium">
                          engagement
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2 bg-[#faf9fc]/40">
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
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#9a99b0]">
              No approved deliverables yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="relative w-fit">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 pl-3.5 pr-8 rounded-lg bg-[#f4f3f6] text-[10px] font-bold text-[#5a5a7a] appearance-none cursor-pointer border border-[#e8e6f0]/60 focus:outline-none"
        >
          <option value="Revision">Revision</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a7a9a] pointer-events-none"
        />
      </div>

      <div className="flex flex-col gap-4">
        {subs.map((sub, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col gap-4 text-left"
          >
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar initials={sub.initials} size={36} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-[#9a99b0] font-medium">
                    {sub.time}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
                Revision requested
              </span>
            </div>

            <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                Content Link
              </span>
              <a
                href={sub.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 w-fit"
              >
                {sub.link} <ExternalLink size={11} />
              </a>
              <p className="text-xs text-[#5a5a7a] font-medium italic mt-0.5">
                {sub.desc}
              </p>

              <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3.5 flex items-start gap-2.5 mt-2 text-xs leading-relaxed text-[#92400e] font-medium">
                <Info size={14} className="shrink-0 mt-0.5 text-[#f59e0b]" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                    Revision Request
                  </span>
                  <span>{sub.revision}</span>
                </div>
              </div>

              {sub.revised && (
                <div className="border border-[#dbeafe] bg-[#eff6ff]/20 rounded-xl p-3.5 flex flex-col gap-2 mt-3 text-xs leading-relaxed text-[#2563eb]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d4ed8]">
                    Revised Content
                  </span>
                  <a
                    href={sub.revised.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold flex items-center gap-1 w-fit"
                  >
                    {sub.revised.link} <ExternalLink size={11} />
                  </a>
                  <p className="text-[#5a5a7a] font-medium italic mt-0.5">
                    {sub.revised.desc}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  onViewDetails({
                    name: sub.name,
                    handle:
                      sub.name === "Adaeze Obi"
                        ? "@adaeze_eats"
                        : "@chef_emeka",
                    rating: "4.9",
                    location: "Lagos, Nigeria",
                    status: "Impact Advocate",
                    initials: sub.initials,
                  })
                }
                className="h-9 px-4 text-xs font-bold text-[#5a5a7a] bg-[#f4f3f6] hover:bg-[#e8e6f0] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                View details <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
