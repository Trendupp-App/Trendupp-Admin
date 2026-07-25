"use client";

import {
  GripVertical,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { FaqItem } from "@/types/adminSettings";
import { cn } from "@/lib/utils";

interface FaqAccordionItemProps {
  faq: FaqItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (faq: FaqItem) => void;
  onDelete: (faq: FaqItem) => void;
}

export default function FaqAccordionItem({
  faq,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: FaqAccordionItemProps) {
  const isPublished = (faq.status || "published").toLowerCase() === "published";

  return (
    <div className="bg-white border border-[#f0f0f5] rounded-2xl overflow-hidden transition-all shadow-xs hover:border-[#e2e2ec]">
      {/* Header Row */}
      <div className="p-4 flex items-center justify-between gap-4">
        {/* Left: Drag Handle Grip + Question + Badges */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <GripVertical
            size={16}
            className="text-[#c0c0d0] shrink-0 cursor-grab active:cursor-grabbing"
          />

          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <h3 className="text-xs font-bold text-[#1a1a2e] leading-snug truncate">
              {faq.question}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#eef2ff] text-[#4f46e5] text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize">
                {faq.category}
              </span>

              <span
                className={cn(
                  "text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize",
                  isPublished
                    ? "bg-[#e8f8f0] text-[#1e8e3e]"
                    : "bg-[#fff8e6] text-[#d68910]",
                )}
              >
                {faq.status || "Published"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(faq)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e0e0ea] text-[11px] font-semibold text-[#1a1a2e] hover:bg-[#fafafa] hover:border-brand-pink transition-all cursor-pointer"
          >
            <Pencil size={12} className="text-[#1a1a2e]" />
            Edit
          </button>

          <button
            onClick={() => onDelete(faq)}
            title="Delete FAQ"
            className="p-1.5 text-[#9a99b0] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>

          <button
            onClick={onToggleExpand}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1.5 text-[#9a99b0] hover:bg-[#f0f0f5] rounded-lg transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Answer Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3 border-t border-[#f0f0f5] bg-[#fafafa]/50">
          <p className="text-xs text-[#55556a] leading-relaxed whitespace-pre-wrap">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}
