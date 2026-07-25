"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import AdSummaryCards from "./AdSummaryCards";
import BannerAdCard from "./BannerAdCard";
import AddEditAdSheet from "./AddEditAdSheet";
import DeleteAdModal from "./DeleteAdModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdSummary,
  useAdminAds,
  useCreateAd,
  useUpdateAd,
  useDeleteAd,
} from "@/hooks/useAdminAds";
import type { BannerAdItem, CreateAdDto } from "@/types/adminAds";

const DEFAULT_SAMPLE_ADS: BannerAdItem[] = [
  {
    id: "79f451f4-9dff-413c-844b-95048513839d",
    title: "Creator Workshop Series — Register Now",
    adType: "Banner",
    targetAudience: ["All Creators"],
    placement: ["Home Page"],
    adImageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    linkUrl: "https://trendupp.com/workshops",
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2026-06-30T23:59:59.000Z",
    status: "active",
    impressions: 48200,
    clicks: 3100,
    ctr: "6.5%",
  },
  {
    id: "ad-2",
    title: "Trendupp Premium Creator Badge",
    adType: "Announcement",
    targetAudience: ["All Creators"],
    placement: ["Home Page", "Explore"],
    adImageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    linkUrl: "https://trendupp.com/premium",
    startDate: "2026-06-05T00:00:00.000Z",
    endDate: "2026-07-05T23:59:59.000Z",
    status: "active",
    impressions: 32100,
    clicks: 2900,
    ctr: "8.9%",
  },
  {
    id: "ad-3",
    title: "New Brand Partners Q3 2026",
    adType: "Sponsored",
    targetAudience: ["Micro", "Macro"],
    placement: ["Home Page"],
    adImageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
    linkUrl: "https://trendupp.com/partners",
    startDate: "2026-07-01T00:00:00.000Z",
    endDate: "2026-08-31T23:59:59.000Z",
    status: "scheduled",
    impressions: 0,
    clicks: 0,
    ctr: "0%",
  },
  {
    id: "ad-4",
    title: "Content Creator Bootcamp",
    adType: "Banner",
    targetAudience: ["Nano", "Micro"],
    placement: ["Explore"],
    adImageUrl:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop",
    linkUrl: "https://trendupp.com/bootcamp",
    startDate: "2026-05-15T00:00:00.000Z",
    endDate: "2026-06-15T23:59:59.000Z",
    status: "paused",
    impressions: 12400,
    clicks: 840,
    ctr: "6.8%",
  },
];

export default function BannerAdsView() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<BannerAdItem | null>(null);
  const [deletingAd, setDeletingAd] = useState<BannerAdItem | null>(null);

  const { data: summary, isLoading: isSummaryLoading } = useAdSummary();
  const { data: ads = [], isLoading: isAdsLoading } = useAdminAds();

  const createMutation = useCreateAd();
  const updateMutation = useUpdateAd();
  const deleteMutation = useDeleteAd();

  const displayAds = useMemo(() => {
    if (process.env.NODE_ENV === "development" && ads.length === 0) {
      return DEFAULT_SAMPLE_ADS;
    }
    return ads;
  }, [ads]);

  const handleOpenAddSheet = () => {
    setEditingAd(null);
    setIsSheetOpen(true);
  };

  const handleOpenEditSheet = (ad: BannerAdItem) => {
    setEditingAd(ad);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingAd(null);
  };

  const handleToggleStatus = (ad: BannerAdItem) => {
    const isPaused = (ad.status || "").toLowerCase() === "paused";
    const newStatus = isPaused ? "active" : "paused";
    updateMutation.mutate({
      id: ad.id,
      data: { status: newStatus },
    });
  };

  const handleFormSubmit = (
    formData: CreateAdDto,
    statusAction?: "published" | "draft",
  ) => {
    const payload = {
      ...formData,
      status: statusAction === "draft" ? "draft" : formData.status || "active",
    };

    if (editingAd) {
      updateMutation.mutate(
        { id: editingAd.id, data: payload },
        {
          onSuccess: () => {
            handleCloseSheet();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          handleCloseSheet();
        },
      });
    }
  };

  const handleConfirmDelete = (adId: string) => {
    deleteMutation.mutate(adId, {
      onSuccess: () => {
        setDeletingAd(null);
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Banner Ads</h1>
      </div>

      {/* Ad Management Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1a1a2e]">Ad Management</h2>
          <span className="text-xs text-[#7a7a9a]">
            {displayAds.length} {displayAds.length === 1 ? "ad" : "ads"} total
          </span>
        </div>

        <button
          onClick={handleOpenAddSheet}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create New Ad
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <AdSummaryCards
        summary={summary}
        ads={displayAds}
        isLoading={isSummaryLoading}
      />

      {/* Ads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {isAdsLoading ? (
          <>
            <Skeleton className="h-[380px] w-full rounded-2xl" />
            <Skeleton className="h-[380px] w-full rounded-2xl" />
            <Skeleton className="h-[380px] w-full rounded-2xl" />
            <Skeleton className="h-[380px] w-full rounded-2xl" />
          </>
        ) : displayAds.length === 0 ? (
          <div className="col-span-full bg-white border border-[#f0f0f5] rounded-2xl p-12 text-center text-xs text-[#7a7a9a]">
            No banner ads found. Click &quot;Create New Ad&quot; to get started.
          </div>
        ) : (
          displayAds.map((ad) => (
            <BannerAdCard
              key={ad.id}
              ad={ad}
              onEdit={handleOpenEditSheet}
              onToggleStatus={handleToggleStatus}
              onDelete={(a) => setDeletingAd(a)}
            />
          ))
        )}
      </div>

      {/* Add / Edit Sheet Drawer */}
      <AddEditAdSheet
        isOpen={isSheetOpen}
        ad={editingAd}
        onClose={handleCloseSheet}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAdModal
        isOpen={!!deletingAd}
        ad={deletingAd}
        onClose={() => setDeletingAd(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
