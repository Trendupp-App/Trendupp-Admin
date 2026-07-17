"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Tag,
  FileEdit,
  Trash2,
  AlertTriangle,
  Clock,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

interface CampaignItem {
  id: string;
  title: string;
  niche: string;
  editedTime?: string;
  progress?: string;
  status: "Draft" | "Live" | "Active" | "Completed";
  participants?: string;
  tokens?: string;
  daysLeft?: string;
  image?: string;
}

const MOCK_SOCIAL_CAMPAIGNS: CampaignItem[] = [
  // Drafts (3 items)
  {
    id: "d1",
    title: "Jollof Cook-off Promo",
    niche: "Food & Lifestyle",
    editedTime: "Last edited 20 min ago",
    progress: "3/5 sections",
    status: "Draft",
  },
  {
    id: "d2",
    title: "Summer Style Collection",
    niche: "Lifestyle",
    editedTime: "Last edited 2 hours ago",
    progress: "2/5 sections",
    status: "Draft",
  },
  {
    id: "d3",
    title: "New Year Skincare Push",
    niche: "Beauty",
    editedTime: "Last edited 1 hours ago",
    progress: "1/5 sections",
    status: "Draft",
  },
  // Live (3 items, to match the mockup visual grid)
  {
    id: "l1",
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    editedTime: "Live 2 days ago",
    progress: "Active participation open",
    status: "Live",
    participants: "47",
    tokens: "100",
    daysLeft: "4 days left",
    image: "/dashboard/img1.jpg",
  },
  {
    id: "l2",
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    editedTime: "Live 5 hours ago",
    progress: "Submissions processing",
    status: "Live",
    participants: "47",
    tokens: "100",
    daysLeft: "4 days left",
    image: "/dashboard/img1.jpg",
  },
  {
    id: "l3",
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    editedTime: "Live 1 day ago",
    progress: "Accepting submissions",
    status: "Live",
    participants: "47",
    tokens: "100",
    daysLeft: "4 days left",
    image: "/dashboard/img1.jpg",
  },
  // Active (6 items)
  ...Array.from({ length: 6 }, (_, idx) => ({
    id: `a-${idx}`,
    title: `Active Brand Push Campaign ${idx + 1}`,
    niche: idx % 2 === 0 ? "Retail" : "Healthcare",
    editedTime: "Updated 1 day ago",
    progress: "Currently in progress",
    status: "Active" as const,
    participants: "245",
    tokens: "24,500",
    daysLeft: "12 days left",
    image: idx % 2 === 0 ? "/dashboard/img2.jpg" : "/dashboard/img3.jpg",
  })),
  // Completed (3 items)
  {
    id: "c1",
    title: "Easter Egg Hunt Special",
    niche: "Community",
    editedTime: "Ended 2 weeks ago",
    progress: "All tokens distributed",
    status: "Completed",
    participants: "850",
    tokens: "85,000",
    daysLeft: "Ended",
    image: "/dashboard/img2.jpg",
  },
  {
    id: "c2",
    title: "Christmas Charity Drive 2025",
    niche: "Charity",
    editedTime: "Ended 1 month ago",
    progress: "Completed successfully",
    status: "Completed",
    participants: "1,500",
    tokens: "150,000",
    daysLeft: "Ended",
    image: "/dashboard/img3.jpg",
  },
  {
    id: "c3",
    title: "Back to School Giveaway",
    niche: "Education",
    editedTime: "Ended 3 weeks ago",
    progress: "Tokens fully distributed",
    status: "Completed",
    participants: "980",
    tokens: "98,000",
    daysLeft: "Ended",
    image: "/dashboard/img1.jpg",
  },
];

