"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { AdminStatusBadge } from "../AdminStatusBadge";
import CreatorProfileDrawer from "./CreatorProfileDrawer";

interface CreatorItem {
  id: string;
  creatorId: string;
  name: string;
  handle: string;
  email: string;
  country: string;
  tier: "Mega" | "Macro" | "Micro" | "Nano";
  niche: string;
  gender: "Male" | "Female";
  platforms: ("IG" | "TikTok" | "YT")[];
  completion: number;
  totalEarnings: number;
  revisionCount: number;
  status: "Active" | "Pending" | "Suspended";
  dateJoined: string;
  lastLogin: string;
}

const MOCK_CREATORS: CreatorItem[] = [
  {
    id: "1",
    creatorId: "CRT-5021",
    name: "Amara Osei",
    handle: "@amara.creates",
    email: "amara@email.com",
    country: "Lagos, Nigeria",
    tier: "Macro",
    niche: "Fashion",
    gender: "Female",
    platforms: ["IG", "TikTok"],
    completion: 100,
    totalEarnings: 1500000,
    revisionCount: 2,
    status: "Active",
    dateJoined: "Jan 15, 2026",
    lastLogin: "2 hours ago",
  },
  {
    id: "2",
    creatorId: "CRT-1092",
    name: "Chidi Nwosu",
    handle: "@chidiplays",
    email: "chidi@email.com",
    country: "Abuja, Nigeria",
    tier: "Micro",
    niche: "Tech",
    gender: "Male",
    platforms: ["TikTok", "YT"],
    completion: 85,
    totalEarnings: 850000,
    revisionCount: 4,
    status: "Active",
    dateJoined: "Feb 1, 2026",
    lastLogin: "1 day ago",
  },
  {
    id: "3",
    creatorId: "CRT-7742",
    name: "Tolu Fashola",
    handle: "@tolustyles",
    email: "tolu@email.com",
    country: "Lagos, Nigeria",
    tier: "Mega",
    niche: "Fashion",
    gender: "Female",
    platforms: ["IG", "TikTok", "YT"],
    completion: 100,
    totalEarnings: 5200000,
    revisionCount: 1,
    status: "Pending",
    dateJoined: "Nov 5, 2025",
    lastLogin: "3 days ago",
  },
  {
    id: "4",
    creatorId: "CRT-0985",
    name: "Ngozi Eze",
    handle: "@ngozi.beauty",
    email: "ngozi@email.com",
    country: "Enugu, Nigeria",
    tier: "Micro",
    niche: "Beauty",
    gender: "Female",
    platforms: ["IG"],
    completion: 75,
    totalEarnings: 450000,
    revisionCount: 0,
    status: "Active",
    dateJoined: "Apr 20, 2026",
    lastLogin: "4 hours ago",
  },
  {
    id: "5",
    creatorId: "CRT-8813",
    name: "Emeka Dev",
    handle: "@emekadev",
    email: "emeka@email.com",
    country: "Enugu, Nigeria",
    tier: "Nano",
    niche: "Tech, Beauty",
    gender: "Male",
    platforms: ["IG"],
    completion: 75,
    totalEarnings: 300000,
    revisionCount: 5,
    status: "Suspended",
    dateJoined: "Apr 20, 2026",
    lastLogin: "1 week ago",
  },
  {
    id: "6",
    creatorId: "CRT-4491",
    name: "Zara Bello",
    handle: "@zarabellocooks",
    email: "zara@email.com",
    country: "Port Harcourt, Nigeria",
    tier: "Nano",
    niche: "Lifestyle",
    gender: "Female",
    platforms: ["IG"],
    completion: 60,
    totalEarnings: 200000,
    revisionCount: 3,
    status: "Pending",
    dateJoined: "Mar 10, 2026",
    lastLogin: "Just now",
  },
];

type FilterTab = "All" | "Active" | "Suspended" | "Pending";

const TIER_CLASSES = {
  Mega: "text-[#ea580c] bg-[#fff7ed] border-[#ffedd5]",
  Macro: "text-[#2f63eb] bg-[#edf2fe] border-[#dbeafe]",
  Micro: "text-[#7c3aed] bg-[#f5f3ff] border-[#e0e7ff]",
  Nano: "text-[#16a34a] bg-[#f0fdf4] border-[#dcfce7]",
};

