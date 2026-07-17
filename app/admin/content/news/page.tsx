"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import {
  Plus,
  Search,
  GripVertical,
  Pencil,
  Archive,
  Trash2,
  RotateCcw,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import NewsDrawer, { NewsArticle } from "@/components/admin/content/NewsDrawer";

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 1,
    title: "TikTok Nigeria launches creator fund — ₦500M available for Q3",
    brand: "Trendupp Africa",
    publishedAt: "2h ago",
    readTime: "4 min read",
    category: "Industry",
    image: "/dashboard/tiktok_news_banner.png",
    summary: "TikTok has officially announced a ₦500 million creator fund...",
    content:
      "TikTok has officially announced a ₦500 million creator fund targeted exclusively at Nigerian content creators for the third quarter of 2026. The announcement, made at a press event in Lagos, marks the platform's most significant investment in the Nigerian creator economy to date.",
    tags: ["TikTok", "Creator Fund", "Nigeria", "Monetization"],
    fullStoryUrl: "#",
    status: "Published",
    views: 4200,
  },
  {
    id: 2,
    title: "Instagram Collab posts now monetisable in Nigeria",
    brand: "Trendupp Africa",
    publishedAt: "5h ago",
    readTime: "3 min read",
    category: "Platform Update",
    image: "/dashboard/tiktok_news_banner.png",
    summary:
      "Meta has expanded its Instagram Collab post monetization features...",
    content:
      "Meta has expanded its Instagram Collab post monetization features to eligible creators based in Nigeria, allowing shared revenue from advertising and brand deals directly inside the app.",
    tags: ["Instagram", "Meta", "Collab"],
    fullStoryUrl: "#",
    status: "Published",
    views: 2800,
  },
  {
    id: 3,
    title: "Top 10 Nigerian brands increasing influencer budgets in 2026",
    brand: "Trendupp Africa",
    publishedAt: "1d ago",
    readTime: "6 min read",
    category: "Brands",
    image: "/dashboard/tiktok_news_banner.png",
    summary:
      "A new Trendupp market report highlights the top FMCG and fintech companies...",
    content:
      "A new Trendupp market report highlights the top fast-moving consumer goods (FMCG) and fintech companies in Nigeria that are pivoting more ad spend into creator partnerships.",
    tags: ["Brands", "Budgets", "Marketing"],
    fullStoryUrl: "#",
    status: "Published",
    views: 8100,
  },
  {
    id: 4,
    title: "How Macro creators are 3x-ing their income",
    brand: "Trendupp Africa",
    publishedAt: "Never",
    readTime: "5 min read",
    category: "Tips",
    image: "/dashboard/tiktok_news_banner.png",
    summary:
      "Re-purposing long-form content into vertical snippets is the highest-leverage strategy...",
    content:
      "Re-purposing long-form content into vertical snippets is the highest-leverage strategy for content creators looking to maximize brand exposure and income streams.",
    tags: ["Tips", "Syndication", "Income"],
    fullStoryUrl: "#",
    status: "Draft",
    views: 0,
  },
  {
    id: 5,
    title: "Trendupp Platform Updates — June 2026",
    brand: "Trendupp Africa",
    publishedAt: "2d ago",
    readTime: "8 min read",
    category: "Announcements",
    image: "/dashboard/tiktok_news_banner.png",
    summary:
      "Celebrate creative excellence across Nigeria's online creator community...",
    content:
      "The annual Trendupp Awards celebrating creative excellence across Nigeria's online creator community is officially open for nominations across 15 distinct categories.",
    tags: ["Awards", "Nominations", "Platform"],
    fullStoryUrl: "#",
    status: "Published",
    views: 12000,
  },
];

const CATEGORY_COLORS: Record<NewsArticle["category"], string> = {
  Industry: "text-[#2563eb] bg-[#eff6ff]",
  "Platform Update": "text-[#2563eb] bg-[#eff6ff]",
  Brands: "text-[#7c3aed] bg-[#f5f3ff]",
  Tips: "text-[#059669] bg-[#ecfdf5]",
  Announcements: "text-[#7c3aed] bg-[#f5f3ff]",
};

