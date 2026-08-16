"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  useAdminCampaignsSummary,
  useCampaignParticipationByTier,
  useCampaignTypes,
  useCampaignVolume,
  useBudgetByIndustry,
} from "@/hooks/useAdminCampaigns";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDateRangeBar } from "@/components/admin/creators/CardDateRangeBar";
import { CardFilterHeaderControls } from "@/components/admin/creators/CardFilterHeaderControls";

const PROJECT_START_YEAR = 2026;

function formatBudgetAmount(amount: number): string {
  if (!amount || isNaN(amount)) return "₦0";
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `₦${amount.toLocaleString()}`;
}

export default function PaidCampaignsAnalyticsView() {
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();

  // Dynamic year options
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = PROJECT_START_YEAR; y <= currentYear; y++) years.push(y);
    return years;
  }, [currentYear]);

  // Top Global Date Filter States
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  // Individual Card Custom Date Range Filter States
  const [tierFromDate, setTierFromDate] = useState("");
  const [tierToDate, setTierToDate] = useState("");

  const [typeFromDate, setTypeFromDate] = useState("");
  const [typeToDate, setTypeToDate] = useState("");

  const [volumeYear, setVolumeYear] = useState(String(currentYear));

  const [budgetFromDate, setBudgetFromDate] = useState("");
  const [budgetToDate, setBudgetToDate] = useState("");

  const activeYear = selectedYear
    ? parseInt(selectedYear)
    : parseInt(volumeYear);

  const { data: campaignSummary, isLoading: isLoadingSummary } =
    useAdminCampaignsSummary();

  const { data: participationByTier = [], isLoading: isLoadingTier } =
    useCampaignParticipationByTier({
      fromDate: tierFromDate || fromDate || undefined,
      toDate: tierToDate || toDate || undefined,
    });

  const { data: campaignTypes = [], isLoading: isLoadingTypes } =
    useCampaignTypes({
      fromDate: typeFromDate || fromDate || undefined,
      toDate: typeToDate || toDate || undefined,
    });

  const { data: volume = [], isLoading: isLoadingVolume } = useCampaignVolume({
    year: activeYear,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  const { data: budgetByIndustry = [], isLoading: isLoadingBudget } =
    useBudgetByIndustry({
      fromDate: budgetFromDate || fromDate || undefined,
      toDate: budgetToDate || toDate || undefined,
    });

  const displayTiers = participationByTier;
  const displayTypes = campaignTypes;
  const displayVolume = volume;
  const displayBudget = budgetByIndustry;

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in-up">
      {/* Subtitle & Top Date Range / Month Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-[#1a1a2e]">Paid Campaigns</h2>
          <p className="text-xs text-[#9a99b0] font-medium">
            Performance data for paid advertising campaigns
          </p>
        </div>

        {/* Global From / To & Month / Year Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <CardFilterHeaderControls
            availablePeriods={[]}
            onYearChange={(yr) => {
              setSelectedYear(String(yr));
              setVolumeYear(String(yr));
            }}
            defaultYear={currentYear}
          />
          <CardDateRangeBar
            onDateChange={(from, to) => {
              setFromDate(from);
              setToDate(to);
            }}
          />
        </div>
      </div>

      {/* Campaign Status Cards — data from /admin/campaigns/summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {(
          [
            {
              label: "Total Campaigns",
              value: campaignSummary?.totalCampaigns ?? 0,
              color: "text-[#2f63eb]",
            },
            {
              label: "Draft",
              value: campaignSummary?.draft ?? 0,
              color: "text-[#7a7a9a]",
            },
            {
              label: "Live",
              value: campaignSummary?.live ?? 0,
              color: "text-[#d7176f]",
            },
            {
              label: "Active",
              value: campaignSummary?.active ?? 0,
              color: "text-[#16a34a]",
            },
            {
              label: "Cancelled",
              value: campaignSummary?.cancelled ?? 0,
              color: "text-[#dc2626]",
            },
            {
              label: "Completed",
              value: campaignSummary?.completed ?? 0,
              color: "text-[#2f63eb]",
            },
          ] as { label: string; value: number; color: string }[]
        ).map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs"
          >
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              {label}
            </span>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <span className={`text-2xl font-extrabold ${color}`}>
                {value.toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Middle Row: Campaign Participation by Tier & Campaign Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Participation by Tier Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Campaign Participation by Tier
            </h3>

            <CardDateRangeBar
              onDateChange={(from, to) => {
                setTierFromDate(from);
                setTierToDate(to);
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            {isLoadingTier
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded-md" />
                ))
              : displayTiers.map((item, idx) => {
                  const color = item.tier.includes("Nano")
                    ? "bg-[#10b981]"
                    : item.tier.includes("Micro")
                      ? "bg-[#6366f1]"
                      : item.tier.includes("Macro")
                        ? "bg-[#3b82f6]"
                        : "bg-[#f59e0b]";
                  return (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <span className="w-28 font-semibold text-[#5a5a7a] shrink-0">
                        {item.tier}
                      </span>
                      <div className="flex-1 h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-24 text-right font-bold text-[#1a1a2e] shrink-0">
                        {item.count.toLocaleString()}{" "}
                        <span className="text-[#9a99b0] font-normal">
                          ({item.percentage}%)
                        </span>
                      </span>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Campaign Type Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-[#1a1a2e]">Campaign Type</h3>

            <CardDateRangeBar
              onDateChange={(from, to) => {
                setTypeFromDate(from);
                setTypeToDate(to);
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            {isLoadingTypes
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded-md" />
                ))
              : displayTypes.map((item, idx) => {
                  const color = item.type.includes("Content")
                    ? "bg-[#d92662]"
                    : "bg-[#3b82f6]";
                  return (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <span className="w-28 font-semibold text-[#5a5a7a] shrink-0">
                        {item.type}
                      </span>
                      <div className="flex-1 h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-24 text-right font-bold text-[#1a1a2e] shrink-0">
                        {item.count.toLocaleString()}{" "}
                        <span className="text-[#9a99b0] font-normal">
                          ({item.percentage}%)
                        </span>
                      </span>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Row 3: Campaign Volume & Budget flow per industry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Volume Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Campaign Volume
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-semibold text-[#7a7a9a]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#d92662]" /> Draft
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Active
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#475569]" />{" "}
                  Completed
                </div>
              </div>
            </div>

            <div className="relative">
              <select
                value={volumeYear}
                onChange={(e) => setVolumeYear(e.target.value)}
                className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
              />
            </div>
          </div>

          {/* Grouped Bar Chart Visualization */}
          <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#e8e6f0]/40">
            {isLoadingVolume
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-36 rounded-t-sm" />
                ))
              : (() => {
                  const maxVal = Math.max(
                    ...displayVolume.map((item) =>
                      Math.max(item.draft, item.live, item.completed),
                    ),
                    1,
                  );
                  return displayVolume.map((item, idx) => {
                    const draftPct =
                      item.draft > 0
                        ? Math.max(8, Math.round((item.draft / maxVal) * 100))
                        : 0;
                    const livePct =
                      item.live > 0
                        ? Math.max(8, Math.round((item.live / maxVal) * 100))
                        : 0;
                    const completedPct =
                      item.completed > 0
                        ? Math.max(
                            8,
                            Math.round((item.completed / maxVal) * 100),
                          )
                        : 0;

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                      >
                        <div className="w-full flex items-end justify-center gap-1 h-full">
                          {/* Draft Bar */}
                          <div
                            className="w-3 rounded-t-sm bg-[#d92662]"
                            style={{ height: `${draftPct}%` }}
                            title={`Draft: ${item.draft}`}
                          />
                          {/* Active Bar */}
                          <div
                            className="w-3 rounded-t-sm bg-[#10b981]"
                            style={{ height: `${livePct}%` }}
                            title={`Active: ${item.live}`}
                          />
                          {/* Completed Bar */}
                          <div
                            className="w-3 rounded-t-sm bg-[#475569]"
                            style={{ height: `${completedPct}%` }}
                            title={`Completed: ${item.completed}`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#9a99b0]">
                          {item.label}
                        </span>
                      </div>
                    );
                  });
                })()}
          </div>
        </div>

        {/* Budget flow per industry Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Budget flow per industry
            </h3>

            <CardDateRangeBar
              onDateChange={(from, to) => {
                setBudgetFromDate(from);
                setBudgetToDate(to);
              }}
            />
          </div>

          <div className="max-h-64 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#e8e6f0] scrollbar-track-transparent">
            {isLoadingBudget ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded-md" />
              ))
            ) : displayBudget.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9a99b0] font-medium">
                No industry budget data available for this date range
              </div>
            ) : (
              displayBudget.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span
                    className="w-28 font-semibold text-[#5a5a7a] shrink-0 text-right truncate"
                    title={item.industry}
                  >
                    {item.industry}
                  </span>
                  <div className="flex-1 h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563eb]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-20 text-right font-bold text-[#5a5a7a] shrink-0">
                    {formatBudgetAmount(item.budget)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
