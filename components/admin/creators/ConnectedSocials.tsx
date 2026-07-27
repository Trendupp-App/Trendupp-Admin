"use client";

import { useCreatorSummary } from "@/hooks/useAdminCreators";

interface SocialItem {
  platform: string;
  count: number;
  pct: number;
}

export default function ConnectedSocials() {
  const { data, isLoading } = useCreatorSummary();

  const counts = data?.connectedSocials;
  const total = data?.summary.totalCreators || 1;
  const pctOf = (count: number) =>
    Math.min(100, Math.round((count / total) * 100));

  const items: SocialItem[] = [
    {
      platform: "YouTube",
      count: counts?.youtube ?? 0,
      pct: pctOf(counts?.youtube ?? 0),
    },
    {
      platform: "Instagram",
      count: counts?.instagram ?? 0,
      pct: pctOf(counts?.instagram ?? 0),
    },
    {
      platform: "TikTok",
      count: counts?.tiktok ?? 0,
      pct: pctOf(counts?.tiktok ?? 0),
    },
    {
      platform: "X(Twitter)",
      count: counts?.twitter ?? 0,
      pct: pctOf(counts?.twitter ?? 0),
    },
    {
      platform: "Facebook",
      count: counts?.facebook ?? 0,
      pct: pctOf(counts?.facebook ?? 0),
    },
  ];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Connected socials
          </h3>
          <span className="text-[10px] text-[#9a99b0] font-medium">
            5 connected socials
          </span>
        </div>
        <select className="h-7 px-2 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-[10px] font-semibold rounded-lg outline-none cursor-pointer">
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex flex-col gap-3.5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 animate-pulse">
                <div className="flex justify-between items-center text-xs">
                  <div className="w-16 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                  <div className="w-16 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                </div>
                <div className="w-full h-1.5 bg-[#e8e6f0]/40 rounded-full" />
              </div>
            ))
          : items.map((item) => (
              <div key={item.platform} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#edf2fe] text-[#2f63eb]">
                    {item.platform}
                  </span>
                  <span className="font-bold text-[#1a1a2e]">
                    {item.count.toLocaleString()}{" "}
                    <span className="text-[#9a99b0] font-normal">
                      ({item.pct}%)
                    </span>
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-pink transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
