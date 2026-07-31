"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const CHART_HEIGHT = 256;
const Y_AXIS_WIDTH = 44;
const BAR_MIN_WIDTH = 56; // px per bar slot — wide enough for "31 Jul" + bar

interface ScrollableBarChartProps {
  data: { label: string; count: number }[];
  barMinWidth?: number;
  accentIndex?: number;
  accentColor?: string;
  baseColor?: string;
}

export function ScrollableBarChart({
  data,
  barMinWidth = BAR_MIN_WIDTH,
  accentIndex,
  accentColor = "#d7176f",
  baseColor = "#fce7f3",
}: ScrollableBarChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width - Y_AXIS_WIDTH);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll, data]);

  const calculatedWidth = data.length * barMinWidth;
  const chartWidth = Math.max(calculatedWidth, containerWidth);
  const needsScroll = calculatedWidth > containerWidth;

  const resolvedAccentIndex = accentIndex ?? data.length - 1;

  const tickFormatter = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${v}`;

  const tooltipStyle = {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 600 as const,
  };

  if (!data.length || containerWidth === 0) {
    return <div className="w-full h-64" ref={wrapperRef} />;
  }

  return (
    <div className="flex w-full overflow-hidden" ref={wrapperRef}>
      {/* Pinned Y-axis strip */}
      <div style={{ width: Y_AXIS_WIDTH, flexShrink: 0 }}>
        <BarChart
          width={Y_AXIS_WIDTH}
          height={CHART_HEIGHT}
          data={data}
          margin={{ top: 4, right: 0, bottom: 20, left: 0 }}
        >
          <YAxis
            width={Y_AXIS_WIDTH}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9a99b0", fontSize: 10, fontWeight: 500 }}
            tickFormatter={tickFormatter}
          />
          {/* Invisible bar — anchors the scale to match the scrollable chart */}
          <Bar dataKey="count" fill="transparent" isAnimationActive={false} />
        </BarChart>
      </div>

      {/* Scrollable chart area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Right-edge fade hint — disappears once scrolled to the end */}
        {needsScroll && !isAtEnd && (
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.9))",
            }}
          />
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e8e6f0 transparent",
          }}
        >
          <BarChart
            width={chartWidth}
            height={CHART_HEIGHT}
            data={data}
            barCategoryGap="40%"
            margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9a99b0", fontSize: 10, fontWeight: 500 }}
              interval={0}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={i === resolvedAccentIndex ? accentColor : baseColor}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
}
