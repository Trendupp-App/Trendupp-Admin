"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxListProps {
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
  open: boolean;
  search: string;
  setSearch: (search: string) => void;
  placeholder?: string;
}

export function CheckboxList({
  options,
  selected,
  onToggle,
  open,
  search,
  setSearch,
  placeholder = "Search...",
}: CheckboxListProps) {
  if (!open) return null;

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3 mt-3">
      <hr className="border-[#e8e6f0]/40 -mx-4" />

      {/* Search Box */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a99b0]" />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 bg-white border border-[#e8e6f0] rounded-[14px] pl-10 pr-3 text-xs font-light text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 placeholder-[#9a99b0]"
        />
      </div>

      {/* Checkboxes List */}
      <div className="max-h-48 overflow-y-auto flex flex-col gap-3.5 pt-2 select-none pr-1 scrollbar-hide">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const isChecked = selected.includes(option);
            return (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer text-xs font-light text-[#1a1a2e] hover:text-black"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => onToggle(option)}
                  className="w-[18px] h-[18px] border-[#e8e6f0] rounded-[5px] data-[state=checked]:bg-[#040039] data-[state=checked]:border-[#040039]"
                />
                <span>{option}</span>
              </label>
            );
          })
        ) : (
          <span className="text-[11px] font-light text-[#9a99b0] py-2">
            No items found
          </span>
        )}
      </div>
    </div>
  );
}
