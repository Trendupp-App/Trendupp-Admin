"use client";

import { useState } from "react";
import { X, Send, Calendar, Save, Sparkles } from "lucide-react";
import { Portal } from "@/components/ui/portal";
import type {
  AdminBroadcastItem,
  CreateBroadcastPayload,
  BroadcastAudience,
  BroadcastChannel,
  BroadcastStatus,
} from "@/types/adminNotifications";

interface BroadcastDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateBroadcastPayload) => void;
  broadcast?: AdminBroadcastItem | null;
  isSaving?: boolean;
}

export default function BroadcastDrawer({
  isOpen,
  onClose,
  onSave,
  broadcast,
  isSaving = false,
}: BroadcastDrawerProps) {
  const [title, setTitle] = useState(() => broadcast?.title || "");
  const [message, setMessage] = useState(() => broadcast?.message || "");
  const [audience, setAudience] = useState<BroadcastAudience>(
    () => broadcast?.audience || "all",
  );
  const [channel, setChannel] = useState<BroadcastChannel>(
    () => broadcast?.channel || "in_app",
  );
  const [status, setStatus] = useState<BroadcastStatus>(
    () => broadcast?.status || "sent",
  );
  const [scheduledAt, setScheduledAt] = useState(() =>
    broadcast?.scheduledAt
      ? new Date(broadcast.scheduledAt).toISOString().slice(0, 16)
      : "",
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const payload: CreateBroadcastPayload = {
      title: title.trim(),
      message: message.trim(),
      audience,
      channel,
      status,
      scheduledAt:
        status === "scheduled" && scheduledAt
          ? new Date(scheduledAt).toISOString()
          : undefined,
    };

    onSave(payload);
  };

  const isEditMode = !!broadcast;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 overflow-hidden text-left">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#e8e6f0]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-pink-light text-brand-pink flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1a1a2e]">
                    {isEditMode
                      ? "Edit Broadcast Announcement"
                      : "Create New Broadcast"}
                  </h2>
                  <p className="text-[11px] text-[#9a99b0] font-medium">
                    Send system notifications across in-app, email, and push
                    channels
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
            >
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platform Maintenance Notice 2.0"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#e8e6f0] px-3.5 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write full notification body message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#e8e6f0] p-3.5 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium resize-none"
                />
              </div>

              {/* Audience Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "all", label: "All Users" },
                    { key: "creators", label: "Creators" },
                    { key: "brands", label: "Brands" },
                  ].map((aud) => (
                    <button
                      type="button"
                      key={aud.key}
                      onClick={() => setAudience(aud.key as BroadcastAudience)}
                      className={`h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        audience === aud.key
                          ? "bg-brand-pink text-white border-brand-pink shadow-sm"
                          : "border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc]"
                      }`}
                    >
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Channel */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "in_app", label: "In-App Banner" },
                    { key: "email", label: "Email Notice" },
                    { key: "push", label: "Mobile Push" },
                  ].map((ch) => (
                    <button
                      type="button"
                      key={ch.key}
                      onClick={() => setChannel(ch.key as BroadcastChannel)}
                      className={`h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        channel === ch.key
                          ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                          : "border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc]"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Status & Action */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Delivery Action
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "sent", label: "Send Now", icon: Send },
                    { key: "scheduled", label: "Schedule", icon: Calendar },
                    { key: "draft", label: "Draft", icon: Save },
                  ].map((st) => (
                    <button
                      type="button"
                      key={st.key}
                      onClick={() => setStatus(st.key as BroadcastStatus)}
                      className={`h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        status === st.key
                          ? "bg-[#16a34a] text-white border-[#16a34a] shadow-sm"
                          : "border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc]"
                      }`}
                    >
                      <st.icon size={13} /> {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduled Date Picker */}
              {status === "scheduled" && (
                <div className="flex flex-col gap-1.5 border-t border-[#e8e6f0]/60 pt-3 animate-fade-in-up">
                  <label className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} /> Schedule Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required={status === "scheduled"}
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[#e8e6f0] px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                  />
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-auto pt-6 border-t border-[#e8e6f0]/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-5 py-2.5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !title.trim() || !message.trim()}
                  className="px-6 py-2.5 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSaving
                    ? "Saving..."
                    : isEditMode
                      ? "Update Broadcast"
                      : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
}
