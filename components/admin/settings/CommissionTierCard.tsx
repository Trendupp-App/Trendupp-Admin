"use client";

import { Pencil, Trash2, Edit3 } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import type { CommissionTier } from "@/types/adminSettings";

interface CommissionTierCardProps {
  tier: CommissionTier;
  onEdit: (tier: CommissionTier) => void;
  onDelete?: (tier: CommissionTier) => void;
}

export default function CommissionTierCard({
  tier,
  onEdit,
  onDelete,
}: CommissionTierCardProps) {
  const isDefault = tier.isDefault;
  const rateDisplay = `${tier.ratePercentage}%`;
  const brandCount =
    tier.appliedBrandsCount ??
    tier.appliedCount ??
    tier.brandIds?.length ??
    (isDefault ? 120 : 0);

  return (
    <div className="bg-white border border-[#f0f0f5] rounded-2xl p-6 flex items-center justify-between shadow-xs transition-all hover:border-[#e2e2ec]">
      {/* Left side: Rate % and Badge */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center justify-center min-w-[70px]">
          <span className="text-3xl font-extrabold text-[#1a1a2e] leading-tight">
            {rateDisplay}
          </span>
          <span
            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider mt-1 ${
              isDefault
                ? "bg-[#f0f0f8] text-[#7a7a9a]"
                : "bg-[#e8f8f0] text-[#1e8e3e]"
            }`}
          >
            {isDefault ? "DEFAULT RATE" : "CUSTOM TIER"}
          </span>
        </div>

        <div className="h-10 w-[1px] bg-[#f0f0f5]" />

        {/* Middle side: Title and Brand Details */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            {tier.name ||
              (isDefault ? "Standard Platform Commission" : "Custom Rate")}
          </h3>

          <div className="flex items-center gap-2">
            {!isDefault && tier.brands && tier.brands.length > 0 && (
              <div className="flex -space-x-2 overflow-hidden">
                {tier.brands.slice(0, 3).map((b, idx) => (
                  <UserAvatar
                    key={b.id || idx}
                    avatarUrl={b.logoUrl}
                    initials={(b.brandName || b.name || "B")
                      .substring(0, 2)
                      .toUpperCase()}
                    size={20}
                  />
                ))}
              </div>
            )}
            <span className="text-xs text-[#7a7a9a]">
              {isDefault
                ? `Applied to ${brandCount} brands by default.`
                : `${brandCount} ${brandCount === 1 ? "Brand" : "Brands"} Selected`}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div>
        {isDefault ? (
          <button
            onClick={() => onEdit(tier)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] hover:bg-[#fafafa] hover:border-brand-pink transition-all cursor-pointer"
          >
            <Edit3 size={14} className="text-[#1a1a2e]" />
            Edit Commission Rate
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(tier)}
              title="Edit Tier"
              className="p-2 rounded-lg text-[#7a7a9a] hover:text-brand-pink hover:bg-[#fff0f5] transition-all cursor-pointer"
            >
              <Pencil size={15} />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(tier)}
                title="Delete Tier"
                className="p-2 rounded-lg text-[#7a7a9a] hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
