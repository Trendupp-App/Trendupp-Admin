"use client";

import { Download } from "lucide-react";

export default function CampaignAuditLogTab() {
  const logs = [
    {
      admin: "Chisom A.",
      action: "Campaign Approved",
      prev: "Pending Review",
      next: "Live",
      reason: "Brief complete and compliant",
      time: "Jun 1 11:30",
    },
    {
      admin: "Chisom A.",
      action: "Escrow Released",
      prev: "Held",
      next: "Released",
      reason: "Verification confirmed",
      time: "Jun 15 09:00",
    },
  ];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 text-left">
      <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-3">
        <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
          Audit Log &mdash; Immutable administrative record
        </h3>
        <button className="h-8.5 px-3.5 border border-[#e8e6f0] text-[10px] font-bold text-[#5a5a7a] rounded-lg hover:bg-[#faf9fc] transition-colors cursor-pointer flex items-center gap-1.5">
          <Download size={11} /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e8e6f0]/40 text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
              <th className="pb-3 pl-2">Admin</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Previous Value</th>
              <th className="pb-3">New Value</th>
              <th className="pb-3">Reason</th>
              <th className="pb-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
            {logs.map((row, i) => (
              <tr key={i} className="hover:bg-[#faf9fc]/30">
                <td className="py-3.5 pl-2 font-bold text-[#1a1a2e]">
                  {row.admin}
                </td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-brand-pink">
                    Super Admin
                  </span>
                </td>
                <td className="py-3.5 font-semibold text-[#1a1a2e]">
                  {row.action}
                </td>
                <td className="py-3.5 text-[#7a7a9a] font-medium">
                  {row.prev}
                </td>
                <td className="py-3.5">
                  <span className="text-[#16a34a] font-bold">{row.next}</span>
                </td>
                <td className="py-3.5 text-[#5a5a7a] font-medium">
                  {row.reason}
                </td>
                <td className="py-3.5 text-[#9a99b0] font-semibold">
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
