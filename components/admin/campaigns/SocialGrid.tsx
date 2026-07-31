"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Tag,
  FileEdit,
  Trash2,
  AlertTriangle,
  Clock,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import {
  useAdminSocialImpactList,
  useDeleteSocialImpactCampaign,
} from "@/hooks/useAdminSocialImpact";
import type { SocialImpactCampaign } from "@/types/adminSocialImpact";
import SocialEmptyState from "@/components/admin/campaigns/SocialEmptyState";

interface SocialGridProps {
  searchQuery?: string;
}

export default function SocialGrid({ searchQuery = "" }: SocialGridProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Draft" | "Active" | "Completed">(
    "Draft",
  );
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: campaignResponse, isLoading } = useAdminSocialImpactList({
    q: searchQuery,
  });

  const deleteCampaignMutation = useDeleteSocialImpactCampaign();

  const campaignsList: SocialImpactCampaign[] = campaignResponse?.data || [];

  const isDraftCampaign = (c: SocialImpactCampaign) => {
    const s = String(c.status || "").toLowerCase();
    return Boolean(c.isDraft) || s === "draft";
  };

  const isCompletedCampaign = (c: SocialImpactCampaign) => {
    const s = String(c.status || "").toLowerCase();
    return s === "completed";
  };

  const counts = {
    Draft: campaignsList.filter(isDraftCampaign).length,
    Active: campaignsList.filter(
      (c) => !isDraftCampaign(c) && !isCompletedCampaign(c),
    ).length,
    Completed: campaignsList.filter(isCompletedCampaign).length,
  };

  const displayItems = campaignsList.filter((c) => {
    if (activeTab === "Draft") {
      return isDraftCampaign(c);
    }
    if (activeTab === "Completed") {
      return isCompletedCampaign(c);
    }
    return !isDraftCampaign(c) && !isCompletedCampaign(c);
  });

  const TABS = [
    { id: "Draft" as const, label: "Draft", count: counts.Draft },
    { id: "Active" as const, label: "Active", count: counts.Active },
    { id: "Completed" as const, label: "Completed", count: counts.Completed },
  ];

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCampaignMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch {
      // Handled in mutation hook
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Tab Row (Underline layout) */}
      <div className="flex items-center gap-6 border-b border-[#e8e6f0]/60 w-full pb-0 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "pb-3 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none",
                active
                  ? "border-brand-pink text-brand-pink"
                  : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]",
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center justify-center min-w-5 h-4.5 transition-colors",
                  active
                    ? "bg-brand-pink text-white shadow-sm"
                    : "bg-[#f4f3f6] text-[#7a7a9a]",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 h-48 animate-pulse flex flex-col gap-3"
            >
              <div className="w-full h-24 bg-gray-100 rounded-xl" />
              <div className="w-2/3 h-4 bg-gray-100 rounded" />
              <div className="w-1/3 h-3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : activeTab === "Draft" ? (
        <div className="flex flex-col gap-4">
          {displayItems.length === 0 && <SocialEmptyState tab="Draft" />}
          {displayItems.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in-up"
            >
              {/* Left Info Section */}
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] border border-[#dbeafe]/40 text-[#2563eb] flex items-center justify-center shrink-0">
                  <Megaphone size={18} />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug">
                    {c.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-[#5a5a7a] flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-[#5a5a7a] bg-[#f4f3f6]/60 px-2 py-0.5 rounded-lg border border-[#e8e6f0]/40 text-[9px] uppercase tracking-wider">
                      <Tag size={10} className="text-[#9a99b0]" />
                      {c.niche || c.brandName || "General"}
                    </span>

                    <span className="text-[#9a99b0] font-medium">•</span>

                    <span className="text-[#9a99b0] font-medium">
                      {c.lastEditedAt || "Draft saved"}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#7a7a9a] font-semibold mt-0.5 flex items-center gap-1">
                    {c.currentStep || 1}/3 sections
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end">
                <button
                  onClick={() =>
                    router.push(
                      `/admin/campaigns/social/create?draftId=${c.id}`,
                    )
                  }
                  className="h-9 px-4.5 border border-[#e8e6f0] bg-white hover:bg-[#faf9fc] text-xs font-bold text-[#5a5a7a] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileEdit size={13} /> Continue
                </button>
                <button
                  onClick={() => setDeleteTargetId(c.id)}
                  className="w-9 h-9 border border-[#e8e6f0] bg-white hover:bg-[#faf9fc] text-[#5a5a7a] hover:text-[#dc2626] rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.length === 0 && <SocialEmptyState tab={activeTab} />}
          {displayItems.map((c) => {
            const rawObj = c as unknown as Record<string, unknown>;

            const daysLeftVal = c.deadline || "Open";

            const categoryVal = String(
              c.category ??
                c.niche ??
                rawObj.category ??
                rawObj.niche ??
                c.brandName ??
                rawObj.brandName ??
                rawObj.brand_name ??
                "Trendupp",
            );

            const tokenRewardNum = Number(
              c.tokenReward ??
                c.tokensReward ??
                c.tokens ??
                rawObj.tokenReward ??
                rawObj.token_reward ??
                rawObj.tokensReward ??
                rawObj.tokens_reward ??
                rawObj.rewardTokens ??
                rawObj.reward_tokens ??
                0,
            );

            const appliedCountNum = Number(
              c.appliedCount ??
                c.applicationsCount ??
                c.participantsCount ??
                rawObj.appliedCount ??
                rawObj.applied_count ??
                rawObj.applicationsCount ??
                rawObj.applications_count ??
                rawObj.participantsCount ??
                rawObj.participants_count ??
                0,
            );

            const tokensVal = tokenRewardNum.toLocaleString();
            const participantsVal = appliedCountNum.toLocaleString();

            return (
              <div
                key={c.id}
                className="bg-white border border-[#e8e6f0]/60 rounded-[24px] p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in-up text-left"
              >
                {/* Inset Cover Image Container */}
                <div className="relative w-full h-[190px] rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-brand-pink/20 to-[#7c3aed]/20 flex items-center justify-center">
                  {c.coverImageUrl ? (
                    <img
                      src={c.coverImageUrl}
                      alt={c.title}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#7a7a9a]">
                      <Megaphone size={24} className="text-brand-pink/70" />
                      <span className="text-[10px] font-bold">
                        Social Impact
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                  {/* Overlay Left Badge */}
                  <span className="absolute bottom-3 left-3 bg-black/45 backdrop-blur-[2px] text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                    <Clock size={11} className="text-white" />
                    <span>{daysLeftVal}</span>
                  </span>
                  {/* Overlay Right Badge */}
                  <span
                    className={cn(
                      "absolute bottom-3 right-3 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center font-bold",
                      c.status === "Live"
                        ? "bg-[#16a34a]"
                        : c.status === "Active"
                          ? "bg-[#2563eb]"
                          : "bg-[#16a34a]",
                    )}
                  >
                    {c.status === "Active" ? "In Progress" : c.status}
                  </span>
                </div>

                {/* Card Content Section */}
                <div className="flex flex-col gap-1.5 flex-1 px-1">
                  <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug">
                    {c.title}
                  </h4>
                  <span className="text-[10px] text-[#9a99b0] font-bold">
                    {categoryVal}
                  </span>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-pink">
                      <Ticket
                        size={14}
                        className="text-brand-pink rotate-[-10deg]"
                      />
                      <span>{tokensVal} Tokens</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#7a7a9a]">
                      <Users size={14} className="text-[#9a99b0]" />
                      <span>{participantsVal} applied</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/admin/campaigns/social/${c.id}`}
                    className="mt-3 w-full h-11 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl flex items-center justify-center transition-all cursor-pointer select-none"
                  >
                    {c.status === "Live"
                      ? "Review application"
                      : "View more details"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setDeleteTargetId(null)}
            />

            <div className="relative z-10 w-full max-w-[360px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fee2e2]">
                <AlertTriangle size={20} className="text-[#dc2626]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-[#1a1a2e]">
                  Delete Campaign?
                </h3>
                <p className="text-xs text-[#7a7a9a] leading-relaxed">
                  This social impact campaign will be permanently deleted.
                  Tokens already distributed will not be recalled.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="h-9.5 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteCampaignMutation.isPending}
                  onClick={handleDeleteConfirm}
                  className="h-9.5 rounded-xl bg-[#dc2626] text-white text-xs font-bold hover:bg-[#b91c1c] cursor-pointer disabled:opacity-50"
                >
                  {deleteCampaignMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
