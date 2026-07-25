"use client";

import { Plus, AlertTriangle } from "lucide-react";
import CommissionTierCard from "./CommissionTierCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { CommissionTier } from "@/types/adminSettings";

interface CommissionTierListProps {
  tiers: CommissionTier[];
  isLoading: boolean;
  onAddTier: () => void;
  onEditTier: (tier: CommissionTier) => void;
  onDeleteTier: (tier: CommissionTier) => void;
}

const DEFAULT_FALLBACK_TIERS: CommissionTier[] = [
  {
    id: "default-tier-1",
    name: "Standard Platform Commission",
    ratePercentage: 15,
    isDefault: true,
    appliedBrandsCount: 120,
  },
  {
    id: "90c96252-ee9a-4ee9-bd3d-ef8bc3af09d6",
    name: "High-Volume Partner Rate",
    ratePercentage: 10,
    isDefault: false,
    appliedBrandsCount: 3,
    brands: [
      { id: "b1", brandName: "Coca-Cola" },
      { id: "b2", brandName: "Nike" },
      { id: "b3", brandName: "Samsung" },
    ],
  },
];

export default function CommissionTierList({
  tiers,
  isLoading,
  onAddTier,
  onEditTier,
  onDeleteTier,
}: CommissionTierListProps) {
  const displayTiers =
    process.env.NODE_ENV === "development" && tiers.length === 0
      ? DEFAULT_FALLBACK_TIERS
      : tiers;

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1a1a2e]">
          COMMISSION TIERS
        </h2>

        <button
          onClick={onAddTier}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add New Commission Tier
        </button>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : (
          displayTiers.map((tier) => (
            <CommissionTierCard
              key={tier.id}
              tier={tier}
              onEdit={onEditTier}
              onDelete={!tier.isDefault ? onDeleteTier : undefined}
            />
          ))
        )}
      </div>

      {/* Warning Notice Banner */}
      <div className="bg-[#fff9e6] border border-[#ffeaa7] rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle size={18} className="text-[#d68910] shrink-0" />
        <span className="text-xs text-[#7d5a00] leading-relaxed">
          Changing the commission rate affects all newly funded campaigns.
          Existing campaigns retain the original rate.
        </span>
      </div>
    </div>
  );
}
