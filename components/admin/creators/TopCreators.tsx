"use client";

import Link from "next/link";
import UserAvatar from "@/shared/UserAvatar";
import { useTopCreators } from "@/hooks/useAdminCreators";

const TIER_BADGE_COLORS: Record<string, string> = {
  Mega: "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
  Macro: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
  Micro: "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]",
  Nano: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
};

export default function TopCreators() {
  const { data: topCreatorsList } = useTopCreators();

  const creators = topCreatorsList?.length
    ? topCreatorsList.map((c, idx) => ({
        rank: idx + 1,
        name: c.name || "Creator",
        tier: c.tier || "Micro",
        handle: c.handle
          ? c.handle.startsWith("@")
            ? c.handle
            : `@${c.handle}`
          : "@creator",
        earnings:
          (c.totalEarnings ?? 0) >= 1000000
            ? `₦${((c.totalEarnings ?? 0) / 1000000).toFixed(1)}M`
            : `₦${((c.totalEarnings ?? 0) / 1000).toFixed(0)}K`,
        campaigns: c.completedCampaigns ?? 0,
        initials: (c.name || "Creator")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        rankColor:
          idx < 3 ? "bg-[#f59e0b] text-white" : "bg-[#e5e7eb] text-[#5a5a7a]",
        badgeColor:
          TIER_BADGE_COLORS[c.tier] ||
          "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]",
      }))
    : [
        {
          rank: 1,
          name: "Tolu Fashola",
          tier: "Mega",
          handle: "@tolustyles",
          earnings: "₦2.1M",
          campaigns: 23,
          initials: "TF",
          rankColor: "bg-[#f59e0b] text-white",
          badgeColor: "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
        },
        {
          rank: 2,
          name: "Amara Osei",
          tier: "Macro",
          handle: "@amara.creates",
          earnings: "₦847K",
          campaigns: 14,
          initials: "AO",
          rankColor: "bg-[#fbbf24] text-white",
          badgeColor: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
        },
        {
          rank: 3,
          name: "Ngozi Eze",
          tier: "Micro",
          handle: "@ngozi.beauty",
          earnings: "₦441K",
          campaigns: 11,
          initials: "NE",
          rankColor: "bg-[#fcd34d] text-white",
          badgeColor: "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]",
        },
        {
          rank: 4,
          name: "Chidi Nwosu",
          tier: "Micro",
          handle: "@chidiplays",
          earnings: "₦312K",
          campaigns: 7,
          initials: "CN",
          rankColor: "bg-[#e5e7eb] text-[#5a5a7a]",
          badgeColor: "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]",
        },
        {
          rank: 5,
          name: "Emeka Dev",
          tier: "Nano",
          handle: "@emekadev",
          earnings: "₦98K",
          campaigns: 3,
          initials: "ED",
          rankColor: "bg-[#e5e7eb] text-[#5a5a7a]",
          badgeColor: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
        },
      ];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#1a1a2e]">Top Creators</h2>
        <Link
          href="#"
          className="text-xs font-bold text-brand-pink hover:opacity-90"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {creators.map((c) => (
          <div key={c.rank} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${c.rankColor}`}
            >
              {c.rank}
            </div>

            <UserAvatar initials={c.initials} size={36} />

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1a1a2e] truncate">
                  {c.name}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${c.badgeColor}`}
                >
                  {c.tier}
                </span>
              </div>
              <span className="text-[10px] text-[#7a7a9a]">{c.handle}</span>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-xs font-bold text-brand-pink">
                {c.earnings}
              </span>
              <span className="text-[10px] text-[#7a7a9a]">
                {c.campaigns} campaigns
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
