"use client";

import { useState } from "react";
import { X, AlertTriangle, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

export type BrandAction = "suspend" | "reactivate" | "ban";

interface BrandActionModalProps {
  action: BrandAction | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting?: boolean;
}

const CONFIG: Record<
  BrandAction,
  {
    title: string;
    warning: string;
    warningColor: string;
    inputLabel: string;
    inputPlaceholder: string;
    confirmText: string;
    confirmClass: string;
    // Confirmation only — the endpoint takes no reason.
    noInput?: boolean;
  }
> = {
  suspend: {
    title: "Suspend Account",
    warning: "The brand will lose platform access immediately upon suspension.",
    warningColor: "bg-[#fff7ed] border-[#fde68a] text-[#92400e]",
    inputLabel: "Reason for suspension *",
    inputPlaceholder: "Describe the reason for this action...",
    confirmText: "Confirm Suspend",
    confirmClass: "bg-brand-pink text-white hover:opacity-90",
  },
  reactivate: {
    title: "Reactivate Account",
    warning: "Brand will regain full platform access upon confirmation.",
    warningColor: "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]",
    inputLabel: "",
    inputPlaceholder: "",
    confirmText: "Reactivate Account",
    confirmClass: "bg-[#16a34a] hover:bg-[#15803d] text-white",
    noInput: true,
  },
  ban: {
    title: "Ban Account",
    warning:
      "This is permanent. The brand will lose access to the platform and cannot be reactivated.",
    warningColor: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
    inputLabel: "Reason for Ban *",
    inputPlaceholder: "Describe the violation that led to this ban...",
    confirmText: "Permanently Ban",
    confirmClass:
      "bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:opacity-40 disabled:cursor-not-allowed",
  },
};

export default function BrandActionModal({
  action,
  onClose,
  onConfirm,
  isSubmitting = false,
}: BrandActionModalProps) {
  const [val, setVal] = useState("");
  if (!action) return null;

  const cfg = CONFIG[action];
  const isBan = action === "ban";
  const ready = cfg.noInput || val.trim().length > 0;

  const handleClose = () => {
    setVal("");
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={handleClose}
        />
        <div className="relative z-10 w-full max-w-[380px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8e6f0]/40">
            <div className="flex items-center gap-2.5">
              {isBan ? (
                <div className="w-7 h-7 rounded-full bg-[#fee2e2] flex items-center justify-center">
                  <ShieldX size={13} className="text-[#dc2626]" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#fff7ed] flex items-center justify-center">
                  <AlertTriangle size={13} className="text-[#f59e0b]" />
                </div>
              )}
              <span className="text-[15px] font-bold text-[#1a1a2e]">
                {cfg.title}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4 text-left">
            <div
              className={cn(
                "flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs font-medium leading-relaxed",
                cfg.warningColor,
              )}
            >
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              {cfg.warning}
            </div>

            {!cfg.noInput && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#5a5a7a] uppercase tracking-wider">
                  {cfg.inputLabel}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder={cfg.inputPlaceholder}
                  className="h-9.5 px-4 rounded-xl border border-[#e8e6f0] text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                onClick={handleClose}
                className="px-4.5 h-9 text-xs font-bold text-[#7a7a9a] hover:bg-[#f4f3f6] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm(val.trim());
                  handleClose();
                }}
                disabled={!ready || isSubmitting}
                className={cn(
                  "px-4.5 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer",
                  cfg.confirmClass,
                )}
              >
                {cfg.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
