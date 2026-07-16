"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignItem {
  id: string;
  title: string;
  brand: string;
  budget: string;
  tier: string;
  platform: string;
  applications: number;
  status: "Live" | "Active" | "Completed" | "Draft" | "Cancelled";
  escrow: "Funded" | "Released" | "Not Funded";
  endDate: string;
  created: string;
}

const MOCK_CAMPAIGNS: CampaignItem[] = [
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Live",
    escrow: "Funded",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Live",
    escrow: "Funded",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Live",
    escrow: "Funded",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Live",
    escrow: "Funded",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Active",
    escrow: "Funded",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Completed",
    escrow: "Released",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
  {
    id: "TRD-1001",
    title: "Summer Style Collectic",
    brand: "Zara Africa",
    budget: "₦3,000,000",
    tier: "Micro",
    platform: "Instagram",
    applications: 47,
    status: "Draft",
    escrow: "Not Funded",
    endDate: "Jun 1, 2026",
    created: "Jun 1, 2026",
  },
];

interface CampaignTableProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function CampaignTable({
  selectedStatus,
  onSelectStatus,
}: CampaignTableProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const filtered = MOCK_CAMPAIGNS.filter((c) => {
    if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
    if (
      search &&
      !c.title.toLowerCase().includes(search.toLowerCase()) &&
      !c.brand.toLowerCase().includes(search.toLowerCase()) &&
      !c.id.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (selectedBrand && c.brand !== selectedBrand) return false;
    if (selectedTier && c.tier !== selectedTier) return false;
    if (selectedPlatform && c.platform !== selectedPlatform) return false;
    return true;
  });

  const getStatusChip = (s: string) => {
    const maps = {
      Live: "bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]",
      Active: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
      Completed: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
      Draft: "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
      Cancelled: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
    };
    return (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit",
          maps[s as keyof typeof maps],
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        {s}
      </span>
    );
  };

  const getEscrowChip = (e: string) => {
    const maps = {
      Funded: "bg-[#f0fdf4] text-[#16a34a]",
      Released: "bg-[#eff6ff] text-[#2563eb]",
      "Not Funded": "bg-[#fff7ed] text-[#ea580c]",
    };
    return (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
          maps[e as keyof typeof maps],
        )}
      >
        {e}
      </span>
    );
  };

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      {/* Top Search bar & Filters toggle */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center min-w-[280px] flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 text-[#9a99b0]" />
          <input
            type="text"
            placeholder="Search by Campaign Title, ID or Brand Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9.5 w-full bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-9.5 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-colors flex items-center gap-2",
            showFilters
              ? "bg-brand-pink-light border-[#fae2ec] text-brand-pink"
              : "border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc]",
          )}
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
      </div>

      {/* Dropdown filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-[#e8e6f0]/40 py-4.5 animate-fade-in-up">
          {[
            {
              label: "Brand",
              value: selectedBrand,
              onChange: setSelectedBrand,
              options: ["Zara Africa"],
            },
            {
              label: "Creator Tier",
              value: selectedTier,
              onChange: setSelectedTier,
              options: ["Micro", "Macro", "Nano", "Mega"],
            },
            {
              label: "Platform",
              value: selectedPlatform,
              onChange: setSelectedPlatform,
              options: ["Instagram", "TikTok", "YouTube"],
            },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                {f.label}
              </span>
              <div className="relative">
                <select
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="h-9.5 w-full pl-4 pr-10 rounded-xl border border-[#e8e6f0] bg-white text-xs font-semibold text-[#1a1a2e] appearance-none cursor-pointer focus:outline-none"
                >
                  <option value="">All</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status tab pills row */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {[
          { label: "All", count: 7 },
          { label: "Draft", count: 1 },
          { label: "Live", count: 1 },
          { label: "Active", count: 1 },
          { label: "Completed", count: 1 },
          { label: "Cancelled", count: 0 },
        ].map((t) => {
          const active = selectedStatus === t.label;
          return (
            <button
              key={t.label}
              onClick={() => onSelectStatus(t.label)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                active
                  ? "bg-brand-pink text-white shadow-sm"
                  : "bg-[#f4f3f6] text-[#5a5a7a] hover:bg-[#e8e6f0]",
              )}
            >
              {t.label} ({t.count})
            </button>
          );
        })}
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              <th className="pb-3.5 pl-2">Campaign ID</th>
              <th className="pb-3.5">Campaign Title</th>
              <th className="pb-3.5">Brand</th>
              <th className="pb-3.5">Budget</th>
              <th className="pb-3.5">Creator Tier</th>
              <th className="pb-3.5">Posting Platform</th>
              <th className="pb-3.5">Applications</th>
              <th className="pb-3.5">Status</th>
              <th className="pb-3.5">Escrow</th>
              <th className="pb-3.5">End Date</th>
              <th className="pb-3.5">Created</th>
              <th className="pb-3.5 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
            {filtered.map((c, i) => (
              <tr key={i} className="hover:bg-[#faf9fc]/40 transition-colors">
                <td className="py-3.5 pl-2 text-[#9a99b0] font-semibold">
                  {c.id}
                </td>
                <td className="py-3.5 font-bold text-[#1a1a2e]">{c.title}</td>
                <td className="py-3.5 text-[#5a5a7a]">{c.brand}</td>
                <td className="py-3.5 font-bold text-brand-pink">{c.budget}</td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]">
                    {c.tier}
                  </span>
                </td>
                <td className="py-3.5 text-[#5a5a7a]">{c.platform}</td>
                <td className="py-3.5 font-bold text-[#1a1a2e]">
                  {c.applications}
                </td>
                <td className="py-3.5">{getStatusChip(c.status)}</td>
                <td className="py-3.5">{getEscrowChip(c.escrow)}</td>
                <td className="py-3.5 text-[#5a5a7a]">{c.endDate}</td>
                <td className="py-3.5 text-[#9a99b0]">{c.created}</td>
                <td className="py-3.5 text-right pr-2">
                  <Link
                    href={`/admin/campaigns/${c.id}`}
                    className="p-1.5 hover:bg-[#f4f3f6] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold text-brand-pink"
                  >
                    <Eye size={12} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#e8e6f0]/40 pt-4 mt-2">
        <span className="text-[11px] text-[#9a99b0] font-medium">
          Showing 1-{filtered.length} of {filtered.length} campaigns
        </span>

        <div className="flex items-center bg-[#f4f3f6] rounded-xl p-0.5 border border-[#e8e6f0]/60 shrink-0">
          <button className="p-1.5 rounded-lg text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer">
            <ChevronLeft size={13} />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={cn(
                "w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                page === 1
                  ? "bg-white text-brand-pink shadow-sm"
                  : "text-[#7a7a9a] hover:text-[#1a1a2e]",
              )}
            >
              {page}
            </button>
          ))}
          <button className="p-1.5 rounded-lg text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
