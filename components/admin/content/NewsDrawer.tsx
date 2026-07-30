"use client";

import { useState, useRef, useEffect } from "react";
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
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { toast } from "sonner";
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

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32"];
const COLOR_PRESETS = [
  "#1a1a2e",
  "#e11d48",
  "#059669",
  "#2563eb",
  "#7c3aed",
  "#d97706",
  "#5a5a7a",
  "#000000",
];

/** Renders saved rich-text HTML with all formatting preserved (bold, italic, lists, links, etc.) */
export function RichTextDisplay({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={cn(
        "text-sm leading-relaxed text-[#1a1a2e] font-medium",
        // Lists
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
        "[&_li]:my-0.5",
        // Inline text
        "[&_b]:font-bold [&_strong]:font-bold",
        "[&_i]:italic [&_em]:italic",
        "[&_u]:underline",
        "[&_s]:line-through [&_strike]:line-through",
        // Links — open in new tab styles
        "[&_a]:text-brand-pink [&_a]:underline [&_a]:font-semibold [&_a]:cursor-pointer [&_a]:hover:opacity-80",
        // Paragraphs / line breaks
        "[&_p]:mb-2",
        "[&_br]:block",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [fontSize, setFontSize] = useState("14");
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>(
    {},
  );

  // Seed the editor on initial mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync when an article is loaded externally (edit mode)
  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const updateActiveFormats = () => {
    if (typeof document === "undefined") return;
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikeThrough"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      alignLeft: document.queryCommandState("justifyLeft"),
      alignCenter: document.queryCommandState("justifyCenter"),
      alignRight: document.queryCommandState("justifyRight"),
    });
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const exec = (command: string, val: string | null = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val ?? undefined);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const handleLink = () => {
    // Capture current selection BEFORE the popover opens (button has onMouseDown preventDefault so focus stays)
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    } else {
      savedRangeRef.current = null;
    }
    setLinkUrl("https://");
    setShowLinkPopover(true);
    // Focus the URL input on next tick
    setTimeout(() => linkInputRef.current?.focus(), 50);
  };

  const applyLink = () => {
    let url = linkUrl.trim();
    if (!url || url === "https://") return;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    if (editorRef.current) {
      editorRef.current.focus();
      // Restore the saved selection so createLink operates on the right text
      const sel = window.getSelection();
      if (savedRangeRef.current && sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      document.execCommand("createLink", false, url);
      // Make all created links open in new tab
      editorRef.current.querySelectorAll("a").forEach((a) => {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      });
      onChange(editorRef.current.innerHTML);
    }
    setShowLinkPopover(false);
    setLinkUrl("https://");
    savedRangeRef.current = null;
    updateActiveFormats();
  };

  const cancelLink = () => {
    setShowLinkPopover(false);
    setLinkUrl("https://");
    savedRangeRef.current = null;
  };

  const handleFontSize = (sz: string) => {
    setFontSize(sz);
    setShowFontSizeDropdown(false);
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const span = document.createElement("span");
      span.style.fontSize = `${sz}px`;
      const range = selection.getRangeAt(0);
      try {
        range.surroundContents(span);
      } catch {
        document.execCommand("fontSize", false, "3");
      }
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    } else {
      document.execCommand("fontSize", false, "3");
    }
  };

  const handleColor = (color: string) => {
    exec("foreColor", color);
    setShowColorPicker(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const toolbar = (
    <div className="border-b border-[#e8e6f0] px-3.5 py-2.5 bg-[#faf9fc] flex flex-wrap gap-1.5 items-center text-[#5a5a7a] relative shrink-0">
      {(
        [
          {
            cmd: "bold",
            icon: <Bold size={14} />,
            active: activeFormats.bold,
            title: "Bold",
          },
          {
            cmd: "italic",
            icon: <Italic size={14} />,
            active: activeFormats.italic,
            title: "Italic",
          },
          {
            cmd: "underline",
            icon: <Underline size={14} />,
            active: activeFormats.underline,
            title: "Underline",
          },
          {
            cmd: "strikeThrough",
            icon: <Strikethrough size={14} />,
            active: activeFormats.strikethrough,
            title: "Strikethrough",
          },
        ] as {
          cmd: string;
          icon: React.ReactNode;
          active: boolean;
          title: string;
        }[]
      ).map(({ cmd, icon, active, title }) => (
        <button
          key={cmd}
          type="button"
          title={title}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec(cmd)}
          className={cn(
            "p-1.5 rounded-lg transition-colors cursor-pointer",
            active
              ? "bg-brand-pink text-white"
              : "hover:bg-[#e8e6f0] hover:text-[#1a1a2e]",
          )}
        >
          {icon}
        </button>
      ))}

      <div className="w-px h-4 bg-[#e8e6f0] mx-1 self-center" />

      {/* Link with inline popover */}
      <div className="relative">
        <button
          type="button"
          title="Insert Link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          className={cn(
            "p-1.5 rounded-lg transition-colors cursor-pointer",
            showLinkPopover
              ? "bg-brand-pink text-white"
              : "hover:bg-[#e8e6f0] hover:text-[#1a1a2e]",
          )}
        >
          <LinkIcon size={14} />
        </button>

        {showLinkPopover && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#e8e6f0] rounded-xl shadow-xl p-3 w-72 flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-[#5a5a7a] uppercase tracking-wide">
              Insert hyperlink
            </p>
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") cancelLink();
              }}
              placeholder="https://example.com"
              className="w-full text-xs px-3 py-2 border border-[#e8e6f0] rounded-lg focus:outline-none focus:border-brand-pink text-[#1a1a2e] font-medium"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={cancelLink}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="text-xs px-3 py-1.5 rounded-lg bg-brand-pink text-white hover:opacity-90 transition-opacity font-semibold"
              >
                Apply Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bullet list */}
      <button
        type="button"
        title="Bullet List"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => exec("insertUnorderedList")}
        className={cn(
          "p-1.5 rounded-lg transition-colors cursor-pointer",
          activeFormats.unorderedList
            ? "bg-brand-pink text-white"
            : "hover:bg-[#e8e6f0] hover:text-[#1a1a2e]",
        )}
      >
        <List size={14} />
      </button>

      {/* Numbered list */}
      <button
        type="button"
        title="Numbered List"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => exec("insertOrderedList")}
        className={cn(
          "p-1.5 rounded-lg transition-colors cursor-pointer",
          activeFormats.orderedList
            ? "bg-brand-pink text-white"
            : "hover:bg-[#e8e6f0] hover:text-[#1a1a2e]",
        )}
      >
        <ListOrdered size={14} />
      </button>

      <div className="w-px h-4 bg-[#e8e6f0] mx-1 self-center" />

      {/* Alignment */}
      {(
        [
          {
            cmd: "justifyLeft",
            icon: <AlignLeft size={14} />,
            active: activeFormats.alignLeft,
            title: "Align Left",
          },
          {
            cmd: "justifyCenter",
            icon: <AlignCenter size={14} />,
            active: activeFormats.alignCenter,
            title: "Align Center",
          },
          {
            cmd: "justifyRight",
            icon: <AlignRight size={14} />,
            active: activeFormats.alignRight,
            title: "Align Right",
          },
        ] as {
          cmd: string;
          icon: React.ReactNode;
          active: boolean;
          title: string;
        }[]
      ).map(({ cmd, icon, active, title }) => (
        <button
          key={cmd}
          type="button"
          title={title}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec(cmd)}
          className={cn(
            "p-1.5 rounded-lg transition-colors cursor-pointer",
            active
              ? "bg-brand-pink text-white"
              : "hover:bg-[#e8e6f0] hover:text-[#1a1a2e]",
          )}
        >
          {icon}
        </button>
      ))}

      <div className="w-px h-4 bg-[#e8e6f0] mx-1 self-center" />

      {/* Font Size */}
      <div className="relative">
        <button
          type="button"
          title="Font Size"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowFontSizeDropdown((p) => !p)}
          className="flex items-center gap-1 text-xs font-bold text-[#5a5a7a] hover:text-[#1a1a2e] px-2 py-1 hover:bg-[#e8e6f0] rounded-lg cursor-pointer transition-colors"
        >
          <span>{fontSize}</span>
          <Type size={12} />
        </button>
        {showFontSizeDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#e8e6f0] rounded-xl shadow-lg py-1.5 z-50 min-w-[70px] text-xs">
            {FONT_SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSize(sz)}
                className={cn(
                  "w-full text-left px-3 py-1 font-bold hover:bg-[#faf9fc] cursor-pointer",
                  fontSize === sz
                    ? "text-brand-pink bg-rose-50/50"
                    : "text-[#1a1a2e]",
                )}
              >
                {sz}px
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className="relative">
        <button
          type="button"
          title="Text Color"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowColorPicker((p) => !p)}
          className="p-1.5 rounded-lg hover:bg-[#e8e6f0] hover:text-[#1a1a2e] transition-colors cursor-pointer"
        >
          <Palette size={14} />
        </button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#e8e6f0] rounded-xl shadow-lg p-2 z-50 grid grid-cols-4 gap-1.5 w-32">
            {COLOR_PRESETS.map((col) => (
              <button
                key={col}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleColor(col)}
                style={{ backgroundColor: col }}
                className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Toggle */}
      <button
        type="button"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}
        className="p-1.5 rounded-lg hover:bg-[#e8e6f0] hover:text-[#1a1a2e] transition-colors cursor-pointer ml-auto"
      >
        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    </div>
  );

  const editorBody = (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyUp={updateActiveFormats}
      onMouseUp={updateActiveFormats}
      onBlur={handleInput}
      data-placeholder={placeholder || "Write article content here..."}
      className={cn(
        "flex-1 p-4 text-xs font-medium text-[#1a1a2e] focus:outline-none overflow-y-auto leading-relaxed min-h-[160px]",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
        "[&_li]:my-0.5 [&_a]:text-brand-pink [&_a]:underline [&_a]:font-bold",
        isFullscreen
          ? "max-h-[calc(100vh-110px)] text-sm p-6"
          : "max-h-[400px]",
      )}
    />
  );

  return (
    <>
      {/* Fullscreen backdrop — rendered in-tree, no Portal needed */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          onClick={toggleFullscreen}
        />
      )}
      <div
        className={cn(
          "border border-[#e8e6f0] bg-white overflow-hidden flex flex-col",
          isFullscreen
            ? "fixed inset-4 z-[9999] shadow-2xl border-brand-pink/60 rounded-3xl"
            : "rounded-2xl min-h-[240px]",
        )}
      >
        {toolbar}
        {editorBody}
      </div>
    </>
  );
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
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(article?.tags) ? article.tags.join(", ") : "",
  );
  const [status, setStatus] = useState<string>(
    (article?.status || "draft").toLowerCase(),
  );

  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setCoverUrl("");
    toast.success("Image selected for upload");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverFile(null);
    setCoverUrl("");
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = (customStatus?: "published" | "draft") => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const finalStatus = customStatus || status || "draft";
    const plainTextBody = bodyContent.replace(/<[^>]*>/g, "").trim();
    const summaryText =
      plainTextBody.slice(0, 150) + (plainTextBody.length > 150 ? "..." : "");

    const dto: CreateNewsDto = {
      title: title.trim(),
      summary: summaryText || title.trim(),
      content: bodyContent || `<p>${title.trim()}</p>`,
      category,
      status: finalStatus,
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative min-h-[140px] overflow-hidden",
            isDragging
              ? "border-brand-pink bg-rose-50/50 scale-[0.99]"
              : "border-[#e8e6f0] bg-white hover:border-brand-pink/40",
          )}
        >
          {previewImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-2">
                <span className="text-white text-xs font-bold bg-brand-pink px-3 py-1.5 rounded-lg shadow-md">
                  Change Photo
                </span>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-white text-xs font-bold bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg shadow-md cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isDragging
                    ? "bg-brand-pink text-white"
                    : "bg-[#f4f3f6] text-[#7a7a9a]",
                )}
              >
                <ImageIcon size={18} />
              </div>
              <span className="text-[11px] font-bold text-[#1a1a2e]">
                {isDragging
                  ? "Drop your image file here"
                  : "Drag & drop image here"}
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
          <RichTextEditor
            value={bodyContent}
            onChange={setBodyContent}
            placeholder="Write article content here..."
          />
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
