"use client";
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useRef } from "react";
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

export interface NewsArticle {
  id: number;
  title: string;
  brand: string;
  brandAvatar?: string;
  publishedAt: string;
  readTime: string;
  category:
    "Industry" | "Platform Update" | "Brands" | "Tips" | "Announcements";
  image: string;
  summary: string;
  content: string;
  tags: string[];
  fullStoryUrl: string;
  status: "Published" | "Draft" | "Archived";
  views: number;
  authorName?: string;
}

interface NewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: NewsArticle) => void;
  article: NewsArticle | null;
}

export default function NewsDrawer({
  isOpen,
  onClose,
  onSave,
  article,
}: NewsDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<NewsArticle["category"]>("Industry");
  const [source, setSource] = useState("Trendupp Africa");
  const [authorName, setAuthorName] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Initialize/reset form when article changes or opens
  useEffect(() => {
    if (isOpen) {
      if (article) {
        setTitle(article.title);
        setCategory(article.category);
        setSource(article.brand);
        setAuthorName(article.authorName || "");
        setCoverUrl(article.image.startsWith("blob:") ? "" : article.image);
        setPreviewImage(article.image);
        setBodyContent(article.content);
        setTagsInput(article.tags.join(", "));
        setStatus(article.status === "Published" ? "Published" : "Draft");
      } else {
        setTitle("");
        setCategory("Industry");
        setSource("Trendupp Africa");
        setAuthorName("");
        setCoverUrl("");
        setPreviewImage(null);
        setBodyContent("");
        setTagsInput("");
        setStatus("Draft");
      }
    }
  }, [isOpen, article]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setCoverUrl(""); // Clear URL input if file is chosen
  };

  const handleSave = (customStatus?: "Published" | "Draft") => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const finalStatus = customStatus || status;

    const savedArticle: NewsArticle = {
      id: article ? article.id : Date.now(),
      title: title.trim(),
      brand: source.trim() || "Trendupp Africa",
      brandAvatar: (source.trim() || "Trendupp")[0].toUpperCase(),
      publishedAt: article ? article.publishedAt : "Just now",
      readTime: `${Math.max(1, Math.ceil(bodyContent.split(/\s+/).length / 200))} min read`,
      category,
      image: previewImage || coverUrl || "/dashboard/tiktok_news_banner.png",
      summary:
        bodyContent.slice(0, 150) + (bodyContent.length > 150 ? "..." : ""),
      content: bodyContent,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      fullStoryUrl: "#",
      status: finalStatus,
      views: article ? article.views : 0,
      authorName: authorName.trim(),
    };

    onSave(savedArticle);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Drawer panel */}
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
                onChange={(e) =>
                  setCategory(e.target.value as NewsArticle["category"])
                }
                className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e] cursor-pointer"
              >
                <option value="Industry">Industry</option>
                <option value="Platform Update">Platform Update</option>
                <option value="Brands">Brands</option>
                <option value="Tips">Tips</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>

            {/* Source */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                Source
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
                Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g Ikechukwu Nwe..."
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
                    (jpeg, jpg, png, webp file extensions, there should be limit
                    of image size 5mb)
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Article Body
                </label>
                <div className="w-4 h-4 text-[#7a7a9a] cursor-pointer hover:text-[#1a1a2e] flex items-center justify-center">
                  <span className="text-[10px] font-bold border border-[#7a7a9a]/40 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    i
                  </span>
                </div>
              </div>

              {/* Editor Shell */}
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
                  onClick={() => setStatus("Draft")}
                  className={cn(
                    "flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer",
                    status === "Draft"
                      ? "border-[#d97706] bg-[#fffbeb] text-[#d97706]"
                      : "border-[#e8e6f0] bg-white text-[#7a7a9a] hover:bg-[#faf9fc]",
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Published")}
                  className={cn(
                    "flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer",
                    status === "Published"
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
              onClick={() => handleSave("Draft")}
              className="flex-1 h-11 border border-brand-pink text-brand-pink hover:bg-brand-pink/5 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave("Published")}
              className="flex-1 h-11 bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Publish Article
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
