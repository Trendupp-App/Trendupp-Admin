"use client";

import { Eye, Check } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import {
  getInitials,
  formatFollowers,
  formatCurrency,
  convertForDisplay,
} from "@/lib/utils";
import { useCampaign } from "@/hooks/useCampaign";
import { useUsdToNgnRate } from "@/hooks/useExchangeRate";
import type { CreatorDrawerData } from "./CampaignCreatorDrawer";

interface SelectedCreatorsTabProps {
  isSocial?: boolean;
  campaignId?: string;
  currency?: string;
  creators?: CreatorDrawerData[];
  confirmedIds?: string[];
  onViewApplicationDetails?: (creator: CreatorDrawerData) => void;
}

export default function SelectedCreatorsTab({
  isSocial = false,
  campaignId,
  currency,
  creators = [],
  confirmedIds = [],
  onViewApplicationDetails = () => {},
}: SelectedCreatorsTabProps) {
  const { data: campaign, isLoading } = useCampaign(
    !isSocial ? (campaignId ?? null) : null,
  );
  const { data: usdToNgnRate } = useUsdToNgnRate(!isSocial && !!campaignId);

  if (isSocial) {
    const confirmedCreators = creators.filter((c) =>
      confirmedIds.includes(c.id),
    );

    if (confirmedCreators.length === 0) {
      return (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 text-center text-xs text-[#7a7a9a]">
          No creators selected yet. Accept applications to select creators.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 text-left">
        <h3 className="text-[11px] font-semibold text-[#9a99b0]">
          {confirmedCreators.length} creator
          {confirmedCreators.length > 1 ? "s" : ""} selected &bull; Admin view
          only
        </h3>

        <div className="flex flex-col gap-4">
          {confirmedCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5.5 flex flex-col md:flex-row justify-between gap-4.5 items-start md:items-center"
            >
              <div className="flex gap-4 items-start flex-1 min-w-0">
                <UserAvatar initials={creator.initials} size={40} />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#1a1a2e]">
                      {creator.name}
                    </span>
                    <span className="text-[10px] text-[#9a99b0] font-medium">
                      {creator.handle}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                    {creator.contentIdea || creator.pitch}
                  </p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {creator.tier && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]">
                        {creator.tier}
                      </span>
                    )}
                    {creator.platforms && (
                      <span className="text-[10px] font-bold text-[#5a5a7a]">
                        {creator.platforms}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onViewApplicationDetails(creator)}
                  className="h-9 px-3 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-[#5a5a7a] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Eye size={14} /> View
                </button>
                <div className="h-9 px-3.5 bg-[#ecfdf5] border border-[#d1fae5]/60 text-xs font-bold text-[#10b981] rounded-xl flex items-center justify-center gap-1 cursor-default select-none">
                  <Check size={14} /> Confirmed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const acceptedApplications = (campaign?.applications ?? []).filter(
    (app) => app.status === "accepted",
  );

  if (isLoading) {
    return (
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
    );
  }

  if (acceptedApplications.length === 0) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 text-center text-xs text-[#7a7a9a]">
        No creators selected yet. Accept applications to select creators.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      <h3 className="text-[11px] font-semibold text-[#9a99b0]">
        {acceptedApplications.length} creator
        {acceptedApplications.length > 1 ? "s" : ""} selected &bull; Admin view
        only
      </h3>

      <div className="flex flex-col gap-4">
        {acceptedApplications.map((app) => {
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
          const fee = convertForDisplay(app.feeRequest, currency, usdToNgnRate);
          const feeRequestedText = fee.secondary
            ? `${formatCurrency(fee.amount, fee.currency)} (≈ ${formatCurrency(fee.secondary.amount, fee.secondary.currency)})`
            : formatCurrency(fee.amount, fee.currency);

          return (
            <div
              key={app.id}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5.5 flex flex-col md:flex-row justify-between gap-4.5 items-start md:items-center"
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
                      {feeRequestedText} requested
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
                      feeRequested: feeRequestedText,
                      applicationStatus: app.status,
                    });
                  }}
                  className="h-9 px-3 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-[#5a5a7a] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Eye size={14} /> View
                </button>
                <div className="h-9 px-3.5 bg-[#ecfdf5] border border-[#d1fae5]/60 text-xs font-bold text-[#10b981] rounded-xl flex items-center justify-center gap-1 cursor-default select-none">
                  <Check size={14} /> Accepted
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
