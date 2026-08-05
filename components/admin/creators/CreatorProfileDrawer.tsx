"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X,
  ArrowLeft,
  Users,
  TrendingUp,
  CheckCircle,
  Wallet,
  Star,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  Ban,
  ShieldOff,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Download,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { AdminStatusBadge } from "../AdminStatusBadge";
import CreatorActionModal from "./CreatorActionModal";
import NoteModal from "./NoteModal";
import SuccessModal from "./SuccessModal";
import { Portal } from "@/components/ui/portal";
import { DrawerSkeleton } from "@/components/admin/DrawerSkeleton";
import {
  useCreatorDetails,
  useCreatorCampaignHistory,
  useCreatorReviews,
  useCreatorNotes,
  useAddCreatorNote,
  useUpdateCreatorNote,
  useDeleteCreatorNote,
  useSuspendCreatorAccount,
  useSuspendCreatorCampaignAccess,
  useReactivateCreatorAccount,
  useChangeCreatorTier,
  useDeleteCreatorAccount,
} from "@/hooks/useAdminCreators";

interface CreatorProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string | null;
}

type TabType = "Overview" | "Campaign History" | "Review" | "Note" | "Action";

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
    desc: "Restore full account privileges for this creator.",
    icon: ShieldCheck,
    color: "text-[#16a34a]",
    border: "border-[#bbf7d0]",
    bg: "bg-[#f0fdf4]",
    iconBg: "bg-[#dcfce7]",
  },
  {
    label: "Change Creator Tier",
    actionType: "changeTier" as const,
    desc: "Manually adjust creator tier level (Nano, Micro, Macro, Mega).",
    icon: Layers,
    color: "text-[#2f63eb]",
    border: "border-[#dbeafe]",
    bg: "bg-[#eff6ff]",
    iconBg: "bg-[#dbeafe]",
  },
  {
    label: "Delete Creator Account",
    actionType: "delete" as const,
    desc: "Permanently delete account and all associated creator data.",
    icon: Trash2,
    color: "text-[#dc2626]",
    border: "border-[#fecaca]",
    bg: "bg-[#fef2f2]",
    iconBg: "bg-[#fee2e2]",
    destructive: true,
  },
];

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "bg-[#f0fdf4] text-[#16a34a]",
    Completed: "bg-[#f0fdf4] text-[#16a34a]",
    ACTIVE: "bg-[#eff6ff] text-[#2563eb]",
    Active: "bg-[#eff6ff] text-[#2563eb]",
    APPLIED: "bg-[#fdf4ff] text-[#9333ea]",
    Applied: "bg-[#fdf4ff] text-[#9333ea]",
    PENDING: "bg-[#fff7ed] text-[#ea580c]",
    Pending: "bg-[#fff7ed] text-[#ea580c]",
  };
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-md text-[10px] font-bold capitalize",
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
            i < Math.round(rating)
              ? "text-[#f59e0b] fill-[#f59e0b]"
              : "text-[#e5e7eb]"
          }
        />
      ))}
    </div>
  );
}

