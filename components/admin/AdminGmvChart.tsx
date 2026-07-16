"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Range = "Week" | "Month" | "Year";

const WEEK_DATA = [
  { day: "Mon", value: 18200000 },
  { day: "Tue", value: 22400000 },
  { day: "Wed", value: 19800000 },
  { day: "Thu", value: 28100000 },
  { day: "Fri", value: 24600000 },
  { day: "Sat", value: 16300000 },
  { day: "Sun", value: 12900000 },
];

function fmt(v: number) {
  return `₦${(v / 1_000_000).toFixed(1)}M`;
}

const peakValue = Math.max(...WEEK_DATA.map((d) => d.value));

// Custom label rendered above each bar
function TopLabel({
  x,
  y,
  width,
  value,
}: {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}) {
  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    value === undefined
  )
    return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fontSize={10}
      fill="#7a7a9a"
      fontWeight={500}
    >
      {fmt(value)}
    </text>
  );
}

export function AdminGmvChart() {
  const [range, setRange] = useState<Range>("Week");

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">GMV Overview</h2>
          <p className="text-[10px] text-[#9a99b0]">
            Total transaction volume by day
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#f4f3f6] rounded-xl p-1">
          {(["Week", "Month", "Year"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                range === r
                  ? "bg-white text-[#1a1a2e] shadow-sm"
                  : "text-[#7a7a9a] hover:text-[#1a1a2e]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px] w-full">
        {/* SVG gradient definition */}
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={WEEK_DATA}
            barCategoryGap="5%"
            margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9a99b0" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => (typeof v === "number" ? fmt(v) : v)}
              contentStyle={{
                fontSize: 11,
                borderRadius: 12,
                border: "1px solid #e8e6f0",
              }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 4, 4]}>
              <LabelList content={<TopLabel />} />
              {WEEK_DATA.map((entry) => (
                <Cell
                  key={entry.day}
                  fill={
                    entry.value === peakValue ? "url(#peakGradient)" : "#cbd5e1"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer: legend + week total */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] text-[#7a7a9a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block" />
            Peak day
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-[#7a7a9a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] inline-block" />
            Regular
          </span>
        </div>
        <p className="text-[11px] text-[#7a7a9a]">
          Week total: <span className="font-bold text-[#2f63eb]">₦142.3M</span>
        </p>
      </div>
    </section>
  );
}
