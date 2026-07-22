"use client";

import { CheckCircle2, X } from "lucide-react";

interface ActivateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  brandName?: string;
  creatorName?: string;
  isLoading?: boolean;
}

export default function ActivateChatModal({
  isOpen,
  onClose,
  onConfirm,
  brandName = "Brand",
  creatorName = "Creator",
  isLoading = false,
}: ActivateChatModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#e8e6f0] flex flex-col items-center text-center gap-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 hover:bg-[#f4f3f6] rounded-xl transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Green Check Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-2">
          <CheckCircle2 size={26} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-[#1a1a2e]">
            Activate Three-Way Chat?
          </h3>
          <p className="text-xs text-[#7a7a9a]">
            You are about to open a three-way chat between:
          </p>
        </div>

        {/* Parties Box */}
        <div className="w-full bg-[#f8f7fa] rounded-2xl p-4 border border-[#e8e6f0]/80 flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              BRAND
            </span>
            <span className="font-bold text-[#1a1a2e]">{brandName}</span>
          </div>
          <div className="h-[1px] bg-[#e8e6f0]/60 w-full" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              CREATOR
            </span>
            <span className="font-bold text-[#1a1a2e]">{creatorName}</span>
          </div>
        </div>

        <p className="text-[11px] text-[#9a99b0] italic">
          Both parties will be notified immediately.
        </p>

        {/* Buttons */}
        <div className="flex flex-col w-full gap-2 mt-1">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="h-10 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? "Activating..." : "Confirm & Open Chat"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="h-9 w-full bg-white hover:bg-[#f4f3f6] text-[#5a5a7a] text-xs font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