function formatDateOnly(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const cleanDate = dateStr.split("T")[0];
  const parsed = new Date(cleanDate.includes("-") ? cleanDate : dateStr);
  if (isNaN(parsed.getTime())) return cleanDate || "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFollowerCount(count?: number | null): string {
  if (count !== undefined && count !== null) {
    const num = Number(count);
    if (!isNaN(num) && num > 0) {
      if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
      if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
      return num.toLocaleString();
    }
  }
  return "0";
}

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

  /* Campaign History Pagination state */
  const [campaignPage, setCampaignPage] = useState(1);
  const campaignLimit = 10;

  /* API Hooks */
  const { data: creatorProfile, isLoading: isLoadingDetails } =
    useCreatorDetails(creatorId, isOpen);
  const { data: campaignHistoryData, isLoading: isLoadingCampaigns } =
    useCreatorCampaignHistory(creatorId, campaignPage, campaignLimit, isOpen);
  const { data: reviewsData, isLoading: isLoadingReviews } = useCreatorReviews(
    creatorId,
    isOpen,
  );
  const { data: notesData = [] } = useCreatorNotes(creatorId, isOpen);

  const addNoteMutation = useAddCreatorNote();
  const updateNoteMutation = useUpdateCreatorNote();
  const deleteNoteMutation = useDeleteCreatorNote();

  /* Actions Mutations */
  const suspendAccountMutation = useSuspendCreatorAccount();
  const suspendCampaignAccessMutation = useSuspendCreatorCampaignAccess();
  const reactivateAccountMutation = useReactivateCreatorAccount();
  const changeTierMutation = useChangeCreatorTier();
  const deleteAccountMutation = useDeleteCreatorAccount();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const profileDetails = creatorProfile?.profileDetails;
  const metricsData = creatorProfile?.metrics;
  const socialAccounts = creatorProfile?.socialAccounts;

  // Header displays
  const creatorName = profileDetails?.fullName || "Creator Profile";
  const creatorHandle = profileDetails?.username
    ? profileDetails.username.startsWith("@")
      ? profileDetails.username
      : `@${profileDetails.username}`
    : "@creator";

  const creatorInitials = useMemo(() => {
    return creatorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [creatorName]);

  const creatorTier = profileDetails?.tier || "Micro";
  const creatorStatus = (
    profileDetails?.accountStatus || "active"
  ).toLowerCase();

  // Action Confirmation Submission
  const handleConfirmAction = (inputValue: string) => {
    if (!creatorId || !activeAction) return;

    if (activeAction === "suspend") {
      suspendAccountMutation.mutate(
        { id: creatorId, reason: inputValue },
        {
          onSuccess: () => {
            setSuccessModalTitle("Account Suspended");
            setSuccessModalMessage(
              "You have successfully suspended this creator account",
            );
            setIsSuccessModalOpen(true);
            setActiveAction(null);
          },
        },
      );
    } else if (activeAction === "suspendCampaign") {
      suspendCampaignAccessMutation.mutate(
        { id: creatorId, reason: inputValue },
        {
          onSuccess: () => {
            setSuccessModalTitle("Campaign Access Suspended");
            setSuccessModalMessage(
              "You have successfully restricted campaign access for this creator",
            );
            setIsSuccessModalOpen(true);
            setActiveAction(null);
          },
        },
      );
    } else if (activeAction === "reactivate") {
      reactivateAccountMutation.mutate(
        { id: creatorId, reason: inputValue },
        {
          onSuccess: () => {
            setSuccessModalTitle("Account Reactivated");
            setSuccessModalMessage(
              "You have successfully reactivated this creator account",
            );
            setIsSuccessModalOpen(true);
            setActiveAction(null);
          },
        },
      );
    } else if (activeAction === "changeTier") {
      changeTierMutation.mutate(
        { id: creatorId, tier: inputValue },
        {
          onSuccess: () => {
            setSuccessModalTitle("Creator tier changed successfully");
            setSuccessModalMessage(
              `You have successfully changed the creator tier to ${inputValue}`,
            );
            setIsSuccessModalOpen(true);
            setActiveAction(null);
          },
        },
      );
    } else if (activeAction === "delete") {
      deleteAccountMutation.mutate(
        { id: creatorId },
        {
          onSuccess: () => {
            setSuccessModalTitle("Account Deleted");
            setSuccessModalMessage(
              "You have successfully deleted this creator account",
            );
            setIsSuccessModalOpen(true);
            setActiveAction(null);
            onClose();
          },
        },
      );
    }
  };

  const isActionSubmitting =
    suspendAccountMutation.isPending ||
    suspendCampaignAccessMutation.isPending ||
    reactivateAccountMutation.isPending ||
    changeTierMutation.isPending ||
    deleteAccountMutation.isPending;

  // Dynamic reviews array
  const displayReviews = useMemo(() => {
    if (reviewsData && Array.isArray(reviewsData) && reviewsData.length > 0) {
      return reviewsData.map((r) => ({
        id: r.id,
        brand: r.brandName || "Brand Partner",
        date: formatDateOnly(r.createdAt),
        rating: r.rating ?? 5,
        text: r.comment || "Great creator to collaborate with.",
      }));
    }
    return [];
  }, [reviewsData]);

  // Dynamic campaigns array & pagination metadata
  const { displayCampaigns, totalCampaignItems, totalCampaignPages } =
    useMemo(() => {
      const rawObj = campaignHistoryData as Record<string, unknown> | undefined;
      let list: unknown[] = [];
      let totalCount = 0;

      if (Array.isArray(campaignHistoryData)) {
        list = campaignHistoryData;
        totalCount = campaignHistoryData.length;
      } else if (rawObj && Array.isArray(rawObj.data)) {
        list = rawObj.data;
        totalCount =
          typeof rawObj.total === "number"
            ? rawObj.total
            : typeof rawObj.totalCount === "number"
              ? rawObj.totalCount
              : list.length;
      } else if (
        rawObj &&
        rawObj.data &&
        typeof rawObj.data === "object" &&
        Array.isArray((rawObj.data as Record<string, unknown>).data)
      ) {
        const inner = rawObj.data as Record<string, unknown>;
        list = inner.data as unknown[];
        totalCount =
          typeof inner.total === "number" ? inner.total : list.length;
      } else if (rawObj && Array.isArray(rawObj.campaigns)) {
        list = rawObj.campaigns as unknown[];
        totalCount =
          typeof rawObj.total === "number" ? rawObj.total : list.length;
      } else if (rawObj && Array.isArray(rawObj.items)) {
        list = rawObj.items as unknown[];
        totalCount =
          typeof rawObj.total === "number" ? rawObj.total : list.length;
      }

      const items = list.map((item, idx) => {
        const c = item as Record<string, unknown>;
        const brandObj = c.brand as Record<string, unknown> | undefined;
        const brandName =
          (c.brandName as string) ??
          (c.brand as string) ??
          (brandObj?.companyName as string) ??
          (brandObj?.name as string) ??
          "Brand";
        const feeVal =
          (c.fee as number) ??
          (c.amount as number) ??
          (c.budget as number) ??
          0;
        const feeStr =
          feeVal > 0
            ? feeVal >= 1000
              ? `₦${(feeVal / 1000).toFixed(0)}K`
              : `₦${feeVal.toLocaleString()}`
            : "₦0";

        return {
          id:
            (c.id as string) ??
            (c._id as string) ??
            (c.campaignId as string) ??
            String(idx),
          name:
            (c.campaignTitle as string) ??
            (c.title as string) ??
            (c.campaignName as string) ??
            (c.name as string) ??
            "Campaign",
          brand: brandName,
          status:
            (c.status as string) ?? (c.campaignStatus as string) ?? "COMPLETED",
          fee: feeStr,
          date: formatDateOnly(
            (c.submittedAt as string) ??
              (c.createdAt as string) ??
              (c.date as string),
          ),
        };
      });

      const calculatedTotal = totalCount > 0 ? totalCount : items.length;
      const pages = Math.max(1, Math.ceil(calculatedTotal / campaignLimit));

      return {
        displayCampaigns: items,
        totalCampaignItems: calculatedTotal,
        totalCampaignPages: pages,
      };
    }, [campaignHistoryData, campaignLimit]);

  const avgRating = useMemo(() => {
    if (displayReviews.length > 0) {
      return (
        displayReviews.reduce((s, r) => s + r.rating, 0) / displayReviews.length
      ).toFixed(1);
    }
    return "0.0";
  }, [displayReviews]);

  const totalFollowersCount = useMemo(() => {
    if (!creatorProfile) return 0;

    const rootObj = creatorProfile as unknown as Record<string, unknown>;
    const rootVal =
      rootObj["total followers"] ??
      rootObj["total_followers"] ??
      rootObj["totalFollowers"] ??
      rootObj["followers"];
    if (rootVal !== undefined && rootVal !== null) {
      const num = Number(rootVal);
      if (!isNaN(num) && num > 0) return num;
    }

    const m = (metricsData || rootObj.metrics) as
      Record<string, unknown> | undefined;
    if (m) {
      const rawVal =
        m["total followers"] ??
        m["total_followers"] ??
        m["totalFollowers"] ??
        m["followers"];
      if (rawVal !== undefined && rawVal !== null) {
        const num = Number(rawVal);
        if (!isNaN(num) && num > 0) return num;
      }
    }

    const pd = (profileDetails || rootObj.profileDetails) as
      Record<string, unknown> | undefined;
    if (pd) {
      const rawVal =
        pd["total followers"] ??
        pd["total_followers"] ??
        pd["totalFollowers"] ??
        pd["followers"] ??
        pd["followersCount"];
      if (rawVal !== undefined && rawVal !== null) {
        const num = Number(rawVal);
        if (!isNaN(num) && num > 0) return num;
      }
    }

    const st = rootObj.stats as Record<string, unknown> | undefined;
    if (st) {
      const rawVal =
        st["total followers"] ??
        st["total_followers"] ??
        st["totalFollowers"] ??
        st["followers"];
      if (rawVal !== undefined && rawVal !== null) {
        const num = Number(rawVal);
        if (!isNaN(num) && num > 0) return num;
      }
    }

    if (
      socialAccounts &&
      Array.isArray(socialAccounts) &&
      socialAccounts.length > 0
    ) {
      const sum = socialAccounts.reduce(
        (acc, sa) => acc + (sa.followersCount || 0),
        0,
      );
      if (sum > 0) return sum;
    }

    return 0;
  }, [creatorProfile, metricsData, profileDetails, socialAccounts]);

  const realBankDetails = useMemo(() => {
    const rootObj = (creatorProfile || {}) as Record<string, unknown>;
    const rootBank = (creatorProfile?.bankDetails ||
      profileDetails?.bankDetails ||
      rootObj?.bankDetails ||
      rootObj?.bank_details ||
      rootObj?.bank) as Record<string, unknown> | undefined;

    const accountNumber =
      (rootBank?.accountNumber as string) ??
      (rootBank?.account_number as string) ??
      profileDetails?.accountNumber ??
      profileDetails?.bankAccountNumber ??
      "";

    const bankName =
      (rootBank?.bankName as string) ??
      (rootBank?.bank_name as string) ??
      profileDetails?.bankName ??
      "";

    const accountName =
      (rootBank?.accountName as string) ??
      (rootBank?.account_name as string) ??
      profileDetails?.accountName ??
      profileDetails?.bankAccountName ??
      profileDetails?.fullName ??
      creatorName;

    const bankAccountStatus =
      (rootBank?.status as string) ??
      (rootBank?.bankAccountStatus as string) ??
      (rootBank?.bank_account_status as string) ??
      profileDetails?.bankAccountStatus ??
      (accountNumber ? "Verified" : "Unverified");

    const isVerified =
      String(bankAccountStatus).toLowerCase().includes("verified") ||
      String(bankAccountStatus).toLowerCase() === "active" ||
      Boolean(rootBank?.isVerified || rootBank?.is_verified);

    return {
      accountNumber: accountNumber ? String(accountNumber) : "",
      bankName: bankName ? String(bankName) : "",
      accountName: accountName ? String(accountName) : "",
      bankAccountStatus: String(bankAccountStatus),
      isVerified,
      hasBank: Boolean(accountNumber || bankName),
    };
  }, [creatorProfile, profileDetails, creatorName]);

  const metrics = [
    {
      label: "Completed Campaigns",
      value:
        metricsData?.completedCampaigns !== undefined
          ? String(metricsData.completedCampaigns)
          : String(displayCampaigns.length),
      icon: CheckCircle2,
      color: "text-[#16a34a]",
      bg: "bg-[#f0fdf4]",
    },
    {
      label: "Total Earnings",
      value:
        metricsData?.totalEarnings !== undefined
          ? `₦${
              metricsData.totalEarnings >= 1000000
                ? (metricsData.totalEarnings / 1000000).toFixed(1) + "M"
                : (metricsData.totalEarnings / 1000).toFixed(0) + "K"
            }`
          : "₦0",
      icon: Wallet,
      color: "text-[#d97706]",
      bg: "bg-[#fffbeb]",
    },
    {
      label: "On-Time Submission rate",
      value:
        metricsData?.onTimeSubmissionRate !== undefined
          ? `${metricsData.onTimeSubmissionRate}%`
          : "0%",
      icon: TrendingUp,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
    },
    {
      label: "Total Followers",
      value: formatFollowerCount(totalFollowersCount),
      icon: Users,
      color: "text-[#d7176f]",
      bg: "bg-[#fdf2f6]",
    },
    {
      label: "Total Tokens",
      value:
        metricsData?.totalTokens !== undefined
          ? String(metricsData.totalTokens)
          : "0",
      icon: Zap,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
    },
  ];

  const handleExportMetrics = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["Creator Name", creatorName],
      ["Username", creatorHandle],
      ["Completed Campaigns", metrics[0].value],
      ["Total Earnings", metrics[1].value],
      ["On-Time Submission rate", metrics[2].value],
      ["Total Followers", metrics[3].value],
      ["Total Tokens", metrics[4].value],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.map((cell) => `"${cell}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${creatorName.toLowerCase().replace(/\s+/g, "_")}_metrics.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Metrics exported successfully");
  };

  if (!isOpen || !creatorId) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="w-full max-w-[620px] h-full bg-white relative z-10 flex flex-col shadow-2xl overflow-y-auto">
          {isLoadingDetails ? (
            <DrawerSkeleton onClose={onClose} title="Creator Profile" />
          ) : (
            <>
              {/* Top bar */}
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

              {/* Creator Header Summary */}
              <div className="flex flex-col items-center justify-center py-7 border-b border-[#e8e6f0]/40 shrink-0">
                <UserAvatar initials={creatorInitials} size={72} />
                <h3 className="text-base font-bold text-[#1a1a2e] mt-3">
                  {creatorName}
                </h3>
                <span className="text-xs text-[#9a99b0]">{creatorHandle}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#e0e7ff] capitalize">
                    {creatorTier}
                  </span>
                  <AdminStatusBadge status={creatorStatus} />
                </div>
              </div>

              {/* Tabs */}
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

              {/* Tab Content */}
              <div className="flex-1 flex flex-col gap-5 p-6">
                {/* OVERVIEW TAB */}
                {activeTab === "Overview" && (
                  <>
                    {/* METRICS CARDS MATRIX (POSITIONED AT TOP WITH EXPORT OPTION) */}
                    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-[#1a1a2e] uppercase tracking-wider">
                          METRICS
                        </h4>
                        <button
                          type="button"
                          onClick={handleExportMetrics}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#e8e6f0] hover:bg-[#faf9fc] text-[#1a1a2e] text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer hover:border-[#d0ceeb]"
                        >
                          <Download size={13} className="text-[#5a5a7a]" />
                          <span>Export</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {metrics.map((m, i) => {
                          const Icon = m.icon;
                          return (
                            <div
                              key={i}
                              className="bg-[#faf9fc]/80 border border-[#e8e6f0]/80 rounded-2xl p-4 flex flex-col items-center text-center justify-center gap-1.5 shadow-2xs transition-all hover:bg-white hover:shadow-xs"
                            >
                              <div
                                className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                                  m.bg,
                                  m.color,
                                )}
                              >
                                <Icon size={14} />
                              </div>
                              <span className="text-base font-bold text-[#1a1a2e] tracking-tight mt-0.5">
                                {m.value}
                              </span>
                              <span className="text-[11px] text-[#7a7a9a] font-medium leading-tight text-center">
                                {m.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4">
                      <h4 className="text-sm font-bold text-[#1a1a2e]">
                        Profile Details
                      </h4>
                      <div className="flex flex-col gap-3.5 text-xs">
                        {[
                          {
                            label: "Full name",
                            value: profileDetails?.fullName || creatorName,
                          },
                          {
                            label: "Email",
                            value: profileDetails?.email || "amara@email.com",
                          },
                          {
                            label: "Country of residence",
                            value:
                              profileDetails?.countryOfResidence || "Nigeria",
                          },
                          {
                            label: "State",
                            value: profileDetails?.state || "Lagos",
                          },
                          {
                            label: "Nationality",
                            value: profileDetails?.nationality || "Nigeria",
                          },
                          {
                            label: "Bio",
                            value:
                              profileDetails?.bio ||
                              "Fashion content creator passionate about African aesthetics and modern style.",
                          },
                          {
                            label: "Gender",
                            value: profileDetails?.gender || "Male",
                          },
                          {
                            label: "Date of Birth",
                            value:
                              profileDetails?.dateOfBirth ||
                              profileDetails?.dob ||
                              "11-05-2000",
                          },
                          {
                            label: "Profile Completion",
                            value: profileDetails?.profileCompletion || "100%",
                          },
                          {
                            label: "Account Number",
                            value:
                              realBankDetails.accountNumber ||
                              profileDetails?.accountNumber ||
                              profileDetails?.bankAccountNumber ||
                              "—",
                            isBankAccountNumber: Boolean(
                              realBankDetails.accountNumber ||
                              profileDetails?.accountNumber ||
                              profileDetails?.bankAccountNumber,
                            ),
                          },
                          {
                            label: "Bank Name",
                            value:
                              realBankDetails.bankName ||
                              profileDetails?.bankName ||
                              "—",
                          },
                          {
                            label: "Account Name",
                            value:
                              realBankDetails.accountName ||
                              profileDetails?.accountName ||
                              profileDetails?.bankAccountName ||
                              profileDetails?.fullName ||
                              creatorName,
                          },
                          {
                            label: "Bank Account Status",
                            value:
                              realBankDetails.bankAccountStatus ||
                              profileDetails?.bankAccountStatus ||
                              "Verified",
                            isBankStatusBadge: true,
                          },
                          {
                            label: "Date Joined",
                            value:
                              formatDateOnly(profileDetails?.dateJoined) !== "—"
                                ? formatDateOnly(profileDetails?.dateJoined)
                                : "Jan 15, 2026",
                          },
                          {
                            label: "Account Status",
                            isBadge: true,
                          },
                        ].map((f, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] items-start gap-1 sm:gap-4"
                          >
                            <span className="font-bold text-[#5a5a7a]">
                              {f.label}
                            </span>
                            {f.isBadge ? (
                              <div className="w-fit">
                                <AdminStatusBadge status={creatorStatus} />
                              </div>
                            ) : f.isBankStatusBadge ? (
                              <span
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize w-fit inline-block",
                                  (String(f.value)
                                    .toLowerCase()
                                    .includes("verified") &&
                                    !String(f.value)
                                      .toLowerCase()
                                      .includes("unverified")) ||
                                    String(f.value).toLowerCase() === "active"
                                    ? "bg-[#f0fdf4] text-[#16a34a] border-emerald-200"
                                    : String(f.value)
                                          .toLowerCase()
                                          .includes("unverified") ||
                                        String(f.value)
                                          .toLowerCase()
                                          .includes("rejected") ||
                                        String(f.value)
                                          .toLowerCase()
                                          .includes("failed")
                                      ? "bg-[#fef2f2] text-[#dc2626] border-red-200"
                                      : "bg-[#fffbeb] text-[#d97706] border-amber-200",
                                )}
                              >
                                {f.value}
                              </span>
                            ) : f.isBankAccountNumber ? (
                              <div className="flex items-center gap-1.5 font-semibold text-[#1a1a2e]">
                                <span>{f.value}</span>
                                {realBankDetails.isVerified && (
                                  <CheckCircle2
                                    size={15}
                                    className="text-[#10b981] fill-[#10b981]/15 shrink-0"
                                  />
                                )}
                              </div>
                            ) : (
                              <span className="font-semibold text-[#1a1a2e] leading-relaxed">
                                {f.value}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Accounts Section */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                        Social Accounts
                      </h4>
                      <div className="flex flex-col gap-3">
                        {socialAccounts && socialAccounts.length > 0 ? (
                          socialAccounts.map((sa) => (
                            <div
                              key={sa.platform}
                              className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl"
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                  sa.platform.toLowerCase() === "instagram"
                                    ? "bg-[#fdf2f6] text-[#d7176f]"
                                    : sa.platform.toLowerCase() === "youtube"
                                      ? "bg-[#fef2f2] text-[#dc2626]"
                                      : "bg-[#f4f3f6] text-[#1a1a2e]",
                                )}
                              >
                                {sa.platform.toLowerCase() === "instagram" ? (
                                  <FaInstagram size={14} />
                                ) : sa.platform.toLowerCase() === "youtube" ? (
                                  <FaYoutube size={14} />
                                ) : (
                                  <FaTiktok size={14} />
                                )}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-xs font-bold text-[#1a1a2e] capitalize">
                                  {sa.platform}
                                </span>
                                <span className="text-[10px] text-[#9a99b0] truncate">
                                  {sa.handle}{" "}
                                  {sa.followersCount
                                    ? `(${sa.followersCount.toLocaleString()} followers)`
                                    : ""}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl">
                              <div className="w-8 h-8 rounded-full bg-[#fdf2f6] text-[#d7176f] flex items-center justify-center shrink-0">
                                <FaInstagram size={14} />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-xs font-bold text-[#1a1a2e]">
                                  Instagram
                                </span>
                                <span className="text-[10px] text-[#9a99b0] truncate">
                                  {creatorHandle}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e8e6f0]/60 rounded-2xl">
                              <div className="w-8 h-8 rounded-full bg-[#f4f3f6] text-[#1a1a2e] flex items-center justify-center shrink-0">
                                <FaTiktok size={14} />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-xs font-bold text-[#1a1a2e]">
                                  TikTok
                                </span>
                                <span className="text-[10px] text-[#9a99b0] truncate">
                                  {creatorHandle}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* CAMPAIGN HISTORY TAB */}
                {activeTab === "Campaign History" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                        Campaign History
                      </h4>
                      {totalCampaignItems > 0 && (
                        <span className="text-[11px] font-semibold text-[#9a99b0]">
                          Total: {totalCampaignItems}
                        </span>
                      )}
                    </div>

                    {isLoadingCampaigns ? (
                      <div className="flex flex-col gap-3 py-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-12 w-full bg-[#faf9fc] rounded-2xl animate-pulse flex items-center px-4 gap-4"
                          >
                            <div className="w-24 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                            <div className="w-20 h-3.5 bg-[#e8e6f0]/40 rounded-md" />
                            <div className="w-16 h-4 bg-[#e8e6f0]/60 rounded-md ml-auto" />
                          </div>
                        ))}
                      </div>
                    ) : displayCampaigns.length === 0 ? (
                      <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-[#faf9fc] rounded-2xl border border-dashed border-[#e8e6f0]">
                        <CheckCircle
                          size={32}
                          className="text-[#9a99b0] mb-2"
                        />
                        <h5 className="text-xs font-bold text-[#1a1a2e]">
                          No Campaign History
                        </h5>
                        <p className="text-[11px] text-[#9a99b0] mt-0.5">
                          This creator has not participated in any campaigns
                          yet.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="overflow-x-auto border border-[#e8e6f0]/60 rounded-2xl">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-[#e8e6f0]/60 bg-[#faf9fc]">
                                {[
                                  "Campaign",
                                  "Brand",
                                  "Status",
                                  "Fee",
                                  "Submitted",
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
                                  key={c.id || i}
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
                                  <td className="px-4 py-3 text-[#5a5a7a] font-semibold">
                                    {c.fee}
                                  </td>
                                  <td className="px-4 py-3 text-[#9a99b0] whitespace-nowrap">
                                    {c.date}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalCampaignPages > 1 && (
                          <div className="flex items-center justify-between px-1 pt-1 text-xs">
                            <span className="text-[11px] font-medium text-[#9a99b0]">
                              Page {campaignPage} of {totalCampaignPages}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={campaignPage <= 1}
                                onClick={() =>
                                  setCampaignPage((p) => Math.max(1, p - 1))
                                }
                                className="px-3 py-1 bg-white border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf9fc] cursor-pointer"
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                disabled={campaignPage >= totalCampaignPages}
                                onClick={() =>
                                  setCampaignPage((p) =>
                                    Math.min(totalCampaignPages, p + 1),
                                  )
                                }
                                className="px-3 py-1 bg-white border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf9fc] cursor-pointer"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === "Review" && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-5">
                      <span className="text-4xl font-black text-[#1a1a2e]">
                        {avgRating}
                      </span>
                      <div className="flex flex-col gap-1">
                        <Stars rating={Number(avgRating)} />
                        <span className="text-[11px] text-[#9a99b0] font-medium">
                          {displayReviews.length} reviews
                        </span>
                      </div>
                    </div>

                    {isLoadingReviews ? (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-3 animate-pulse"
                          >
                            <div className="flex justify-between items-center">
                              <div className="w-28 h-4 bg-[#e8e6f0]/60 rounded-md" />
                              <div className="w-16 h-3 bg-[#e8e6f0]/40 rounded-md" />
                            </div>
                            <div className="w-20 h-3 bg-[#e8e6f0]/40 rounded-md" />
                            <div className="w-full h-10 bg-[#e8e6f0]/30 rounded-xl" />
                          </div>
                        ))}
                      </div>
                    ) : displayReviews.length === 0 ? (
                      <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-[#faf9fc] rounded-2xl border border-dashed border-[#e8e6f0]">
                        <Star size={32} className="text-[#9a99b0] mb-2" />
                        <h5 className="text-xs font-bold text-[#1a1a2e]">
                          No Brand Reviews Yet
                        </h5>
                        <p className="text-[11px] text-[#9a99b0] mt-0.5">
                          No brand reviews or ratings have been submitted for
                          this creator.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {displayReviews.map((r, i) => (
                          <div
                            key={r.id || i}
                            className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2 shadow-xs"
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
                    )}
                  </div>
                )}

                {/* NOTES TAB */}
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
                                  {formatDateOnly(n.createdAt)}
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

                {/* ACTION TAB */}
                {activeTab === "Action" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs font-semibold">
                      <AlertTriangle
                        size={14}
                        className="shrink-0 text-[#f59e0b]"
                      />
                      Actions require confirmation and are recorded in the audit
                      trail.
                    </div>

                    <div className="flex flex-col gap-3">
                      {ACTIONS.map((a) => {
                        const Icon = a.icon;
                        return (
                          <button
                            key={a.actionType}
                            onClick={() => setActiveAction(a.actionType)}
                            className={cn(
                              "w-full text-left p-4 rounded-2xl border flex items-start gap-3.5 transition-all cursor-pointer hover:shadow-xs",
                              a.bg,
                              a.border,
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
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

              {/* Action confirmation Modal */}
              <CreatorActionModal
                action={activeAction}
                currentTier={creatorTier}
                onClose={() => setActiveAction(null)}
                onConfirm={handleConfirmAction}
                isSubmitting={isActionSubmitting}
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
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}
