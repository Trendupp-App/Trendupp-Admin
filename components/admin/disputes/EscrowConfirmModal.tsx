"use client";

import { Info, X } from "lucide-react";

export type EscrowActionType =
  "release_to_creator" | "refund_to_brand" | "split";

interface EscrowConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: EscrowActionType | null;
  isLoading?: boolean;
}

export default function EscrowConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  isLoading = false,
}: EscrowConfirmModalProps) {
  if (!isOpen || !actionType) return null;

  let title = "Release to creator";
  let promptText = "Are you sure you want to release funds to creator?";
  let confirmBtnText = "Yes, release";
  let confirmBtnBg = "bg-emerald-500 hover:bg-emerald-600";

  if (actionType === "refund_to_brand") {
    title = "Return to brand";
    promptText = "Are you sure you want to return funds to brand?";
    confirmBtnText = "Yes, return";
    confirmBtnBg = "bg-rose-500 hover:bg-rose-600";
  } else if (actionType === "split") {
    title = "50/50 Split Escrow";
    promptText =
      "Are you sure you want to split funds 50/50 between Brand and Creator?";
    confirmBtnText = "Yes, split";
    confirmBtnBg = "bg-amber-500 hover:bg-amber-600";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#e8e6f0] flex flex-col items-center text-center gap-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 hover:bg-[#f4f3f6] rounded-xl transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Yellow Info Icon */}
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mt-2">
          <Info size={24} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-[#1a1a2e]">{title}</h3>
          <p className="text-xs text-[#7a7a9a]">{promptText}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center w-full gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-9 bg-white hover:bg-[#f4f3f6] text-[#5a5a7a] text-xs font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 h-9 ${confirmBtnBg} text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50`}
          >
            {isLoading ? "Processing..." : confirmBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}
