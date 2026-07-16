"use client";

import { Construction } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-fade-in-up">
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#fdf2f6] text-brand-pink flex items-center justify-center border border-[#fae2ec]">
          <Construction size={20} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-[#1a1a2e]">{title} Page</h2>
          <span className="px-3 py-0.5 rounded-full text-[9px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] uppercase tracking-wider mx-auto mt-1">
            Coming up
          </span>
        </div>
        <p className="text-xs text-[#9a99b0] leading-relaxed mt-1">
          This section is currently under development. The layout sidebar is
          integrated, and the full feature panel is coming up soon.
        </p>
      </div>
    </div>
  );
}
