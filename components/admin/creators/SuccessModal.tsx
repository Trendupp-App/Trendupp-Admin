"use client";

import { Check } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-[320px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center gap-5">
          {/* Success Icon */}
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] flex items-center justify-center">
            <Check size={22} className="stroke-[2.5]" />
          </div>

          {/* Text Details */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[14px] font-bold text-[#1a1a2e] leading-snug">
              {title}
            </h3>
            <p className="text-[11px] text-[#7a7a9a] font-medium leading-relaxed px-1">
              {message}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full h-10 rounded-2xl bg-brand-pink hover:opacity-90 text-white text-xs font-bold transition-opacity cursor-pointer"
          >
            Ok, got it
          </button>
        </div>
      </div>
    </Portal>
  );
}
