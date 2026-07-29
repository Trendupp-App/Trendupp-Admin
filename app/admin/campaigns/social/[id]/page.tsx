"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Check,
  X,
  Ticket,
  Users,
  PauseCircle,
  Ban,
  Clock,
  XCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import {
  useAdminSocialImpactDetails,
  useAdminSocialImpactParticipants,
  useApproveParticipant,
  useRejectParticipant,
  usePauseSocialImpactCampaign,
  useCancelSocialImpactCampaign,
  useExtendSocialImpactDeadline,
  useCloseSocialImpactApplications,
} from "@/hooks/useAdminSocialImpact";
import SocialImpactActionModal, {
  type SocialActionType,
} from "@/components/admin/campaigns/SocialImpactActionModal";

interface PageParams {
  id: string;
}

export default function SocialImpactDetailsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<
    "Campaign Details" | "Participants" | "Analytics" | "Admin Action"
  >("Campaign Details");

  // Action modal state
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: SocialActionType;
    participantId?: string;
  }>({
    isOpen: false,
    type: "pause",
  });

  const { data: campaign, isLoading: isLoadingDetails } =
    useAdminSocialImpactDetails(id);
  const { data: participantsData, isLoading: isLoadingParticipants } =
    useAdminSocialImpactParticipants(id, { page: 1, limit: 50 });

  const approveMutation = useApproveParticipant();
  const rejectMutation = useRejectParticipant();
  const pauseMutation = usePauseSocialImpactCampaign();
  const cancelMutation = useCancelSocialImpactCampaign();
  const extendDeadlineMutation = useExtendSocialImpactDeadline();
  const closeApplicationsMutation = useCloseSocialImpactApplications();

  // Fallback mock campaign details if API returns empty during initial setup
  const campaignData = campaign || {
    id,
    title: "Summer Style Collection 2025",
    goal: "Create Content",
    brandId: "brand-1",
    brandName: "Zara Africa",
    creatorTiers: ["Micro", "Nano"],
    coverImageUrl: "/dashboard/img1.jpg",
    campaignBrief:
      "Zara Africa is launching a brand-new summer style collection across West Africa. Creators are invited to share their unique fashion styling video.",
    deliverables: [
      "1x Instagram Reel (30-60 seconds)",
      "1x TikTok Fashion Showcase Video",
    ],
    contentDirection: [
      "Film in warm, golden-hour lighting",
      "Highlight outfit transitions clearly",
    ],
    dos: [
      "Tag brand account @ZaraAfrica",
      "Use official hashtag #ZaraSummer25",
    ],
    donts: ["No competitor brands visible in frame"],
    status: "Live" as const,
    niche: "Lifestyle",
    tokensReward: 100,
    participantsCount: 47,
    deadline: "2026-08-15",
  };

  const participantsList = participantsData?.data || [
    {
      id: "p1",
      campaignId: id,
      creatorId: "c1",
      creatorName: "Emeka Obi",
      creatorHandle: "@emeka_obi",
      creatorAvatar: null,
      creatorTier: "Micro",
      status: "Pending" as const,
      submissionUrl: "https://instagram.com/reel/example1",
      submissionNotes: "Created summer outfit reel with golden hour light.",
      tokensEarned: 100,
      submittedAt: "2 hours ago",
    },
    {
      id: "p2",
      campaignId: id,
      creatorId: "c2",
      creatorName: "Amara Kalu",
      creatorHandle: "@amara_style",
      creatorAvatar: null,
      creatorTier: "Nano",
      status: "Approved" as const,
      submissionUrl: "https://tiktok.com/@amara_style/video/123",
      submissionNotes: "TikTok fashion showcase posted successfully.",
      tokensEarned: 100,
      submittedAt: "1 day ago",
    },
  ];

  const handleActionConfirm = async ({
    reason,
    newDeadline,
  }: {
    reason?: string;
    newDeadline?: string;
  }) => {
    const type = actionModal.type;

    if (type === "pause") {
      await pauseMutation.mutateAsync({
        id,
        payload: { reason: reason || "", newDeadline },
      });
    } else if (type === "cancel") {
      await cancelMutation.mutateAsync({
        id,
        payload: { reason: reason || "" },
      });
    } else if (type === "extend-deadline") {
      await extendDeadlineMutation.mutateAsync({
        id,
        payload: { newDeadline: newDeadline || "", reason },
      });
    } else if (type === "close-applications") {
      await closeApplicationsMutation.mutateAsync({
        id,
        payload: { reason: reason || "" },
      });
    } else if (type === "reject-participant" && actionModal.participantId) {
      await rejectMutation.mutateAsync({
        campaignId: id,
        participantId: actionModal.participantId,
        payload: { reason: reason || "" },
      });
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="p-8 text-center text-xs font-semibold text-[#7a7a9a]">
        Loading Social Impact campaign details...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 text-left animate-fade-in-up">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns/social"
            className="w-8 h-8 rounded-xl bg-white border border-[#e8e6f0] flex items-center justify-center text-[#5a5a7a] hover:text-[#1a1a2e] transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#1a1a2e]">
              {campaignData.title}
            </h1>
            <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
              Brand: {campaignData.brandName || "Trendupp"} &bull; Token-based
              Campaign
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActionModal({ isOpen: true, type: "pause" })}
            className="h-8.5 px-3 bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] hover:bg-[#ffedd5] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PauseCircle size={13} /> Pause
          </button>
          <button
            onClick={() =>
              setActionModal({ isOpen: true, type: "extend-deadline" })
            }
            className="h-8.5 px-3 bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] hover:bg-[#dbeafe] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Clock size={13} /> Extend Deadline
          </button>
          <button
            onClick={() =>
              setActionModal({ isOpen: true, type: "close-applications" })
            }
            className="h-8.5 px-3 bg-[#fff1f2] text-brand-pink border border-[#ffe4e6] hover:bg-[#ffe4e6] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <XCircle size={13} /> Close Applications
          </button>
          <button
            onClick={() => setActionModal({ isOpen: true, type: "cancel" })}
            className="h-8.5 px-3 bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2] hover:bg-[#fee2e2] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Ban size={13} /> Cancel
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-6 border-b border-[#e8e6f0]/60 w-full overflow-x-auto scrollbar-none">
        {(
          [
            "Campaign Details",
            "Participants",
            "Analytics",
            "Admin Action",
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none",
              activeTab === tab
                ? "border-brand-pink text-brand-pink"
                : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]",
            )}
          >
            <span>{tab}</span>
            {tab === "Participants" && (
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-brand-pink text-white">
                {participantsList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "Campaign Details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Cover Image & Basic Info */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="w-full h-56 rounded-2xl overflow-hidden relative">
                <img
                  src={campaignData.coverImageUrl || "/dashboard/img1.jpg"}
                  alt={campaignData.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 right-3 bg-[#16a34a] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {campaignData.status}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <h3 className="text-base font-bold text-[#1a1a2e]">
                  {campaignData.title}
                </h3>
                <p className="text-[#5a5a7a] leading-relaxed">
                  {campaignData.campaignBrief || "No brief specified."}
                </p>
              </div>
            </div>

            {/* Deliverables Card */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-sm text-xs">
              <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                Deliverables Required
              </h4>
              <div className="flex flex-col gap-2">
                {(campaignData.deliverables || []).map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[#5a5a7a]"
                  >
                    <span className="font-bold text-brand-pink">{i + 1}.</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Direction & Guidelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-sm text-xs">
                <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                  Content Direction
                </h4>
                <div className="flex flex-col gap-2 text-[#5a5a7a]">
                  {(campaignData.contentDirection || []).map((cd, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                      <span>{cd}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-sm text-xs">
                <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                  Do's & Don'ts
                </h4>
                <div className="flex flex-col gap-2 text-[#5a5a7a]">
                  {(campaignData.dos || []).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[#16a34a]"
                    >
                      <Check size={12} className="stroke-[3]" />
                      <span className="text-[#5a5a7a]">{d}</span>
                    </div>
                  ))}
                  {(campaignData.donts || []).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[#dc2626]"
                    >
                      <X size={12} className="stroke-[3]" />
                      <span className="text-[#5a5a7a]">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info Card (1 Col) */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-sm text-xs">
              <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                Campaign Summary
              </h4>

              <div className="flex flex-col gap-3.5 divide-y divide-[#e8e6f0]/40">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">Goal</span>
                  <span className="font-bold text-[#1a1a2e]">
                    {campaignData.goal}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Target Creator Tiers
                  </span>
                  <span className="font-bold text-[#1a1a2e]">
                    {(campaignData.creatorTiers || []).join(", ") || "All"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Token Reward
                  </span>
                  <span className="font-bold text-brand-pink flex items-center gap-1">
                    <Ticket size={14} />
                    {campaignData.tokensReward ?? 100} Tokens
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Applications
                  </span>
                  <span className="font-bold text-[#1a1a2e] flex items-center gap-1">
                    <Users size={14} className="text-[#9a99b0]" />
                    {campaignData.participantsCount ?? 0}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Deadline Date
                  </span>
                  <span className="font-bold text-[#1a1a2e] flex items-center gap-1">
                    <Calendar size={13} className="text-[#9a99b0]" />
                    {campaignData.deadline || "Open"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PARTICIPANTS TAB */}
      {activeTab === "Participants" && (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            Creator Submissions ({participantsList.length})
          </h3>

          {isLoadingParticipants ? (
            <div className="p-8 text-center text-xs font-semibold text-[#7a7a9a]">
              Loading participant submissions...
            </div>
          ) : participantsList.length === 0 ? (
            <div className="p-8 text-center text-xs font-semibold text-[#7a7a9a]">
              No participant submissions received yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#e8e6f0]/40 text-xs">
              {participantsList.map((p) => (
                <div
                  key={p.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <UserAvatar
                      initials={p.creatorName.slice(0, 2)}
                      size={40}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1a1a2e]">
                          {p.creatorName}
                        </span>
                        <span className="text-[10px] text-[#9a99b0]">
                          {p.creatorHandle}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#e0e7ff]">
                          {p.creatorTier || "Creator"}
                        </span>
                      </div>

                      {p.submissionNotes && (
                        <p className="text-[#5a5a7a] text-[11px]">
                          {p.submissionNotes}
                        </p>
                      )}

                      {p.submissionUrl && (
                        <a
                          href={p.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-pink font-semibold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          View submitted content <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize",
                        p.status === "Approved"
                          ? "bg-[#f0fdf4] text-[#16a34a] border-emerald-200"
                          : p.status === "Rejected"
                            ? "bg-[#fef2f2] text-[#dc2626] border-red-200"
                            : "bg-[#fffbeb] text-[#d97706] border-amber-200",
                      )}
                    >
                      {p.status}
                    </span>

                    {p.status === "Pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={approveMutation.isPending}
                          onClick={() =>
                            approveMutation.mutate({
                              campaignId: id,
                              participantId: p.id,
                            })
                          }
                          className="h-8 px-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button
                          onClick={() =>
                            setActionModal({
                              isOpen: true,
                              type: "reject-participant",
                              participantId: p.id,
                            })
                          }
                          className="h-8 px-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "Analytics" && (
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-2 shadow-sm">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Total Participants
              </span>
              <span className="text-xl font-bold text-[#1a1a2e]">
                {participantsList.length}
              </span>
            </div>
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-2 shadow-sm">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Approved Submissions
              </span>
              <span className="text-xl font-bold text-[#16a34a]">
                {participantsList.filter((p) => p.status === "Approved").length}
              </span>
            </div>
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-2 shadow-sm">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Pending Submissions
              </span>
              <span className="text-xl font-bold text-[#ea580c]">
                {participantsList.filter((p) => p.status === "Pending").length}
              </span>
            </div>
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-2 shadow-sm">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Tokens Allocated
              </span>
              <span className="text-xl font-bold text-brand-pink">
                {(campaignData.tokensReward ?? 100) * participantsList.length}{" "}
                Tokens
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ACTION TAB (Matching Image 1 Screenshot) */}
      {activeTab === "Admin Action" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Card 1: Pause Campaign */}
          <button
            onClick={() => setActionModal({ isOpen: true, type: "pause" })}
            className="bg-white border border-[#e8e6f0]/80 hover:border-brand-pink/50 rounded-[24px] p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PauseCircle size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-[#1a1a2e]">
                Pause Campaign
              </h4>
              <p className="text-xs text-[#7a7a9a] leading-relaxed">
                Temporarily pause new submissions or activity for this campaign.
              </p>
            </div>
          </button>

          {/* Card 2: Extend Deadline */}
          <button
            onClick={() =>
              setActionModal({ isOpen: true, type: "extend-deadline" })
            }
            className="bg-white border border-[#e8e6f0]/80 hover:border-brand-pink/50 rounded-[24px] p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-[#1a1a2e]">
                Extend Deadline
              </h4>
              <p className="text-xs text-[#7a7a9a] leading-relaxed">
                Set a new deadline date for creators to participate.
              </p>
            </div>
          </button>

          {/* Card 3: Close Applications */}
          <button
            onClick={() =>
              setActionModal({ isOpen: true, type: "close-applications" })
            }
            className="bg-white border border-[#e8e6f0]/80 hover:border-brand-pink/50 rounded-[24px] p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff1f2] text-brand-pink border border-[#ffe4e6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <XCircle size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-[#1a1a2e]">
                Close Applications
              </h4>
              <p className="text-xs text-[#7a7a9a] leading-relaxed">
                Stop accepting new creator applications for this campaign.
              </p>
            </div>
          </button>

          {/* Card 4: Cancel Campaign */}
          <button
            onClick={() => setActionModal({ isOpen: true, type: "cancel" })}
            className="bg-white border border-[#e8e6f0]/80 hover:border-brand-pink/50 rounded-[24px] p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Ban size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-[#1a1a2e]">
                Cancel Social Impact
              </h4>
              <p className="text-xs text-[#7a7a9a] leading-relaxed">
                Permanently cancel this social impact campaign and close active
                tasks.
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Action Modal Dialog */}
      <SocialImpactActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: "pause" })}
        actionType={actionModal.type}
        title={campaignData.title}
        onConfirm={handleActionConfirm}
        isLoading={
          pauseMutation.isPending ||
          cancelMutation.isPending ||
          extendDeadlineMutation.isPending ||
          closeApplicationsMutation.isPending ||
          rejectMutation.isPending
        }
      />
    </div>
  );
}
