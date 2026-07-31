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
import {
  CardFilterHeaderControls,
  type CardPeriod,
} from "../creators/CardFilterHeaderControls";
import { ScrollableBarChart } from "../creators/ScrollableBarChart";

export default function BrandActiveUsersChart() {
  const [period, setPeriod] = useState<CardPeriod>("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const apiPeriod = period === "yearly" ? "yearly" : period;

  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);

  const { data: apiData, isLoading } = useBrandActiveUsers(
    apiPeriod,
    period === "yearly" ? undefined : selectedYear,
    period === "daily" || period === "weekly" ? currentMonth : undefined,
  );

  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    return apiData.map((d: { label: string; count: number }) => {
      let label = d.label;

      if (period === "daily") {
        const dayNum = label.match(/^Day\s*(\d+)$/i)?.[1];
        if (dayNum) {
          const monthIdx = currentMonth - 1;
          const date = new Date(selectedYear, monthIdx, parseInt(dayNum, 10));
          label = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
        }
      }

      return { label, count: d.count };
    });
  }, [apiData, period, selectedYear, currentMonth]);

  const barGap = period === "yearly" ? "40%" : "25%";

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#1a1a2e]">Active users</h3>
          <span className="text-[11px] text-[#9a99b0]">
            Active advertisers count
          </span>
        </div>

        <div className="pt-0.5">
          <CardFilterHeaderControls
            period={period}
            selectedYear={selectedYear}
            onPeriodChange={setPeriod}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>

      <div className="w-full pt-2 relative" style={{ height: 256 }}>
        {isLoading && (
          <div className="absolute inset-0 rounded-2xl bg-[#faf9fc] animate-pulse z-10" />
        )}
        {!isLoading && chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-[#9a99b0]">
            No data available
          </div>
        ) : period === "daily" ? (
          <ScrollableBarChart
            data={chartData}
            accentIndex={chartData.length - 1}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={barGap}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9a99b0", fontSize: 10, fontWeight: 500 }}
                interval={0}
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
                    fill={
                      index === chartData.length - 1 ? "#d7176f" : "#fce7f3"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
