"use client";

import { Dispute } from "@/types/dispute";
import { ArrowRightLeft } from "lucide-react";
import { useUserById } from "@/hooks/useUsers";

interface ActiveChatsGridProps {
  disputes: Dispute[];
  onOpenCase: (disputeId: string) => void;
}

const formatBudget = (dispute: Dispute) => {
  const amount =
    dispute.campaign?.paymentBreakdown?.totalToPay ??
    dispute.campaign?.totalBudget;
  if (!amount) return null;
  const symbol = dispute.campaign?.currency === "USD" ? "$" : "₦";
  return `${symbol}${amount.toLocaleString()}`;
};

const formatDaysAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.max(0, Math.floor(diffMs / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

function ActiveChatCard({
  dispute,
  onOpenCase,
}: {
  dispute: Dispute;
  onOpenCase: (disputeId: string) => void;
}) {
  const { data: brandUser } = useUserById(dispute.brandId);
  const { data: creatorUser } = useUserById(dispute.creatorId);

  const brand =
    `${brandUser?.firstName ?? ""} ${brandUser?.lastName ?? ""}`.trim() ||
    "Brand";
  const creator =
    `${creatorUser?.firstName ?? ""} ${creatorUser?.lastName ?? ""}`.trim() ||
    "Creator";
  const campaignTitle = dispute.campaign?.title || "Campaign";
  const budget = formatBudget(dispute);

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#1a1a2e]">
            #{dispute.id.slice(0, 8).toUpperCase()}
          </span>
          <span className="text-[10px] text-[#9a99b0] font-medium">
            {formatDaysAgo(dispute.createdAt)}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
          Open
        </span>
      </div>

      <div className="flex items-center gap-2 bg-[#f8f7fa] p-2.5 rounded-2xl border border-[#e8e6f0]/60">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-full bg-brand-pink text-white font-bold text-[9px] flex items-center justify-center shrink-0">
            {brand.slice(0, 1).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-[#1a1a2e] truncate">
            {brand}
          </span>
        </div>

        <ArrowRightLeft size={12} className="text-[#9a99b0] shrink-0" />

        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs font-bold text-[#1a1a2e] truncate text-right">
            {creator}
          </span>
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
            {creator.slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-brand-pink">{campaignTitle}</h4>
        <p className="text-[11px] text-[#7a7a9a] leading-relaxed line-clamp-2">
          {dispute.notes || dispute.reason || "No additional notes provided."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#f4f3f6]">
        <span className="text-xs font-bold text-[#1a1a2e]">
          {budget ?? "—"}
        </span>
        <button
          onClick={() => onOpenCase(dispute.id)}
          className="h-8 px-4 bg-[#c0185c] hover:opacity-90 text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Open Case →
        </button>
      </div>
    </div>
  );
}

export default function ActiveChatsGrid({
  disputes,
  onOpenCase,
}: ActiveChatsGridProps) {
  if (disputes.length === 0) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-12 text-center text-[#9a99b0] font-medium text-xs">
        No active dispute chats currently open.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {disputes.map((dispute) => (
        <ActiveChatCard
          key={dispute.id}
          dispute={dispute}
          onOpenCase={onOpenCase}
        />
      ))}
    </div>
  );
}
