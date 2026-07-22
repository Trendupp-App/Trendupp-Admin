"use client";

import UserAvatar from "@/shared/UserAvatar";

interface Creator {
  rank: number;
  name: string;
  handle: string;
  initials: string;
  tier: string;
  earnings: string;
  campaigns: number;
}

const MOCK: Creator[] = [
  {
    rank: 1,
    name: "Tolu Fashola",
    handle: "@to.ustyles",
    initials: "TF",
    tier: "mega",
    earnings: "₦2.1M",
    campaigns: 15,
  },
  {
    rank: 2,
    name: "Amara Osei",
    handle: "@amara.creates",
    initials: "AO",
    tier: "macro",
    earnings: "₦847K",
    campaigns: 11,
  },
  {
    rank: 3,
    name: "Ngozi Eze",
    handle: "@ngozi.by.beauty",
    initials: "NE",
    tier: "micro",
    earnings: "₦441K",
    campaigns: 9,
  },
  {
    rank: 4,
    name: "Chidi Nwosu",
    handle: "@chidi.lifestyle",
    initials: "CN",
    tier: "micro",
    earnings: "₦312K",
    campaigns: 7,
  },
  {
    rank: 5,
    name: "Emeka Dev",
    handle: "@emeka.dev",
    initials: "ED",
    tier: "nano",
    earnings: "₦98K",
    campaigns: 3,
  },
];

const TIER_COLOR: Record<string, string> = {
  mega: "text-[#7c3aed] bg-[#f5f3ff]",
  macro: "text-[#2f63eb] bg-[#edf2fe]",
  micro: "text-brand-pink bg-brand-pink-light",
  nano: "text-[#16a34a] bg-[#f0fdf4]",
};

import { TopCreatorDto } from "@/types/adminOverview";

interface AdminTopCreatorsProps {
  creators?: TopCreatorDto[];
}

export function AdminTopCreators({ creators }: AdminTopCreatorsProps) {
  const creatorsList: Creator[] = creators?.length
    ? creators.map((item, idx) => ({
        rank: idx + 1,
        name: item.name,
        handle: item.handle.startsWith("@") ? item.handle : `@${item.handle}`,
        initials: item.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        tier: item.tier.toLowerCase(),
        earnings:
          item.totalEarnings >= 1000000
            ? `₦${(item.totalEarnings / 1000000).toFixed(1)}M`
            : `₦${(item.totalEarnings / 1000).toFixed(0)}K`,
        campaigns: item.completedCampaigns,
      }))
    : MOCK;

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-[#1a1a2e]">Top Creators</h2>
        <button className="text-[10px] text-brand-pink font-semibold hover:underline">
          View All ›
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {creatorsList.map(
          ({ rank, name, handle, initials, tier, earnings, campaigns }) => (
            <div key={rank} className="flex items-center gap-3 py-1">
              <span className="text-xs font-bold text-[#b0aec8] w-4 shrink-0">
                {rank}
              </span>
              <UserAvatar initials={initials} size={34} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#1a1a2e] truncate">
                  {name}
                </span>
                <span className="text-[10px] text-[#9a99b0]">{handle}</span>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${TIER_COLOR[tier] ?? ""}`}
              >
                {tier}
              </span>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-bold text-brand-pink">
                  {earnings}
                </span>
                <span className="text-[9px] text-[#9a99b0]">
                  {campaigns} campaigns
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
