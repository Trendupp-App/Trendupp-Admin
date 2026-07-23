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

  /* API Hooks */
  const { data: brandData, isLoading: isLoadingDetails } = useBrandDetails(
    brandId,
    isOpen,
  );
  const { data: campaignHistoryData, isLoading: isLoadingCampaigns } =
    useBrandCampaignHistory(brandId, 1, 10, isOpen);
  const { data: notesData = [], isLoading: isLoadingNotes } = useBrandNotes(
    brandId,
    isOpen,
  );

  const addNoteMutation = useAddBrandNote();
  const updateNoteMutation = useUpdateBrandNote();
  const deleteNoteMutation = useDeleteBrandNote();

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

  const brandName =
    header?.brandName ||
    brandDetails?.brandName ||
    profileDetails?.brandName ||
    "Brand Profile";
  const brandEmail = brandDetails?.email || profileDetails?.email || "N/A";
  const brandWebsite =
    header?.websiteUrl ||
    brandDetails?.website ||
    profileDetails?.website ||
    "N/A";
  const brandLogoUrl = header?.logoUrl || null;
  const brandIndustry = header?.industry || profileDetails?.industry || "FMCG";
  const brandStatus = (
    header?.status ||
    brandRepresentative?.accountStatus ||
    profileDetails?.accountStatus ||
    "ACTIVE"
  ).toLowerCase();

  const repName =
    brandRepresentative?.fullName ||
    profileDetails?.representativeName ||
    brandName;
  const repEmail =
    brandRepresentative?.email ||
    profileDetails?.representativeEmail ||
    brandEmail;
  const repPhone =
    brandRepresentative?.phoneNumber ||
    profileDetails?.representativePhone ||
    "N/A";
  const repCompletion =
    brandRepresentative?.profileCompletion ??
    profileDetails?.profileCompletion ??
    0;
  const repJoined =
    brandRepresentative?.dateJoined || profileDetails?.dateJoined || "N/A";

  const monthlyBudgetDisplay = brandDetails?.monthlyBudget
    ? `₦${(brandDetails.monthlyBudget / 1000000).toFixed(1)}M`
    : profileDetails?.monthlyBudget
      ? `₦${(profileDetails.monthlyBudget / 1000000).toFixed(1)}M`
      : "N/A";

  const formatDateOnly = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const displayCampaigns = useMemo(() => {
    if (
      campaignHistoryData?.data &&
      Array.isArray(campaignHistoryData.data) &&
      campaignHistoryData.data.length > 0
    ) {
      return campaignHistoryData.data.map((c) => ({
        id: c.id,
        title: c.campaignTitle || "Campaign Title",
        status: c.status || "ACTIVE",
        budget: c.budget ? `₦${(c.budget / 1000000).toFixed(1)}M` : "₦0",
        spent: c.spentAmount ? `₦${(c.spentAmount / 1000).toFixed(0)}K` : "₦0",
        creators: c.creatorsJoinedCount || 0,
        date: formatDateOnly(c.startDate || c.createdAt),
      }));
    }
    return [];
  }, [campaignHistoryData]);

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
                    {/* Brand Details Card */}
                    <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
                        Brand Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Brand name
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {brandName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Email
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {brandEmail}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Website
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {brandWebsite}
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[#9a99b0] block text-[10px]">
                            Bio
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block leading-relaxed">
                            {brandDetails?.bio || profileDetails?.bio || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Country
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {brandDetails?.country ||
                              profileDetails?.countryOfResidence ||
                              "Nigeria"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            State/City
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {brandDetails?.stateCity ||
                              profileDetails?.state ||
                              profileDetails?.city ||
                              "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Monthly Budget
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {monthlyBudgetDisplay}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider pt-2 border-t border-[#e8e6f0]/40">
                        Brand Representative
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Full name
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {repName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Email
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {repEmail}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Phone Number
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {repPhone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Profile Completion
                          </span>
                          <span className="font-bold text-[#10b981] mt-0.5 block">
                            {repCompletion}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Date Joined
                          </span>
                          <span className="font-bold text-[#1a1a2e] mt-0.5 block">
                            {formatDateOnly(repJoined)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#9a99b0] block text-[10px]">
                            Account Status
                          </span>
                          <div className="mt-0.5">
                            <AdminStatusBadge status={brandStatus} />
                          </div>
                        </div>
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
                    <h4 className="text-xs font-bold text-[#1a1a2e]">
                      Campaign History
                    </h4>
                    {isLoadingCampaigns ? (
                      <div className="p-4 text-center text-xs text-[#9a99b0]">
                        Loading campaign history...
                      </div>
                    ) : (
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
                                    id: brandId,
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
                  setSuccessModalTitle("Action Successful");
                  setSuccessModalMessage(
                    "The requested brand action has completed.",
                  );
                  setIsSuccessModalOpen(true);
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
