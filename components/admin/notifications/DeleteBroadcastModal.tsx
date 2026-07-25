"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface DeleteBroadcastModalProps {
  broadcastTitle?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CONFIRM_PHRASE = "i want to delete";

export default function DeleteBroadcastModal({
  broadcastTitle,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteBroadcastModalProps) {
  const [confirmText, setConfirmText] = useState("");

  const isMatch = confirmText.trim().toLowerCase() === CONFIRM_PHRASE;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 text-left">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center border border-[#fecaca] shrink-0">
              <AlertTriangle size={20} />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Delete broadcast
            </h3>
            <p className="text-xs text-[#7a7a9a] leading-relaxed">
              {broadcastTitle ? (
                <>
                  This will permanently delete{" "}
                  <strong className="text-[#1a1a2e]">
                    &ldquo;{broadcastTitle}&rdquo;
                  </strong>
                  . This action cannot be undone.
                </>
              ) : (
                "This action cannot be undone."
              )}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
              Type &ldquo;{CONFIRM_PHRASE}&rdquo; to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoComplete="off"
              className="w-full h-10 rounded-xl border border-[#e8e6f0] px-3.5 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-[#dc2626]/30 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-1">
            <button
              onClick={onClose}
              className="px-4.5 py-2 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!isMatch || isDeleting}
              onClick={onConfirm}
              className="px-4.5 py-2 bg-[#dc2626] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete broadcast"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
