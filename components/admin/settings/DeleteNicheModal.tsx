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
import type { CreatorNiche } from "@/types/adminSettings";

interface DeleteNicheModalProps {
  isOpen: boolean;
  niche: CreatorNiche | null;
  onClose: () => void;
  onConfirm: (nicheId: string) => void;
  isDeleting?: boolean;
  /** Noun used in all copy — "Niche" (default), "Industry", "Category", ... */
  entityLabel?: string;
  /** Consequence sentence after "Are you sure...?" */
  warning?: string;
}

export default function DeleteNicheModal({
  isOpen,
  niche,
  onClose,
  onConfirm,
  isDeleting = false,
  entityLabel = "Niche",
  warning = "This action will remove it from creator onboarding options.",
}: DeleteNicheModalProps) {
  if (!niche) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#1a1a2e]">
            Delete {entityLabel}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#7a7a9a] mt-1.5 leading-relaxed">
            Are you sure you want to delete the {entityLabel.toLowerCase()}{" "}
            &ldquo;
            <span className="font-semibold text-[#1a1a2e]">{niche.name}</span>
            &rdquo;? {warning}
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
            onClick={() => onConfirm(niche.id)}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5"
          >
            {isDeleting ? "Deleting..." : `Delete ${entityLabel}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
