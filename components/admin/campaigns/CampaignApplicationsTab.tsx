"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Eye, Check, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { useCampaign, useReviewApplication } from "@/hooks/useCampaign";
import type { CreatorDrawerData } from "./CampaignCreatorDrawer";

interface CampaignApplicationsTabProps {
  isSocial?: boolean;
  campaignId?: string;
  currency?: string;
  creators?: CreatorDrawerData[];
  selectedIds?: string[];
  confirmedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onReject?: (id: string) => void;
  onConfirm?: () => void;
  onViewDetails?: (id: string) => void;
  onViewApplicationDetails?: (creator: CreatorDrawerData) => void;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
  accepted: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
  rejected: "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

const getInitials = (firstName?: string, lastName?: string) => {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return initials || "?";
};

const formatFollowers = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

export default function CampaignApplicationsTab({
  isSocial,
  campaignId,
  currency,
  creators = [],
  selectedIds = [],
  confirmedIds = [],
  onToggleSelect = () => {},
  onReject = () => {},
  onConfirm = () => {},
  onViewDetails = () => {},
  onViewApplicationDetails = () => {},
}: CampaignApplicationsTabProps) {
  const queryClient = useQueryClient();
  const { data: campaign, isLoading } = useCampaign(
    !isSocial && campaignId ? campaignId : null,
  );
  const reviewApplication = useReviewApplication(campaignId ?? "", () => {
    if (campaignId) {
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    }
  });

  if (isSocial) {
    const defaultApps = [
      {
        id: "1",
        name: "Adaeze Obi",
        handle: "@adaeze_eats",
        rating: "4.9",
        pitch:
          "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
        initials: "AO",
      },
      {
        id: "2",
        name: "Chisom Nwosu",
        handle: "@chisom.ng",
        rating: "4.9",
        pitch:
          "A 'day in my Ramadan' vlog that features KFC as the iftar meal of choice — authentic, personal, low-key.",
        initials: "CN",
      },
      {
        id: "3",
        name: "Emeka Chukwu",
        handle: "@chef_emeka",
        rating: "4.9",
        pitch:
          "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
        initials: "EC",
      },
      {
        id: "4",
        name: "Fatima Garba",
        handle: "@fatima.foods",
        rating: "4.9",
        pitch:
          "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
        initials: "FG",
      },
    ];

    return (
      <div className="flex flex-col gap-4 text-left">
        {selectedIds.length > 0 && (
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
          {(creators.length ? creators : defaultApps).map((app, i) => {
            const isSelected =
              selectedIds.includes(app.id) || confirmedIds.includes(app.id);

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
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]/60">
                        Applied
                      </span>
                      <span className="text-[10px] font-bold text-[#f59e0b] flex items-center gap-0.5 ml-1">
                        ★ {app.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                      {app.pitch}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#7a7a9a] mt-3 font-semibold">
                      <MessageSquare size={12} className="text-[#9a99b0]" />
                      <span>1 note from creator</span>
                    </div>

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
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const applications = campaign?.applications ?? [];
  const currencySymbol = currency === "USD" ? "$" : "₦";

  return (
    <div className="flex flex-col gap-4 text-left">
      <h3 className="text-[11px] font-semibold text-[#9a99b0]">
        {applications.length} total application
        {applications.length === 1 ? "" : "s"} &bull; Admin view only
      </h3>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex gap-4 items-start animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-[#e8e6f0]/60 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="w-1/3 h-3 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-2/3 h-3 bg-[#e8e6f0]/50 rounded-md" />
                <div className="w-1/2 h-3 bg-[#e8e6f0]/40 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl py-10 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-xs font-bold text-[#1a1a2e]">
            No applications yet
          </p>
          <p className="text-[11px] text-[#9a99b0]">
            Creators haven&apos;t applied to this campaign yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const creator = app.creator;
            const totalFollowers =
              (creator.instagramFollowers || 0) +
              (creator.tiktokFollowers || 0) +
              (creator.youtubeFollowers || 0) +
              (creator.twitterFollowers || 0);
            const platformNames = [
              app.primaryPlatform?.name,
              app.secondaryPlatform?.name,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={app.id}
                className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col md:flex-row justify-between gap-4.5 items-start md:items-center"
              >
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <UserAvatar
                    avatarUrl={creator.avatarUrl}
                    initials={getInitials(creator.firstName, creator.lastName)}
                    size={40}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#1a1a2e]">
                        {creator.firstName} {creator.lastName}
                      </span>
                      <span className="text-[10px] text-[#9a99b0] font-medium">
                        @{creator.username}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold border",
                          STATUS_BADGE[app.status] ??
                            "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
                        )}
                      >
                        {STATUS_LABEL[app.status] ?? app.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                      {app.contentIdea}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {creator.assignedTier && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]">
                          {creator.assignedTier}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-[#5a5a7a]">
                        {formatFollowers(totalFollowers)}{" "}
                        <span className="text-[#9a99b0] font-medium">
                          followers
                        </span>
                      </span>
                      {platformNames && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9a99b0] shrink-0" />
                          <span className="text-[10px] font-bold text-[#5a5a7a]">
                            {platformNames}
                          </span>
                        </>
                      )}
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9a99b0] shrink-0" />
                      <span className="text-[10px] font-bold text-[#1a1a2e]">
                        {currencySymbol}
                        {app.feeRequest.toLocaleString()} requested
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          reviewApplication.mutate({
                            appId: app.id,
                            status: "accepted",
                          })
                        }
                        disabled={reviewApplication.isPending}
                        className="h-9 px-3.5 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() =>
                          reviewApplication.mutate({
                            appId: app.id,
                            status: "rejected",
                          })
                        }
                        disabled={reviewApplication.isPending}
                        className="h-9 px-3.5 bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fee2e2]/60 text-xs font-bold text-[#dc2626] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      const pastWorkLink = Array.isArray(app.pastWorkLink)
                        ? app.pastWorkLink[0]
                        : app.pastWorkLink;
                      onViewApplicationDetails({
                        id: creator.id,
                        name: `${creator.firstName} ${creator.lastName}`,
                        handle: creator.username ? `@${creator.username}` : "—",
                        rating: "—",
                        location: "—",
                        role: "Creator",
                        initials: getInitials(
                          creator.firstName,
                          creator.lastName,
                        ),
                        pitch: "",
                        contentIdea: app.contentIdea,
                        platforms: platformNames || "—",
                        questionComment: app.comments ?? "—",
                        tier: creator.assignedTier,
                        totalFollowers: formatFollowers(totalFollowers),
                        pastWorkLink: pastWorkLink || undefined,
                        feeRequested: `${currencySymbol}${app.feeRequest.toLocaleString()}`,
                        applicationStatus: app.status,
                      });
                    }}
                    className="h-9 px-4.5 border bg-[#f4f3f6] text-xs font-bold text-[#5a5a7a] rounded-lg hover:bg-[#faf9fc] shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    View application <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
