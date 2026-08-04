"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import {
  FaTiktok,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { AdminStatusBadge } from "../AdminStatusBadge";
import CreatorProfileDrawer from "./CreatorProfileDrawer";
import { useAdminCreatorsList } from "@/hooks/useAdminCreators";
import { CardFilterHeaderControls } from "./CardFilterHeaderControls";
import { CardDateRangeBar } from "./CardDateRangeBar";

interface CreatorItem {
  id: string;
  creatorId: string;
  name: string;
  handle: string;
  email: string;
  country: string;
  tier: "Mega" | "Macro" | "Micro" | "Nano" | "";
  niche: string;
  gender: "Male" | "Female" | "";
  platforms: ("IG" | "TikTok" | "YT" | "X" | "FB")[];
  completion: number;
  campaignsCount: number;
  totalEarnings: number;
  revisionCount: number;
  status: "Active" | "Pending" | "Suspended";
  dateJoined: string;
  lastLogin: string;
}

type FilterTab = "All" | "Onboarded" | "Suspended" | "Pending";

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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);

  // activeTab is the single source of truth for status filtering
  const apiStatus =
    activeTab === "Onboarded"
      ? "active"
      : activeTab !== "All"
        ? activeTab.toLowerCase()
        : undefined;

  const { data: paginatedResponse, isLoading } = useAdminCreatorsList({
    q: search || undefined,
    status: apiStatus,
    startDate: fromDate || undefined,
    endDate: toDate || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    limit: 1000,
  });

  const listItems: CreatorItem[] = useMemo(() => {
    if (paginatedResponse?.data !== undefined) {
      return paginatedResponse.data.map((c, idx) => {
        const rawDate = c.createdAt || c.joinedAt || c.dateJoined;
        const formattedDateJoined = formatDateOnly(rawDate);

        // ── Status ────────────────────────────────────────────────────────────
        // Check all known field-name variants (status, accountStatus, userStatus)
        const rawStatus = String(
          c.status || c.accountStatus || "",
        ).toLowerCase();

        let normalizedStatus: "Active" | "Pending" | "Suspended" = "Active";
        if (
          rawStatus === "suspended" ||
          rawStatus === "blocked" ||
          rawStatus === "inactive"
        ) {
          normalizedStatus = "Suspended";
        } else if (rawStatus === "pending" || rawStatus === "unverified") {
          normalizedStatus = "Pending";
        } else if (
          rawStatus === "active" ||
          rawStatus === "verified" ||
          rawStatus === "onboarded"
        ) {
          normalizedStatus = "Active";
        }

        // ── Profile Completion ────────────────────────────────────────────────
        const parsedCompletion =
          typeof c.profileCompletion === "number"
            ? c.profileCompletion
            : typeof c.profileCompletion === "string"
              ? parseInt(c.profileCompletion.replace("%", ""), 10) || 0
              : 0;

        // ── Platforms ────────────────────────────────────────────────────────
        const rawPlatforms =
          c.platformsConnected ||
          c.platforms ||
          c.connectedSocials ||
          c.socialAccounts;

        const parsedPlatforms: ("IG" | "TikTok" | "YT" | "X" | "FB")[] = [];

        if (Array.isArray(rawPlatforms)) {
          rawPlatforms.forEach((p) => {
            const pStr =
              typeof p === "string"
                ? p.toLowerCase().trim()
                : (
                    (p as { platform?: string; name?: string; type?: string })
                      ?.platform ||
                    (p as { platform?: string; name?: string; type?: string })
                      ?.name ||
                    (p as { platform?: string; name?: string; type?: string })
                      ?.type ||
                    ""
                  )
                    .toLowerCase()
                    .trim();
            if (pStr.includes("ig") || pStr.includes("insta")) {
              if (!parsedPlatforms.includes("IG")) parsedPlatforms.push("IG");
            } else if (pStr.includes("tiktok") || pStr.includes("tik")) {
              if (!parsedPlatforms.includes("TikTok"))
                parsedPlatforms.push("TikTok");
            } else if (pStr.includes("yt") || pStr.includes("youtube")) {
              if (!parsedPlatforms.includes("YT")) parsedPlatforms.push("YT");
            } else if (pStr.includes("twitter") || pStr === "x") {
              if (!parsedPlatforms.includes("X")) parsedPlatforms.push("X");
            } else if (pStr.includes("facebook") || pStr === "fb") {
              if (!parsedPlatforms.includes("FB")) parsedPlatforms.push("FB");
            }
          });
        } else if (rawPlatforms && typeof rawPlatforms === "object") {
          Object.keys(rawPlatforms).forEach((key) => {
            const val = (rawPlatforms as Record<string, unknown>)[key];
            if (val) {
              const kLower = key.toLowerCase().trim();
              if (kLower.includes("insta") || kLower.includes("ig")) {
                if (!parsedPlatforms.includes("IG")) parsedPlatforms.push("IG");
              } else if (kLower.includes("tiktok") || kLower.includes("tik")) {
                if (!parsedPlatforms.includes("TikTok"))
                  parsedPlatforms.push("TikTok");
              } else if (kLower.includes("yt") || kLower.includes("youtube")) {
                if (!parsedPlatforms.includes("YT")) parsedPlatforms.push("YT");
              } else if (kLower.includes("twitter") || kLower === "x") {
                if (!parsedPlatforms.includes("X")) parsedPlatforms.push("X");
              } else if (kLower.includes("facebook") || kLower === "fb") {
                if (!parsedPlatforms.includes("FB")) parsedPlatforms.push("FB");
              }
            }
          });
        }

        const revCount =
          c.revisionCount ?? c.revisionsCount ?? c.revisions ?? 0;

        // ── Country ───────────────────────────────────────────────────────────
        // Checks: country → countryOfResidence → location (string/object)
        let extractedCountry =
          c.country ||
          c.countryOfResidence ||
          (typeof c.location === "string" ? c.location : "") ||
          (c.location && typeof c.location === "object" && c.location.country
            ? c.location.country
            : "");

        // Strip "City, Country" format — take last segment after comma
        if (extractedCountry.includes(",")) {
          const parts = extractedCountry.split(",");
          extractedCountry = parts[parts.length - 1].trim();
        }

        // ── Gender ───────────────────────────────────────────────────────────
        // Normalize "male"/"female"/"Male"/"Female"/"MALE"/"FEMALE" → display label
        let extractedGender: "Male" | "Female" | "" = "";
        const rawGender = (c.gender || "").toLowerCase().trim();
        if (rawGender === "male" || rawGender === "m") {
          extractedGender = "Male";
        } else if (rawGender === "female" || rawGender === "f") {
          extractedGender = "Female";
        }

        // ── Tier ─────────────────────────────────────────────────────────────
        const rawTier =
          c.tier ||
          (c as unknown as { creatorTier?: string }).creatorTier ||
          (c as unknown as { userTier?: string }).userTier ||
          "";
        let extractedTier: "Mega" | "Macro" | "Micro" | "Nano" | "" = "";
        if (rawTier) {
          const tLower = String(rawTier).toLowerCase().trim();
          if (tLower.includes("mega")) extractedTier = "Mega";
          else if (tLower.includes("macro")) extractedTier = "Macro";
          else if (tLower.includes("micro")) extractedTier = "Micro";
          else if (tLower.includes("nano")) extractedTier = "Nano";
        }

        // ── Niche ────────────────────────────────────────────────────────────
        const extractedNiche = c.niche ?? "";

        // ── Name & Handle ────────────────────────────────────────────────────
        // Some endpoints return fullName/username instead of name/handle
        const resolvedName = c.name || c.fullName || "Creator";
        const rawHandle = c.handle || c.username || "";
        const resolvedHandle = rawHandle
          ? rawHandle.startsWith("@")
            ? rawHandle
            : `@${rawHandle}`
          : "@creator";

        return {
          id: c.id || `creator-${idx}`,
          creatorId: `CRT-${(c.id || "0000").slice(0, 4).toUpperCase()}`,
          name: resolvedName,
          handle: resolvedHandle,
          email: c.email || "—",
          country: extractedCountry,
          tier: extractedTier,
          niche: extractedNiche,
          gender: extractedGender,
          platforms: parsedPlatforms,
          completion: parsedCompletion,
          campaignsCount: c.completedCampaigns ?? c.campaignsCount ?? 0,
          totalEarnings: c.totalEarnings ?? 0,
          revisionCount: revCount,
          status: normalizedStatus,
          dateJoined: formattedDateJoined,
          lastLogin: "Active",
        };
      });
    }
    return [];
  }, [paginatedResponse]);

  // Compile unique available countries dynamically from dataset
  const availableCountries = useMemo(() => {
    const set = new Set<string>([
      "Nigeria",
      "Ghana",
      "Kenya",
      "Togo",
      "Benin Republic",
      "Uganda",
      "South Africa",
      "United Kingdom",
      "United States",
      "Austria",
      "Australia",
    ]);
    listItems.forEach((c) => {
      if (c.country && c.country.trim()) set.add(c.country.trim());
    });
    return Array.from(set).sort();
  }, [listItems]);

  // Client-side filter — strictly filters listItems by Search, Year, Status, Tier, and Country
  const filtered = useMemo(() => {
    return listItems.filter((c) => {
      // 1. Search filter
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.handle.toLowerCase().includes(search.toLowerCase()) &&
        !c.creatorId.toLowerCase().includes(search.toLowerCase()) &&
        !c.email.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // 2. Year filter
      if (selectedYear && !c.dateJoined.includes(selectedYear)) return false;

      // 3. Status tab filter
      if (activeTab === "Onboarded" && c.status !== "Active") return false;
      if (activeTab === "Suspended" && c.status !== "Suspended") return false;
      if (activeTab === "Pending" && c.status !== "Pending") return false;

      // 4. Tier filter
      if (selectedTier && c.tier.toLowerCase() !== selectedTier.toLowerCase()) {
        return false;
      }

      // 5. Country filter (flexible matching)
      if (selectedCountry) {
        const cCountry = c.country.toLowerCase().trim();
        const sCountry = selectedCountry.toLowerCase().trim();
        if (!cCountry.includes(sCountry) && !sCountry.includes(cCountry)) {
          return false;
        }
      }

      return true;
    });
  }, [
    listItems,
    search,
    selectedYear,
    activeTab,
    selectedTier,
    selectedCountry,
  ]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  const paginatedList = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const hasActiveFilters =
    search !== "" ||
    selectedTier !== "" ||
    selectedCountry !== "" ||
    selectedYear !== "" ||
    activeTab !== "All";

  const clearAllFilters = () => {
    setActiveTab("All");
    setSearch("");
    setSelectedTier("");
    setSelectedCountry("");
    setSelectedYear("");
    setPage(1);
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      "Creator ID",
      "Name",
      "Handle",
      "Email",
      "Country",
      "Tier",
      "Gender",
      "Platforms",
      "Profile",
      "Total Earnings",
      "Revisions",
      "Status",
      "Date Joined",
    ];

    const rows = filtered.map((c) => [
      c.creatorId,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.handle.replace(/"/g, '""')}"`,
      c.email,
      c.country,
      c.tier,
      c.gender,
      `"${c.platforms.join(", ")}"`,
      `${c.completion}%`,
      c.totalEarnings,
      c.revisionCount,
      c.status,
      c.dateJoined,
    ]);

    const csvString = [headers.join(","), ...rows.map((e) => e.join(","))].join(
      "\n",
    );

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `creators_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Status Filter Tabs (Left) & Card Controls + Actions (Right) */}
      <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-3 gap-4 flex-wrap">
        {/* Left: Status Filter Tabs */}
        <div className="flex items-center gap-6">
          {(["All", "Onboarded", "Suspended", "Pending"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={cn(
                  "pb-1 text-xs font-bold border-b-2 transition-all cursor-pointer",
                  activeTab === tab
                    ? "border-brand-pink text-brand-pink"
                    : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
                )}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Right: Time Controls, Clear Filters & Export */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <CardFilterHeaderControls
            availablePeriods={[]}
            onYearChange={(yr) => {
              setSelectedYear(String(yr));
              setPage(1);
            }}
            defaultYear={selectedYear ? Number(selectedYear) : 2026}
          />

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RotateCcw size={12} /> Clear all filters
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e6f0] text-[#1a1a2e] hover:bg-[#faf9fc] text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Download size={13} className="text-brand-pink" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex items-center w-full sm:w-[240px] flex-1 max-w-sm">
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

          {/* Creator Filter Dropdowns: Tier, Status, Country */}
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
              value: activeTab !== "All" ? activeTab : "",
              onChange: (val: string) => {
                if (val === "Onboarded" || val === "Active") {
                  setActiveTab("Onboarded");
                } else if (val === "Suspended" || val === "Pending") {
                  setActiveTab(val);
                } else {
                  setActiveTab("All");
                }
                setPage(1);
              },
              label: "Status",
              options: ["Onboarded", "Pending", "Suspended"],
            },
            {
              value: selectedCountry,
              onChange: (val: string) => {
                setSelectedCountry(val);
                setPage(1);
              },
              label: "Country",
              options: availableCountries,
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

        {/* Date Range Selector */}
        <CardDateRangeBar
          onDateChange={(from, to) => {
            setFromDate(from);
            setToDate(to);
            setPage(1);
          }}
        />
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
          {activeTab !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink border border-rose-100 text-[11px] font-semibold">
              Status: {activeTab}
              <X
                size={12}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setActiveTab("All")}
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
            className="mt-4 px-4 py-2 rounded-xl bg-brand-pink text-white text-xs font-semibold shadow-xs hover:opacity-90 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[1280px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                <th className="pb-3.5 pt-1 pl-2 pr-3 min-w-[110px] whitespace-nowrap">
                  Creator ID
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[160px] whitespace-nowrap">
                  Creator
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[170px] whitespace-nowrap">
                  Email
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[100px] whitespace-nowrap">
                  Country
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[90px] whitespace-nowrap">
                  Tier
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[90px] whitespace-nowrap">
                  Gender
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[100px] whitespace-nowrap">
                  Platforms
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[130px] whitespace-nowrap">
                  Profile
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[100px] whitespace-nowrap">
                  Earnings
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[80px] whitespace-nowrap text-center">
                  Revisions
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[90px] whitespace-nowrap">
                  Status
                </th>
                <th className="pb-3.5 pt-1 px-3 min-w-[110px] whitespace-nowrap">
                  Date Joined
                </th>
                <th className="pb-3.5 pt-1 pl-3 pr-4 min-w-[110px] whitespace-nowrap">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6f0]/30 text-xs font-medium">
              {paginatedList.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCreatorId(c.id)}
                  className="hover:bg-[#faf9fc] transition-colors cursor-pointer"
                >
                  <td className="py-3 pl-2 pr-3 text-[#5a5a7a] font-medium whitespace-nowrap">
                    {c.creatorId}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
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
                  <td className="py-3 px-3 text-[#5a5a7a] whitespace-nowrap">
                    {c.email}
                  </td>
                  <td className="py-3 px-3 text-[#5a5a7a] whitespace-nowrap font-semibold">
                    {c.country}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {c.tier ? (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize",
                          TIER_CLASSES[c.tier],
                        )}
                      >
                        {c.tier}
                      </span>
                    ) : (
                      <span className="text-[#9a99b0] text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#5a5a7a] whitespace-nowrap font-medium">
                    {c.gender || <span className="text-[#9a99b0]">—</span>}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {c.platforms.length === 0 ? (
                      <span className="text-[#9a99b0] text-[11px]">—</span>
                    ) : (
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
                          if (p === "X")
                            return (
                              <span
                                key={p}
                                className="p-1 rounded-md bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0]"
                              >
                                <FaTwitter size={11} />
                              </span>
                            );
                          if (p === "FB")
                            return (
                              <span
                                key={p}
                                className="p-1 rounded-md bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]"
                              >
                                <FaFacebook size={11} />
                              </span>
                            );
                          return null;
                        })}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 w-24">
                      <div className="flex-1 h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-pink rounded-full transition-all duration-300"
                          style={{ width: `${c.completion}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a2e]">
                        {c.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#1a1a2e] font-bold whitespace-nowrap">
                    ₦{c.totalEarnings.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-[#5a5a7a] font-semibold text-center whitespace-nowrap">
                    {c.revisionCount}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <AdminStatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-3 text-[#5a5a7a] whitespace-nowrap">
                    {c.dateJoined}
                  </td>
                  <td className="py-3 pl-3 pr-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#16a34a] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                      {c.lastLogin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#e8e6f0]/40 flex-wrap">
        <span className="text-xs text-[#9a99b0] font-medium">
          Showing {filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} -{" "}
          {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
          {filtered.length} Creators
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-semibold text-[#1a1a2e] px-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#faf9fc] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Creator Profile Detail Drawer */}
      <CreatorProfileDrawer
        creatorId={selectedCreatorId}
        isOpen={Boolean(selectedCreatorId)}
        onClose={() => setSelectedCreatorId(null)}
      />
    </section>
  );
}
