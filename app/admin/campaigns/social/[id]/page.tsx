"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
  Star,
  ChevronDown,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";
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

  const [subTab, setSubTab] = useState<
    "All" | "No Submission" | "Pending Review" | "Approved" | "Rejected"
  >("All");

  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

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

  const campaignData = campaign;
  const rawParticipantsList = participantsData?.data || [];
  const liveParticipantsCount =
    participantsData?.total ??
    rawParticipantsList.length ??
    campaignData?.participantsCount ??
    0;

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
        payload: { reason: reason || "Paused by admin" },
      });
    } else if (type === "cancel") {
      await cancelMutation.mutateAsync({
        id,
        payload: { reason: reason || "" },
      });
    } else if (type === "extend-deadline") {
      await extendDeadlineMutation.mutateAsync({
        id,
        payload: {
          newDeadline: newDeadline || "",
          reason: reason || undefined,
        },
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

  const handleExport = () => {
    if (!campaignData) return;

    const headers = [
      "Participant Name",
      "Creator Handle",
      "Tier",
      "Status",
      "Submission Link",
      "Tokens Earned",
      "Campaign Title",
      "Brand",
      "Campaign Goal",
      "Campaign Status",
      "Deadline",
    ];

    const rows = rawParticipantsList.map((p) => [
      p.creatorName || "N/A",
      p.creatorHandle || "N/A",
      p.creatorTier || "N/A",
      p.status || "No Submission",
      p.submissionUrl || "None",
      p.tokensEarned ?? 0,
      campaignData.title,
      campaignData.brandName || "Trendupp",
      campaignData.goal || "Amplify Content",
      campaignData.status || "Live",
      campaignData.deadline || "N/A",
    ]);

    if (rows.length === 0) {
      rows.push([
        "No participants",
        "N/A",
        "N/A",
        "N/A",
        "N/A",
        0,
        campaignData.title,
        campaignData.brandName || "Trendupp",
        campaignData.goal || "Amplify Content",
        campaignData.status || "Live",
        campaignData.deadline || "N/A",
      ]);
    }

    const filename = `Social_Impact_${campaignData.title.replace(/\s+/g, "_")}`;
    downloadCsv(filename, headers, rows);
    toast.success("Campaign data exported successfully!");
  };

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-8 animate-pulse text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-1.5">
              <div className="w-48 h-5 bg-gray-200 rounded-md" />
              <div className="w-32 h-3 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-9 bg-gray-200 rounded-xl" />
            <div className="w-28 h-9 bg-gray-200 rounded-xl" />
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 pb-3">
          <div className="w-28 h-4 bg-gray-200 rounded" />
          <div className="w-28 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="w-full h-56 bg-gray-200 rounded-3xl" />
            <div className="w-full h-32 bg-gray-200 rounded-3xl" />
          </div>
          <div className="w-full h-80 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="p-8 text-center text-xs font-semibold text-[#7a7a9a]">
        Social Impact campaign not found.
      </div>
    );
  }

  const getStatusBadgeStyle = (status?: string) => {
    const s = (status || "Live").toLowerCase();
    if (s === "paused") {
      return {
        bg: "bg-[#fff7ed]",
        text: "text-[#ea580c]",
        border: "border-[#ffedd5]",
        dot: "bg-[#ea580c]",
      };
    }
    if (s === "cancelled") {
      return {
        bg: "bg-[#fef2f2]",
        text: "text-[#dc2626]",
        border: "border-[#fee2e2]",
        dot: "bg-[#dc2626]",
      };
    }
    if (s === "draft") {
      return {
        bg: "bg-[#f4f3f6]",
        text: "text-[#5a5a7a]",
        border: "border-[#e8e6f0]",
        dot: "bg-[#5a5a7a]",
      };
    }
    if (s === "completed") {
      return {
        bg: "bg-[#eff6ff]",
        text: "text-[#2563eb]",
        border: "border-[#dbeafe]",
        dot: "bg-[#2563eb]",
      };
    }
    return {
      bg: "bg-[#f0fdf4]",
      text: "text-[#16a34a]",
      border: "border-[#dcfce7]",
      dot: "bg-[#16a34a]",
    };
  };

  const statusStyle = getStatusBadgeStyle(campaignData.status);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 text-left animate-fade-in-up">
      {/* Header Bar (Matching Mockup Screenshot) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns/social"
            className="w-8 h-8 rounded-full bg-[#f4f3f6] hover:bg-[#e8e6f0] flex items-center justify-center text-[#5a5a7a] transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#1a1a2e]">
                {campaignData.title}
              </h1>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 uppercase tracking-wider",
                  statusStyle.bg,
                  statusStyle.text,
                  statusStyle.border,
                )}
              >
                <span
                  className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)}
                />
                {campaignData.status || "Live"}
              </span>
            </div>
            <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
              TRD-1001 &bull; {campaignData.brandName || "Trendupp"} &bull;
              Created {campaignData.createdAt || "Jun 1, 2026"}
            </span>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto relative">
          <button
            onClick={handleExport}
            className="h-9 px-3.5 border border-[#e8e6f0] bg-white hover:bg-[#faf9fc] text-xs font-bold text-[#5a5a7a] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download size={13} /> Export
          </button>

          <div className="relative">
            <button
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
              className="h-9 px-4 bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 select-none"
            >
              Admin Actions <ChevronDown size={13} />
            </button>

            {/* Dropdown Menu */}
            {showAdminDropdown && (
              <div className="absolute right-0 top-11 w-48 bg-white border border-[#e8e6f0] rounded-2xl shadow-lg p-1.5 flex flex-col gap-1 z-50 animate-fade-in-up text-xs font-bold">
                <button
                  onClick={() => {
                    setShowAdminDropdown(false);
                    setActionModal({ isOpen: true, type: "pause" });
                  }}
                  className="px-3 py-2 text-left rounded-xl hover:bg-[#fff7ed] text-[#ea580c] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <PauseCircle size={14} /> Pause Campaign
                </button>
                <button
                  onClick={() => {
                    setShowAdminDropdown(false);
                    setActionModal({ isOpen: true, type: "extend-deadline" });
                  }}
                  className="px-3 py-2 text-left rounded-xl hover:bg-[#eff6ff] text-[#2563eb] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Clock size={14} /> Extend Deadline
                </button>
                <button
                  onClick={() => {
                    setShowAdminDropdown(false);
                    setActionModal({
                      isOpen: true,
                      type: "close-applications",
                    });
                  }}
                  className="px-3 py-2 text-left rounded-xl hover:bg-[#fff1f2] text-brand-pink transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <XCircle size={14} /> Close Applications
                </button>
                <button
                  onClick={() => {
                    setShowAdminDropdown(false);
                    setActionModal({ isOpen: true, type: "cancel" });
                  }}
                  className="px-3 py-2 text-left rounded-xl hover:bg-[#fef2f2] text-[#dc2626] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Ban size={14} /> Cancel Campaign
                </button>
              </div>
            )}
          </div>
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
            <span>
              {tab === "Participants"
                ? `Participants (${rawParticipantsList.length})`
                : tab}
            </span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Campaign Details */}
      {activeTab === "Campaign Details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Cover Image & Basic Info */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
              {campaignData?.coverImageUrl && (
                <div className="w-full h-56 rounded-2xl overflow-hidden relative bg-[#f4f3f6]">
                  <img
                    src={campaignData.coverImageUrl}
                    alt={campaignData.title || "Cover"}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 right-3 bg-[#16a34a] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {campaignData.status || "Live"}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-2 text-xs">
                <h3 className="text-base font-bold text-[#1a1a2e]">
                  {campaignData?.title}
                </h3>
                <p className="text-[#5a5a7a] leading-relaxed">
                  {campaignData?.campaignBrief || "No brief specified."}
                </p>
              </div>
            </div>

            {/* Deliverables Card */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-sm text-xs">
              <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                Deliverables Required
              </h4>
              <div className="flex flex-col gap-2">
                {(campaignData?.deliverables || []).map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[#5a5a7a]"
                  >
                    <span className="font-bold text-brand-pink">{i + 1}.</span>
                    <span>{d}</span>
                  </div>
                ))}
                {(!campaignData?.deliverables ||
                  campaignData.deliverables.length === 0) && (
                  <span className="text-[#9a99b0]">
                    No deliverables specified.
                  </span>
                )}
              </div>
            </div>

            {/* Content Direction & Guidelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-sm text-xs">
                <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                  Content Direction
                </h4>
                <div className="flex flex-col gap-2 text-[#5a5a7a]">
                  {(campaignData?.contentDirection || []).map((cd, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                      <span>{cd}</span>
                    </div>
                  ))}
                  {(!campaignData?.contentDirection ||
                    campaignData.contentDirection.length === 0) && (
                    <span className="text-[#9a99b0]">
                      No direction guidelines specified.
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-sm text-xs">
                <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                  Do's & Don'ts
                </h4>
                <div className="flex flex-col gap-2 text-[#5a5a7a]">
                  {(campaignData?.dos || []).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[#16a34a]"
                    >
                      <Check size={12} className="stroke-[3]" />
                      <span className="text-[#5a5a7a]">{d}</span>
                    </div>
                  ))}
                  {(campaignData?.donts || []).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[#dc2626]"
                    >
                      <X size={12} className="stroke-[3]" />
                      <span className="text-[#5a5a7a]">{d}</span>
                    </div>
                  ))}
                  {(!campaignData?.dos || campaignData.dos.length === 0) &&
                    (!campaignData?.donts ||
                      campaignData.donts.length === 0) && (
                      <span className="text-[#9a99b0]">
                        No guidelines specified.
                      </span>
                    )}
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
                    {campaignData?.goal || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Target Creator Tiers
                  </span>
                  <span className="font-bold text-[#1a1a2e]">
                    {(campaignData?.creatorTiers || []).join(", ") || "All"}
                  </span>
                </div>

                {String(campaignData?.status || "").toLowerCase() ===
                  "completed" && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#7a7a9a] font-semibold">
                      Token Reward
                    </span>
                    <span className="font-bold text-brand-pink flex items-center gap-1">
                      <Ticket size={14} />
                      {campaignData?.tokensReward ?? 100} Tokens
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Applications
                  </span>
                  <span className="font-bold text-[#1a1a2e] flex items-center gap-1">
                    <Users size={14} className="text-[#9a99b0]" />
                    {liveParticipantsCount}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#7a7a9a] font-semibold">
                    Deadline Date
                  </span>
                  <span className="font-bold text-[#1a1a2e] flex items-center gap-1">
                    <Clock size={13} className="text-[#9a99b0]" />
                    {campaignData?.deadline || "Open"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Participants */}
      {activeTab === "Participants" && (
        <div className="flex flex-col gap-5 text-left">
          {/* Sub-Tab Filter Pills (Mockup Image 2) */}
          <div className="flex items-center gap-2 bg-[#f4f3f6] p-1.5 rounded-2xl w-fit">
            {(
              [
                "All",
                "No Submission",
                "Pending Review",
                "Approved",
                "Rejected",
              ] as const
            ).map((st) => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none",
                  subTab === st
                    ? "bg-brand-pink text-white shadow-xs"
                    : "text-[#5a5a7a] hover:text-[#1a1a2e]",
                )}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-semibold text-[#9a99b0]">
            {rawParticipantsList.length} total applications &bull; Admin view
            only
          </span>

          {/* Participant Cards List */}
          {isLoadingParticipants ? (
            <div className="p-8 text-center text-xs font-semibold text-[#7a7a9a]">
              Loading participant submissions...
            </div>
          ) : rawParticipantsList.length === 0 ? (
            <div className="p-8 text-center text-xs font-semibold text-[#7a7a9a] bg-white rounded-3xl border border-[#e8e6f0]/60">
              No participant submissions received yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xs">
              {rawParticipantsList
                .filter((p) => {
                  if (subTab === "No Submission")
                    return !p.submissionUrl || p.status === "No Submission";
                  if (subTab === "Pending Review")
                    return p.status === "Pending";
                  if (subTab === "Approved") return p.status === "Approved";
                  if (subTab === "Rejected") return p.status === "Rejected";
                  return true;
                })
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#e8e6f0] rounded-3xl p-5 flex flex-col gap-4 shadow-xs"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <UserAvatar
                          initials={(p.creatorName || "Creator").slice(0, 2)}
                          size={42}
                        />
                        <div className="flex flex-col text-left gap-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1a1a2e] text-sm">
                              {p.creatorName || "Creator"}
                            </span>
                            <span className="text-xs text-[#7a7a9a] font-medium">
                              {p.creatorHandle || "@creator"}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#1a1a2e]">
                              <Star
                                size={11}
                                className="fill-[#f59e0b] text-[#f59e0b]"
                              />{" "}
                              4.9
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed]">
                              {p.creatorTier || "Micro"}
                            </span>
                            <span className="text-[11px] text-[#7a7a9a] font-medium">
                              180K followers
                            </span>
                            <span className="text-[11px] text-[#7a7a9a] font-medium">
                              5.2% engagement
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fff0f5] text-brand-pink border border-[#fbcfe8] flex items-center gap-1">
                              <Ticket size={11} /> 100 Tokens
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status / Action Button */}
                      <div className="shrink-0 self-end sm:self-auto">
                        {!p.submissionUrl || p.status === "No Submission" ? (
                          <span className="px-4 py-1.5 rounded-xl text-xs font-bold border border-[#e8e6f0] text-[#7a7a9a] bg-[#faf9fc]">
                            No Submission
                          </span>
                        ) : p.status === "Approved" ? (
                          <span className="px-4 py-1.5 rounded-xl text-xs font-bold border border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4] flex items-center gap-1.5">
                            <CheckCircle2 size={13} /> Accepted
                          </span>
                        ) : p.status === "Rejected" ? (
                          <span className="px-4 py-1.5 rounded-xl text-xs font-bold border border-[#fecdd3] text-[#e11d48] bg-[#fff1f2] flex items-center gap-1.5">
                            <XCircle size={13} /> Rejected
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={approveMutation.isPending}
                              onClick={() =>
                                approveMutation.mutate({
                                  campaignId: id,
                                  participantId: p.id,
                                })
                              }
                              className="h-8.5 px-4 bg-white border border-[#bbf7d0] text-[#16a34a] hover:bg-[#f0fdf4] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Check size={13} /> Accept
                            </button>
                            <button
                              onClick={() =>
                                setActionModal({
                                  isOpen: true,
                                  type: "reject-participant",
                                  participantId: p.id,
                                })
                              }
                              className="h-8.5 px-4 bg-white border border-[#fecdd3] text-[#e11d48] hover:bg-[#fff1f2] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <X size={13} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submitted Content Link Card (Mockup Image 2) */}
                    {p.submissionUrl && (
                      <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-1.5 bg-[#faf9fc]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a99b0]">
                          CONTENT LINK
                        </span>
                        <a
                          href={p.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#1a1a2e] hover:text-brand-pink flex items-center gap-1.5 break-all"
                        >
                          {p.submissionUrl}{" "}
                          <ExternalLink
                            size={13}
                            className="shrink-0 text-[#9a99b0]"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Analytics */}
      {activeTab === "Analytics" && (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 text-center text-xs font-semibold text-[#7a7a9a] shadow-xs">
          Analytics dashboard view for this Social Impact campaign.
        </div>
      )}

      {/* TAB CONTENT: Admin Action Cards Grid (Mockup Image 3) */}
      {activeTab === "Admin Action" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Pause Campaign Card */}
          <div
            onClick={() => setActionModal({ isOpen: true, type: "pause" })}
            className="bg-white border border-[#fef08a] hover:border-[#fde047] rounded-3xl p-6 flex items-center gap-4 transition-all cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fefce8] text-[#ca8a04] flex items-center justify-center shrink-0 border border-[#fef9c3]">
              <PauseCircle size={20} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-[#1a1a2e] group-hover:text-[#ca8a04] transition-colors">
                Pause Campaign
              </h4>
            </div>
          </div>

          {/* Extend Deadline Card */}
          <div
            onClick={() =>
              setActionModal({ isOpen: true, type: "extend-deadline" })
            }
            className="bg-white border border-[#fbcfe8] hover:border-[#f472b6] rounded-3xl p-6 flex items-center gap-4 transition-all cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff0f5] text-brand-pink flex items-center justify-center shrink-0 border border-[#fce7f3]">
              <Clock size={20} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                Extend Deadline
              </h4>
            </div>
          </div>

          {/* Close Participations Card */}
          <div
            onClick={() =>
              setActionModal({ isOpen: true, type: "close-applications" })
            }
            className="bg-white border border-[#e8e6f0] hover:border-[#cbd5e1] rounded-3xl p-6 flex items-center gap-4 transition-all cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] text-[#64748b] flex items-center justify-center shrink-0 border border-[#f1f5f9]">
              <XCircle size={20} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-[#1a1a2e] group-hover:text-[#64748b] transition-colors">
                Close Participations
              </h4>
            </div>
          </div>
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
