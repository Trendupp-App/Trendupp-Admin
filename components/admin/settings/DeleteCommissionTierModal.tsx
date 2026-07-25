"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CommissionTier } from "@/types/adminSettings";

interface DeleteCommissionTierModalProps {
  isOpen: boolean;
  tier: CommissionTier | null;
  onClose: () => void;
  onConfirm: (tierId: string) => void;
  isDeleting?: boolean;
}

export default function DeleteCommissionTierModal({
  isOpen,
  tier,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteCommissionTierModalProps) {
  if (!tier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#1a1a2e]">
            Delete Commission Tier
          </DialogTitle>
          <DialogDescription className="text-xs text-[#7a7a9a] mt-1.5 leading-relaxed">
            Are you sure you want to delete the tier &ldquo;
            <span className="font-semibold text-[#1a1a2e]">{tier.name}</span>
            &rdquo;? Brands assigned to this tier will revert to the default
            platform commission rate.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] px-5 py-2.5 hover:bg-[#fafafa]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(tier.id)}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5"
          >
            {isDeleting ? "Deleting..." : "Delete Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
