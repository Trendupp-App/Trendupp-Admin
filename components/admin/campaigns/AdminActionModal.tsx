"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AdminActionModalProps {
  action: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function AdminActionModal({
  action,
  onClose,
  onConfirm,
}: AdminActionModalProps) {
  const [reason, setReason] = useState("");

  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 text-left">
        <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-3">
          <h3 className="text-sm font-bold text-[#1a1a2e]">{action}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <p className="text-xs text-[#7a7a9a] leading-relaxed">
          This action is permanently recorded in the audit log with your
          identity and timestamp.
        </p>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
            Reason (required) *
          </label>
          <textarea
            rows={3}
            placeholder="Provide a clear reason for this administrative action..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-[#e8e6f0] p-3 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-2">
          <button
            onClick={onClose}
            className="px-4.5 py-2 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
            className="px-4.5 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}