export default function SocialGrid() {
  const [activeTab, setActiveTab] = useState<CampaignItem["status"]>("Draft");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered = MOCK_SOCIAL_CAMPAIGNS.filter((c) => c.status === activeTab);

  const counts = {
    Draft: MOCK_SOCIAL_CAMPAIGNS.filter((c) => c.status === "Draft").length,
    Live: MOCK_SOCIAL_CAMPAIGNS.filter((c) => c.status === "Live").length,
    Active: MOCK_SOCIAL_CAMPAIGNS.filter((c) => c.status === "Active").length,
    Completed: MOCK_SOCIAL_CAMPAIGNS.filter((c) => c.status === "Completed")
      .length,
  };

  const TABS = [
    { id: "Draft" as const, label: "Draft", count: counts.Draft },
    { id: "Live" as const, label: "Live", count: counts.Live },
    { id: "Active" as const, label: "Active", count: counts.Active },
    { id: "Completed" as const, label: "Completed", count: counts.Completed },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Tab Row (Underline layout) */}
      <div className="flex items-center gap-6 border-b border-[#e8e6f0]/60 w-full pb-0 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "pb-3 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none",
                active
                  ? "border-brand-pink text-brand-pink"
                  : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]",
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 text-[9px] font-bold rounded-full inline-flex items-center justify-center min-w-5 h-4.5 transition-colors",
                  active
                    ? "bg-brand-pink text-white shadow-sm"
                    : "bg-[#f4f3f6] text-[#7a7a9a]",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Campaigns Layout */}
      {activeTab === "Draft" ? (
        <div className="flex flex-col gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in-up"
            >
              {/* Left Info Section */}
              <div className="flex items-center gap-4 text-left">
                {/* Megaphone icon box */}
                <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] border border-[#dbeafe]/40 text-[#2563eb] flex items-center justify-center shrink-0">
                  <Megaphone size={18} />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug">
                    {c.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-[#5a5a7a] flex-wrap">
                    {/* Tag */}
                    <span className="flex items-center gap-1 font-bold text-[#5a5a7a] bg-[#f4f3f6]/60 px-2 py-0.5 rounded-lg border border-[#e8e6f0]/40 text-[9px] uppercase tracking-wider">
                      <Tag size={10} className="text-[#9a99b0]" />
                      {c.niche}
                    </span>

                    <span className="text-[#9a99b0] font-medium">•</span>

                    {/* Last Edited or Status time */}
                    <span className="text-[#9a99b0] font-medium">
                      {c.editedTime}
                    </span>
                  </div>

                  {/* Progress descriptor text */}
                  <div className="text-[10px] text-[#7a7a9a] font-semibold mt-0.5 flex items-center gap-1">
                    {c.progress}
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end">
                <button
                  onClick={() => alert(`Continuing setup for ${c.title}...`)}
                  className="h-9 px-4.5 border border-[#e8e6f0] bg-white hover:bg-[#faf9fc] text-xs font-bold text-[#5a5a7a] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileEdit size={13} /> Continue
                </button>
                <button
                  onClick={() => setDeleteTargetId(c.id)}
                  className="w-9 h-9 border border-[#e8e6f0] bg-white hover:bg-[#faf9fc] text-[#5a5a7a] hover:text-[#dc2626] rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const daysLeftVal = c.daysLeft || "4 days left";
            const imageVal = c.image || "/dashboard/img1.jpg";
            const participantsVal = c.participants || "47";
            const tokensVal = c.tokens || "100";

            return (
              <div
                key={c.id}
                className="bg-white border border-[#e8e6f0]/60 rounded-[24px] p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in-up"
              >
                {/* Inset Cover Image Container */}
                <div className="relative w-full h-[190px] rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={imageVal}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Bottom Gradient overlay to ensure text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                  {/* Overlay Left Badge */}
                  <span className="absolute bottom-3 left-3 bg-black/45 backdrop-blur-[2px] text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                    <Clock size={11} className="text-white" />
                    <span>{daysLeftVal}</span>
                  </span>
                  {/* Overlay Right Badge */}
                  <span
                    className={cn(
                      "absolute bottom-3 right-3 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center font-bold",
                      c.status === "Live"
                        ? "bg-[#16a34a]"
                        : c.status === "Active"
                          ? "bg-[#2563eb]"
                          : "bg-[#16a34a]",
                    )}
                  >
                    {c.status === "Active" ? "In Progress" : c.status}
                  </span>
                </div>

                {/* Card Content Section */}
                <div className="flex flex-col gap-1.5 flex-1 px-1">
                  <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug">
                    {c.title}
                  </h4>
                  <span className="text-[10px] text-[#9a99b0] font-bold">
                    {c.niche}
                  </span>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Tokens */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-pink">
                      <Ticket
                        size={14}
                        className="text-brand-pink rotate-[-10deg]"
                      />
                      <span>{tokensVal} Tokens</span>
                    </div>

                    {/* Applied */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#7a7a9a]">
                      <Users size={14} className="text-[#9a99b0]" />
                      <span>{participantsVal} applied</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/admin/campaigns/${c.id}`}
                    className="mt-3 w-full h-11 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl flex items-center justify-center transition-all cursor-pointer select-none"
                  >
                    {c.status === "Live"
                      ? "Review application"
                      : "View more details"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
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
                  This social impact campaign will be permanently deleted.
                  Tokens already distributed will not be recalled.
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
        </Portal>
      )}
    </div>
  );
}
