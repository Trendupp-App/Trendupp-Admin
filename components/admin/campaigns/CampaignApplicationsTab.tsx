"use client";

import { ArrowRight, Eye, Check, X, MessageSquare } from "lucide-react";
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

interface CampaignApplicationsTabProps {
  isSocial?: boolean;
  creators?: CreatorDrawerData[];
  selectedIds?: string[];
  confirmedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onReject?: (id: string) => void;
  onConfirm?: () => void;
  onViewDetails?: (id: string) => void;
}

export default function CampaignApplicationsTab({
  isSocial,
  creators = [],
  selectedIds = [],
  confirmedIds = [],
  onToggleSelect = () => {},
  onReject = () => {},
  onConfirm = () => {},
  onViewDetails = () => {},
}: CampaignApplicationsTabProps) {
  const defaultApps = [
    {
      id: "1",
      name: "Adaeze Obi",
      handle: "@adaeze_eats",
      rating: "4.9",
      pitch:
        "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
      initials: "AO",
      price: null,
    },
    {
      id: "2",
      name: "Chisom Nwosu",
      handle: "@chisom.ng",
      rating: "4.9",
      pitch:
        "A 'day in my Ramadan' vlog that features KFC as the iftar meal of choice — authentic, personal, low-key.",
      initials: "CN",
      price: null,
    },
    {
      id: "3",
      name: "Emeka Chukwu",
      handle: "@chef_emeka",
      rating: "4.9",
      pitch:
        "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
      initials: "EC",
      price: "₦120,000",
    },
    {
      id: "4",
      name: "Fatima Garba",
      handle: "@fatima.foods",
      rating: "4.9",
      pitch:
        "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
      initials: "FG",
      price: "₦120,000",
    },
  ];

  const displayList = isSocial ? creators : defaultApps;

  return (
    <div className="flex flex-col gap-4 text-left">
      {isSocial && selectedIds.length > 0 && (
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex justify-between items-center text-xs text-[#1e40af] font-semibold animate-fade-in">
          <span>{selectedIds.length} creators selected</span>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-brand-pink text-white font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            Confirm Selections
          </button>
        </div>
      )}

      <h3 className="text-[11px] font-semibold text-[#9a99b0]">
        47 total applications &bull; Admin view only
      </h3>

      <div className="flex flex-col gap-4">
        {displayList.map((app, i) => {
          const isSelected =
            isSocial &&
            (selectedIds.includes(app.id) || confirmedIds.includes(app.id));

          return (
            <div
              key={app.id || i}
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
                    {isSocial && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]/60">
                        Applied
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-[#f59e0b] flex items-center gap-0.5 ml-1">
                      ★ {app.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                    {app.pitch}
                  </p>

                  {isSocial && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#7a7a9a] mt-3 font-semibold">
                      <MessageSquare size={12} className="text-[#9a99b0]" />
                      <span>1 note from creator</span>
                    </div>
                  )}

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
                    {!isSocial && "price" in app && app.price && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9a99b0] shrink-0" />
                        <span className="text-[10px] font-bold text-[#1a1a2e]">
                          {app.price}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isSocial ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewDetails(app.id)}
                    className="h-9 px-3 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-[#5a5a7a] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Eye size={14} /> View
                  </button>
                  {isSelected ? (
                    <div className="h-9 px-3.5 bg-[#f0fdf4] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1 cursor-default select-none">
                      <Check size={14} /> Selected
                    </div>
                  ) : (
                    <button
                      onClick={() => onToggleSelect(app.id)}
                      className="h-9 px-3.5 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Check size={14} /> Accept
                    </button>
                  )}
                  <button
                    onClick={() => onReject(app.id)}
                    className="h-9 px-3.5 bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fee2e2]/60 text-xs font-bold text-[#dc2626] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              ) : (
                <button className="h-9 px-4.5 border bg-[#f4f3f6] text-xs font-bold text-[#5a5a7a] rounded-lg hover:bg-[#faf9fc] shrink-0 transition-colors cursor-pointer flex items-center gap-1.5">
                  View application <ArrowRight size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
