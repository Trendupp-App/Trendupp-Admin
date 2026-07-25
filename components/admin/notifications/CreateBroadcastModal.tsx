"use client";

import { useState } from "react";
import {
  X,
  Send,
  FileText,
  CalendarClock,
  Megaphone,
  Loader2,
} from "lucide-react";
import { Portal } from "@/components/ui/portal";
import { cn } from "@/lib/utils";
import { useCreateBroadcast } from "@/hooks/useAdminBroadcasts";
import type {
  BroadcastAudience,
  BroadcastChannel,
} from "@/types/adminBroadcasts";

export interface CreateBroadcastInitialValues {
  title?: string;
  message?: string;
  audience?: BroadcastAudience;
  channel?: BroadcastChannel;
}

interface CreateBroadcastModalProps {
  onClose: () => void;
  initialValues?: CreateBroadcastInitialValues | null;
}

const AUDIENCE_OPTIONS: { value: BroadcastAudience; label: string }[] = [
  { value: "creators", label: "Creators" },
  { value: "brands", label: "Brands" },
  { value: "all", label: "All" },
];

const CHANNEL_OPTIONS: { value: BroadcastChannel; label: string }[] = [
  { value: "in_app", label: "In-App" },
  { value: "email", label: "Email" },
  { value: "both", label: "Both" },
];

export default function CreateBroadcastModal({
  onClose,
  initialValues,
}: CreateBroadcastModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [message, setMessage] = useState(initialValues?.message ?? "");
  const [audience, setAudience] = useState<BroadcastAudience>(
    initialValues?.audience ?? "all",
  );
  const [channel, setChannel] = useState<BroadcastChannel>(
    initialValues?.channel ?? "in_app",
  );
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [pendingStatus, setPendingStatus] = useState<
    "draft" | "sent" | "scheduled" | null
  >(null);

  const createBroadcast = useCreateBroadcast();

  const isValid = title.trim().length > 0 && message.trim().length > 0;
  const isSubmitting = createBroadcast.isPending;
  const isSending = isSubmitting && pendingStatus === "sent";
  const isSavingDraft = isSubmitting && pendingStatus === "draft";
  const isScheduling = isSubmitting && pendingStatus === "scheduled";

  const submit = (status: "draft" | "sent" | "scheduled") => {
    if (!isValid) return;
    if (status === "scheduled" && !scheduledAt) {
      setShowSchedule(true);
      return;
    }
    setPendingStatus(status);
    createBroadcast.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        audience,
        channel,
        status,
        ...(status === "scheduled"
          ? { scheduledAt: new Date(scheduledAt).toISOString() }
          : {}),
      },
      {
        onSuccess: onClose,
        onError: () => setPendingStatus(null),
      },
    );
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[6vh] pb-6 overflow-y-auto">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-[480px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-3.5">
            <h3 className="text-sm font-bold text-[#1a1a2e] flex items-center gap-2">
              <Megaphone size={16} className="text-brand-pink" /> Create
              Broadcast
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1a1a2e]">
              Title <span className="text-brand-pink">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter broadcast title"
              className="h-10 w-full rounded-xl border border-[#e8e6f0] px-3.5 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1a1a2e]">
              Message <span className="text-brand-pink">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              className="w-full rounded-xl border border-[#e8e6f0] p-3.5 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-[#1a1a2e]">Audience</span>
            <div className="flex gap-2">
              {AUDIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAudience(opt.value)}
                  className={cn(
                    "flex-1 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                    audience === opt.value
                      ? "bg-brand-pink text-white border-brand-pink shadow-sm"
                      : "bg-white text-[#5a5a7a] border-[#e8e6f0] hover:bg-[#faf9fc]",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-[#1a1a2e]">
              Delivery Channel
            </span>
            <div className="flex gap-2">
              {CHANNEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setChannel(opt.value)}
                  className={cn(
                    "flex-1 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5",
                    channel === opt.value
                      ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                      : "bg-white text-[#5a5a7a] border-[#e8e6f0] hover:bg-[#faf9fc]",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {showSchedule && (
            <div className="flex flex-col gap-1.5 animate-fade-in-up">
              <label className="text-xs font-bold text-[#1a1a2e]">
                Scheduled Date &amp; Time{" "}
                <span className="text-brand-pink">*</span>
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#e8e6f0] px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-1">
            <button
              onClick={() => submit("scheduled")}
              disabled={
                !isValid || isSubmitting || (showSchedule && !scheduledAt)
              }
              className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isScheduling ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CalendarClock size={13} />
              )}{" "}
              {isScheduling
                ? "Scheduling..."
                : showSchedule
                  ? "Confirm"
                  : "Schedule"}
            </button>
            <button
              onClick={() => submit("draft")}
              disabled={!isValid || isSubmitting}
              className="h-10 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isSavingDraft ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <FileText size={13} />
              )}{" "}
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => submit("sent")}
              disabled={!isValid || isSubmitting}
              className="h-10 rounded-xl bg-brand-pink text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isSending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}{" "}
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
