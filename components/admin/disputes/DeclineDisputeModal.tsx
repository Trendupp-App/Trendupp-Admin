"use client";

import { useState } from "react";
import { XCircle, X } from "lucide-react";

interface DeclineDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  brandName?: string;
  creatorName?: string;
  isLoading?: boolean;
}

export default function DeclineDisputeModal({
  isOpen,
  onClose,
  onConfirm,
  brandName = "Brand",
  creatorName = "Creator",
  isLoading = false,
}: DeclineDisputeModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const trimmed = reason.trim();
  const canSubmit = trimmed.length > 0 && !isLoading;

  const handleClose = () => {
    if (isLoading) return;
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#e8e6f0] flex flex-col items-center text-center gap-4 relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1.5 hover:bg-[#f4f3f6] rounded-xl transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Red Icon */}
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mt-2">
          <XCircle size={26} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-[#1a1a2e]">
            Decline Dispute Request?
          </h3>
          <p className="text-xs text-[#7a7a9a]">
            This closes the request without opening a chat. Both parties will be
            notified with your reason.
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

        {/* Reason */}
        <div className="w-full flex flex-col gap-1 text-left">
          <label className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Reason for declining
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={1000}
            disabled={isLoading}
            placeholder="Explain why this dispute is being declined…"
            className="w-full resize-none rounded-xl border border-[#e8e6f0] bg-white p-3 text-xs text-[#1a1a2e] placeholder:text-[#b6b5c8] focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col w-full gap-2 mt-1">
          <button
            onClick={() => onConfirm(trimmed)}
            disabled={!canSubmit}
            className="h-10 w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Declining..." : "Confirm & Decline"}
          </button>
          <button
            onClick={handleClose}
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
