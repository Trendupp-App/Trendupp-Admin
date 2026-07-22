"use client";

import { useState, useEffect } from "react";
import {
  X,
  ArrowLeft,
  Users,
  TrendingUp,
  CheckCircle,
  Wallet,
  Award,
  Star,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  Ban,
  ShieldOff,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { FaTiktok, FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { AdminStatusBadge } from "../AdminStatusBadge";
import CreatorActionModal from "./CreatorActionModal";
import NoteModal from "./NoteModal";
import SuccessModal from "./SuccessModal";
import { Portal } from "@/components/ui/portal";

interface CreatorProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string | null;
}

type TabType = "Overview" | "Campaign History" | "Review" | "Note" | "Action";

/* ── mock data ─────────────────────────────────────── */
const CAMPAIGNS = [
  {
    name: "Summer Glow",
    brand: "GlowBrand",
    status: "Completed",
    fee: "₦150K",
    date: "Jan 20, 2026",
  },
  {
    name: "Summer Glow",
    brand: "GlowBrand",
    status: "Completed",
    fee: "₦150K",
    date: "Jan 20, 2026",
  },
  {
    name: "Summer Glow",
    brand: "GlowBrand",
    status: "Active",
    fee: "₦150K",
    date: "Jan 20, 2026",
  },
  {
    name: "Summer Glow",
    brand: "GlowBrand",
    status: "Applied",
    fee: "₦150K",
    date: "Jan 20, 2026",
  },
];

const REVIEWS = [
  {
    brand: "GlowBrand",
    date: "Feb 15, 2026",
    rating: 5,
    text: "Exceptional content quality and professional communication.",
  },
  {
    brand: "FashionNG",
    date: "Mar 1, 2026",
    rating: 5,
    text: "Delivered beyond expectations. Will work again.",
  },
  {
    brand: "StyleHouse",
    date: "Mar 20, 2026",
    rating: 4,
    text: "Great creator, very responsive and creative.",
  },
];

const ACTIONS = [
  {
    label: "Suspend Account",
    actionType: "suspend" as const,
    desc: "Temporarily restrict creator access to the platform.",
    icon: Ban,
    color: "text-[#ea580c]",
    border: "border-[#fde68a]",
    bg: "bg-[#fffbeb]",
    iconBg: "bg-[#fff7ed]",
  },
  {
    label: "Suspend Campaign Access",
    actionType: "suspendCampaign" as const,
    desc: "Restrict creator from accessing or participating in any campaigns.",
    icon: ShieldOff,
    color: "text-[#ea580c]",
    border: "border-[#fde68a]",
    bg: "bg-[#fffbeb]",
    iconBg: "bg-[#fff7ed]",
  },
  {
    label: "Reactivate Account",
    actionType: "reactivate" as const,
    desc: "Restore creator access, if currently suspended.",
    icon: ShieldCheck,
    color: "text-[#16a34a]",
    border: "border-[#e8e6f0]",
    bg: "bg-white",
    iconBg: "bg-[#f0fdf4]",
  },
  {
    label: "Delete Account",
    actionType: "delete" as const,
    desc: "Permanently remove creator account. This cannot be undone.",
    icon: Trash2,
    color: "text-[#dc2626]",
    border: "border-[#fecaca]",
    bg: "bg-[#fef2f2]",
    iconBg: "bg-[#fee2e2]",
    destructive: true,
  },
  {
    label: "Change Creator Tier",
    actionType: "changeTier" as const,
    desc: "Manually update the creator's tier classification.",
    icon: Layers,
    color: "text-[#2f63eb]",
    border: "border-[#e8e6f0]",
    bg: "bg-white",
    iconBg: "bg-[#edf2fe]",
  },
];

/* ── helpers ────────────────────────────────────────── */
function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-[#f0fdf4] text-[#16a34a]",
    Active: "bg-[#eff6ff] text-[#2563eb]",
    Applied: "bg-[#fdf4ff] text-[#9333ea]",
    Pending: "bg-[#fff7ed] text-[#ea580c]",
  };
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-md text-[10px] font-bold",
        map[status] ?? "bg-[#f4f3f6] text-[#7a7a9a]",
      )}
    >
      {status}
    </span>
  );
}

function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#e5e7eb]"
          }
        />
      ))}
    </div>
  );
}

