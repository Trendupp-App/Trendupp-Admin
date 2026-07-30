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
import { useBrandActiveUsers } from "@/hooks/useAdminBrands";
import { CardFilterHeaderControls } from "../creators/CardFilterHeaderControls";

export default function BrandActiveUsersChart() {
  const [period, setPeriod] = useState<
    "all_time" | "daily" | "weekly" | "yearly"
  >("all_time");
  const [selectedYear, setSelectedYear] = useState(2026);

  const { data: apiData, isLoading } = useBrandActiveUsers(
    period === "all_time" ? "yearly" : period,
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
            <div className="w-28 h-4 bg-[#e8e6f0]/60 rounded-md" />
            <div className="w-40 h-3 bg-[#e8e6f0]/40 rounded-md" />
          </div>
          <div className="w-40 h-8 bg-[#e8e6f0]/60 rounded-xl" />
        </div>
        <div className="w-full h-56 bg-[#faf9fc] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#1a1a2e]">Active users</h3>
          <span className="text-[11px] text-[#9a99b0]">Active advertisers</span>
        </div>

        <CardFilterHeaderControls
          onPeriodChange={(p) => setPeriod(p)}
          onYearChange={(y) => setSelectedYear(y)}
          defaultPeriod="all_time"
          defaultYear={2026}
        />
      </div>

      <div className="w-full h-56 pt-2">
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
