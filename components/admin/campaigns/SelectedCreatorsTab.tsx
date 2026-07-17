"use client";

import { Eye, Check } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";

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

interface SelectedCreatorsTabProps {
  confirmedIds: string[];
  creators: CreatorDrawerData[];
  onViewDetails: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function SelectedCreatorsTab({
  confirmedIds = [],
  creators = [],
  onViewDetails,
}: SelectedCreatorsTabProps) {
  const confirmedList = creators.filter((c) => confirmedIds.includes(c.id));

  if (confirmedList.length === 0) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 text-center text-xs text-[#7a7a9a]">
        No creators selected yet. Accept applications to select creators.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      <h3 className="text-[11px] font-semibold text-[#9a99b0]">
        {confirmedList.length} creator{confirmedList.length > 1 ? "s" : ""}{" "}
        selected &bull; Admin view only
      </h3>

      <div className="flex flex-col gap-4">
        {confirmedList.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col md:flex-row justify-between gap-4.5 items-start md:items-center"
          >
            <div className="flex gap-4 items-start flex-1 min-w-0">
              <UserAvatar initials={app.initials} size={40} />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    {app.name}
                  </span>
                  <span className="text-[10px] text-[#9a99b0] font-medium">
                    {app.handle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]">
                    100 tokens
                  </span>
                  <span className="text-[10px] font-bold text-[#f59e0b] flex items-center gap-0.5 ml-1">
                    ★ {app.rating}
                  </span>
                </div>
                <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                  {app.pitch}
                </p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
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

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onViewDetails(app.id)}
                className="h-9 px-3 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-[#5a5a7a] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
              >
                <Eye size={14} /> View
              </button>
              <div className="h-9 px-3.5 bg-[#ecfdf5] border border-[#d1fae5]/60 text-xs font-bold text-[#10b981] rounded-xl flex items-center justify-center gap-1 cursor-default select-none">
                <Check size={14} /> Accepted
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
