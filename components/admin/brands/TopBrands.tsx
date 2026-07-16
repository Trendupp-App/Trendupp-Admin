"use client";

import Link from "next/link";

const PepsiLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-9 h-9 rounded-full overflow-hidden shadow-sm shrink-0"
  >
    <path
      d="M 50,5 A 45,45 0 0 1 95,50 C 95,50 80,35 50,45 C 20,55 5,50 5,50 A 45,45 0 0 1 50,5 Z"
      fill="#E31837"
    />
    <path
      d="M 50,95 A 45,45 0 0 1 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 A 45,45 0 0 1 50,95 Z"
      fill="#004B87"
    />
    <path
      d="M 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 C 95,50 78,28 50,38 C 22,48 5,50 5,50 Z"
      fill="#FFFFFF"
    />
  </svg>
);

const BRANDS = [
  {
    rank: 1,
    name: "Pepsi",
    web: "www.pepsi.ng",
    earnings: "₦2.1M",
    campaigns: 23,
    rankColor: "bg-[#f59e0b] text-white",
  },
  {
    rank: 2,
    name: "Pepsi",
    web: "www.pepsi.ng",
    earnings: "₦847K",
    campaigns: 14,
    rankColor: "bg-[#fbbf24] text-white",
  },
  {
    rank: 3,
    name: "Pepsi",
    web: "www.pepsi.ng",
    earnings: "₦441K",
    campaigns: 11,
    rankColor: "bg-[#fcd34d] text-white",
  },
  {
    rank: 4,
    name: "Pepsi",
    web: "www.pepsi.ng",
    earnings: "₦312K",
    campaigns: 7,
    rankColor: "bg-[#e5e7eb] text-[#5a5a7a]",
  },
  {
    rank: 5,
    name: "Pepsi",
    web: "www.pepsi.ng",
    earnings: "₦98K",
    campaigns: 3,
    rankColor: "bg-[#e5e7eb] text-[#5a5a7a]",
  },
];

export default function TopBrands() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#1a1a2e]">Top Brand</h2>
        <Link
          href="#"
          className="text-xs font-bold text-brand-pink hover:opacity-90"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {BRANDS.map((b) => (
          <div key={b.rank} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${b.rankColor}`}
            >
              {b.rank}
            </div>
            <PepsiLogo />
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-xs font-bold text-[#1a1a2e]">{b.name}</span>
              <span className="text-[10px] text-[#9a99b0] mt-0.5 truncate">
                {b.web}
              </span>
            </div>
            <div className="text-right flex flex-col shrink-0">
              <span className="text-xs font-bold text-brand-pink">
                {b.earnings}
              </span>
              <span className="text-[9px] text-[#9a99b0] font-medium">
                {b.campaigns} campaigns
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
