"use client";

import * as React from "react";
import { DialogTitle } from "@/components/ui/dialog";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full pb-1">
      <DialogTitle className="text-[18px] font-bold text-[#1a1a2e] tracking-tight">
        {title}
      </DialogTitle>
      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#1a1a2e] transition-colors focus:outline-none cursor-pointer border-none"
        aria-label="Close modal"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
