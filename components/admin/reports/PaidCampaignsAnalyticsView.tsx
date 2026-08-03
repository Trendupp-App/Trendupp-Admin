"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  useAdminCampaignSummary,
  useCampaignParticipationByTier,
  useCampaignTypes,
  useCampaignVolume,
  useBudgetByIndustry,
  useSlaBreachTrend,
  useRevisionRateTrend,
  useCompletionRateTrend,
} from "@/hooks/useAdminCampaigns";
import { Skeleton } from "@/components/ui/skeleton";

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

/** Build dynamic quarter/period filter options relative to today */
function buildRangeOptions(): { value: string; label: string }[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed
  const opts: { value: string; label: string }[] = [
    { value: "all", label: "All Time" },
  ];

  // Q4: Oct–Dec (months 9-11)
  if (m >= 9) opts.push({ value: "q4", label: `Q4 ${y} (Oct – Dec)` });
  // Q3: Jul–Sep (months 6-8)
  if (m >= 6) opts.push({ value: "q3", label: `Q3 ${y} (Jul – Sep)` });
  // Q2: Apr–Jun (months 3-5)
  if (m >= 3) opts.push({ value: "q2", label: `Q2 ${y} (Apr – Jun)` });
  // Q1: Jan–Mar (months 0-2)
  opts.push({ value: "q1", label: `Q1 ${y} (Jan – Mar)` });
  // Last 30 days always available
  opts.push({ value: "last30", label: "Last 30 Days" });
  // Last 90 days always available
  opts.push({ value: "last90", label: "Last 90 Days" });

  return opts;
}

