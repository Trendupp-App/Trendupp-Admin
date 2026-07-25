"use client";

import { X, Bell, Calendar, Send, UserCheck, ShieldCheck } from "lucide-react";
import { Portal } from "@/components/ui/portal";
import type { AdminBroadcastItem } from "@/types/adminNotifications";

interface BroadcastDetailDrawerProps {
  broadcast: AdminBroadcastItem | null;
  onClose: () => void;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function BroadcastDetailDrawer({
  broadcast,
  onClose,
}: BroadcastDetailDrawerProps) {
  if (!broadcast) return null;

  const audienceLabel =
    broadcast.audience === "creators"
      ? "Creators Only"
      : broadcast.audience === "brands"
        ? "Brands Only"
        : "All Platform Users";

  const channelLabel =
    broadcast.channel === "email"
      ? "Email Notification"
      : broadcast.channel === "push"
        ? "Mobile Push"
        : "In-App Banner";

  const statusLabel = broadcast.status.toUpperCase();

  return (
    <Portal>
      <div className="fixed inset-0 z-50 overflow-hidden text-left">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#e8e6f0]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1a1a2e]">
                    Broadcast Details
                  </h2>
                  <span className="text-[10px] text-[#9a99b0] font-semibold">
                    ID: {broadcast.id}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Title & Status */}
              <div className="flex flex-col gap-2 bg-[#faf9fc] border border-[#e8e6f0]/80 rounded-2xl p-4.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7]">
                    {statusLabel}
                  </span>
                  <span className="text-[10px] text-[#9a99b0] font-semibold">
                    Created: {formatDate(broadcast.createdAt)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1a1a2e] mt-1">
                  {broadcast.title}
                </h3>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider flex items-center gap-1">
                    <UserCheck size={12} /> Target Audience
                  </span>
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    {audienceLabel}
                  </span>
                </div>
                <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider flex items-center gap-1">
                    <Send size={12} /> Channel
                  </span>
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    {channelLabel}
                  </span>
                </div>
              </div>

              {/* Scheduled Time if applicable */}
              {broadcast.scheduledAt && (
                <div className="bg-[#fff7ed] border border-[#fde68a]/60 rounded-2xl p-4 flex items-center gap-3">
                  <Calendar size={18} className="text-[#ea580c] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider">
                      Scheduled Delivery
                    </span>
                    <span className="text-xs font-bold text-[#92400e]">
                      {formatDate(broadcast.scheduledAt)}
                    </span>
                  </div>
                </div>
              )}

              {/* Full Message */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Message Body
                </h4>
                <div className="bg-white border border-[#e8e6f0] rounded-2xl p-4 text-xs text-[#5a5a7a] font-medium leading-relaxed whitespace-pre-wrap">
                  {broadcast.message}
                </div>
              </div>

              {/* Audit Footer */}
              <div className="mt-auto bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center gap-2 text-[10px] text-[#7a7a9a] font-semibold">
                <ShieldCheck size={14} className="text-[#16a34a] shrink-0" />
                <span>
                  Broadcast verified &amp; recorded in system admin audit log.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
