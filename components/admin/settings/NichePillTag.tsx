"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { CreatorNiche } from "@/types/adminSettings";

interface NichePillTagProps {
  niche: CreatorNiche;
  onEdit: (niche: CreatorNiche) => void;
  onDelete: (niche: CreatorNiche) => void;
}

export default function NichePillTag({
  niche,
  onEdit,
  onDelete,
}: NichePillTagProps) {
  return (
    <div className="bg-[#f8f8fa] border border-[#e8e8f0] px-3.5 py-2 rounded-full text-xs font-semibold text-[#1a1a2e] inline-flex items-center gap-2 transition-all hover:bg-white hover:border-[#d0d0dc] hover:shadow-xs">
      <span>{niche.name}</span>
      <div className="flex items-center gap-1.5 ml-1">
        <button
          onClick={() => onEdit(niche)}
          title="Edit niche"
          className="text-[#9a99b0] hover:text-brand-pink transition-colors cursor-pointer"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(niche)}
          title="Delete niche"
          className="text-[#9a99b0] hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
