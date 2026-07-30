"use client";

import Link from "next/link";
import UserAvatar from "@/shared/UserAvatar";
import { useTopCreators } from "@/hooks/useAdminCreators";
import { CardFilterHeaderControls } from "./CardFilterHeaderControls";
import { CardDateRangeBar } from "./CardDateRangeBar";

const TIER_BADGE_COLORS: Record<string, string> = {
  Mega: "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
  Macro: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
  Micro: "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]",
  Nano: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
};

export default function TopCreators() {
  const { data: topCreatorsList, isLoading } = useTopCreators();

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
          (c.totalEarnings ?? 0) >= 1_000_000
            ? `₦${((c.totalEarnings ?? 0) / 1_000_000).toFixed(1)}M`
            : (c.totalEarnings ?? 0) >= 1_000
              ? `₦${((c.totalEarnings ?? 0) / 1_000).toFixed(0)}K`
              : `₦${(c.totalEarnings ?? 0).toLocaleString()}`,
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
    : [];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1a1a2e]">
              Top Creators
            </h2>
            <span className="text-xs text-[#9a99b0]">By total earnings</span>
          </div>

          <Link
            href="/admin/users/creators"
            className="text-xs font-bold text-brand-pink hover:underline shrink-0"
          >
            View all
          </Link>
        </div>

        <div className="pt-0.5">
          <CardFilterHeaderControls />
        </div>

        {/* Date Range Selector Toolbar (From, To) */}
        <div className="pt-2 border-t border-[#f4f3f6] flex justify-start">
          <CardDateRangeBar />
        </div>
      </div>

      <div className="flex flex-col gap-3.5 max-h-[340px] overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf9fc] animate-pulse"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#e8e6f0]/60 shrink-0" />
                <div className="w-10 h-10 rounded-full bg-[#e8e6f0]/60 shrink-0" />
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="w-24 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                  <div className="w-16 h-3 rounded-md bg-[#e8e6f0]/40" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 pl-2">
                <div className="w-14 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                <div className="w-12 h-3 rounded-md bg-[#e8e6f0]/40" />
              </div>
            </div>
          ))
        ) : creators.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#9a99b0]">
            No top creators data available.
          </div>
        ) : (
          creators.map((c) => (
            <div
              key={c.rank}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf9fc] hover:bg-[#f4f3f6] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${c.rankColor}`}
                >
                  {c.rank}
                </span>

                <UserAvatar initials={c.initials} size={40} />

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1a1a2e] truncate">
                      {c.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${c.badgeColor}`}
                    >
                      {c.tier}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9a99b0] truncate">
                    {c.handle}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  {c.earnings}
                </span>
                <span className="text-[10px] text-[#9a99b0]">
                  {c.campaigns} campaigns
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
