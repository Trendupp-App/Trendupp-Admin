"use client";

import { useState, useRef } from "react";
import {
  X,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import type { AdminNewsItem, CreateNewsDto } from "@/types/adminNews";

export interface NewsArticle extends AdminNewsItem {
  brand?: string;
  brandAvatar?: string;
  readTime?: string;
  fullStoryUrl?: string;
}

interface NewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    articleData: CreateNewsDto,
    customStatus?: "published" | "draft",
  ) => void;
  article: AdminNewsItem | null;
  isSaving?: boolean;
}

function NewsDrawerFormInner({
  article,
  onClose,
  onSave,
  isSaving = false,
}: Omit<NewsDrawerProps, "isOpen">) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState(article?.title || "");
  const [category, setCategory] = useState(article?.category || "Industry");
  const [source, setSource] = useState(article?.brand || "Trendupp Africa");
  const [authorName, setAuthorName] = useState(article?.authorName || "");
  const [coverUrl, setCoverUrl] = useState(
    article?.coverImage || article?.image || "",
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    article?.coverImage || article?.image || null,
  );
  const [bodyContent, setBodyContent] = useState(article?.content || "");
  const [summaryInput, setSummaryInput] = useState(article?.summary || "");
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(article?.tags) ? article.tags.join(", ") : "",
  );
  const [status, setStatus] = useState<string>(
    (article?.status || "draft").toLowerCase(),
  );

  const [isPlatformUpdate, setIsPlatformUpdate] = useState<boolean>(
    article?.isPlatformUpdate ?? true,
  );
  const [isTopNews, setIsTopNews] = useState<boolean>(
    article?.isTopNews ?? false,
  );
  const [industryId, setIndustryId] = useState<string>(
    article?.industryId || "",
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setCoverUrl("");
  };

  const handleSave = (customStatus?: "published" | "draft") => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const finalStatus = customStatus || status || "draft";
    const summaryText =
      summaryInput.trim() ||
      bodyContent.slice(0, 150) + (bodyContent.length > 150 ? "..." : "");

    const dto: CreateNewsDto = {
      title: title.trim(),
      summary: summaryText,
      content: bodyContent || `<p>${title.trim()}</p>`,
      category,
      status: finalStatus,
      isPlatformUpdate,
      isTopNews,
      industryId: industryId.trim() || undefined,
      coverImage: coverFile || coverUrl || null,
      brand: source.trim() || "Trendupp Africa",
      authorName: authorName.trim(),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onSave(dto, customStatus);
  };

  return (
    <div className="relative z-10 w-full max-w-[560px] h-full bg-[#faf9fc] shadow-2xl flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8e6f0]/60 px-6 py-5 shrink-0 bg-white">
        <h3 className="text-base font-bold text-[#1a1a2e]">
          {article ? "Edit Article" : "Publish New Article"}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-left select-none">
        {/* Article Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Article Title *
          </label>
          <input
            type="text"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e] cursor-pointer"
          >
            <option value="Industry">Industry</option>
            <option value="Platform Update">Platform Update</option>
            <option value="Brands">Brands</option>
            <option value="Tips">Tips</option>
            <option value="Announcements">Announcements</option>
          </select>
        </div>

        {/* Feature Checkboxes */}
        <div className="flex items-center gap-6 py-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#1a1a2e] cursor-pointer">
            <input
              type="checkbox"
              checked={isPlatformUpdate}
              onChange={(e) => setIsPlatformUpdate(e.target.checked)}
              className="accent-brand-pink rounded"
            />
            Platform Update
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#1a1a2e] cursor-pointer">
            <input
              type="checkbox"
              checked={isTopNews}
              onChange={(e) => setIsTopNews(e.target.checked)}
              className="accent-brand-pink rounded"
            />
            Top News
          </label>
        </div>

        {/* Source */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Source / Brand
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Trendupp Africa"
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        {/* Author Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Author Name
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Ikechukwu Nwe..."
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        {/* Industry ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Industry ID (Optional)
          </label>
          <input
            type="text"
            value={industryId}
            onChange={(e) => setIndustryId(e.target.value)}
            placeholder="e.g. uuid-of-industry"
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        {/* Summary Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Summary
          </label>
          <input
            type="text"
            value={summaryInput}
            onChange={(e) => setSummaryInput(e.target.value)}
            placeholder="A brief summary of the news..."
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        {/* Cover Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Cover Image URL
          </label>
          <input
            type="text"
            value={coverUrl}
            onChange={(e) => {
              setCoverUrl(e.target.value);
              setCoverFile(null);
              if (e.target.value.trim()) setPreviewImage(e.target.value);
            }}
            placeholder="https://..."
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        <div className="text-center text-[10px] font-bold text-[#9a99b0] uppercase">
          OR
        </div>

        {/* Drag and drop image */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#e8e6f0] bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-pink/40 transition-colors relative min-h-[140px] overflow-hidden"
        >
          {previewImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold bg-brand-pink px-3 py-1.5 rounded-lg shadow-md">
                  Change Photo
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#7a7a9a]">
                <ImageIcon size={18} />
              </div>
              <span className="text-[11px] font-bold text-[#1a1a2e]">
                Drag & drop image here
              </span>
              <span className="text-[9px] font-medium text-[#7a7a9a] text-center px-4">
                (jpeg, jpg, png, webp file extensions up to 5MB)
              </span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Article Body */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Article Body Content
          </label>
          <div className="border border-[#e8e6f0] rounded-2xl bg-white overflow-hidden flex flex-col min-h-[220px]">
            {/* Toolbar */}
            <div className="border-b border-[#e8e6f0] px-3.5 py-2.5 bg-[#faf9fc] flex flex-wrap gap-2.5 items-center text-[#5a5a7a]">
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <Underline size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <Strikethrough size={13} />
              </button>
              <div className="w-px h-3.5 bg-[#e8e6f0] self-center" />
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <LinkIcon size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <List size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <ListOrdered size={13} />
              </button>
              <div className="w-px h-3.5 bg-[#e8e6f0] self-center" />
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <AlignLeft size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <AlignCenter size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <AlignRight size={13} />
              </button>
              <div className="w-px h-3.5 bg-[#e8e6f0] self-center" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#5a5a7a] hover:text-[#1a1a2e] px-1 hover:bg-[#e8e6f0] rounded cursor-pointer h-5">
                <span>14</span>
                <Type size={11} />
              </div>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <Palette size={13} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#e8e6f0] hover:text-[#1a1a2e] cursor-pointer ml-auto"
              >
                <Maximize2 size={13} />
              </button>
            </div>
            {/* Textarea */}
            <textarea
              placeholder="Write article content here..."
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="flex-1 w-full p-4 text-xs font-medium text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none resize-none min-h-[160px] leading-relaxed"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. TikTok, Creator Fund, Nigeria"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
          />
        </div>

        {/* Status Radio Toggles */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
            Status
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStatus("draft")}
              className={cn(
                "flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer",
                status === "draft"
                  ? "border-[#d97706] bg-[#fffbeb] text-[#d97706]"
                  : "border-[#e8e6f0] bg-white text-[#7a7a9a] hover:bg-[#faf9fc]",
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus("published")}
              className={cn(
                "flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer",
                status === "published"
                  ? "border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]"
                  : "border-[#e8e6f0] bg-white text-[#7a7a9a] hover:bg-[#faf9fc]",
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              Publish Immediately
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Sticky Footer */}
      <div className="border-t border-[#e8e6f0]/60 p-6 flex gap-4 bg-white shrink-0">
        <button
          type="button"
          onClick={() => handleSave("draft")}
          disabled={isSaving}
          className="flex-1 h-11 border border-brand-pink text-brand-pink hover:bg-brand-pink/5 text-xs font-bold rounded-xl transition-all cursor-pointer text-center disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave("published")}
          disabled={isSaving}
          className="flex-1 h-11 bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Publish Article"}
        </button>
      </div>
    </div>
  );
}

export default function NewsDrawer({
  isOpen,
  onClose,
  onSave,
  article,
  isSaving = false,
}: NewsDrawerProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={onClose}
        />

        <NewsDrawerFormInner
          key={article?.id || "new"}
          article={article}
          onClose={onClose}
          onSave={onSave}
          isSaving={isSaving}
        />
      </div>
    </Portal>
  );
}
