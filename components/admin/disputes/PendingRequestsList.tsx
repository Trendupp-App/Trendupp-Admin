"use client";

import { Dispute } from "@/types/dispute";
import { useUserById } from "@/hooks/useUsers";

interface PendingRequestsListProps {
  disputes: Dispute[];
  onActivateClick: (dispute: Dispute) => void;
  onDeclineClick?: (dispute: Dispute) => void;
}

function PendingRequestRow({
  dispute,
  onActivateClick,
  onDeclineClick,
}: {
  dispute: Dispute;
  onActivateClick: (dispute: Dispute) => void;
  onDeclineClick?: (dispute: Dispute) => void;
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

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-pink/10 text-brand-pink font-extrabold text-xs flex items-center justify-center shrink-0 border border-brand-pink/20">
            {brand.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#1a1a2e]">{brand}</span>
            <span className="text-[10px] text-[#9a99b0] font-medium">
              Brand · #{dispute.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Awaiting Activation
        </span>
      </div>

      <h4 className="text-xs font-bold text-brand-pink">
        {campaignTitle} - {brand}
      </h4>

      <div className="flex flex-col gap-1 text-xs">
        <span className="font-bold text-[#1a1a2e]">
          Reason: {dispute.reason || "Not specified"}
        </span>
        <p className="text-[11px] text-[#7a7a9a] leading-relaxed">
          {dispute.notes ||
            `Dispute raised between ${brand} and ${creator}. Need admin mediation to ensure campaign brief and requirements are respected.`}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#f4f3f6] mt-1">
        <span className="text-[10px] text-[#9a99b0] font-medium">
          Submitted{" "}
          {new Date(dispute.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>

        <div className="flex items-center gap-2">
          {onDeclineClick && (
            <button
              type="button"
              onClick={() => onDeclineClick(dispute)}
              className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0] hover:bg-rose-50 hover:border-rose-200 text-rose-600 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
            >
              Decline
            </button>
          )}
          <button
            type="button"
            onClick={() => onActivateClick(dispute)}
            className="h-8 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Activate Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PendingRequestsList({
  disputes,
  onActivateClick,
  onDeclineClick,
}: PendingRequestsListProps) {
  if (disputes.length === 0) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-12 text-center text-[#9a99b0] font-medium text-xs">
        No pending dispute requests awaiting activation.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {disputes.map((dispute) => (
        <PendingRequestRow
          key={dispute.id}
          dispute={dispute}
          onActivateClick={onActivateClick}
          onDeclineClick={onDeclineClick}
        />
      ))}
    </div>
  );
}
