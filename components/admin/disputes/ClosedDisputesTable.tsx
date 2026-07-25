"use client";

import { Dispute, EscrowActionType } from "@/types/dispute";
import { ArrowRightLeft } from "lucide-react";
import { useUserById } from "@/hooks/useUsers";

interface ClosedDisputesTableProps {
  disputes: Dispute[];
}

const DECISION_BADGE: Record<
  EscrowActionType,
  { label: string; className: string }
> = {
  release_to_creator: {
    label: "Side with Creator",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  refund_to_brand: {
    label: "Refund to Brand",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  split: {
    label: "Mutual Agreement (Split)",
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
  allow_content_submission: {
    label: "Allowed Content Submission",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  allow_content_review: {
    label: "Allowed Content Review",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  allow_revised_submission: {
    label: "Allowed Revised Submission",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  allow_revised_review: {
    label: "Allowed Revised Review",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

function ClosedDisputeRow({ dispute }: { dispute: Dispute }) {
  const { data: brandUser } = useUserById(dispute.brandId);
  const { data: creatorUser } = useUserById(dispute.creatorId);

  const brand =
    `${brandUser?.firstName ?? ""} ${brandUser?.lastName ?? ""}`.trim() ||
    "Brand";
  const creator =
    `${creatorUser?.firstName ?? ""} ${creatorUser?.lastName ?? ""}`.trim() ||
    "Creator";
  const campaignTitle = dispute.campaign?.title || "Campaign";
  const chatId = `CH-${dispute.id.slice(0, 6).toUpperCase()}`;
  const resolvedByName = dispute.resolvedBy
    ? `${dispute.resolvedBy.firstName} ${dispute.resolvedBy.lastName}`.trim()
    : "—";

  const decision = dispute.escrowAction
    ? DECISION_BADGE[dispute.escrowAction]
    : null;

  return (
    <tr className="hover:bg-[#faf9fc]/60 transition-colors">
      <td className="pl-6 py-4.5 font-bold text-[#1a1a2e]">{chatId}</td>

      <td className="py-4.5 font-semibold text-[#1a1a2e]">{campaignTitle}</td>

      <td className="py-4.5">
        <div className="flex items-center gap-1.5 text-[#5a5a7a] font-medium">
          <span className="font-semibold text-[#1a1a2e]">{brand}</span>
          <ArrowRightLeft size={10} className="text-[#9a99b0]" />
          <span>{creator}</span>
        </div>
      </td>

      <td className="py-4.5">
        {decision ? (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${decision.className}`}
          >
            {decision.label}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f3f6] text-[#5a5a7a] border border-[#e8e6f0]">
            Resolved
          </span>
        )}
      </td>

      <td className="py-4.5 font-semibold text-[#5a5a7a]">{resolvedByName}</td>

      <td className="pr-6 py-4.5 text-[#7a7a9a] font-medium">
        {new Date(
          dispute.resolvedAt || dispute.updatedAt || dispute.createdAt,
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}

export default function ClosedDisputesTable({
  disputes,
}: ClosedDisputesTableProps) {
  if (disputes.length === 0) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-12 text-center text-[#9a99b0] font-medium text-xs">
        No closed/resolved disputes history found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e8e6f0] bg-[#faf9fc] text-[#9a99b0] font-bold uppercase tracking-wider text-[10px]">
              <th className="pl-6 py-4">CHAT ID</th>
              <th className="py-4">CAMPAIGN</th>
              <th className="py-4">PARTIES</th>
              <th className="py-4">DECISION</th>
              <th className="py-4">RESOLVED BY</th>
              <th className="pr-6 py-4">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/60">
            {disputes.map((dispute) => (
              <ClosedDisputeRow key={dispute.id} dispute={dispute} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
