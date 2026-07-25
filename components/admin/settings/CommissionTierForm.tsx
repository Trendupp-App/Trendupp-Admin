"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import BrandSelectionList from "./BrandSelectionList";
import type {
  CommissionTier,
  CreateCommissionTierDto,
} from "@/types/adminSettings";
import { useAuthStore } from "@/store/authStore";

interface CommissionTierFormProps {
  initialData?: CommissionTier | null;
  defaultRate?: number;
  onCancel: () => void;
  onSubmit: (data: CreateCommissionTierDto) => void;
  isSubmitting?: boolean;
}

export default function CommissionTierForm({
  initialData,
  defaultRate = 15,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: CommissionTierFormProps) {
  const { user } = useAuthStore();
  const isDefault = initialData?.isDefault ?? false;

  const [name, setName] = useState(
    initialData?.name || (isDefault ? "Standard Platform Commission" : ""),
  );
  const [ratePercentage, setRatePercentage] = useState<string>(
    initialData?.ratePercentage !== undefined
      ? String(initialData.ratePercentage)
      : "",
  );
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    initialData?.brandIds || initialData?.brands?.map((b) => b.id) || [],
  );
  const [reason, setReason] = useState(initialData?.reason || "");

  const updatedBy =
    initialData?.lastUpdatedBy ||
    (user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "Chisom Adeyemi (Super Admin)");
  const updatedDate = initialData?.lastUpdatedDate || "Jan 15, 2026";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(ratePercentage);
    if (isNaN(rate) || rate < 0 || rate > 100) return;

    onSubmit({
      name:
        name.trim() ||
        (isDefault ? "Standard Platform Commission" : "Custom Rate"),
      ratePercentage: rate,
      isDefault: isDefault,
      reason: reason.trim(),
      brandIds: selectedBrandIds,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#f0f0f5] rounded-2xl p-7 flex flex-col gap-6 shadow-xs"
      >
        {/* Header / Current Rate Info */}
        <div className="flex flex-col gap-2 pb-4 border-b border-[#f0f0f5]">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7a7a9a]">
            {initialData ? "CURRENT COMMISSION RATE" : "NEW COMMISSION TIER"}
          </span>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-[#1a1a2e]">
              {ratePercentage
                ? `${ratePercentage}%`
                : `${initialData?.ratePercentage ?? defaultRate}%`}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e8f8f0] text-[#1e8e3e]">
              {isDefault ? "Applied to all new campaigns" : "Custom Tier Rate"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#7a7a9a] mt-1">
            <span>
              Last Updated By:{" "}
              <strong className="text-[#1a1a2e] font-semibold">
                {updatedBy}
              </strong>
            </span>
            <span>•</span>
            <span>
              Last Updated Date:{" "}
              <strong className="text-[#1a1a2e] font-semibold">
                {updatedDate}
              </strong>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5">
          {/* Tier Name (for non-default or custom) */}
          {!isDefault && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1a1a2e]">
                Tier Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. High-Volume Partner Rate"
                required={!isDefault}
                className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-2.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
              />
            </div>
          )}

          {/* New Commission Rate Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1a1a2e]">
              New Commission Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={ratePercentage}
              onChange={(e) => setRatePercentage(e.target.value)}
              placeholder="e.g. 12"
              required
              className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-2.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
            />
          </div>

          {/* Brand Selector */}
          {!isDefault && (
            <BrandSelectionList
              selectedBrandIds={selectedBrandIds}
              onChange={setSelectedBrandIds}
              defaultRate={defaultRate}
            />
          )}

          {/* Reason for Change */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1a1a2e]">
              Reason for Change
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why the rate is being updated..."
              className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl p-3.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] hover:bg-[#fafafa] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Confirm Change"}
          </button>
        </div>
      </form>

      {/* Warning Alert Banner */}
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
