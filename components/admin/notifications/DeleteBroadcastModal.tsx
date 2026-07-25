"use client";

import { AlertTriangle } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface DeleteBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  isDeleting?: boolean;
}

export default function DeleteBroadcastModal({
  isOpen,
  onClose,
  onConfirm,
  title = "this broadcast",
  isDeleting = false,
}: DeleteBroadcastModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-[400px] bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Delete Broadcast Announcement?
            </h3>
            <p className="text-xs text-[#7a7a9a] leading-relaxed">
              Are you sure you want to delete &quot;{title}&quot;? This action
              cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 h-11 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 h-11 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Broadcast"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
