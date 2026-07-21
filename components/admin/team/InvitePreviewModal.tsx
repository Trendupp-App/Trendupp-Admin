"use client";

import { useState } from "react";
import { X, Copy } from "lucide-react";
import { toast } from "sonner";

interface InvitePreviewModalProps {
  previewUrl: string | null;
  onClose: () => void;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export default function InvitePreviewModal({
  previewUrl,
  onClose,
  copyToClipboard,
}: InvitePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!previewUrl) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(previewUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#e8e6f0] flex flex-col gap-4 text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            Invitation Link Generated
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f4f3f6] rounded-lg transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Info callout */}
        <div className="bg-[#fdf2f8] border border-[#fce7f3] rounded-xl px-4 py-3 text-[11px] text-[#c0185c] font-semibold leading-relaxed">
          📌 This link takes the invitee to a preview of their invitation email.
          Clicking the button on that page will auto-verify their account and
          redirect them to set their password.
        </div>

        {/* Link box */}
        <div className="flex items-center gap-2 bg-[#f4f3f6] rounded-xl px-3 py-2.5 border border-[#e8e6f0]">
          <p className="flex-1 text-[11px] text-[#5a5a7a] font-medium truncate break-all">
            {previewUrl}
          </p>
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-1.5 h-8 px-3 bg-[#c0185c] hover:opacity-90 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
          >
            <Copy size={12} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="h-9 w-full bg-[#f4f3f6] hover:bg-[#ebe9f1] text-[#5a5a7a] text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
