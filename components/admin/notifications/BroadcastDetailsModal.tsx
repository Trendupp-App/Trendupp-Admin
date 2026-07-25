"use client";

import { X, Smartphone, Mail, Calendar, Copy } from "lucide-react";
import { Portal } from "@/components/ui/portal";
import { cn } from "@/lib/utils";
import type { AdminBroadcastDto } from "@/types/adminBroadcasts";

interface BroadcastDetailsModalProps {
  broadcast: AdminBroadcastDto | null;
  isLoading?: boolean;
  onClose: () => void;
  onDuplicate: (broadcast: AdminBroadcastDto) => void;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  sent: {
    label: "Sent",
    className: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
  },
  draft: {
    label: "Draft",
    className: "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
  },
};

const AUDIENCE_LABEL: Record<string, string> = {
  all: "All Users",
  brands: "Brands",
  creators: "Creators",
};

const CHANNEL_LABEL: Record<string, string> = {
  in_app: "In-App",
  email: "Email",
  both: "In-App & Email",
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BroadcastDetailsModal({
  broadcast,
  isLoading = false,
  onClose,
  onDuplicate,
}: BroadcastDetailsModalProps) {
  if (!broadcast && !isLoading) return null;

  const status = broadcast
    ? (STATUS_BADGE[broadcast.status] ?? {
        label: broadcast.status,
        className: "bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]",
      })
    : null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-[560px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#faf9fc] border-b border-[#e8e6f0]/60 px-6 py-4.5">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Notification Details
              </h3>
              {status && (
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white text-[#7a7a9a] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {isLoading || !broadcast ? (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="w-2/3 h-4 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-full h-16 bg-[#e8e6f0]/40 rounded-2xl" />
                <div className="w-full h-10 bg-[#e8e6f0]/30 rounded-xl" />
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold text-[#1a1a2e]">
                  {broadcast.title}
                </h2>

                <div className="bg-brand-pink-light/60 border border-[#fae2ec] rounded-2xl p-4 text-xs text-[#5a5a7a] leading-relaxed font-medium">
                  {broadcast.message}
                </div>

                <div className="border-t border-dashed border-[#e8e6f0] pt-4 grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      Audience
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-pink-light text-brand-pink w-fit uppercase tracking-wider">
                      {AUDIENCE_LABEL[broadcast.audience] ?? broadcast.audience}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      Channel
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a2e]">
                      {broadcast.channel === "email" ? (
                        <Mail size={13} className="text-[#2563eb]" />
                      ) : (
                        <Smartphone size={13} className="text-[#2563eb]" />
                      )}
                      {CHANNEL_LABEL[broadcast.channel] ?? broadcast.channel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      Created
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a2e]">
                      <Calendar size={13} className="text-[#7a7a9a]" />
                      {formatDate(broadcast.createdAt)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 bg-[#faf9fc] border-t border-[#e8e6f0]/60 px-6 py-4">
            <button
              onClick={onClose}
              className="px-4.5 py-2 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            {broadcast && (
              <button
                onClick={() => onDuplicate(broadcast)}
                className="px-4.5 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Copy size={13} /> Duplicate
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
