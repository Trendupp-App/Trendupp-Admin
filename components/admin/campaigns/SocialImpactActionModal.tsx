"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Portal } from "@/components/ui/portal";

export type SocialActionType =
  | "pause"
  | "cancel"
  | "extend-deadline"
  | "close-applications"
  | "reject-participant";

interface SocialImpactActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: SocialActionType;
  title: string;
  onConfirm: (data: { reason?: string; newDeadline?: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function SocialImpactActionModal({
  isOpen,
  onClose,
  actionType,
  title,
  onConfirm,
  isLoading = false,
}: SocialImpactActionModalProps) {
  const [reason, setReason] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  if (!isOpen) return null;

  const requiresReason =
    actionType === "pause" ||
    actionType === "cancel" ||
    actionType === "close-applications" ||
    actionType === "reject-participant";

  const requiresDeadline = actionType === "extend-deadline";
  const allowsDeadline =
    actionType === "pause" || actionType === "extend-deadline";

  const getActionConfig = () => {
    switch (actionType) {
      case "pause":
        return {
          questionTitle: "Are you sure you want to Pause this Campaign?",
          subtitle:
            "Temporarily suspend active submissions. Creators will be notified.",
          confirmText: "Yes",
        };
      case "cancel":
        return {
          questionTitle: "Are you sure you want to Cancel this Campaign?",
          subtitle:
            "Permanently cancel this social campaign. All pending submissions will be closed.",
          confirmText: "Yes",
        };
      case "extend-deadline":
        return {
          questionTitle: "Are you sure you want to Extend the Deadline?",
          subtitle: "Set a new deadline date for creator participation.",
          confirmText: "Yes",
        };
      case "close-applications":
        return {
          questionTitle: "Are you sure you want to Close the Applications?",
          subtitle: "Stop accepting new participant applications early.",
          confirmText: "Yes",
        };
      case "reject-participant":
        return {
          questionTitle: "Are you sure you want to Reject this Submission?",
          subtitle: "Specify the reason for rejecting this creator submission.",
          confirmText: "Yes",
        };
      default:
        return {
          questionTitle: `Confirm action for ${title}?`,
          subtitle: "Confirm action.",
          confirmText: "Yes",
        };
    }
  };

  const config = getActionConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresReason && !reason.trim()) return;
    if (requiresDeadline && !newDeadline) return;

    await onConfirm({
      reason: reason.trim() || undefined,
      newDeadline: newDeadline || undefined,
    });
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[28px] shadow-2xl p-8 flex flex-col items-center gap-6 text-center animate-scale-up">
          {/* Top Yellow Warning Exclamation Badge */}
          <div className="w-16 h-16 rounded-full border-2 border-[#f59e0b] text-[#f59e0b] flex items-center justify-center text-3xl font-light shrink-0">
            !
          </div>

          {/* Title Wording */}
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-base font-bold text-[#1a1a2e] max-w-[320px] leading-snug">
              {config.questionTitle}
            </h3>
            {config.subtitle && (
              <p className="text-xs text-[#7a7a9a] leading-tight max-w-[300px]">
                {config.subtitle}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 text-xs font-semibold text-[#1a1a2e] text-left"
          >
            {allowsDeadline && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a] flex items-center gap-1">
                  <Calendar size={11} /> New Deadline Date{" "}
                  {requiresDeadline && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  required={requiresDeadline}
                  className="h-10 w-full bg-[#faf9fc] border border-[#e8e6f0] rounded-xl px-3 text-xs focus:outline-none focus:border-brand-pink font-medium"
                />
              </div>
            )}

            {requiresReason && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                  required={requiresReason}
                  className="w-full bg-[#faf9fc] border border-[#e8e6f0] rounded-xl p-3 text-xs focus:outline-none focus:border-brand-pink font-medium resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2 w-full">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl bg-[#f4f3f6] border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#e8e6f0] cursor-pointer transition-colors"
              >
                No, go back
              </button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (requiresReason && !reason.trim()) ||
                  (requiresDeadline && !newDeadline)
                }
                className="h-11 rounded-xl bg-brand-pink text-white text-xs font-bold hover:opacity-90 cursor-pointer transition-all disabled:opacity-50"
              >
                {isLoading ? "Processing..." : config.confirmText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
