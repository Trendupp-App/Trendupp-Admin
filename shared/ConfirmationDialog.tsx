"use client";

import { type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: LucideIcon;
  iconColor?: string;
  message: React.ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ConfirmActionDialog({
  open,
  onOpenChange,
  icon: Icon,
  iconColor = "text-amber-500",
  message,
  cancelLabel = "No, go back",
  confirmLabel,
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmActionDialogProps) {
  const borderColor = iconColor.replace("text-", "border-");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] flex flex-col items-center text-center gap-5 py-10">
        <DialogHeader className="sr-only">
          <DialogTitle>Confirm action</DialogTitle>
        </DialogHeader>

        <div
          className={cn(
            "w-16 h-16 rounded-full border-2 flex items-center justify-center shrink-0",
            borderColor,
          )}
        >
          <Icon size={28} strokeWidth={2} className={iconColor} />
        </div>

        <p className="text-base text-[#1a1a2e] leading-relaxed max-w-[340px]">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full mt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl text-sm font-light bg-[#f4f3f8] text-[#1a1a2e] hover:bg-[#ece9f4] transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-pink text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
