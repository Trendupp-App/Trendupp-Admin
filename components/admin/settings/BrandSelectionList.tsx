"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import { useAdminBrandsList } from "@/hooks/useAdminBrands";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminBrandListItem } from "@/types/adminBrands";

interface BrandSelectionListProps {
  selectedBrandIds: string[];
  onChange: (brandIds: string[]) => void;
  defaultRate?: number;
}

export default function BrandSelectionList({
  selectedBrandIds,
  onChange,
  defaultRate = 15,
}: BrandSelectionListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: brandsData, isLoading } = useAdminBrandsList({
    limit: 100,
  });

  const brandList: AdminBrandListItem[] = useMemo(() => {
    return brandsData?.data || [];
  }, [brandsData]);

  const filteredBrands = useMemo(() => {
    if (!searchTerm.trim()) return brandList;
    const term = searchTerm.toLowerCase();
    return brandList.filter((b) => {
      const name = b.brandName || b.advertiser?.brandName || "";
      return name.toLowerCase().includes(term);
    });
  }, [brandList, searchTerm]);

  const isAllSelected = useMemo(() => {
    if (filteredBrands.length === 0) return false;
    return filteredBrands.every((b) => selectedBrandIds.includes(b.id));
  }, [filteredBrands, selectedBrandIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = new Set(filteredBrands.map((b) => b.id));
      onChange(selectedBrandIds.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredBrands.map((b) => b.id);
      const combined = Array.from(
        new Set([...selectedBrandIds, ...filteredIds]),
      );
      onChange(combined);
    }
  };

  const toggleBrand = (brandId: string) => {
    if (selectedBrandIds.includes(brandId)) {
      onChange(selectedBrandIds.filter((id) => id !== brandId));
    } else {
      onChange([...selectedBrandIds, brandId]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-semibold text-[#1a1a2e]">
        Apply to Specific Brands
      </label>

      <div className="border border-[#e6e6ec] rounded-xl p-3.5 bg-white flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Brands..."
            className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
          />
        </div>

        {/* Select All Checkbox */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <input
            type="checkbox"
            id="select-all-brands"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink border-gray-300 cursor-pointer accent-brand-pink"
          />
          <label
            htmlFor="select-all-brands"
            className="text-xs font-bold text-[#1a1a2e] cursor-pointer"
          >
            Select All Brands
          </label>
        </div>

        {/* Brand Items Container */}
        <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 pr-1">
          {isLoading ? (
            <div className="flex flex-col gap-2 py-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#7a7a9a]">
              {searchTerm ? "No matching brands found" : "No brands available"}
            </div>
          ) : (
            filteredBrands.map((brand) => {
              const isSelected = selectedBrandIds.includes(brand.id);
              const name =
                brand.brandName || brand.advertiser?.brandName || "Brand";
              const logo = brand.logoUrl || brand.advertiser?.logoUrl;
              const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={brand.id}
                  onClick={() => toggleBrand(brand.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#fff0f5] border-[#fcd5e5]"
                      : "bg-[#fafafa] border-[#f0f0f5] hover:border-[#e0e0ea]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleBrand(brand.id);
                    }}
                    className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink border-gray-300 cursor-pointer accent-brand-pink shrink-0"
                  />

                  <UserAvatar avatarUrl={logo} initials={initials} size={32} />

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#1a1a2e] truncate">
                      {name}
                    </span>
                    <span className="text-[11px] text-[#7a7a9a]">
                      Current: {defaultRate}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Count */}
        <div className="text-right pt-1 border-t border-[#f0f0f5]">
          <span className="text-[11px] text-[#7a7a9a] font-medium">
            {selectedBrandIds.length}{" "}
            {selectedBrandIds.length === 1 ? "brand" : "brands"} selected
          </span>
        </div>
      </div>
    </div>
  );
}
