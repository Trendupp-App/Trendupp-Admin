"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminCampaignsList,
  useAdminCampaignsSummary,
} from "@/hooks/useAdminCampaigns";
import type { CampaignListQueryParams } from "@/types/adminCampaigns";
import CampaignDetailDrawer from "./CampaignDetailDrawer";

type DisplayStatus = "Live" | "Active" | "Completed" | "Draft" | "Cancelled";
type DisplayEscrow = "Funded" | "Released" | "Not Funded" | "Refunded";

const STATUS_TABS = [
  "All",
  "Draft",
  "Live",
  "Active",
  "Completed",
  "Cancelled",
] as const;

const normalizeStatus = (status: string): DisplayStatus => {
  const map: Record<string, DisplayStatus> = {
    DRAFT: "Draft",
    LIVE: "Live",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[status?.toUpperCase()] ?? "Draft";
};

const normalizeEscrow = (escrow: string): DisplayEscrow => {
  const key = escrow?.toUpperCase().replace(/_/g, " ").trim();
  const map: Record<string, DisplayEscrow> = {
    FUNDED: "Funded",
    RELEASED: "Released",
    "NOT FUNDED": "Not Funded",
    REFUNDED: "Refunded",
  };
  return map[key] ?? "Not Funded";
};

const truncateTitle = (title: string) =>
  title.length > 12 ? `${title.slice(0, 12)}...` : title;

const truncateBrandName = (name: string) =>
  name.length > 15 ? `${name.slice(0, 15)}...` : name;

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface CampaignTableProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function CampaignTable({
  selectedStatus,
  onSelectStatus,
}: CampaignTableProps) {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedEscrow, setSelectedEscrow] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: summary } = useAdminCampaignsSummary();

  const queryParams: CampaignListQueryParams = useMemo(
    () => ({
      q: search || undefined,
      tab:
        selectedStatus === "All"
          ? "all"
          : (selectedStatus.toLowerCase() as CampaignListQueryParams["tab"]),
      creatorTier: selectedTier || undefined,
      platform: selectedPlatform || undefined,
      escrowStatus: selectedEscrow || undefined,
      page,
      limit: 20,
    }),
    [
      search,
      selectedStatus,
      selectedTier,
      selectedPlatform,
      selectedEscrow,
      page,
    ],
  );

  const { data: apiData, isLoading } = useAdminCampaignsList(queryParams);

  const campaigns = apiData?.data ?? [];
  const meta = apiData?.meta;

  const statusCounts: Record<string, number> = {
    All: summary?.totalCampaigns ?? 0,
    Draft: summary?.draft ?? 0,
    Live: summary?.live ?? 0,
    Active: summary?.active ?? 0,
    Completed: summary?.completed ?? 0,
    Cancelled: summary?.cancelled ?? 0,
  };

  const getStatusChip = (s: DisplayStatus) => {
    const maps: Record<DisplayStatus, string> = {
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
          maps[s],
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        {s}
      </span>
    );
  };

  const getEscrowChip = (e: DisplayEscrow) => {
    const maps: Record<DisplayEscrow, string> = {
      Funded: "bg-[#f0fdf4] text-[#16a34a]",
      Released: "bg-[#eff6ff] text-[#2563eb]",
      "Not Funded": "bg-[#fff7ed] text-[#ea580c]",
      Refunded: "bg-[#f5f3ff] text-[#7c3aed]",
    };
    return (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
          maps[e],
        )}
      >
        {e}
      </span>
    );
  };

  const handleExportCSV = () => {
    if (campaigns.length === 0) return;
    const headers = [
      "Campaign ID",
      "Title",
      "Brand",
      "Budget",
      "Applications",
      "Status",
      "Escrow Status",
      "End Date",
      "Date Created",
    ];

    const rows = campaigns.map((c) => {
      const status = normalizeStatus(c.status);
      const escrow = normalizeEscrow(c.escrowStatus);
      return [
        c.id,
        `"${c.title.replace(/"/g, '""')}"`,
        `"${(c.brand?.name || "").replace(/"/g, '""')}"`,
        `"₦${c.budget.toLocaleString()}"`,
        c.applicationsCount,
        status,
        escrow,
        formatDate(c.endDate),
        formatDate(c.createdAt),
      ];
    });

    const csvString = [headers.join(","), ...rows.map((e) => e.join(","))].join(
      "\n",
    );

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `campaigns_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters =
    search !== "" ||
    selectedTier !== "" ||
    selectedPlatform !== "" ||
    selectedEscrow !== "" ||
    selectedStatus !== "All";

  const clearAllFilters = () => {
    setSearch("");
    setSelectedTier("");
    setSelectedPlatform("");
    setSelectedEscrow("");
    onSelectStatus("All");
    setPage(1);
  };

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Status Filter Tabs (Left) & Frequency Controls + Export (Right) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#f4f3f6] border border-[#e8e6f0]/80 p-1 rounded-xl max-w-2xl overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((label) => {
            const active = selectedStatus === label;
            return (
              <button
                key={label}
                onClick={() => {
                  onSelectStatus(label);
                  setPage(1);
                }}
                className={cn(
                  "px-3.5 sm:px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  active
                    ? "bg-brand-pink text-white shadow-sm"
                    : "bg-transparent text-[#5a5a7a] hover:text-[#1a1a2e]",
                )}
              >
                {label} ({statusCounts[label] ?? 0})
              </button>
            );
          })}
        </div>

        {/* Right: Clear Filters & Export */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
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

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex items-center w-full sm:w-[260px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 text-[#9a99b0]" />
            <input
              type="text"
              placeholder="Search by Campaign Title, ID or Brand..."
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

          {/* Unique Campaign Dropdown Filters */}
          {[
            {
              value: selectedTier,
              onChange: (val: string) => {
                setSelectedTier(val);
                setPage(1);
              },
              label: "Tier",
              options: [
                { value: "nano", label: "Nano" },
                { value: "micro", label: "Micro" },
                { value: "macro", label: "Macro" },
                { value: "mega", label: "Mega" },
              ],
            },
            {
              value: selectedPlatform,
              onChange: (val: string) => {
                setSelectedPlatform(val);
                setPage(1);
              },
              label: "Platform",
              options: [
                { value: "instagram", label: "Instagram" },
                { value: "tiktok", label: "TikTok" },
                { value: "youtube", label: "YouTube" },
                { value: "twitter", label: "Twitter" },
              ],
            },
            {
              value: selectedEscrow,
              onChange: (val: string) => {
                setSelectedEscrow(val);
                setPage(1);
              },
              label: "Escrow",
              options: [
                { value: "funded", label: "Funded" },
                { value: "released", label: "Released" },
                { value: "not_funded", label: "Not Funded" },
                { value: "refunded", label: "Refunded" },
              ],
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
                  <option key={o.value} value={o.value}>
                    {o.label}
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
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#e8e6f0]/40">
          <span className="text-[11px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Active Filters:
          </span>
          {selectedStatus !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink text-xs font-bold border border-rose-100">
              Status: {selectedStatus}
              <button
                onClick={() => onSelectStatus("All")}
                className="hover:text-rose-800 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink text-xs font-bold border border-rose-100">
              Search: "{search}"
              <button
                onClick={() => setSearch("")}
                className="hover:text-rose-800 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedTier && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink text-xs font-bold border border-rose-100">
              Tier: {selectedTier}
              <button
                onClick={() => setSelectedTier("")}
                className="hover:text-rose-800 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedPlatform && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink text-xs font-bold border border-rose-100">
              Platform: {selectedPlatform}
              <button
                onClick={() => setSelectedPlatform("")}
                className="hover:text-rose-800 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedEscrow && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-brand-pink text-xs font-bold border border-rose-100">
              Escrow: {selectedEscrow}
              <button
                onClick={() => setSelectedEscrow("")}
                className="hover:text-rose-800 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-[#7a7a9a] hover:text-[#1a1a2e] underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[960px] text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              <th className="pb-3.5 pt-1 pl-2 pr-3 min-w-[170px] whitespace-nowrap">
                Campaign Title
              </th>
              <th className="pb-3.5 pt-1 px-3 min-w-[120px] whitespace-nowrap">
                Brand
              </th>
              <th className="pb-3.5 pt-1 px-3 min-w-[90px] whitespace-nowrap">
                Budget
              </th>
              <th className="pb-3.5 pt-1 px-3 min-w-[100px] whitespace-nowrap text-center">
                Applications
              </th>
              <th className="pb-3.5 pt-1 px-3 min-w-[90px] whitespace-nowrap">
                Status
              </th>
              <th className="pb-3.5 pt-1 px-3 min-w-[100px] whitespace-nowrap">
                Escrow
              </th>
              <th className="pb-3.5 pt-1 pr-3 px-3 min-w-[100px] whitespace-nowrap">
                End Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 pl-2" colSpan={7}>
                    <div className="w-full h-4 bg-[#e8e6f0]/50 rounded-md" />
                  </td>
                </tr>
              ))
            ) : campaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-[#9a99b0] text-xs"
                >
                  No campaigns found matching your criteria.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => {
                const status = normalizeStatus(c.status);
                const escrow = normalizeEscrow(c.escrowStatus);
                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedCampaignId(c.id);
                      setIsDrawerOpen(true);
                    }}
                    className="hover:bg-[#faf9fc] cursor-pointer transition-colors"
                  >
                    <td
                      className="py-3.5 pl-2 pr-3 font-bold text-[#1a1a2e] whitespace-nowrap"
                      title={c.title}
                    >
                      {truncateTitle(c.title)}
                    </td>
                    <td
                      className="py-3.5 px-3 text-[#5a5a7a] whitespace-nowrap"
                      title={c.brand?.name}
                    >
                      {c.brand?.name ? truncateBrandName(c.brand.name) : ""}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-brand-pink whitespace-nowrap">
                      {c.budget.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#1a1a2e] text-center whitespace-nowrap">
                      {c.applicationsCount}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getStatusChip(status)}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getEscrowChip(escrow)}
                    </td>
                    <td className="py-3.5 pr-3 px-3 text-[#5a5a7a] whitespace-nowrap">
                      {formatDate(c.endDate)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e8e6f0]/40 pt-4 mt-2">
          <span className="text-[11px] text-[#9a99b0] font-medium">
            Showing {(meta.page - 1) * meta.limit + 1}-
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            campaigns
          </span>

          <div className="flex items-center bg-[#f4f3f6] rounded-xl p-0.5 border border-[#e8e6f0]/60 shrink-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="p-1.5 rounded-lg text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from(
              { length: Math.min(5, meta.totalPages) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                  p === meta.page
                    ? "bg-white text-brand-pink shadow-sm"
                    : "text-[#7a7a9a] hover:text-[#1a1a2e]",
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={meta.page >= meta.totalPages}
              className="p-1.5 rounded-lg text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Campaign Detail Drawer */}
      <CampaignDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        campaignId={selectedCampaignId}
      />
    </section>
  );
}
