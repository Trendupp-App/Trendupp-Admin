"use client";

import { useState } from "react";
import { X, AlertTriangle, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

type ActionType =
  "suspend" | "suspendCampaign" | "reactivate" | "delete" | "changeTier";

interface CreatorActionModalProps {
  action: ActionType | null;
  onClose: () => void;
  onConfirm?: () => void;
}

const CONFIG: Record<
  ActionType,
  {
    title: string;
    warning: string;
    warningColor: string;
    inputLabel: string;
    inputPlaceholder: string;
    confirmText: string;
    confirmClass: string;
    requiresConfirmWord?: string;
  }
> = {
  suspend: {
    title: "Suspend Account",
    warning:
      "This action will restrict platform access immediately until a re-review.",
    warningColor: "bg-[#fff7ed] border-[#fde68a] text-[#92400e]",
    inputLabel: "Reason for Suspension *",
    inputPlaceholder: "Search for the reason for this action...",
    confirmText: "Continue Suspend",
    confirmClass: "bg-[#ea580c] hover:bg-[#c2410c] text-white",
  },
  suspendCampaign: {
    title: "Suspend Campaign Access",
    warning:
      "This will prevent the creator from accessing or joining any campaigns.",
    warningColor: "bg-[#fff7ed] border-[#fde68a] text-[#92400e]",
    inputLabel: "Reason for Suspension *",
    inputPlaceholder: "Search for the reason for this action...",
    confirmText: "Continue Suspend",
    confirmClass: "bg-[#ea580c] hover:bg-[#c2410c] text-white",
  },
  reactivate: {
    title: "Reactivate Account",
    warning: "Creator will regain full platform access upon confirmation.",
    warningColor: "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]",
    inputLabel: "Reason for Reactivation *",
    inputPlaceholder: "Enter the reason for reactivating this account...",
    confirmText: "Reactivate Account",
    confirmClass: "bg-[#16a34a] hover:bg-[#15803d] text-white",
  },
  delete: {
    title: "Delete Account",
    warning:
      "This is irreversible. All creator jobs, campaigns, and history within our community deleted.",
    warningColor: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
    inputLabel: "Type DELETE to confirm",
    inputPlaceholder: "DELETE",
    confirmText: "Permanently Delete",
    confirmClass:
      "bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:opacity-40 disabled:cursor-not-allowed",
    requiresConfirmWord: "DELETE",
  },
  changeTier: {
    title: "Change Creator Tier",
    warning: "",
    warningColor: "",
    inputLabel: "Select New Tier",
    inputPlaceholder: "Choose a tier...",
    confirmText: "Update Tier",
    confirmClass:
      "bg-brand-pink hover:opacity-90 text-white disabled:opacity-40 disabled:cursor-not-allowed",
  },
};

export default function CreatorActionModal({
  action,
  onClose,
  onConfirm,
}: CreatorActionModalProps) {
  const [inputValue, setInputValue] = useState("");

  if (!action) return null;

  const cfg = CONFIG[action];
  const isDelete = action === "delete";
  const isChangeTier = action === "changeTier";
  const deleteReady = isDelete && inputValue === "DELETE";
  const canSubmit = isDelete ? deleteReady : inputValue.trim().length > 0;

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-[380px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8e6f0]/40">
            <div className="flex items-center gap-2.5">
              {!isChangeTier &&
                (isDelete ? (
                  <div className="w-7 h-7 rounded-full bg-[#fee2e2] flex items-center justify-center">
                    <Trash2 size={13} className="text-[#dc2626]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#fff7ed] flex items-center justify-center">
                    <AlertTriangle size={13} className="text-[#f59e0b]" />
                  </div>
                ))}
              <span className="text-[15px] font-bold text-[#1a1a2e]">
                {cfg.title}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          {isChangeTier ? (
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Plain description text */}
              <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed">
                Update the creator&apos;s classification level on the platform.
              </p>

              {/* Current Tier box */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#f4f3f6]/40 border border-[#e8e6f0]/50 rounded-2xl">
                <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Current Tier
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#e0e7ff]">
                  Micro
                </span>
              </div>

              {/* Select Dropdown */}
              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-xs font-bold text-[#1a1a2e]">
                  {cfg.inputLabel}
                </label>
                <div className="relative">
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-10 w-full pl-4 pr-10 rounded-xl border border-[#e8e6f0] text-xs text-[#1a1a2e] bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink/30 appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Choose a tier...</option>
                    <option value="Nano">Nano</option>
                    <option value="Micro">Micro</option>
                    <option value="Macro">Macro</option>
                    <option value="Mega">Mega</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Warning box */}
              <div
                className={cn(
                  "flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs font-medium leading-relaxed",
                  cfg.warningColor,
                )}
              >
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                {cfg.warning}
              </div>

              {/* Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a1a2e]">
                  {cfg.inputLabel}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={cfg.inputPlaceholder}
                  className={cn(
                    "h-9 w-full px-3.5 rounded-xl border text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 transition-colors",
                    isDelete && inputValue.length > 0 && !deleteReady
                      ? "border-[#fecaca] focus:ring-red-300"
                      : "border-[#e8e6f0] focus:ring-brand-pink/30",
                  )}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 pb-6 pt-2">
            <button
              onClick={handleClose}
              className={cn(
                "h-10 rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center flex-1",
                isChangeTier
                  ? "bg-[#f4f5f7] hover:bg-[#e8e6f0] text-[#344054]"
                  : "border border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#f4f3f6]",
              )}
            >
              Cancel
            </button>
            <button
              disabled={!canSubmit}
              onClick={onConfirm}
              className={cn(
                "h-10 rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center flex-1",
                cfg.confirmClass,
              )}
            >
              {cfg.confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
