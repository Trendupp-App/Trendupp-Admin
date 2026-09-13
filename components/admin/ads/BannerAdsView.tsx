"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import AdSummaryCards from "./AdSummaryCards";
import BannerAdCard from "./BannerAdCard";
import AddEditAdSheet from "./AddEditAdSheet";
import DeleteAdModal from "./DeleteAdModal";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermission } from "@/hooks/usePermission";
import {
  useAdSummary,
  useAdminAds,
  useCreateAd,
  useUpdateAd,
  useDeleteAd,
  useArchiveAd,
  useUnarchiveAd,
} from "@/hooks/useAdminAds";
import type { BannerAdItem, CreateAdDto } from "@/types/adminAds";

function SortableBannerAdCard({
  ad,
  onEdit,
  onToggleStatus,
  onArchive,
  onDelete,
}: {
  ad: BannerAdItem;
  onEdit: (ad: BannerAdItem) => void;
  onToggleStatus: (ad: BannerAdItem) => void;
  onArchive: (ad: BannerAdItem) => void;
  onDelete: (ad: BannerAdItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(ad.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BannerAdCard
        ad={ad}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onArchive={onArchive}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function BannerAdsView() {
  const canCreate = usePermission("ads.create");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<BannerAdItem | null>(null);
  const [deletingAd, setDeletingAd] = useState<BannerAdItem | null>(null);

  // Persistent custom order stored in state & localStorage
  const [customOrderIds, setCustomOrderIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("trendupp_admin_banner_ads_order");
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const { data: summary, isLoading: isSummaryLoading } = useAdSummary();
  const { data: ads = [], isLoading: isAdsLoading } = useAdminAds();

  const createMutation = useCreateAd();
  const updateMutation = useUpdateAd();
  const deleteMutation = useDeleteAd();
  const archiveMutation = useArchiveAd();
  const unarchiveMutation = useUnarchiveAd();

  const archivedCount = useMemo(
    () =>
      ads.filter((a) => (a.status || "").toLowerCase() === "archived").length,
    [ads],
  );

  const displayAds = useMemo(() => {
    if (!ads.length) return [];

    const visible = showArchived
      ? ads
      : ads.filter((a) => (a.status || "").toLowerCase() !== "archived");

    if (!customOrderIds.length) return visible;

    return [...visible].sort((a, b) => {
      const indexA = customOrderIds.indexOf(String(a.id));
      const indexB = customOrderIds.indexOf(String(b.id));
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return -1;
      if (indexB === -1) return 1;
      return indexA - indexB;
    });
  }, [ads, customOrderIds, showArchived]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const currentIds = displayAds.map((a) => String(a.id));
    const oldIndex = currentIds.indexOf(String(active.id));
    const newIndex = currentIds.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = arrayMove(currentIds, oldIndex, newIndex);
    setCustomOrderIds(newIds);
    try {
      localStorage.setItem(
        "trendupp_admin_banner_ads_order",
        JSON.stringify(newIds),
      );
    } catch {
      // ignore storage quota error
    }
  }

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

  const handleArchive = (ad: BannerAdItem) => {
    if ((ad.status || "").toLowerCase() === "archived") {
      unarchiveMutation.mutate(ad.id);
    } else {
      archiveMutation.mutate(ad.id);
    }
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
        onSuccess: (res: BannerAdItem | { data?: BannerAdItem }) => {
          const newAd =
            "data" in res && res.data ? res.data : (res as BannerAdItem);
          if (newAd?.id) {
            setCustomOrderIds((prev) => {
              const updated = [
                newAd.id,
                ...prev.filter((id) => id !== newAd.id),
              ];
              try {
                localStorage.setItem(
                  "trendupp_admin_banner_ads_order",
                  JSON.stringify(updated),
                );
              } catch {
                // ignore
              }
              return updated;
            });
          }
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

  const activeAdObj = activeId
    ? displayAds.find((a) => a.id === activeId)
    : null;

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

        <div className="flex items-center gap-2.5">
          {(archivedCount > 0 || showArchived) && (
            <button
              onClick={() => setShowArchived((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                showArchived
                  ? "bg-[#eef2ff] border-[#c7d2fe] text-[#4f46e5]"
                  : "bg-white border-[#e8e6f0] text-[#7a7a9a] hover:bg-[#faf9fc]",
              )}
            >
              <Archive size={14} />
              {showArchived ? "Hide archived" : `Archived (${archivedCount})`}
            </button>
          )}

          {canCreate && (
            <button
              onClick={handleOpenAddSheet}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <AdSummaryCards
        summary={summary}
        ads={displayAds}
        isLoading={isSummaryLoading}
      />

      {/* Drag hint */}
      {displayAds.length > 1 && (
        <p className="text-[10px] font-semibold text-[#9a99b0] flex items-center gap-1.5 mt-1">
          <GripVertical size={12} className="text-[#c4c2d4]" />
          Drag the handle on any card to reorder ads
        </p>
      )}

      {/* Ads Grid */}
      <div className="mt-1">
        {isAdsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[380px] w-full rounded-2xl" />
            <Skeleton className="h-[380px] w-full rounded-2xl" />
            <Skeleton className="h-[380px] w-full rounded-2xl" />
            <Skeleton className="h-[380px] w-full rounded-2xl" />
          </div>
        ) : displayAds.length === 0 ? (
          <div className="bg-white border border-[#f0f0f5] rounded-2xl p-12 text-center text-xs text-[#7a7a9a]">
            No banner ads found. Click &quot;Create New Ad&quot; to get started.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayAds.map((a) => a.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayAds.map((ad) => (
                  <SortableBannerAdCard
                    key={ad.id}
                    ad={ad}
                    onEdit={handleOpenEditSheet}
                    onToggleStatus={handleToggleStatus}
                    onArchive={handleArchive}
                    onDelete={(a) => setDeletingAd(a)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeAdObj ? (
                <div className="opacity-95 shadow-2xl scale-[1.02] border-2 border-brand-pink/50 rounded-2xl overflow-hidden bg-white">
                  <BannerAdCard
                    ad={activeAdObj}
                    onEdit={() => {}}
                    onToggleStatus={() => {}}
                    onArchive={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
