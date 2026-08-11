"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  Calendar,
  PauseCircle,
  PlayCircle,
  Ban,
  Clock,
  XCircle,
} from "lucide-react";
import { Portal } from "@/components/ui/portal";

export type SocialActionType =
  | "pause"
  | "resume"
  | "cancel"
  | "extend-deadline"
  | "close-applications"
  | "reject-participant";

interface SocialImpactActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: SocialActionType;
  title: string;
  onConfirm: (data: {
    reason?: string;
    newDeadline?: string;
    action?: "pause" | "resume";
  }) => Promise<void>;
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
  const [statusAction, setStatusAction] = useState<"pause" | "resume">(
    actionType === "resume" ? "resume" : "pause",
  );

  if (!isOpen) return null;

  const isStatusAction = actionType === "pause" || actionType === "resume";
  const effectiveType = isStatusAction ? statusAction : actionType;

  const requiresReason =
    effectiveType === "pause" ||
    effectiveType === "resume" ||
    effectiveType === "cancel" ||
    effectiveType === "close-applications" ||
    effectiveType === "reject-participant";

  const requiresDeadline = effectiveType === "extend-deadline";
  const allowsDeadline = effectiveType === "extend-deadline";

  const getActionConfig = () => {
    switch (effectiveType) {
      case "pause":
        return {
          icon: PauseCircle,
          iconBg: "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
          headerTitle: `Pause ${title}?`,
          subtitle:
            "Temporarily suspend active submissions. Creators will be notified.",
          buttonText: "Pause Campaign",
          buttonBg: "bg-[#ea580c] hover:bg-[#c2410c]",
        };
      case "resume":
        return {
          icon: PlayCircle,
          iconBg: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
          headerTitle: `Resume ${title}?`,
          subtitle:
            "Reactivate this campaign so creators can continue submitting.",
          buttonText: "Resume Campaign",
          buttonBg: "bg-[#16a34a] hover:bg-[#15803d]",
        };
      case "cancel":
        return {
          icon: Ban,
          iconBg: "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]",
          headerTitle: `Cancel ${title}?`,
          subtitle:
            "Permanently cancel this social campaign. All pending submissions will be closed.",
          buttonText: "Cancel Campaign",
          buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
        };
      case "extend-deadline":
        return {
          icon: Clock,
          iconBg: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
          headerTitle: `Extend Deadline for ${title}`,
          subtitle: "Set a new deadline date for creator participation.",
          buttonText: "Extend Deadline",
          buttonBg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
        };
      case "close-applications":
        return {
          icon: XCircle,
          iconBg: "bg-[#fff1f2] text-brand-pink border-[#ffe4e6]",
          headerTitle: `Close Applications for ${title}?`,
          subtitle: "Stop accepting new participant applications early.",
          buttonText: "Close Applications",
          buttonBg: "bg-brand-pink hover:opacity-90",
        };
      case "reject-participant":
        return {
          icon: AlertTriangle,
          iconBg: "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]",
          headerTitle: "Reject Participant Submission?",
          subtitle: "Specify the reason for rejecting this creator submission.",
          buttonText: "Reject Submission",
          buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
        };
      default:
        return {
          icon: AlertTriangle,
          iconBg: "bg-gray-100 text-gray-700 border-gray-200",
          headerTitle: title,
          subtitle: "Confirm action.",
          buttonText: "Confirm",
          buttonBg: "bg-[#1a1a2e]",
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
      action: isStatusAction ? statusAction : undefined,
    });
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-5 text-left animate-scale-up">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${config.iconBg}`}
              >
                <config.icon size={18} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#1a1a2e]">
                  {config.headerTitle}
                </h3>
                <p className="text-[11px] text-[#7a7a9a] leading-tight">
                  {config.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#9a99b0] hover:bg-[#f4f3f6] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-xs font-semibold text-[#1a1a2e]"
          >
            {isStatusAction && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Action <span className="text-red-500">*</span>
                </label>
                <select
                  value={statusAction}
                  onChange={(e) =>
                    setStatusAction(e.target.value as "pause" | "resume")
                  }
                  className="h-10 w-full bg-[#faf9fc] border border-[#e8e6f0] rounded-xl px-3 text-xs focus:outline-none focus:border-brand-pink font-medium cursor-pointer"
                >
                  <option value="pause">Pause</option>
                  <option value="resume">Resume</option>
                </select>
              </div>
            )}

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
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Temporary administrative review"
                  required={requiresReason}
                  className="w-full bg-[#faf9fc] border border-[#e8e6f0] rounded-xl p-3 text-xs focus:outline-none focus:border-brand-pink font-medium resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (requiresReason && !reason.trim()) ||
                  (requiresDeadline && !newDeadline)
                }
                className={`h-10 rounded-xl text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${config.buttonBg}`}
              >
                {isLoading ? "Processing..." : config.buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
