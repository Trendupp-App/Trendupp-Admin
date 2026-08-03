"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Play,
  Star,
  Pencil,
  Trash2,
  Plus,
  Ban,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "../AdminStatusBadge";
import BrandActionModal from "./BrandActionModal";
import SuccessModal from "../creators/SuccessModal";
import NoteModal from "../creators/NoteModal";
import { Portal } from "@/components/ui/portal";
import { DrawerSkeleton } from "@/components/admin/DrawerSkeleton";
import UserAvatar from "@/shared/UserAvatar";
import {
  useBrandDetails,
  useBrandCampaignHistory,
  useBrandNotes,
  useAddBrandNote,
  useUpdateBrandNote,
  useDeleteBrandNote,
  useSuspendBrand,
  useReactivateBrand,
} from "@/hooks/useAdminBrands";

interface BrandProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string | null;
}

type TabType = "Overview" | "Campaign History" | "Notes" | "Actions";

const PepsiLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-18 h-18 rounded-full overflow-hidden shadow-xs shrink-0"
  >
    <path
      d="M 50,5 A 45,45 0 0 1 95,50 C 95,50 80,35 50,45 C 20,55 5,50 5,50 A 45,45 0 0 1 50,5 Z"
      fill="#E31837"
    />
    <path
      d="M 50,95 A 45,45 0 0 1 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 A 45,45 0 0 1 50,95 Z"
      fill="#004B87"
    />
    <path
      d="M 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 C 95,50 78,28 50,38 C 22,48 5,50 5,50 Z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function BrandProfileDrawer({
  isOpen,
  onClose,
  brandId,
}: BrandProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [activeAction, setActiveAction] = useState<
    "suspend" | "reactivate" | "delete" | null
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
  const { data: brandData, isLoading: isLoadingDetails } = useBrandDetails(
    brandId,
    isOpen,
  );
  const { data: campaignHistoryData, isLoading: isLoadingCampaigns } =
    useBrandCampaignHistory(brandId, campaignPage, campaignLimit, isOpen);
  const { data: notesData = [], isLoading: isLoadingNotes } = useBrandNotes(
    brandId,
    isOpen,
  );

  const addNoteMutation = useAddBrandNote();
  const updateNoteMutation = useUpdateBrandNote();
  const deleteNoteMutation = useDeleteBrandNote();
  const suspendBrandMutation = useSuspendBrand();
  const reactivateBrandMutation = useReactivateBrand();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const header = brandData?.header;
  const brandDetails = brandData?.brandDetails;
  const brandRepresentative = brandData?.brandRepresentative;
  const metricsData = brandData?.metrics;
  const profileDetails = brandData?.profileDetails;

  const rootObj = useMemo(
    () => (brandData || {}) as Record<string, unknown>,
    [brandData],
  );

  const brandName =
    header?.brandName ||
    brandDetails?.brandName ||
    profileDetails?.brandName ||
    (rootObj?.brandName as string) ||
    (rootObj?.name as string) ||
    "Brand Profile";

  const brandEmail =
    brandDetails?.email ||
    profileDetails?.email ||
    (rootObj?.email as string) ||
    "—";

  const brandWebsite =
    header?.websiteUrl ||
    brandDetails?.website ||
    profileDetails?.website ||
    (rootObj?.website as string) ||
    (rootObj?.websiteUrl as string) ||
    "—";

  const brandLogoUrl =
    header?.logoUrl ||
    (rootObj?.logoUrl as string) ||
    (rootObj?.logo as string) ||
    null;

  const brandIndustry =
    header?.industry ||
    profileDetails?.industry ||
    (rootObj?.industry as string) ||
    "FMCG";

  const brandBio =
    brandDetails?.bio || profileDetails?.bio || (rootObj?.bio as string) || "—";

  const brandCountry =
    brandDetails?.country ||
    profileDetails?.countryOfResidence ||
    (rootObj?.country as string) ||
    (rootObj?.countryOfResidence as string) ||
    "—";

  const brandStateCity = useMemo(() => {
    const st =
      brandDetails?.stateCity ||
      profileDetails?.state ||
      (rootObj?.state as string);
    const ct = profileDetails?.city || (rootObj?.city as string);
    if (st && ct) return `${st}/${ct}`;
    return st || ct || "—";
  }, [rootObj, brandDetails, profileDetails]);

  const accountStatusRaw = useMemo(() => {
    const raw =
      (brandRepresentative?.accountStatus as string) ??
      (profileDetails?.accountStatus as string) ??
      (header?.status as string) ??
      (brandDetails?.accountStatus as string) ??
      (rootObj?.accountStatus as string) ??
      (rootObj?.status as string) ??
      "Onboarded";

    const s = String(raw).trim();
    if (s.toLowerCase() === "active") return "onboarded";
    return s.toLowerCase();
  }, [rootObj, brandRepresentative, profileDetails, header, brandDetails]);

  const brandStatus = accountStatusRaw;

  const repName =
    brandRepresentative?.fullName ||
    profileDetails?.representativeName ||
    (rootObj?.representativeName as string) ||
    (rootObj?.representativeFullName as string) ||
    (rootObj?.fullName as string) ||
    "—";

  const repEmail =
    brandRepresentative?.email ||
    profileDetails?.representativeEmail ||
    (rootObj?.representativeEmail as string) ||
    (rootObj?.email as string) ||
    "—";

  const repPhone =
    brandRepresentative?.phoneNumber ||
    profileDetails?.representativePhone ||
    (rootObj?.representativePhone as string) ||
    (rootObj?.phoneNumber as string) ||
    (rootObj?.phone as string) ||
    "—";

  const repCompletion =
    brandRepresentative?.profileCompletion ??
    profileDetails?.profileCompletion ??
    (rootObj?.profileCompletion as number) ??
    (rootObj?.completion as number) ??
    0;

  const repJoinedRaw =
    brandRepresentative?.dateJoined ||
    profileDetails?.dateJoined ||
    (rootObj?.dateJoined as string) ||
    (rootObj?.joinedAt as string) ||
    (rootObj?.createdAt as string);

  const formatDateOnly = (dateStr?: string) => {
    if (!dateStr || dateStr === "N/A" || dateStr === "—") return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const repJoined = formatDateOnly(repJoinedRaw);

  const refundAccountData = useMemo(() => {
    const refundObj = (brandData?.refundAccount ||
      brandData?.bankDetails ||
      rootObj?.refundAccount ||
      rootObj?.bankDetails ||
      rootObj?.bankAccount ||
      rootObj?.refund_account ||
      rootObj?.bank_details) as Record<string, unknown> | undefined;

    const accNum =
      (refundObj?.accountNumber as string) ??
      (refundObj?.account_number as string) ??
      profileDetails?.accountNumber ??
      (rootObj?.accountNumber as string) ??
      (rootObj?.bankAccountNumber as string) ??
      (rootObj?.refundAccountNumber as string) ??
      "—";

    const bName =
      (refundObj?.bankName as string) ??
      (refundObj?.bank_name as string) ??
      profileDetails?.bankName ??
      (rootObj?.bankName as string) ??
      (rootObj?.refundBankName as string) ??
      "—";

    const accName =
      (refundObj?.accountName as string) ??
      (refundObj?.account_name as string) ??
      profileDetails?.accountName ??
      (rootObj?.accountName as string) ??
      (rootObj?.bankAccountName as string) ??
      (rootObj?.refundAccountName as string) ??
      (repName !== "—" ? repName : "—");

    const verified =
      Boolean(refundObj?.isVerified || refundObj?.is_verified) ||
      Boolean(rootObj?.isBankVerified || rootObj?.isAccountVerified) ||
      Boolean(accNum && accNum !== "—");

    return {
      accountNumber: String(accNum),
      bankName: String(bName),
      accountName: String(accName),
      isVerified: verified,
    };
  }, [brandData, rootObj, profileDetails, repName]);

  const monthlyBudgetDisplay = useMemo(() => {
    const budgetVal =
      brandDetails?.monthlyBudget ??
      profileDetails?.monthlyBudget ??
      (rootObj?.monthlyBudget as number) ??
      (rootObj?.monthly_budget as number) ??
      (rootObj?.budget as number);

    if (budgetVal !== undefined && budgetVal !== null && budgetVal > 0) {
      if (budgetVal >= 1000000) {
        return `₦${(budgetVal / 1000000).toFixed(1)}M`;
      } else if (budgetVal >= 1000) {
        return `₦${(budgetVal / 1000).toFixed(0)}K`;
      }
      return `₦${budgetVal.toLocaleString()}`;
    }
    return "—";
  }, [rootObj, brandDetails, profileDetails]);

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
        const meta = rawObj.meta as Record<string, unknown> | undefined;
        totalCount =
          typeof meta?.total === "number"
            ? meta.total
            : typeof rawObj.total === "number"
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
        const budgetVal =
          (c.budget as number) ??
          (c.totalBudget as number) ??
          (c.amount as number) ??
          0;
        const spentVal =
          (c.spentAmount as number) ??
          (c.spent as number) ??
          (c.amountSpent as number) ??
          0;
        const creatorsCount =
          (c.creatorsJoinedCount as number) ??
          (c.creatorsCount as number) ??
          (c.applicantsCount as number) ??
          (c.creators as number) ??
          0;

        const formatMoney = (val: number) => {
          if (!val || val <= 0) return "₦0";
          if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
          return `₦${val.toLocaleString()}`;
        };

        return {
          id:
            (c.id as string) ??
            (c._id as string) ??
            (c.campaignId as string) ??
            String(idx),
          title:
            (c.campaignTitle as string) ??
            (c.title as string) ??
            (c.campaignName as string) ??
            (c.name as string) ??
            "Campaign Title",
          status:
            (c.status as string) ?? (c.campaignStatus as string) ?? "ACTIVE",
          budget: formatMoney(budgetVal),
          spent: formatMoney(spentVal),
          creators: creatorsCount,
          date: formatDateOnly(
            (c.startDate as string) ??
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

  if (!isOpen || !brandId) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="w-full max-w-[620px] h-full bg-white relative z-10 flex flex-col shadow-2xl overflow-y-auto">
          {isLoadingDetails ? (
            <DrawerSkeleton onClose={onClose} title="Brand Profile" />
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
                  Brand Profile
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Header Summary */}
              <div className="flex flex-col items-center justify-center py-7 border-b border-[#e8e6f0]/40 shrink-0">
                {brandName.toLowerCase().includes("pepsi") ? (
                  <PepsiLogo />
                ) : (
                  <UserAvatar
                    avatarUrl={brandLogoUrl}
                    initials={brandName.slice(0, 2)}
                    size={72}
                  />
                )}
                <h3 className="text-base font-bold text-[#1a1a2e] mt-3">
                  {brandName}
                </h3>
                <span className="text-xs text-[#9a99b0]">{brandWebsite}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#e0e7ff] uppercase">
                    {brandIndustry}
                  </span>
                  <AdminStatusBadge status={brandStatus} />
                </div>
              </div>

              {/* Tabs Bar */}
              <div className="flex border-b border-[#e8e6f0]/40 px-6 overflow-x-auto shrink-0 scrollbar-none">
                {(
                  ["Overview", "Campaign History", "Notes", "Actions"] as const
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
                    {/* Brand Details Container */}
                    <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4">
                      {/* Section 1: Brand Details */}
                      <h4 className="text-sm font-bold text-[#1a1a2e]">
                        Brand Details
                      </h4>
                      <div className="flex flex-col gap-3.5 text-xs">
                        {[
                          {
                            label: "Brand name",
                            value: brandName,
                          },
                          {
                            label: "Email",
                            value: brandEmail,
                          },
                          {
                            label: "Website",
                            value: brandWebsite,
                          },
                          {
                            label: "Bio",
                            value: brandBio,
                          },
                          {
                            label: "Country",
                            value: brandCountry,
                          },
                          {
                            label: "State/City",
                            value: brandStateCity,
                          },
                          {
                            label: "Monthly Budget",
                            value: monthlyBudgetDisplay,
                          },
                        ].map((f, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] items-start gap-1 sm:gap-4"
                          >
                            <span className="font-bold text-[#5a5a7a]">
                              {f.label}
                            </span>
                            <span className="font-semibold text-[#1a1a2e] leading-relaxed">
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Section 2: Brand Representative */}
                      <h4 className="text-sm font-bold text-[#1a1a2e] pt-2 border-t border-[#e8e6f0]/40">
                        Brand Representative
                      </h4>
                      <div className="flex flex-col gap-3.5 text-xs">
                        {[
                          {
                            label: "Full name",
                            value: repName,
                          },
                          {
                            label: "Email",
                            value: repEmail,
                          },
                          {
                            label: "Phone Number",
                            value: repPhone,
                          },
                        ].map((f, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] items-start gap-1 sm:gap-4"
                          >
                            <span className="font-bold text-[#5a5a7a]">
                              {f.label}
                            </span>
                            <span className="font-semibold text-[#1a1a2e] leading-relaxed">
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Section 3: Refund Account */}
                      <h4 className="text-sm font-bold text-[#1a1a2e] pt-2 border-t border-[#e8e6f0]/40">
                        Refund Account
                      </h4>
                      <div className="flex flex-col gap-3.5 text-xs">
                        {[
                          {
                            label: "Account Number",
                            value: refundAccountData.accountNumber,
                            isAccountNumber: true,
                          },
                          {
                            label: "Bank Name",
                            value: refundAccountData.bankName,
                          },
                          {
                            label: "Account Name",
                            value: refundAccountData.accountName,
                          },
                          {
                            label: "Profile Completion",
                            value: `${repCompletion}%`,
                          },
                          {
                            label: "Date Joined",
                            value: repJoined,
                          },
                          {
                            label: "Account Status",
                            isStatusBadge: true,
                          },
                        ].map((f, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] items-start gap-1 sm:gap-4"
                          >
                            <span className="font-bold text-[#5a5a7a]">
                              {f.label}
                            </span>
                            {f.isStatusBadge ? (
                              <div className="w-fit">
                                <AdminStatusBadge status={accountStatusRaw} />
                              </div>
                            ) : f.isAccountNumber ? (
                              <div className="flex items-center gap-1.5 font-semibold text-[#1a1a2e]">
                                <span>{f.value}</span>
                                {refundAccountData.isVerified && (
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

                    {/* Metrics Strip Card */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                        Metrics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                          <Briefcase
                            size={16}
                            className="text-[#2f63eb] mb-1"
                          />
                          <span className="text-base font-black text-[#1a1a2e]">
                            {metricsData?.totalCampaigns ?? 0}
                          </span>
                          <span className="text-[10px] font-bold text-[#7a7a9a]">
                            Total Campaigns
                          </span>
                        </div>
                        <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                          <TrendingUp
                            size={16}
                            className="text-[#ea580c] mb-1"
                          />
                          <span className="text-base font-black text-[#1a1a2e]">
                            {metricsData?.totalSpend
                              ? `₦${metricsData.totalSpend.toLocaleString()}`
                              : "₦0"}
                          </span>
                          <span className="text-[10px] font-bold text-[#7a7a9a]">
                            Total Spend
                          </span>
                        </div>
                        <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                          <Play size={16} className="text-[#16a34a] mb-1" />
                          <span className="text-base font-black text-[#1a1a2e]">
                            {metricsData?.activeCampaigns ?? 0}
                          </span>
                          <span className="text-[10px] font-bold text-[#7a7a9a]">
                            Active Campaigns
                          </span>
                        </div>
                        <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                          <Star size={16} className="text-[#ca8a04] mb-1" />
                          <span className="text-base font-black text-[#1a1a2e]">
                            {metricsData?.avgCreatorRating !== undefined &&
                            metricsData?.avgCreatorRating !== null
                              ? `${metricsData.avgCreatorRating} / 5`
                              : "0.0 / 5"}
                          </span>
                          <span className="text-[10px] font-bold text-[#7a7a9a]">
                            Avg Creator Rating
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* CAMPAIGN HISTORY TAB */}
                {activeTab === "Campaign History" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1a1a2e]">
                        Campaign History
                      </h4>
                      {totalCampaignItems > 0 && (
                        <span className="text-[11px] font-semibold text-[#9a99b0]">
                          Total: {totalCampaignItems}
                        </span>
                      )}
                    </div>
                    {isLoadingCampaigns ? (
                      <div className="p-4 text-center text-xs text-[#9a99b0]">
                        Loading campaign history...
                      </div>
                    ) : displayCampaigns.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#9a99b0] bg-[#faf9fc] rounded-2xl border border-[#e8e6f0]/60">
                        No campaign history found for this brand.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="overflow-x-auto rounded-2xl border border-[#e8e6f0]/60">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-[#faf9fc] border-b border-[#e8e6f0]/60 text-[10px] font-extrabold uppercase text-[#7a7a9a]">
                                <th className="py-3 px-3">Title</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Budget</th>
                                <th className="py-3 px-3">Spent</th>
                                <th className="py-3 px-3">Creators</th>
                                <th className="py-3 px-3">Start Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e6f0]/40">
                              {displayCampaigns.map((c) => (
                                <tr key={c.id}>
                                  <td className="py-3 px-3 font-bold text-[#1a1a2e]">
                                    {c.title}
                                  </td>
                                  <td className="py-3 px-3">
                                    <AdminStatusBadge status={c.status} />
                                  </td>
                                  <td className="py-3 px-3 font-bold text-[#1a1a2e]">
                                    {c.budget}
                                  </td>
                                  <td className="py-3 px-3 font-bold text-[#1a1a2e]">
                                    {c.spent}
                                  </td>
                                  <td className="py-3 px-3 font-bold text-[#1a1a2e]">
                                    {c.creators}
                                  </td>
                                  <td className="py-3 px-3 text-[#7a7a9a]">
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

                {/* NOTES TAB */}
                {activeTab === "Notes" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1a1a2e]">
                        Internal Admin Notes
                      </h4>
                      <button
                        onClick={() => {
                          setEditingNoteId(null);
                          setNoteInitialValue("");
                          setNoteModalTitle("Add note");
                          setIsNoteModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-brand-pink text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus size={14} /> Add Note
                      </button>
                    </div>

                    {isLoadingNotes ? (
                      <div className="p-4 text-center text-xs text-[#9a99b0]">
                        Loading notes...
                      </div>
                    ) : notesData.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#9a99b0] bg-[#faf9fc] rounded-2xl border border-[#e8e6f0]/60">
                        No internal notes added yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {notesData.map((noteItem) => (
                          <div
                            key={noteItem.id}
                            className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-2 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#1a1a2e]">
                                {noteItem.adminName || "Admin"}
                              </span>
                              <span className="text-[10px] text-[#9a99b0]">
                                {formatDateOnly(noteItem.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-[#5a5a7a] leading-relaxed">
                              {noteItem.note}
                            </p>
                            <div className="flex items-center gap-2 justify-end pt-1">
                              <button
                                onClick={() => {
                                  setEditingNoteId(noteItem.id);
                                  setNoteInitialValue(noteItem.note);
                                  setNoteModalTitle("Edit note");
                                  setIsNoteModalOpen(true);
                                }}
                                className="p-1 hover:bg-[#e8e6f0]/60 text-[#7a7a9a] rounded-md transition-colors cursor-pointer"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  deleteNoteMutation.mutate({
                                    id: noteItem.brandId || brandId!,
                                    noteId: noteItem.id,
                                  });
                                }}
                                className="p-1 hover:bg-red-50 text-red-500 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ACTIONS TAB */}
                {activeTab === "Actions" && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">
                      Account Actions
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => setActiveAction("suspend")}
                        className="p-4 bg-white border border-[#e8e6f0]/60 rounded-2xl flex items-center justify-between hover:bg-[#fef2f2] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center font-bold">
                            <Ban size={18} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#1a1a2e]">
                              Suspend Brand
                            </span>
                            <span className="text-[10px] text-[#9a99b0]">
                              Temporarily freeze advertiser campaigns
                            </span>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveAction("reactivate")}
                        className="p-4 bg-white border border-[#e8e6f0]/60 rounded-2xl flex items-center justify-between hover:bg-[#f0fdf4] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center font-bold">
                            <ShieldCheck size={18} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#1a1a2e]">
                              Reactivate Brand
                            </span>
                            <span className="text-[10px] text-[#9a99b0]">
                              Restore full account privileges
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action confirmation Modal */}
              <BrandActionModal
                action={activeAction}
                onClose={() => setActiveAction(null)}
                onConfirm={() => {
                  if (activeAction === "suspend" && brandId) {
                    suspendBrandMutation.mutate(brandId, {
                      onSuccess: () => {
                        setSuccessModalTitle("Account Suspended");
                        setSuccessModalMessage(
                          "You have successfully suspended this brand account.",
                        );
                        setIsSuccessModalOpen(true);
                      },
                    });
                  } else if (activeAction === "reactivate" && brandId) {
                    reactivateBrandMutation.mutate(brandId, {
                      onSuccess: () => {
                        setSuccessModalTitle("Account Reactivated");
                        setSuccessModalMessage(
                          "You have successfully reactivated this brand account.",
                        );
                        setIsSuccessModalOpen(true);
                      },
                    });
                  } else {
                    setSuccessModalTitle("Action Successful");
                    setSuccessModalMessage(
                      "The requested brand action has completed.",
                    );
                    setIsSuccessModalOpen(true);
                  }
                  setActiveAction(null);
                }}
              />

              {/* Note Modal */}
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
                        id: brandId,
                        noteId: editingNoteId,
                        note: value,
                      });
                    } else {
                      addNoteMutation.mutate({
                        id: brandId,
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
