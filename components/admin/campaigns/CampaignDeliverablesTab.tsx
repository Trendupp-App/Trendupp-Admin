"use client";

import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Info,
  ArrowRight,
  Check,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import {
  useSubmissions,
  useVetDraft,
  useApproveLivePost,
} from "@/hooks/useCampaign";
import type { CampaignSubmission } from "@/types/submissions";
import type { CreatorDrawerData } from "./CampaignCreatorDrawer";
import AdminActionModal from "./AdminActionModal";

interface CampaignDeliverablesTabProps {
  onViewDetails: (c: CreatorDrawerData) => void;
  isSocial?: boolean;
  campaignId?: string;
  deliverableStatus?: "Awaiting" | "Approved";
  onApprove?: () => void;
  onRequestRevision?: () => void;
}

type FilterOption = "all" | "pending" | "revision" | "approved";

const FILTER_STATUS_MAP: Record<Exclude<FilterOption, "all">, string[]> = {
  pending: ["pending_approval"],
  revision: ["revision_requested", "revision-sent"],
  approved: ["approved", "livelink_available", "done", "live"],
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending_approval: {
    label: "Pending review",
    className: "bg-[#f3f4f6] text-[#5a5a7a] border-[#e5e7eb]",
  },
  revision_requested: {
    label: "Revision requested",
    className: "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
  },
  "revision-sent": {
    label: "Revised — awaiting review",
    className: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
  },
  approved: {
    label: "Approved",
    className: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
  },
  livelink_available: {
    label: "Live link submitted",
    className: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
  },
  done: {
    label: "Approved",
    className: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
  },
  live: {
    label: "Live",
    className: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
  },
};

const getStatusBadge = (status: string) =>
  STATUS_BADGE[status] ?? {
    label: status,
    className: "bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]",
  };

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Submitted just now";
  if (diffMins < 60)
    return `Submitted ${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `Submitted ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30)
    return `Submitted ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return `Submitted on ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const getContentLink = (sub: CampaignSubmission) => {
  if (sub.liveLink) {
    const urls = Object.values(sub.liveLink)
      .map((entry) => (typeof entry === "string" ? entry : entry?.url))
      .filter((url): url is string => Boolean(url));
    if (urls.length) return urls[0];
  }
  return sub.draftLink ?? "";
};