export default function CreatorTable() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "Week" | "Month" | "Year"
  >("Week");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null,
  );

  const filtered = MOCK_CREATORS.filter((c) => {
    if (activeTab !== "All" && c.status !== activeTab) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.handle.toLowerCase().includes(search.toLowerCase()) &&
      !c.creatorId.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (selectedTier && c.tier !== selectedTier) return false;
    if (selectedNiche && !c.niche.includes(selectedNiche)) return false;
    if (selectedGender && c.gender !== selectedGender) return false;
    if (selectedStatus && c.status !== selectedStatus) return false;
    if (selectedCountry && c.country !== selectedCountry) return false;
    return true;
  });

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#f4f3f6] border border-[#e8e6f0]/80 p-1 rounded-xl w-fit self-start max-w-full overflow-x-auto scrollbar-none">
        {(["All", "Active", "Suspended", "Pending"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                active
                  ? "bg-brand-pink text-white shadow-sm"
                  : "bg-transparent text-[#5a5a7a] hover:text-[#1a1a2e]",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex items-center min-w-[240px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 text-[#9a99b0]" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
            />
          </div>

          {/* Filter dropdowns */}
          {[
            {
              value: selectedTier,
              onChange: setSelectedTier,
              label: "Tier",
              options: ["Mega", "Macro", "Micro", "Nano"],
            },
            {
              value: selectedNiche,
              onChange: setSelectedNiche,
              label: "Niche",
              options: ["Fashion", "Tech", "Beauty", "Lifestyle"],
            },
            {
              value: selectedGender,
              onChange: setSelectedGender,
              label: "Gender",
              options: ["Male", "Female"],
            },
            {
              value: selectedStatus,
              onChange: setSelectedStatus,
              label: "Status",
              options: ["Active", "Pending", "Suspended"],
            },
            {
              value: selectedCountry,
              onChange: setSelectedCountry,
              label: "Country",
              options: [
                "Lagos, Nigeria",
                "Abuja, Nigeria",
                "Enugu, Nigeria",
                "Port Harcourt, Nigeria",
              ],
            },
            {
              value: selectedYear,
              onChange: setSelectedYear,
              label: "Year",
              options: ["2026", "2025", "2024"],
            },
          ].map(({ value, onChange, label, options }) => (
            <div key={label} className="relative">
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 pl-4 pr-9 rounded-xl bg-white border border-[#e8e6f0] text-xs font-semibold text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer appearance-none"
              >
                <option value="">{label}</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center bg-[#f4f3f6] rounded-xl p-0.5 border border-[#e8e6f0]/60 shrink-0">
          {(["Week", "Month", "Year"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTimeframe(t)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                selectedTimeframe === t
                  ? "bg-white text-brand-pink shadow-sm"
                  : "text-[#7a7a9a] hover:text-[#1a1a2e]",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              <th className="pb-3.5 pl-2">Creator ID</th>
              <th className="pb-3.5">Creator</th>
              <th className="pb-3.5">Email</th>
              <th className="pb-3.5">Country</th>
              <th className="pb-3.5">Tier</th>
              <th className="pb-3.5">Niche</th>
              <th className="pb-3.5">Gender</th>
              <th className="pb-3.5">Platforms</th>
              <th className="pb-3.5">Profile Completion</th>
              <th className="pb-3.5">Earnings</th>
              <th className="pb-3.5 text-center">Revisions</th>
              <th className="pb-3.5">Status</th>
              <th className="pb-3.5">Date Joined</th>
              <th className="pb-3.5">Last Login</th>
              <th className="pb-3.5 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/30 text-xs">
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-[#faf9fc]/40 transition-colors"
              >
                <td className="py-3 pl-2 text-[#5a5a7a] font-medium">
                  {c.creatorId}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      initials={c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      size={28}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1a1a2e]">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[#9a99b0]">
                        {c.handle}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-[#5a5a7a]">{c.email}</td>
                <td className="py-3 text-[#5a5a7a]">{c.country}</td>
                <td className="py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize",
                      TIER_CLASSES[c.tier],
                    )}
                  >
                    {c.tier}
                  </span>
                </td>
                <td className="py-3 text-[#5a5a7a]">{c.niche}</td>
                <td className="py-3 text-[#5a5a7a]">{c.gender}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    {c.platforms.map((p) => {
                      if (p === "IG")
                        return (
                          <span
                            key={p}
                            className="p-1 rounded-md bg-[#fdf2f6] text-[#d7176f] border border-[#fce7f3]"
                          >
                            <FaInstagram size={12} />
                          </span>
                        );
                      if (p === "YT")
                        return (
                          <span
                            key={p}
                            className="p-1 rounded-md bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2]"
                          >
                            <FaYoutube size={12} />
                          </span>
                        );
                      if (p === "TikTok")
                        return (
                          <span
                            key={p}
                            className="p-1 rounded-md bg-[#f4f3f6] text-[#1a1a2e] border border-[#e8e6f0]"
                          >
                            <FaTiktok size={11} />
                          </span>
                        );
                      return null;
                    })}
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <div className="w-12 h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden shrink-0">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          c.completion === 100
                            ? "bg-[#16a34a]"
                            : "bg-[#ca8a04]",
                        )}
                        style={{ width: `${c.completion}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#1a1a2e] text-[10px]">
                      {c.completion}%
                    </span>
                  </div>
                </td>
                <td className="py-3 font-semibold text-[#1a1a2e] whitespace-nowrap">
                  ₦{c.totalEarnings.toLocaleString()}
                </td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-[#f4f3f6] text-[#5a5a7a] font-bold text-[10px]">
                    {c.revisionCount}
                  </span>
                </td>
                <td className="py-3">
                  <AdminStatusBadge status={c.status.toLowerCase()} />
                </td>
                <td className="py-3 text-[#9a99b0] whitespace-nowrap">
                  {c.dateJoined}
                </td>
                <td className="py-3 text-[#9a99b0] whitespace-nowrap">
                  {c.lastLogin}
                </td>
                <td className="py-3 text-right pr-2">
                  <button
                    onClick={() => setSelectedCreatorId(c.id)}
                    className="h-8 px-3.5 bg-[#eff6ff] text-[#2563eb] rounded-xl hover:bg-[#dbeafe] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs font-bold shrink-0"
                  >
                    <Eye size={13} className="shrink-0" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreatorProfileDrawer
        isOpen={selectedCreatorId !== null}
        onClose={() => setSelectedCreatorId(null)}
        creatorId={selectedCreatorId}
      />
    </section>
  );
}