export default function TrenduppNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [activeTab, setActiveTab] = useState<
    "All" | "Published" | "Draft" | "Archived"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer & Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);

  // Drag and drop sorting state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Calculate totals
  const totalArticles = articles.length;
  const publishedCount = articles.filter(
    (a) => a.status === "Published",
  ).length;
  const draftCount = articles.filter((a) => a.status === "Draft").length;
  const archivedCount = articles.filter((a) => a.status === "Archived").length;

  // Filter list
  const filteredArticles = articles.filter((article) => {
    // Tab filter
    if (activeTab === "Published" && article.status !== "Published")
      return false;
    if (activeTab === "Draft" && article.status !== "Draft") return false;
    if (activeTab === "Archived" && article.status !== "Archived") return false;
    if (activeTab !== "All" && activeTab !== "Archived" && article.status === "Archived") return false;

    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchCategory = article.category.toLowerCase().includes(q);
      const matchTags = article.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchTags;
    }

    return true;
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const draggedId = filteredArticles[draggedIndex]?.id;
    const targetId = filteredArticles[index]?.id;
    if (draggedId == null || targetId == null) return;

    const updated = [...articles];
    const from = updated.findIndex((a) => a.id === draggedId);
    const to = updated.findIndex((a) => a.id === targetId);
    if (from === -1 || to === -1) return;

    const [draggedItem] = updated.splice(from, 1);
    updated.splice(to, 0, draggedItem);
    setDraggedIndex(null);
    setArticles(updated);
  };

  const handleSaveArticle = (saved: NewsArticle) => {
    if (editingArticle) {
      setArticles((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
      setEditingArticle(null);
    } else {
      setArticles((prev) => [saved, ...prev]);
    }
  };

  const handleArchiveToggle = (id: number) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: a.status === "Archived" ? "Draft" : "Archived",
          };
        }
        return a;
      }),
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(".0", "") + "K";
    return num.toString();
  };

  return (
    <div className="p-6 flex flex-col gap-6 select-none text-left">
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
        <button
          onClick={() => setActiveTab("Archived")}
          className={cn(
            "h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "Archived"
              ? "bg-brand-pink text-white"
              : "bg-white border border-[#e8e6f0] text-[#7a7a9a] hover:bg-[#faf9fc]",
          )}
        >
          Archived{" "}
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              activeTab === "Archived"
                ? "bg-white/20 text-white"
                : "bg-[#f4f3f6] text-[#7a7a9a]",
            )}
          >
            {archivedCount}
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
        {filteredArticles.length === 0 ? (
          <div className="border border-dashed border-[#e8e6f0] rounded-[24px] bg-white p-12 flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-bold text-[#7a7a9a]">
              No articles found
            </span>
            <span className="text-[10px] font-medium text-[#9a99b0]">
              Try adjusting your search query or filters.
            </span>
          </div>
        ) : (
          filteredArticles.map((article, idx) => (
            <div
              key={article.id}
              draggable={activeTab === "All"}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className={cn(
                "border border-[#e8e6f0]/60 rounded-3xl p-4 flex items-center gap-4 bg-white transition-all",
                draggedIndex === idx
                  ? "opacity-40 scale-[0.98] border-brand-pink/30"
                  : "hover:border-brand-pink/20",
              )}
            >
              {/* Drag handle */}
              {activeTab === "All" && (
                <div className="cursor-grab text-[#c4c2d4] hover:text-[#9a99b0] shrink-0 p-1">
                  <GripVertical size={16} />
                </div>
              )}

              {/* Cover Thumbnail */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 relative flex items-center justify-center">
                <img
                  src={article.image}
                  alt={article.title}
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
                    {article.category}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1",
                      article.status === "Published"
                        ? "text-[#16a34a] bg-[#f0fdf4]"
                        : article.status === "Draft"
                          ? "text-[#d97706] bg-[#fffbeb]"
                          : "text-[#4b5563] bg-[#f3f4f6]",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full",
                        article.status === "Published"
                          ? "bg-[#16a34a]"
                          : article.status === "Draft"
                            ? "bg-[#d97706]"
                            : "bg-[#4b5563]",
                      )}
                    />
                    {article.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#1a1a2e] leading-snug line-clamp-1">
                  {article.title}
                </h3>

                <div className="text-[10px] font-semibold text-[#9a99b0] flex items-center gap-1.5 flex-wrap">
                  <span>{article.brand}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
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
                  onClick={() => handleArchiveToggle(article.id)}
                  className="p-2 text-[#7a7a9a] hover:text-[#1a1a2e] hover:bg-[#f4f3f6] rounded-xl transition-colors cursor-pointer"
                  title={article.status === "Archived" ? "Restore" : "Archive"}
                >
                  {article.status === "Archived" ? (
                    <RotateCcw size={14} />
                  ) : (
                    <Archive size={14} />
                  )}
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
          ))
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
                  className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="h-10 rounded-xl bg-[#dc2626] text-white text-xs font-bold hover:bg-[#b91c1c] cursor-pointer"
                >
                  Delete
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
      />
    </div>
  );
}
