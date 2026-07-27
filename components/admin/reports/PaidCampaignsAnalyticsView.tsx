"use client";

import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
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

export default function PaidCampaignsAnalyticsView() {
  const [volumeYear, setVolumeYear] = useState("2026");

  const { data: summaryRes, isLoading: isLoadingSummary } =
    useAdminCampaignSummary();
  const { data: participationByTier = [], isLoading: isLoadingTier } =
    useCampaignParticipationByTier();
  const { data: campaignTypes = [], isLoading: isLoadingTypes } =
    useCampaignTypes();
  const { data: volume = [], isLoading: isLoadingVolume } = useCampaignVolume({
    year: parseInt(volumeYear),
  });
  const { data: budgetByIndustry = [], isLoading: isLoadingBudget } =
    useBudgetByIndustry();
  const { data: slaBreachTrend = [], isLoading: isLoadingSla } =
    useSlaBreachTrend();
  const { data: revisionRateTrend = [], isLoading: isLoadingRevision } =
    useRevisionRateTrend();
  const { data: completionRateTrend = [], isLoading: isLoadingCompletion } =
    useCompletionRateTrend();

  const summary = summaryRes?.summary;

  const totalCampaigns = summary?.totalCampaigns ?? 1284;
  const avgApplicants = summary?.avgApplicantsPerCampaign ?? 18.4;
  const creatorsSelectedRate = summary?.creatorsSelectedRate ?? 62;
  const totalCompleted = summary?.totalCompleted ?? 946;
  const campaignCompletionRate = summary?.campaignCompletionRate ?? 73.7;

  // Tier participation display mapping
  const displayTiers =
    participationByTier.length > 0
      ? participationByTier
      : [
          {
            tier: "Nano (1K-10K)",
            count: 3642,
            percentage: 76,
            color: "bg-[#10b981]",
          },
          {
            tier: "Micro (10K-200K)",
            count: 3420,
            percentage: 60,
            color: "bg-[#6366f1]",
          },
          {
            tier: "Macro (200K-1M)",
            count: 2387,
            percentage: 37,
            color: "bg-[#3b82f6]",
          },
          {
            tier: "Mega (1M+)",
            count: 880,
            percentage: 12,
            color: "bg-[#f59e0b]",
          },
        ];

  // Campaign types display mapping
  const displayTypes =
    campaignTypes.length > 0
      ? campaignTypes
      : [
          {
            type: "Content Creation",
            count: 5248,
            percentage: 68,
            color: "bg-[#d92662]",
          },
          {
            type: "Amplification",
            count: 2987,
            percentage: 40,
            color: "bg-[#3b82f6]",
          },
        ];

  // Campaign volume monthly grouped bar display mapping
  const displayVolume =
    volume.length > 0
      ? volume
      : [
          { label: "Jan", draft: 80, live: 45, completed: 35 },
          { label: "Feb", draft: 95, live: 55, completed: 42 },
          { label: "Mar", draft: 70, live: 40, completed: 30 },
          { label: "Apr", draft: 110, live: 65, completed: 50 },
          { label: "May", draft: 85, live: 50, completed: 38 },
          { label: "Jun", draft: 125, live: 75, completed: 60 },
        ];

  // Industry budget display mapping
  const displayBudget =
    budgetByIndustry.length > 0
      ? budgetByIndustry
      : [
          { industry: "Beauty", budget: 273200, percentage: 90 },
          { industry: "Tech", budget: 223200, percentage: 70 },
          { industry: "Food Beverage", budget: 193200, percentage: 65 },
          { industry: "Fashion", budget: 183200, percentage: 60 },
          { industry: "Travel", budget: 143200, percentage: 45 },
          { industry: "Education", budget: 113200, percentage: 35 },
          { industry: "Entertainment", budget: 63200, percentage: 20 },
          { industry: "Automotive", budget: 43200, percentage: 15 },
        ];

  // SLA breach trend (0-20 scale)
  const displaySla =
    slaBreachTrend.length > 0
      ? slaBreachTrend
      : [
          { label: "Jan", rate: 12 },
          { label: "Feb", rate: 15 },
          { label: "Mar", rate: 10 },
          { label: "Apr", rate: 17 },
          { label: "May", rate: 8 },
          { label: "Jun", rate: 14 },
        ];

  // Revision rate trend (0-25 scale)
  const displayRevision =
    revisionRateTrend.length > 0
      ? revisionRateTrend
      : [
          { label: "Jan", rate: 19 },
          { label: "Feb", rate: 14 },
          { label: "Mar", rate: 21 },
          { label: "Apr", rate: 18 },
          { label: "May", rate: 11 },
          { label: "Jun", rate: 16 },
        ];

  // Completion rate trend (0-100 scale)
  const displayCompletion =
    completionRateTrend.length > 0
      ? completionRateTrend
      : [
          { label: "Jan", rate: 76 },
          { label: "Feb", rate: 79 },
          { label: "Mar", rate: 77 },
          { label: "Apr", rate: 81 },
          { label: "May", rate: 84 },
          { label: "Jun", rate: 80 },
        ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Campaigns */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-1 shadow-xs">
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
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-1 shadow-xs">
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
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-1 shadow-xs">
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
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-1 shadow-xs">
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
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-1 shadow-xs">
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
                <select className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer">
                  <option value="custom">Custom</option>
                  <option value="monthly">Monthly</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>

              <div className="flex items-center gap-1.5 h-8 px-3 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a]">
                <Calendar size={12} className="text-[#9a99b0]" />
                <span>1 Jan, 2026 - 30 Jun, 2026</span>
                <ChevronDown size={12} className="text-[#9a99b0]" />
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
                <select className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer">
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>

              <div className="flex items-center gap-1.5 h-8 px-3 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a]">
                <Calendar size={12} className="text-[#9a99b0]" />
                <span>1 Jan, 2026 - 30 Jun, 2026</span>
                <ChevronDown size={12} className="text-[#9a99b0]" />
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
                <option value="2026">2026</option>
                <option value="2025">2025</option>
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
              : displayVolume.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Draft Bar */}
                      <div
                        className="w-3 rounded-t-sm bg-[#d92662]"
                        style={{
                          height: `${Math.min(100, Math.max(15, (item.draft / 130) * 100))}%`,
                        }}
                        title={`Draft: ${item.draft}`}
                      />
                      {/* Live Bar */}
                      <div
                        className="w-3 rounded-t-sm bg-[#10b981]"
                        style={{
                          height: `${Math.min(100, Math.max(15, (item.live / 130) * 100))}%`,
                        }}
                        title={`Live: ${item.live}`}
                      />
                      {/* Completed Bar */}
                      <div
                        className="w-3 rounded-t-sm bg-[#475569]"
                        style={{
                          height: `${Math.min(100, Math.max(15, (item.completed / 130) * 100))}%`,
                        }}
                        title={`Completed: ${item.completed}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#9a99b0]">
                      {item.label}
                    </span>
                  </div>
                ))}
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
                <select className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer">
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
                />
              </div>

              <div className="flex items-center gap-1.5 h-8 px-3 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a]">
                <Calendar size={12} className="text-[#9a99b0]" />
                <span>1 Jan, 2026 - 30 Jun, 2026</span>
                <ChevronDown size={12} className="text-[#9a99b0]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {isLoadingBudget
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full rounded-md" />
                ))
              : displayBudget.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-24 font-semibold text-[#5a5a7a] shrink-0 text-right">
                      {item.industry}
                    </span>
                    <div className="flex-1 h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563eb]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-16 text-right font-bold text-[#5a5a7a] shrink-0">
                      ₦{(item.budget / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
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

/**
 * Reusable SVG Line Trend Chart matching exact design with dashed gridlines and dots
 */
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
