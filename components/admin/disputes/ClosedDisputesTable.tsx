"use client";

import { Dispute } from "@/types/dispute";
import { ArrowRightLeft } from "lucide-react";

interface ClosedDisputesTableProps {
  disputes: Dispute[];
  getCampaignTitle: (campaignId: string) => string;
  getBrandName: (campaignId: string) => string;
  getCreatorName: (creatorId: string) => string;
  currentAdminName?: string;
}

export default function ClosedDisputesTable({
  disputes,
  getCampaignTitle,
  getBrandName,
  getCreatorName,
  currentAdminName = "Admin",
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
            {disputes.map((dispute, index) => {
              const brand = getBrandName(dispute.campaignId);
              const creator = getCreatorName(dispute.creatorId);
              const chatId = dispute.id
                ? `CH-${dispute.id.slice(0, 6).toUpperCase()}`
                : `CH-00${index + 1}`;

              let decisionBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Side with Creator
                </span>
              );

              if (dispute.action === "refund_to_brand") {
                decisionBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Refund to Brand
                  </span>
                );
              } else if (dispute.action === "split") {
                decisionBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Mutual Agreement (Split)
                  </span>
                );
              }

              return (
                <tr
                  key={dispute.id}
                  className="hover:bg-[#faf9fc]/60 transition-colors"
                >
                  <td className="pl-6 py-4.5 font-bold text-[#1a1a2e]">
                    {chatId}
                  </td>

                  <td className="py-4.5 font-semibold text-[#1a1a2e]">
                    {getCampaignTitle(dispute.campaignId)}
                  </td>

                  <td className="py-4.5">
                    <div className="flex items-center gap-1.5 text-[#5a5a7a] font-medium">
                      <span className="font-semibold text-[#1a1a2e]">
                        {brand}
                      </span>
                      <ArrowRightLeft size={10} className="text-[#9a99b0]" />
                      <span>{creator}</span>
                    </div>
                  </td>

                  <td className="py-4.5">{decisionBadge}</td>

                  <td className="py-4.5 font-semibold text-[#5a5a7a]">
                    {currentAdminName}
                  </td>

                  <td className="pr-6 py-4.5 text-[#7a7a9a] font-medium">
                    {new Date(
                      dispute.updatedAt || dispute.createdAt,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
