"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  ChevronDown,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { AdminStatusBadge } from "../AdminStatusBadge";
import CreatorProfileDrawer from "./CreatorProfileDrawer";
import { useAdminCreatorsList } from "@/hooks/useAdminCreators";

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

type FilterTab = "All" | "Active" | "Suspended" | "Pending";

const TIER_CLASSES: Record<string, string> = {
  Mega: "text-[#ea580c] bg-[#fff7ed] border-[#ffedd5]",
  Macro: "text-[#2f63eb] bg-[#edf2fe] border-[#dbeafe]",
  Micro: "text-[#7c3aed] bg-[#f5f3ff] border-[#e0e7ff]",
  Nano: "text-[#16a34a] bg-[#f0fdf4] border-[#dcfce7]",
};

function formatDateOnly(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const cleanDate = dateStr.split("T")[0];
  const parsed = new Date(cleanDate.includes("-") ? cleanDate : dateStr);
  if (isNaN(parsed.getTime())) return cleanDate || "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
  const [page, setPage] = useState(1);

  // Sync tab status with dropdown status
  const apiStatus = useMemo(() => {
    if (activeTab !== "All") return activeTab.toLowerCase();
    if (selectedStatus) return selectedStatus.toLowerCase();
    return undefined;
  }, [activeTab, selectedStatus]);

  const { data: paginatedResponse, isLoading } = useAdminCreatorsList({
    q: search || undefined,
    status: apiStatus,
    tier: selectedTier || undefined,
    niche: selectedNiche || undefined,
    page,
    limit: 10,
  });

  const listItems: CreatorItem[] = useMemo(() => {
    if (paginatedResponse?.data !== undefined) {
      return paginatedResponse.data.map((c, idx) => {
        const rawStatus = (c.status || "").toLowerCase();
        const normalizedStatus: "Active" | "Pending" | "Suspended" =
          rawStatus === "active" || rawStatus === "verified"
            ? "Active"
            : rawStatus === "suspended" ||
                rawStatus === "blocked" ||
                rawStatus === "inactive"
              ? "Suspended"
              : "Pending";

        return {
          id: c.id || `creator-${idx}`,
          creatorId: `CRT-${(c.id || "0000").slice(0, 4).toUpperCase()}`,
          name: c.name || "Creator",
          handle: c.handle
            ? c.handle.startsWith("@")
              ? c.handle
              : `@${c.handle}`
            : "@creator",
          email: c.email || "—",
          country: "Nigeria",
          tier: (c.tier as "Mega" | "Macro" | "Micro" | "Nano") || "Micro",
          niche: c.niche || "General",
          gender: "Female",
          platforms: ["IG", "TikTok"],
          completion: 100,
          totalEarnings: c.totalEarnings ?? 0,
          revisionCount: 0,
          status: normalizedStatus,
          dateJoined: formatDateOnly(c.joinedAt),
          lastLogin: "Active",
        };
      });
    }
    return [];
  }, [paginatedResponse]);

  const filtered = useMemo(() => {
    return listItems.filter((c) => {
      const activeStatusFilterLower =
        activeTab !== "All"
          ? activeTab.toLowerCase()
          : selectedStatus
            ? selectedStatus.toLowerCase()
            : "";

      if (
        activeStatusFilterLower &&
        c.status.toLowerCase() !== activeStatusFilterLower
      ) {
        return false;
      }
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.handle.toLowerCase().includes(search.toLowerCase()) &&
        !c.creatorId.toLowerCase().includes(search.toLowerCase()) &&
        !c.email.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (selectedTier && c.tier.toLowerCase() !== selectedTier.toLowerCase()) {
        return false;
      }
      if (
        selectedNiche &&
        !c.niche.toLowerCase().includes(selectedNiche.toLowerCase())
      ) {
        return false;
      }
      if (
        selectedGender &&
        c.gender.toLowerCase() !== selectedGender.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedCountry &&
        !c.country.toLowerCase().includes(selectedCountry.toLowerCase())
      ) {
        return false;
      }
      if (selectedYear && !c.dateJoined.includes(selectedYear)) return false;
      return true;
    });
  }, [
    listItems,
    activeTab,
    selectedStatus,
    search,
    selectedTier,
    selectedNiche,
    selectedGender,
    selectedCountry,
    selectedYear,
  ]);

  const hasActiveFilters =
    search !== "" ||
    selectedTier !== "" ||
    selectedNiche !== "" ||
    selectedGender !== "" ||
    selectedStatus !== "" ||
    selectedCountry !== "" ||
    selectedYear !== "" ||
    activeTab !== "All";

  const clearAllFilters = () => {
    setActiveTab("All");
    setSearch("");
    setSelectedTier("");
    setSelectedNiche("");
    setSelectedGender("");
    setSelectedStatus("");
    setSelectedCountry("");
    setSelectedYear("");
    setPage(1);
  };

  const totalPages = paginatedResponse?.totalPages || 1;
  const totalItems = paginatedResponse?.total || filtered.length;

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-[#f4f3f6] border border-[#e8e6f0]/80 p-1 rounded-xl w-fit self-start max-w-full overflow-x-auto scrollbar-none">
          {(["All", "Active", "Suspended", "Pending"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab !== "All") setSelectedStatus(tab);
                  else setSelectedStatus("");
                  setPage(1);
                }}
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

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RotateCcw size={12} /> Clear all filters
          </button>
        )}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-8 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 text-[#9a99b0] hover:text-[#1a1a2e]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          {[
            {
              value: selectedTier,
              onChange: (val: string) => {
                setSelectedTier(val);
                setPage(1);
              },
              label: "Tier",
              options: ["Mega", "Macro", "Micro", "Nano"],
            },
            {
              value: selectedNiche,
              onChange: (val: string) => {
                setSelectedNiche(val);
                setPage(1);
              },
              label: "Niche",
              options: [
                "Fashion",
                "Tech",
                "Beauty",
                "Lifestyle",
                "Food & Beverage",
                "Finance",
              ],
            },
            {
              value: selectedGender,
              onChange: (val: string) => {
                setSelectedGender(val);
                setPage(1);
              },
              label: "Gender",
              options: ["Male", "Female"],
            },
            {
              value: selectedStatus,
              onChange: (val: string) => {
                setSelectedStatus(val);
                if (
                  val === "Active" ||
                  val === "Suspended" ||
                  val === "Pending"
                ) {
                  setActiveTab(val);
                } else {
                  setActiveTab("All");
                }
                setPage(1);
              },
              label: "Status",
              options: ["Active", "Pending", "Suspended"],
            },
            {
              value: selectedCountry,
              onChange: (val: string) => {
                setSelectedCountry(val);
                setPage(1);
              },
              label: "Country",
              options: [
                "Lagos, Nigeria",
                "Abuja, Nigeria",
                "Enugu, Nigeria",
                "Port Harcourt, Nigeria",
                "Ghana",
                "Kenya",
              ],
            },
            {
              value: selectedYear,
              onChange: (val: string) => {
                setSelectedYear(val);
                setPage(1);
              },
              label: "Year",
              options: ["2026", "2025", "2024"],
            },
          ].map(({ value, onChange, label, options }) => (
            <div key={label} className="relative">
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                  "h-9 pl-4 pr-9 rounded-xl bg-white border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer appearance-none transition-all",
                  value
                    ? "border-brand-pink text-brand-pink bg-rose-50/20"
                    : "border-[#e8e6f0] text-[#1a1a2e]",
                )}
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
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                  value ? "text-brand-pink" : "text-[#9a99b0]",
                )}
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

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Active Filters:
          </span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Search: &quot;{search}&quot;
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSearch("")}
              />
            </span>
          )}
          {selectedTier && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Tier: {selectedTier}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedTier("")}
              />
            </span>
          )}
          {selectedNiche && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Niche: {selectedNiche}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNiche("")}
              />
            </span>
          )}
          {selectedGender && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Gender: {selectedGender}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedGender("")}
              />
            </span>
          )}
          {selectedStatus && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Status: {selectedStatus}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => {
                  setSelectedStatus("");
                  setActiveTab("All");
                }}
              />
            </span>
          )}
          {selectedCountry && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Country: {selectedCountry}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedCountry("")}
              />
            </span>
          )}
          {selectedYear && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Year: {selectedYear}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedYear("")}
              />
            </span>
          )}
        </div>
      )}

      {/* Table Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full bg-[#faf9fc] rounded-2xl animate-pulse flex items-center px-4 gap-4"
            >
              <div className="w-16 h-4 bg-[#e8e6f0]/60 rounded-md" />
              <div className="w-8 h-8 rounded-full bg-[#e8e6f0]/60 shrink-0" />
              <div className="w-28 h-4 bg-[#e8e6f0]/60 rounded-md" />
              <div className="w-36 h-4 bg-[#e8e6f0]/40 rounded-md ml-auto" />
              <div className="w-20 h-4 bg-[#e8e6f0]/60 rounded-md" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-[#faf9fc] rounded-2xl border border-dashed border-[#e8e6f0]">
          <Search size={32} className="text-[#9a99b0] mb-3" />
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            No Creators Found
          </h3>
          <p className="text-xs text-[#7a7a9a] mt-1 max-w-sm">
            We couldn&apos;t find any creators matching your filter criteria.
            Try adjusting or resetting your active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} /> Reset All Filters
          </button>
        </div>
      ) : (
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
                    <div className="flex items-center gap-1.5">
                      {c.platforms.map((p) => {
                        if (p === "IG")
                          return (
                            <span
                              key={p}
                              className="p-1 rounded-md bg-[#fdf2f6] text-brand-pink border border-rose-100"
                            >
                              <FaInstagram size={11} />
                            </span>
                          );
                        if (p === "YT")
                          return (
                            <span
                              key={p}
                              className="p-1 rounded-md bg-[#fef2f2] text-[#dc2626] border border-red-100"
                            >
                              <FaYoutube size={11} />
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
      )}

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-[#e8e6f0]/60 pt-4 text-xs">
          <span className="text-[#7a7a9a] font-medium">
            Showing{" "}
            <strong className="text-[#1a1a2e]">{(page - 1) * 10 + 1}</strong> to{" "}
            <strong className="text-[#1a1a2e]">
              {Math.min(page * 10, totalItems)}
            </strong>{" "}
            of <strong className="text-[#1a1a2e]">{totalItems}</strong> creators
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoading}
              className="h-8 px-3 rounded-xl border border-[#e8e6f0] text-[#1a1a2e] font-semibold flex items-center gap-1 hover:bg-[#f4f3f6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="px-2 font-bold text-[#1a1a2e]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || isLoading}
              className="h-8 px-3 rounded-xl border border-[#e8e6f0] text-[#1a1a2e] font-semibold flex items-center gap-1 hover:bg-[#f4f3f6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <CreatorProfileDrawer
        isOpen={selectedCreatorId !== null}
        onClose={() => setSelectedCreatorId(null)}
        creatorId={selectedCreatorId}
      />
    </section>
  );
}
