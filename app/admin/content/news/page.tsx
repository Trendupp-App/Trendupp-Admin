"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Search,
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import NewsDrawer from "@/components/admin/content/NewsDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDateRangeBar } from "@/components/admin/creators/CardDateRangeBar";
import {
  useAdminNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from "@/hooks/useAdminNews";
import type { AdminNewsItem, CreateNewsDto } from "@/types/adminNews";

const CATEGORY_COLORS: Record<string, string> = {
  Industry: "text-[#2563eb] bg-[#eff6ff]",
  "Platform Update": "text-[#2563eb] bg-[#eff6ff]",
  Brands: "text-[#7c3aed] bg-[#f5f3ff]",
  Tips: "text-[#059669] bg-[#ecfdf5]",
  Announcements: "text-[#7c3aed] bg-[#f5f3ff]",
};

// ── Sortable Article Row ──────────────────────────────────────────────────────
function SortableArticleRow({
  article,
  isDragEnabled,
  formatNumber,
  onEdit,
  onDelete,
}: {
  article: AdminNewsItem;
  isDragEnabled: boolean;
  formatNumber: (n?: number) => string;
  onEdit: (a: AdminNewsItem) => void;
  onDelete: (a: AdminNewsItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const statusLower = (article.status || "draft").toLowerCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-[#e8e6f0]/60 rounded-3xl p-4 flex items-center gap-4 bg-white transition-all",
        isDragging
          ? "shadow-xl border-brand-pink/30 scale-[1.01]"
          : "hover:border-brand-pink/20",
      )}
    >
      {/* Drag handle */}
      {isDragEnabled && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#c4c2d4] hover:text-brand-pink shrink-0 p-1 touch-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Cover Thumbnail */}
      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 relative flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            article.coverImage ||
            article.image ||
            "/dashboard/tiktok_news_banner.png"
          }
          alt={article.title || "News Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article details */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0",
              CATEGORY_COLORS[article.category] ||
                "text-[#7a7a9a] bg-[#f4f3f6]",
            )}
          >
            {article.category || "General"}
          </span>
          <span
            className={cn(
              "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1",
              statusLower === "published"
                ? "text-[#16a34a] bg-[#f0fdf4]"
                : statusLower === "scheduled"
                  ? "text-[#2563eb] bg-[#eff6ff]"
                  : "text-[#d97706] bg-[#fffbeb]",
            )}
          >
            <span
              className={cn(
                "w-1 h-1 rounded-full",
                statusLower === "published"
                  ? "bg-[#16a34a]"
                  : statusLower === "scheduled"
                    ? "bg-[#2563eb]"
                    : "bg-[#d97706]",
              )}
            />
            {article.status || "Draft"}
          </span>
        </div>

        <h3 className="text-xs font-bold text-[#1a1a2e] leading-snug line-clamp-1">
          {article.title}
        </h3>

        <div className="text-[10px] font-semibold text-[#9a99b0] flex items-center gap-1.5 flex-wrap">
          <span>{article.brand || "Trendupp Africa"}</span>
          <span>•</span>
          <span>{article.publishedAt || "Recently"}</span>
        </div>
      </div>

      {/* Views stats */}
      <div className="hidden sm:flex items-center gap-1 text-[#9a99b0] text-[10px] font-bold shrink-0 px-4">
        <Eye size={12} />
        <span>{formatNumber(article.views)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(article)}
          className="p-2 text-[#7a7a9a] hover:text-[#1a1a2e] hover:bg-[#f4f3f6] rounded-xl transition-colors cursor-pointer"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(article)}
          className="p-2 text-[#7a7a9a] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-xl transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function TrenduppNewsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Published" | "Draft">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Drawer & Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<AdminNewsItem | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminNewsItem | null>(null);

  // React Query hooks
  const { data: newsItems = [], isLoading } = useAdminNews();
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const articles = useMemo(() => {
    return Array.isArray(newsItems) ? newsItems : [];
  }, [newsItems]);

  // Persistent custom drag order stored in state & localStorage
  const [customOrderIds, setCustomOrderIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("trendupp_admin_news_order");
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  const orderedArticles = useMemo(() => {
    if (!articles.length) return [];
    if (!customOrderIds.length) return articles;

    return [...articles].sort((a, b) => {
      const indexA = customOrderIds.indexOf(a.id);
      const indexB = customOrderIds.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [articles, customOrderIds]);

  // DnD sensors — 8px activation distance to avoid accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // Calculate totals
  const totalArticles = articles.length;
  const publishedCount = articles.filter(
    (a) => (a.status || "").toLowerCase() === "published",
  ).length;
  const draftCount = articles.filter(
    (a) => (a.status || "").toLowerCase() === "draft",
  ).length;

  // Filter list — operates on ordered array
  const filteredArticles = orderedArticles.filter((article) => {
    const statusLower = (article.status || "").toLowerCase();

    if (activeTab === "Published" && statusLower !== "published") return false;
    if (activeTab === "Draft" && statusLower !== "draft") return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = (article.title || "").toLowerCase().includes(q);
      const matchCategory = (article.category || "").toLowerCase().includes(q);
      const matchTags = Array.isArray(article.tags)
        ? article.tags.some((t) => t.toLowerCase().includes(q))
        : false;
      if (!matchTitle && !matchCategory && !matchTags) return false;
    }

    const articleDateStr =
      article.publishedAt || article.createdAt || article.updatedAt;
    if (fromDate && articleDateStr) {
      const articleTime = new Date(articleDateStr).getTime();
      const fromTime = new Date(fromDate).getTime();
      if (!isNaN(articleTime) && !isNaN(fromTime) && articleTime < fromTime) {
        return false;
      }
    }

    if (toDate && articleDateStr) {
      const articleTime = new Date(articleDateStr).getTime();
      const toTime = new Date(toDate).setHours(23, 59, 59, 999);
      if (!isNaN(articleTime) && !isNaN(toTime) && articleTime > toTime) {
        return false;
      }
    }

    return true;
  });

  // Drag-and-drop is only available on the "All" tab with no active filters
  const isDragEnabled =
    activeTab === "All" &&
    searchQuery.trim() === "" &&
    fromDate === "" &&
    toDate === "";

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const currentIds = orderedArticles.map((a) => a.id);
    const oldIndex = currentIds.indexOf(String(active.id));
    const newIndex = currentIds.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = arrayMove(currentIds, oldIndex, newIndex);
    setCustomOrderIds(newIds);
    try {
      localStorage.setItem("trendupp_admin_news_order", JSON.stringify(newIds));
    } catch {
      // storage quota fallback
    }
  }

  const handleSaveArticle = (
    savedData: CreateNewsDto,
    customStatus: "published" | "draft" | "scheduled",
    scheduledAt?: string,
  ) => {
    const payload = { ...savedData, status: customStatus, scheduledAt };

    if (editingArticle) {
      updateMutation.mutate(
        { id: editingArticle.id, data: payload },
        {
          onSuccess: () => {
            setIsDrawerOpen(false);
            setEditingArticle(null);
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDrawerOpen(false);
          setEditingArticle(null);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(".0", "") + "K";
    return num.toString();
  };

  const activeArticle = activeId
    ? orderedArticles.find((a) => a.id === activeId)
    : null;

  return (
    <div className="p-6 flex flex-col gap-6 select-none text-left min-h-screen bg-[#fafafa]">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1a1a2e]">News Management</h2>
          <span className="text-xs font-semibold text-[#7a7a9a]">
            {totalArticles} articles total
          </span>
        </div>
        <button
          onClick={() => {
            setEditingArticle(null);
            setIsDrawerOpen(true);
          }}
          className="h-10 bg-brand-pink text-white hover:opacity-90 transition-opacity rounded-xl px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          Publish New Article
        </button>
      </div>

      {/* Tabs & Custom Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setActiveTab("All")}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              activeTab === "All"
                ? "bg-brand-pink text-white"
                : "bg-white border border-[#e8e6f0] text-[#7a7a9a] hover:bg-[#faf9fc]",
            )}
          >
            All{" "}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "All"
                  ? "bg-white/20 text-white"
                  : "bg-[#f4f3f6] text-[#7a7a9a]",
              )}
            >
              {totalArticles}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("Published")}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              activeTab === "Published"
                ? "bg-brand-pink text-white"
                : "bg-white border border-[#e8e6f0] text-[#7a7a9a] hover:bg-[#faf9fc]",
            )}
          >
            Published{" "}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "Published"
                  ? "bg-white/20 text-white"
                  : "bg-[#f4f3f6] text-[#7a7a9a]",
              )}
            >
              {publishedCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("Draft")}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              activeTab === "Draft"
                ? "bg-brand-pink text-white"
                : "bg-white border border-[#e8e6f0] text-[#7a7a9a] hover:bg-[#faf9fc]",
            )}
          >
            Draft{" "}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "Draft"
                  ? "bg-white/20 text-white"
                  : "bg-[#f4f3f6] text-[#7a7a9a]",
              )}
            >
              {draftCount}
            </span>
          </button>
        </div>

        {/* Custom From/To Date Filter */}
        <CardDateRangeBar
          onDateChange={(from, to) => {
            setFromDate(from);
            setToDate(to);
          }}
        />
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99b0]"
        />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 w-full bg-white border border-[#e8e6f0] rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
        />
      </div>

      {/* Drag hint — only shown when drag is enabled */}
      {isDragEnabled && filteredArticles.length > 1 && (
        <p className="text-[10px] font-semibold text-[#9a99b0] flex items-center gap-1.5">
          <GripVertical size={12} className="text-[#c4c2d4]" />
          Drag the handle to reorder articles
        </p>
      )}

      {/* Articles List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="border border-dashed border-[#e8e6f0] rounded-[24px] bg-white p-12 flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-bold text-[#7a7a9a]">
              No articles found
            </span>
            <span className="text-[10px] font-medium text-[#9a99b0]">
              Click &quot;Publish New Article&quot; to create your first news
              article.
            </span>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredArticles.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {filteredArticles.map((article) => (
                  <SortableArticleRow
                    key={article.id}
                    article={article}
                    isDragEnabled={isDragEnabled}
                    formatNumber={formatNumber}
                    onEdit={(a) => {
                      setEditingArticle(a);
                      setIsDrawerOpen(true);
                    }}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag Overlay — ghost card while dragging */}
            <DragOverlay>
              {activeArticle ? (
                <div className="border border-brand-pink/40 rounded-3xl p-4 flex items-center gap-4 bg-white shadow-2xl opacity-95">
                  <div className="cursor-grabbing text-brand-pink shrink-0 p-1">
                    <GripVertical size={16} />
                  </div>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        activeArticle.coverImage ||
                        activeArticle.image ||
                        "/dashboard/tiktok_news_banner.png"
                      }
                      alt={activeArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1a1a2e] line-clamp-1">
                      {activeArticle.title}
                    </p>
                    <p className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
                      {activeArticle.brand || "Trendupp Africa"}
                    </p>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setDeleteTarget(null)}
            />
            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-[360px] bg-white rounded-[32px] p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fee2e2]">
                <AlertTriangle size={20} className="text-[#dc2626]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-[#1a1a2e]">
                  Delete Article?
                </h3>
                <p className="text-xs text-[#7a7a9a] leading-relaxed">
                  This action cannot be undone. The article will be permanently
                  removed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteMutation.isPending}
                  className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteMutation.isPending}
                  className="h-10 rounded-xl bg-[#dc2626] text-white text-xs font-bold hover:bg-[#b91c1c] cursor-pointer disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* News Form Drawer */}
      <NewsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveArticle}
        article={editingArticle}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
