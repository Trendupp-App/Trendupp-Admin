"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleButtonGroupProps<T extends string> {
  options: readonly T[];
  selected: string | string[];
  multiple?: boolean;
  onSelect: (option: T) => void;
  variant?: "pills" | "segmented";
}

export function ToggleButtonGroup<T extends string>({
  options,
  selected,
  multiple = false,
  onSelect,
  variant = "pills",
}: ToggleButtonGroupProps<T>) {
  const isSelected = (option: string) => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  if (variant === "segmented") {
    return (
      <div className="bg-[#f4f2fa] rounded-[18px] p-1.5 flex items-center w-full">
        {options.map((option) => {
          const active = isSelected(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                "flex-1 py-3 text-[13px] font-semibold rounded-[14px] transition-all cursor-pointer border-none text-center leading-none",
                active
                  ? "bg-[#040039] text-white shadow-sm"
                  : "bg-transparent text-[#7a7a9a] hover:text-[#5e5c7a]",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = isSelected(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-semibold rounded-full border transition-all duration-200 cursor-pointer leading-none",
              active
                ? "bg-[#040039] text-white border-[#040039] shadow-sm"
                : "bg-white text-[#1a1a2e] border-[#e8e6f0] hover:bg-[#fcfbfd]",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
