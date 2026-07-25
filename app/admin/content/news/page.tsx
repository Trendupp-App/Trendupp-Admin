"use client";

import { useState, useMemo } from "react";
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

export default function TrenduppNewsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Published" | "Draft">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

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

  // Calculate totals
  const totalArticles = articles.length;
  const publishedCount = articles.filter(
    (a) => (a.status || "").toLowerCase() === "published",
  ).length;
  const draftCount = articles.filter(
    (a) => (a.status || "").toLowerCase() === "draft",
  ).length;

  // Filter list
  const filteredArticles = articles.filter((article) => {
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
      return matchTitle || matchCategory || matchTags;
    }

    return true;
  });

  const handleSaveArticle = (
    savedData: CreateNewsDto,
    customStatus?: "published" | "draft",
  ) => {
    const payload = {
      ...savedData,
      status: customStatus || savedData.status || "draft",
    };

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

      {/* Tabs list */}
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
          filteredArticles.map((article) => {
            const statusLower = (article.status || "draft").toLowerCase();

            return (
              <div
                key={article.id}
                className="border border-[#e8e6f0]/60 rounded-3xl p-4 flex items-center gap-4 bg-white transition-all hover:border-brand-pink/20"
              >
                {/* Drag handle */}
                {activeTab === "All" && (
                  <div className="cursor-grab text-[#c4c2d4] hover:text-[#9a99b0] shrink-0 p-1">
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
                          : "text-[#d97706] bg-[#fffbeb]",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1 h-1 rounded-full",
                          statusLower === "published"
                            ? "bg-[#16a34a]"
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
                    onClick={() => {
                      setEditingArticle(article);
                      setIsDrawerOpen(true);
                    }}
                    className="p-2 text-[#7a7a9a] hover:text-[#1a1a2e] hover:bg-[#f4f3f6] rounded-xl transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(article)}
                    className="p-2 text-[#7a7a9a] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-xl transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
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