import {
  useCreatorDetails,
  useCreatorCampaignHistory,
  useCreatorReviews,
  useCreatorNotes,
  useAddCreatorNote,
  useUpdateCreatorNote,
  useDeleteCreatorNote,
} from "@/hooks/useAdminCreators";

/* ── main component ─────────────────────────────────── */
export default function CreatorProfileDrawer({
  isOpen,
  onClose,
  creatorId,
}: CreatorProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [activeAction, setActiveAction] = useState<
    | "suspend"
    | "suspendCampaign"
    | "reactivate"
    | "delete"
    | "changeTier"
    | null
  >(null);

  /* Note Modal states */
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteModalTitle, setNoteModalTitle] = useState("Add note");
  const [noteInitialValue, setNoteInitialValue] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  /* Success Modal states */
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalTitle, setSuccessModalTitle] = useState("");
  const [successModalMessage, setSuccessModalMessage] = useState("");

  /* API Hooks */
  const { data: creatorDetail } = useCreatorDetails(creatorId, isOpen);
  const { data: campaignHistoryData } = useCreatorCampaignHistory(
    creatorId,
    1,
    10,
    isOpen,
  );
  const { data: reviewsData } = useCreatorReviews(creatorId, isOpen);
  const { data: notesData = [] } = useCreatorNotes(creatorId, isOpen);

  const addNoteMutation = useAddCreatorNote();
  const updateNoteMutation = useUpdateCreatorNote();
  const deleteNoteMutation = useDeleteCreatorNote();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !creatorId) return null;

  const displayReviews = reviewsData?.length
    ? reviewsData.map((r) => ({
        brand: r.brandName,
        date: new Date(r.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rating: r.rating,
        text: r.comment,
      }))
    : REVIEWS;

  const displayCampaigns = campaignHistoryData?.data?.length
    ? campaignHistoryData.data.map((c) => ({
        name: c.title,
        brand: c.brandName,
        status: c.status,
        fee: `₦${(c.payout / 1000).toFixed(0)}K`,
        date: new Date(c.submittedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }))
    : CAMPAIGNS;

  const avgRating = (
    displayReviews.reduce((s, r) => s + r.rating, 0) /
    (displayReviews.length || 1)
  ).toFixed(1);

  const metrics = [
    {
      label: "Followers",
      value: creatorDetail?.tier ? `${creatorDetail.tier} Tier` : "450K",
      icon: Users,
      bg: "bg-[#fdf2f6] text-[#d7176f]",
    },
    {
      label: "Engagement",
      value: "4.2%",
      icon: TrendingUp,
      bg: "bg-[#edf2fe] text-[#2f63eb]",
    },
    {
      label: "Campaigns",
      value: creatorDetail?.stats?.completedCampaigns
        ? String(creatorDetail.stats.completedCampaigns)
        : "18",
      icon: CheckCircle,
      bg: "bg-[#f0fdf4] text-[#16a34a]",
    },
    {
      label: "Earnings",
      value: creatorDetail?.stats?.totalEarnings
        ? `₦${(creatorDetail.stats.totalEarnings / 1000000).toFixed(1)}M`
        : "₦2.4M",
      icon: Wallet,
      bg: "bg-[#fff7ed] text-[#ea580c]",
    },
    {
      label: "Tokens",
      value: "1200",
      icon: Award,
      bg: "bg-[#f5f3ff] text-[#7c3aed]",
    },
  ];

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="w-full max-w-[620px] h-full bg-white relative z-10 flex flex-col shadow-2xl overflow-y-auto">
          {/* ── Top bar ─────── */}
          <div className="flex items-center justify-between border-b border-[#e8e6f0]/60 px-6 py-4 shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-semibold text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <span className="text-sm font-bold text-[#1a1a2e]">
              Creator Profile
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Creator Summary ─────── */}
          <div className="flex flex-col items-center justify-center py-7 border-b border-[#e8e6f0]/40 shrink-0">
            <UserAvatar initials="AO" size={72} />
            <h3 className="text-base font-bold text-[#1a1a2e] mt-3">
              Alex Okafor
            </h3>
            <span className="text-xs text-[#9a99b0]">@alexokafor</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#e0e7ff]">
                Micro
              </span>
              <AdminStatusBadge status="pending" />
            </div>
          </div>

          {/* ── Tabs ─────── */}
          <div className="flex border-b border-[#e8e6f0]/40 px-6 overflow-x-auto shrink-0 scrollbar-none">
            {(
              [
                "Overview",
                "Campaign History",
                "Review",
                "Note",
                "Action",
              ] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  activeTab === tab
                    ? "border-brand-pink text-brand-pink"
                    : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab Content ─────── */}
          <div className="flex-1 flex flex-col gap-5 p-6">
            {/* OVERVIEW */}
            {activeTab === "Overview" && (
              <>
                <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                    Profile Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                    {[
                      { label: "Full name", value: "Alex Okafor" },
                      { label: "Email", value: "alex@email.com" },
                      { label: "Country of residence", value: "Nigeria" },
                      { label: "State", value: "Lagos" },
                      { label: "Nationality", value: "Nigeria" },
                      {
                        label: "Bio",
                        value:
                          "Fashion content creator passionate about African aesthetics and modern style.",
                        span: true,
                      },
                      { label: "Profile Completion", value: "100%" },
                      {
                        label: "Bank Account",
                        value: "Verified",
                        color: "text-[#16a34a] font-bold",
                      },
                      { label: "Date Joined", value: "Jan 15, 2026" },
                      { label: "Account Status", badge: true },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex flex-col gap-1",
                          f.span && "sm:col-span-2",
                        )}
                      >
                        <span className="text-[#9a99b0] text-[10px] font-semibold uppercase">
                          {f.label}
                        </span>
                        {f.badge ? (
                          <div className="w-fit">
                            <AdminStatusBadge status="active" />
                          </div>
                        ) : (
                          <span
                            className={cn(
                              "text-[#1a1a2e] font-medium leading-relaxed",
                              f.color,
                            )}
                          >
                            {f.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                    Metrics
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {metrics.map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={i}
                          className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-3.5 flex flex-col items-center text-center gap-1"
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              m.bg,
                            )}
                          >
                            <Icon size={14} />
                          </div>
                          <span className="text-sm font-bold text-[#1a1a2e] mt-1">
                            {m.value}
                          </span>
                          <span className="text-[9px] text-[#9a99b0] font-medium uppercase tracking-wider">
                            {m.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                    Social Accounts
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-[#fdf2f6] text-[#d7176f] flex items-center justify-center shrink-0">
                        <FaInstagram size={14} />
                      </div>
                      <div className="flex flex-col flex-1 text-xs">
                        <span className="font-bold text-[#1a1a2e]">
                          @alexokafor
                        </span>
                        <span className="text-[10px] text-[#9a99b0] font-medium">
                          28.6K · Last synced: Today
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-[#f4f3f6] text-[#7a7a9a] flex items-center justify-center shrink-0">
                        <FaTiktok size={13} />
                      </div>
                      <div className="flex flex-col flex-1 text-xs">
                        <span className="font-bold text-[#9a99b0]">TikTok</span>
                        <span className="text-[10px] text-[#dc2626] font-semibold">
                          Not connected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CAMPAIGN HISTORY */}
            {activeTab === "Campaign History" && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[#1a1a2e]">
                  Campaign History
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[#e8e6f0]/60">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e8e6f0]/60 bg-[#faf9fc]">
                        {[
                          "Campaign Name",
                          "Brand",
                          "Status",
                          "Proposed Fee",
                          "Date Applied",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayCampaigns.map((c, i) => (
                        <tr
                          key={i}
                          className="border-b border-[#e8e6f0]/40 last:border-0 hover:bg-[#faf9fc] transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-[#1a1a2e]">
                            {c.name}
                          </td>
                          <td className="px-4 py-3 text-[#5a5a7a]">
                            {c.brand}
                          </td>
                          <td className="px-4 py-3">
                            <StatusChip status={c.status} />
                          </td>
                          <td className="px-4 py-3 text-[#5a5a7a]">{c.fee}</td>
                          <td className="px-4 py-3 text-[#9a99b0] whitespace-nowrap">
                            {c.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REVIEW */}
            {activeTab === "Review" && (
              <div className="flex flex-col gap-5">
                {/* Average rating card */}
                <div className="flex items-center gap-4 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-5">
                  <span className="text-4xl font-black text-[#1a1a2e]">
                    {avgRating}
                  </span>
                  <div className="flex flex-col gap-1">
                    <Stars rating={Math.round(Number(avgRating))} />
                    <span className="text-[11px] text-[#9a99b0] font-medium">
                      {displayReviews.length} reviews
                    </span>
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="flex flex-col gap-3">
                  {displayReviews.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1a1a2e]">
                          {r.brand}
                        </span>
                        <span className="text-[10px] text-[#9a99b0]">
                          {r.date}
                        </span>
                      </div>
                      <Stars rating={r.rating} />
                      <p className="text-xs text-[#5a5a7a] leading-relaxed">
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTE */}
            {activeTab === "Note" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a2e]">
                      Internal Notes
                    </h4>
                    <p className="text-[11px] text-[#9a99b0] mt-0.5">
                      Not visible to creator
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setNoteModalTitle("Add note");
                      setNoteInitialValue("");
                      setIsNoteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-brand-pink text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Plus size={13} /> Add Note
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {notesData.length === 0 ? (
                    <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-6 text-center text-xs text-[#9a99b0] font-medium">
                      No internal notes recorded yet for this creator.
                    </div>
                  ) : (
                    notesData.map((n) => (
                      <div
                        key={n.id}
                        className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#1a1a2e]">
                              {n.createdBy?.name || "Admin"}
                            </span>
                            <span className="text-[10px] text-[#9a99b0] ml-2">
                              {new Date(n.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingNoteId(n.id);
                                setNoteModalTitle("Edit note");
                                setNoteInitialValue(n.note);
                                setIsNoteModalOpen(true);
                              }}
                              className="p-1 rounded-lg hover:bg-[#f4f3f6] text-[#9a99b0] hover:text-[#5a5a7a] transition-colors cursor-pointer"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() =>
                                deleteNoteMutation.mutate({
                                  id: creatorId,
                                  noteId: n.id,
                                })
                              }
                              className="p-1 rounded-lg hover:bg-[#fef2f2] text-[#9a99b0] hover:text-[#dc2626] transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#5a5a7a] leading-relaxed">
                          {n.note}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ACTION */}
            {activeTab === "Action" && (
              <div className="flex flex-col gap-4">
                {/* Warning banner */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs font-semibold">
                  <AlertTriangle
                    size={14}
                    className="shrink-0 text-[#f59e0b]"
                  />
                  Actions require confirmation and are recorded in the audit
                  log.
                </div>

                {/* Action rows */}
                <div className="flex flex-col gap-3">
                  {ACTIONS.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveAction(a.actionType)}
                        className={cn(
                          "flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl border transition-all hover:brightness-95 cursor-pointer",
                          a.bg,
                          a.border,
                        )}
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                            a.iconBg,
                            a.color,
                          )}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={cn(
                              "text-sm font-bold",
                              a.destructive
                                ? "text-[#dc2626]"
                                : "text-[#1a1a2e]",
                            )}
                          >
                            {a.label}
                          </span>
                          <span className="text-[11px] text-[#9a99b0] leading-relaxed">
                            {a.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action confirmation Modal */}
        <CreatorActionModal
          action={activeAction}
          onClose={() => setActiveAction(null)}
          onConfirm={() => {
            if (activeAction === "changeTier") {
              setSuccessModalTitle("Creator tier changed successfully");
              setSuccessModalMessage(
                "You have successfully changed the creator tier to another tier",
              );
            } else if (activeAction === "suspend") {
              setSuccessModalTitle("Account Suspended");
              setSuccessModalMessage(
                "You have successfully suspended this creator account",
              );
            } else if (activeAction === "delete") {
              setSuccessModalTitle("Account Deleted");
              setSuccessModalMessage(
                "You have successfully deleted this creator account",
              );
            } else {
              setSuccessModalTitle("Action Successful");
              setSuccessModalMessage(
                "The requested action completed successfully",
              );
            }
            setIsSuccessModalOpen(true);
            setActiveAction(null);
          }}
        />

        {/* Note Modal (Add/Edit) */}
        {isNoteModalOpen && (
          <NoteModal
            isOpen={isNoteModalOpen}
            onClose={() => {
              setIsNoteModalOpen(false);
              setEditingNoteId(null);
            }}
            initialValue={noteInitialValue}
            title={noteModalTitle}
            onSave={(value) => {
              if (editingNoteId) {
                updateNoteMutation.mutate({
                  id: creatorId,
                  noteId: editingNoteId,
                  note: value,
                });
              } else {
                addNoteMutation.mutate({
                  id: creatorId,
                  note: value,
                });
              }
              setIsNoteModalOpen(false);
              setEditingNoteId(null);
            }}
          />
        )}

        {/* Success Modal */}
        {isSuccessModalOpen && (
          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            title={successModalTitle}
            message={successModalMessage}
          />
        )}
      </div>
    </Portal>
  );
}
