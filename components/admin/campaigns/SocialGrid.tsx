"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pause, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignCard {
  id: string;
  title: string;
  niche: string;
  tier: string;
  tokens: string;
  applicants: number;
  timeLeft: string;
  status: "Live" | "Revision" | "Completed" | "Draft";
  bgGradient: string;
}

const MOCK_SOCIAL_CAMPAIGNS: CampaignCard[] = [
  {
    id: "1",
    title: "Summer Style Collection",
    niche: "Sport",
    tier: "Micro",
    tokens: "100 Tokens",
    applicants: 47,
    timeLeft: "4 days left",
    status: "Live",
    bgGradient: "from-pink-500 to-rose-600",
  },
  {
    id: "2",
    title: "Lagos Tech Week Coverage",
    niche: "Technology",
    tier: "Micro",
    tokens: "100 Tokens",
    applicants: 47,
    timeLeft: "31 hour left",
    status: "Revision",
    bgGradient: "from-blue-600 to-indigo-700",
  },
  {
    id: "3",
    title: "Summer Style Collection",
    niche: "Technology",
    tier: "Micro",
    tokens: "100 Tokens",
    applicants: 47,
    timeLeft: "4 days left",
    status: "Live",
    bgGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "4",
    title: "Summer Style Collection",
    niche: "Sport",
    tier: "Micro",
    tokens: "100 Tokens",
    applicants: 47,
    timeLeft: "4 days left",
    status: "Live",
    bgGradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "5",
    title: "Lagos Tech Week Coverage",
    niche: "Technology",
    tier: "Micro",
    tokens: "100 Tokens",
    applicants: 47,
    timeLeft: "31 hour left",
    status: "Revision",
    bgGradient: "from-violet-500 to-purple-600",
  },
];

export default function SocialGrid() {
  const [activeTab, setActiveTab] = useState<
    "All" | "Live" | "Draft" | "Completed"
  >("All");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered = MOCK_SOCIAL_CAMPAIGNS.filter((c) => {
    if (activeTab === "All") return true;
    if (
      activeTab === "Live" &&
      (c.status === "Live" || c.status === "Revision")
    )
      return true;
    return c.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-5 text-left">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#f4f3f6] border border-[#e8e6f0]/80 p-1 rounded-xl w-fit self-start max-w-full overflow-x-auto scrollbar-none">
        {[
          { label: "All", count: 5 },
          { label: "Live", count: 3 },
          { label: "Draft", count: 1 },
          { label: "Completed", count: 1 },
        ].map((t) => {
          const active = activeTab === t.label;
          return (
            <button
              key={t.label}
              onClick={() =>
                setActiveTab(t.label as "All" | "Live" | "Draft" | "Completed")
              }
              className={cn(
                "px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                active
                  ? "bg-brand-pink text-white shadow-sm"
                  : "bg-transparent text-[#5a5a7a] hover:text-[#1a1a2e]",
              )}
            >
              {t.label} ({t.count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Cover image area */}
            <div
              className={cn(
                "h-40 bg-gradient-to-br relative p-4 flex flex-col justify-between",
                c.bgGradient,
              )}
            >
              <div className="absolute inset-0 bg-black/10" />
              {/* Overlays */}
              <div className="relative flex justify-between items-center w-full z-10">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold text-white bg-black/45 backdrop-blur-[2px]">
                  🕒 {c.timeLeft}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[9px] font-bold border backdrop-blur-[2px]",
                    c.status === "Live"
                      ? "bg-[#f0fdf4]/85 text-[#16a34a] border-[#dcfce7]/40"
                      : "bg-[#fff7ed]/85 text-[#ea580c] border-[#ffedd5]/40",
                  )}
                >
                  {c.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col text-left">
                  <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug">
                    {c.title}
                  </h4>
                  <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
                    {c.niche}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe] shrink-0">
                  {c.tier}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-[#5a5a7a] border-t border-[#e8e6f0]/40 pt-3">
                <span className="flex items-center gap-1 text-[11px] text-[#ea580c]">
                  🪙 {c.tokens}
                </span>
                <span className="text-[10px] text-[#5a5a7a]">
                  👥 {c.applicants} applied
                </span>
              </div>

              {/* Actions row */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Link
                  href={`/admin/campaigns/${c.id}`}
                  className="h-8 px-3 bg-[#eff6ff] text-[#2563eb] rounded-xl hover:bg-[#dbeafe] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[10px] font-bold shrink-0"
                >
                  <Eye size={12} /> View
                </Link>
                <button
                  onClick={() => alert(`${c.title} campaign has been paused.`)}
                  className="h-8.5 rounded-xl border border-[#fde68a] bg-[#fffdf5] text-[10px] font-bold text-[#b45309] hover:bg-[#fffbeb] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Pause size={12} /> Pause
                </button>
                <button
                  onClick={() => setDeleteTargetId(c.id)}
                  className="h-8.5 rounded-xl border border-[#fee2e2] bg-[#fffbfa] text-[10px] font-bold text-[#dc2626] hover:bg-[#fff5f5] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTargetId(null)}
          />

          <div className="relative z-10 w-full max-w-[360px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fee2e2]">
              <AlertTriangle size={20} className="text-[#dc2626]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Delete Campaign?
              </h3>
              <p className="text-xs text-[#7a7a9a] leading-relaxed">
                This social impact campaign will be permanently deleted. Tokens
                already distributed will not be recalled.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="h-9.5 rounded-xl border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteTargetId(null);
                  alert("Campaign successfully deleted.");
                }}
                className="h-9.5 rounded-xl bg-[#dc2626] text-white text-xs font-bold hover:bg-[#b91c1c] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
