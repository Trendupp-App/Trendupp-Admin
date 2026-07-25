"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { BannerAdItem } from "@/types/adminAds";

interface DeleteAdModalProps {
  isOpen: boolean;
  ad: BannerAdItem | null;
  onClose: () => void;
  onConfirm: (adId: string) => void;
  isDeleting?: boolean;
}

export default function DeleteAdModal({
  isOpen,
  ad,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteAdModalProps) {
  if (!ad) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm bg-white rounded-2xl p-6 border-0 shadow-xl text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
            <Trash2 size={22} />
          </div>

          <DialogHeader className="text-center items-center">
            <DialogTitle className="text-base font-bold text-[#1a1a2e] text-center">
              Delete Ad?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7a7a9a] mt-1 text-center leading-relaxed">
              This ad will be permanently removed and can no longer be displayed
              to creators.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-3 mt-6 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 rounded-xl border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] py-2.5 hover:bg-[#fafafa]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(ad.id)}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2.5"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