export default function PaidCampaignsAnalyticsView() {
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
  const defaultRange =
    currentQuarter >= 3 ? "q3" : currentQuarter >= 2 ? "q2" : "q1";

  // Dynamic year options: project launch year → current year
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = PROJECT_START_YEAR; y <= currentYear; y++) years.push(y);
    return years;
  }, [currentYear]);

  // Dynamic range options: only periods that have already started
  const rangeOptions = useMemo(() => buildRangeOptions(), []);

  // Controlled Filter States for the 4 Cards
  const [tierPeriod, setTierPeriod] = useState("custom");
  const [tierRange, setTierRange] = useState(defaultRange);

  const [typePeriod, setTypePeriod] = useState("custom");
  const [typeRange, setTypeRange] = useState(defaultRange);

  const [volumeYear, setVolumeYear] = useState(String(currentYear));

  const [budgetPeriod, setBudgetPeriod] = useState("custom");
  const [budgetRange, setBudgetRange] = useState(defaultRange);

  const { data: summaryRes, isLoading: isLoadingSummary } =
    useAdminCampaignSummary();
  const { data: participationByTier = [], isLoading: isLoadingTier } =
    useCampaignParticipationByTier({ period: tierPeriod, range: tierRange });
  const { data: campaignTypes = [], isLoading: isLoadingTypes } =
    useCampaignTypes({ period: typePeriod, range: typeRange });
  const { data: volume = [], isLoading: isLoadingVolume } = useCampaignVolume({
    year: parseInt(volumeYear),
  });
  const { data: budgetByIndustry = [], isLoading: isLoadingBudget } =
    useBudgetByIndustry({ period: budgetPeriod, range: budgetRange });
  const { data: slaBreachTrend = [], isLoading: isLoadingSla } =
    useSlaBreachTrend();
  const { data: revisionRateTrend = [], isLoading: isLoadingRevision } =
    useRevisionRateTrend();
  const { data: completionRateTrend = [], isLoading: isLoadingCompletion } =
    useCompletionRateTrend();

  const summary = summaryRes?.summary;

  const totalCampaigns = summary?.totalCampaigns ?? 0;
  const avgApplicants = summary?.avgApplicantsPerCampaign ?? 0;
  const creatorsSelectedRate = summary?.creatorsSelectedRate ?? 0;
  const totalCompleted = summary?.totalCompleted ?? 0;
  const campaignCompletionRate = summary?.campaignCompletionRate ?? 0;

  const displayTiers = participationByTier;
  const displayTypes = campaignTypes;
  const displayVolume = volume;
  const displayBudget = budgetByIndustry;
  const displaySla = slaBreachTrend;
  const displayRevision = revisionRateTrend;
  const displayCompletion = completionRateTrend;

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in-up">
      {/* Subtitle */}
      <div>
        <h2 className="text-base font-bold text-[#1a1a2e]">Paid Campaigns</h2>
        <p className="text-xs text-[#9a99b0] font-medium">
          Performance data for paid advertising campaigns
        </p>
      </div>

      {/* Top 5 Stat Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Campaigns */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Total Campaigns
          </span>
          <span className="text-2xl font-extrabold text-[#1a1a2e]">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              totalCampaigns.toLocaleString()
            )}
          </span>
        </div>

        {/* Avg. Applicants / Campaign */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Avg. Applicants / Campaign
          </span>
          <span className="text-2xl font-extrabold text-[#1a1a2e]">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              avgApplicants.toFixed(1)
            )}
          </span>
        </div>

        {/* Creators Selected Rate */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Creators Selected Rate
          </span>
          <span className="text-2xl font-extrabold text-[#10b981]">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              `${creatorsSelectedRate}%`
            )}
          </span>
        </div>

        {/* Total Completed */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Total Completed
          </span>
          <span className="text-2xl font-extrabold text-[#1a1a2e]">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              totalCompleted.toLocaleString()
            )}
          </span>
        </div>

        {/* Campaign Completion Rate */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Campaign Completion Rate
          </span>
          <span className="text-2xl font-extrabold text-[#d92662]">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              `${campaignCompletionRate}%`
            )}
          </span>
        </div>
      </div>

      {/* Middle Row: Campaign Participation by Tier & Campaign Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Participation by Tier Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Campaign Participation by Tier
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={tierPeriod}
                  onChange={(e) => setTierPeriod(e.target.value)}
                  className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
                >
                  <option value="custom">Custom</option>
                  <option value="monthly">Monthly</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={tierRange}
                  onChange={(e) => setTierRange(e.target.value)}
                  className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
                >
                  {rangeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>
            </div>
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

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={typePeriod}
                  onChange={(e) => setTypePeriod(e.target.value)}
                  className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
                >
                  <option value="custom">Custom</option>
                  <option value="monthly">Monthly</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={typeRange}
                  onChange={(e) => setTypeRange(e.target.value)}
                  className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
                >
                  {rangeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>
            </div>
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
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Live
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
                          {/* Live Bar */}
                          <div
                            className="w-3 rounded-t-sm bg-[#10b981]"
                            style={{ height: `${livePct}%` }}
                            title={`Live: ${item.live}`}
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

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={budgetPeriod}
                  onChange={(e) => setBudgetPeriod(e.target.value)}
                  className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
                >
                  <option value="custom">Custom</option>
                  <option value="monthly">Monthly</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
                >
                  {rangeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>
            </div>
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

      {/* Row 4: 3 Line Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SLA Breach Rate Trend */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            SLA Breach Rate Trend
          </h4>
          <div className="h-32 w-full pt-2">
            {isLoadingSla ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <TrendLineChart
                data={displaySla}
                strokeColor="#ef4444"
                maxY={20}
              />
            )}
          </div>
        </div>

        {/* Revision Rate Trend */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Revision Rate Trend
          </h4>
          <div className="h-32 w-full pt-2">
            {isLoadingRevision ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <TrendLineChart
                data={displayRevision}
                strokeColor="#f59e0b"
                maxY={25}
              />
            )}
          </div>
        </div>

        {/* Campaign Completion Rate Trend */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Campaign Completion Rate Trend
          </h4>
          <div className="h-32 w-full pt-2">
            {isLoadingCompletion ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <TrendLineChart
                data={displayCompletion}
                strokeColor="#10b981"
                maxY={100}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendLineChart({
  data,
  strokeColor,
  maxY = 100,
}: {
  data: { label: string; rate: number }[];
  strokeColor: string;
  maxY?: number;
}) {
  const height = 90;
  const width = 280;
  const paddingX = 20;
  const paddingY = 10;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.rate / maxY) * (height - 2 * paddingY);
    return { x, y, label: d.label, rate: d.rate };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        {/* Horizontal dashed gridlines */}
        <line
          x1="0"
          y1="15"
          x2={width}
          y2="15"
          stroke="#e8e6f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="45"
          x2={width}
          y2="45"
          stroke="#e8e6f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="75"
          x2={width}
          y2="75"
          stroke="#e8e6f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />

        {/* Trend line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r="3"
            fill={strokeColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Month Labels */}
      <div className="flex justify-between px-2 pt-1 text-[9px] font-semibold text-[#9a99b0]">
        {data.map((d, idx) => (
          <span key={idx}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
