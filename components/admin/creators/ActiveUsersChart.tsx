"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCreatorActiveUsers } from "@/hooks/useAdminCreators";
import { cn } from "@/lib/utils";

export default function ActiveUsersChart() {
  const [period, setPeriod] = useState<
    "all_time" | "daily" | "weekly" | "yearly"
  >("all_time");
  const [selectedYear, setSelectedYear] = useState(2026);

  const { data: apiData, isLoading } = useCreatorActiveUsers(
    period === "all_time" ? "monthly" : period,
    selectedYear,
  );

  const chartData = useMemo(() => {
    if (apiData && apiData.length > 0) {
      return apiData.map((d: { label: string; count: number }) => ({
        label: d.label,
        count: d.count,
      }));
    }
    return [];
  }, [apiData]);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
            <div className="w-48 h-3 bg-[#e8e6f0]/40 rounded-md" />
          </div>
          <div className="w-40 h-8 bg-[#e8e6f0]/60 rounded-xl" />
        </div>
        <div className="w-full h-56 bg-[#faf9fc] rounded-2xl" />
      </div>
    );
  }

  const periodLabels: Record<string, string> = {
    all_time: "All Time",
    daily: "Daily",
    weekly: "Weekly",
    yearly: "Yearly",
  };

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex flex-col gap-4">
        {/* Row 1: Title Header & Controls (Toggles + Year Filter) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2e]">Active users</h3>
            <span className="text-[11px] text-[#9a99b0]">Active creators</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Frequency Toggle Buttons: All Time | Daily | Weekly | Yearly */}
            <div className="flex items-center p-1 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl">
              {(["all_time", "daily", "weekly", "yearly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-1 text-[11px] font-bold rounded-lg capitalize transition-all cursor-pointer",
                    period === p
                      ? "bg-brand-pink text-white shadow-xs"
                      : "text-[#7a7a9a] hover:text-[#1a1a2e]",
                  )}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>

            {/* Year Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#9a99b0] uppercase">
                Year:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-[11px] font-bold rounded-xl outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9a99b0", fontSize: 10, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9a99b0", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#d7176f" : "#fce7f3"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