export default function CampaignDeliverablesTab({
  onViewDetails,
  isSocial = false,
  campaignId,
  deliverableStatus = "Awaiting",
  onApprove = () => {},
  onRequestRevision = () => {},
}: CampaignDeliverablesTabProps) {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [revisionTargetId, setRevisionTargetId] = useState<string | null>(null);

  const { data: submissions, isLoading } = useSubmissions(
    !isSocial && campaignId ? campaignId : null,
  );
  const vetDraft = useVetDraft(campaignId ?? "");
  const approveLivePost = useApproveLivePost(campaignId ?? "");

  const allSubmissions = submissions ?? [];
  const filteredSubmissions =
    filter === "all"
      ? allSubmissions
      : allSubmissions.filter((s) =>
          FILTER_STATUS_MAP[filter].includes(s.status),
        );

  const handleConfirmRevision = (reason: string) => {
    if (!revisionTargetId) return;
    vetDraft.mutate({
      submissionId: revisionTargetId,
      decision: "request_revision",
      brandFeedback: reason,
    });
    setRevisionTargetId(null);
  };

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
          onChange={(e) => setFilter(e.target.value as FilterOption)}
          className="h-8 pl-3.5 pr-8 rounded-lg bg-[#f4f3f6] text-[10px] font-bold text-[#5a5a7a] appearance-none cursor-pointer border border-[#e8e6f0]/60 focus:outline-none"
        >
          <option value="all">All Submissions</option>
          <option value="pending">Pending Review</option>
          <option value="revision">Revision</option>
          <option value="approved">Approved</option>
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a7a9a] pointer-events-none"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col gap-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e8e6f0]/60 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-24 h-3 bg-[#e8e6f0]/60 rounded-md" />
                  <div className="w-32 h-2.5 bg-[#e8e6f0]/40 rounded-md" />
                </div>
              </div>
              <div className="w-full h-16 bg-[#e8e6f0]/30 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : allSubmissions.length === 0 ? (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl py-10 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-xs font-bold text-[#1a1a2e]">No submissions yet</p>
          <p className="text-[11px] text-[#9a99b0]">
            Creators haven&apos;t submitted any content for this campaign.
          </p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl py-10 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-xs font-bold text-[#1a1a2e]">
            No submissions in this status
          </p>
          <p className="text-[11px] text-[#9a99b0]">
            Try selecting a different filter above.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredSubmissions.map((sub) => {
            const badge = getStatusBadge(sub.status);
            const link = getContentLink(sub);
            const isActionable = ["pending_approval", "revision-sent"].includes(
              sub.status,
            );
            const isLiveLinkPending = sub.status === "livelink_available";

            return (
              <div
                key={sub.id}
                className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col gap-4 text-left"
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      initials={getInitials(
                        sub.creator.firstName,
                        sub.creator.lastName,
                      )}
                      size={36}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a2e]">
                        {sub.creator.firstName} {sub.creator.lastName}
                      </span>
                      <span className="text-[10px] text-[#9a99b0] font-medium">
                        {formatRelativeTime(sub.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0",
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Content Link
                  </span>
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 w-fit"
                    >
                      {link} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-xs text-[#9a99b0]">
                      No link submitted yet.
                    </span>
                  )}
                  {sub.application?.contentIdea && (
                    <p className="text-xs text-[#5a5a7a] font-medium italic mt-0.5">
                      &ldquo;{sub.application.contentIdea}&rdquo;
                    </p>
                  )}

                  {sub.brandFeedback && (
                    <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-xl p-3.5 flex items-start gap-2.5 mt-2 text-xs leading-relaxed text-[#92400e] font-medium">
                      <Info
                        size={14}
                        className="shrink-0 mt-0.5 text-[#f59e0b]"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                          Revision Request
                        </span>
                        <span>{sub.brandFeedback}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  {isActionable && (
                    <>
                      <button
                        onClick={() =>
                          vetDraft.mutate({
                            submissionId: sub.id,
                            decision: "approved",
                          })
                        }
                        disabled={vetDraft.isPending}
                        className="h-9 px-4 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={14} /> Approve content
                      </button>
                      <button
                        onClick={() => setRevisionTargetId(sub.id)}
                        disabled={vetDraft.isPending}
                        className="h-9 px-4 bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#ffedd5]/60 text-xs font-bold text-[#ea580c] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Request revision
                      </button>
                    </>
                  )}
                  {isLiveLinkPending && (
                    <button
                      onClick={() => approveLivePost.mutate(sub.id)}
                      disabled={approveLivePost.isPending}
                      className="h-9 px-4 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7]/60 text-xs font-bold text-[#16a34a] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={14} /> Approve live link
                    </button>
                  )}
                  <button
                    onClick={() =>
                      onViewDetails({
                        id: sub.creator.id,
                        name: `${sub.creator.firstName} ${sub.creator.lastName}`,
                        handle: sub.creator.username
                          ? `@${sub.creator.username}`
                          : "—",
                        rating: "—",
                        location: "—",
                        role: "Creator",
                        initials: getInitials(
                          sub.creator.firstName,
                          sub.creator.lastName,
                        ),
                        pitch: sub.application?.contentIdea ?? "",
                        contentIdea: sub.application?.contentIdea ?? "",
                        platforms: "—",
                        questionComment: sub.application?.comments ?? "—",
                      })
                    }
                    className="h-9 px-4 text-xs font-bold text-[#5a5a7a] bg-[#f4f3f6] hover:bg-[#e8e6f0] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    View details <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminActionModal
        action={revisionTargetId ? "Request Revision" : null}
        onClose={() => setRevisionTargetId(null)}
        onConfirm={handleConfirmRevision}
      />
    </div>
  );
}
