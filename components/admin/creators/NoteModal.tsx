"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: string;
  onSave: (val: string) => void;
  title: string;
}

export default function NoteModal({
  isOpen,
  onClose,
  initialValue = "",
  onSave,
  title,
}: NoteModalProps) {
  const [value, setValue] = useState(initialValue);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-[380px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8e6f0]/40">
            <span className="text-[15px] font-bold text-[#1a1a2e]">
              {title}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Describe the note details here..."
              className="w-full h-32 p-4 rounded-2xl border border-[#e8e6f0] text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="h-10 rounded-2xl text-xs font-bold bg-[#f4f5f7] hover:bg-[#e8e6f0] text-[#344054] cursor-pointer flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!value.trim()}
              className="h-10 rounded-2xl text-xs font-bold bg-brand-pink hover:opacity-90 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-1"
            >
              Update note
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
