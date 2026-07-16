"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface AdminKpiCardProps {
  value: string;
  label: string;
  sublabel?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: LucideIcon | string;
  iconBg?: string;
  iconColor?: string;
}

export function AdminKpiCard({
  value,
  label,
  sublabel,
  trend,
  trendUp = true,
  icon: Icon,
  iconBg = "bg-[#edf2fe]",
  iconColor = "text-[#2f63eb]",
}: AdminKpiCardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-[0_4px_20px_-4px_rgba(4,0,57,0.06)] transition-all duration-300">
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
              iconBg,
              iconColor,
            )}
          >
            {typeof Icon === "string" ? (
              <span>{Icon}</span>
            ) : (
              <Icon size={15} />
            )}
          </div>
        )}
        {trend && (
          <span
            className={cn(
              "text-[10px] font-semibold",
              trendUp ? "text-[#16a34a]" : "text-[#dc2626]",
            )}
          >
            {trendUp ? "+" : ""}
            {trend}
          </span>
        )}
      </div>

      {/* Value + label */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-bold text-[#1a1a2e] tracking-tight">
          {value}
        </span>
        <span className="text-xs text-[#7a7a9a] font-medium">{label}</span>
        {sublabel && (
          <span className="text-[10px] text-[#9a99b0] font-light">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
