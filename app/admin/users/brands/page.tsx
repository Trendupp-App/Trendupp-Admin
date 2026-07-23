"use client";

import { useState } from "react";
import BrandStats from "@/components/admin/brands/BrandStats";
import BrandRetentionBanner from "@/components/admin/brands/BrandRetentionBanner";
import BrandSignupGrowthChart from "@/components/admin/brands/BrandSignupGrowthChart";
import BrandActiveUsersChart from "@/components/admin/brands/BrandActiveUsersChart";
import TopBrands from "@/components/admin/brands/TopBrands";
import BrandProfileCompletionCard from "@/components/admin/brands/BrandProfileCompletionCard";
import BrandDistributions from "@/components/admin/brands/BrandDistributions";
import BrandTable from "@/components/admin/brands/BrandTable";
import InviteBrandModal from "@/components/admin/brands/InviteBrandModal";
import SuccessModal from "@/components/admin/creators/SuccessModal";
import { cn } from "@/lib/utils";

export default function BrandManagementPage() {
  const [viewMode, setViewMode] = useState<"charts" | "tables">("charts");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [invitedBrandName, setInvitedBrandName] = useState("");

  const handleInviteSuccess = (name: string) => {
    setInvitedBrandName(name);
    setIsInviteOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">
            Advertisers Management
          </h1>
          <p className="text-xs text-[#7a7a9a] mt-0.5">
            Manage all registered brands, profiles, and campaigns.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-9 px-4 bg-brand-pink text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <span>+</span> Invite Brand
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <BrandStats />

      {/* View Mode Pill Toggle (Charts | Tables) */}
      <div className="flex items-center gap-1 p-1 bg-[#e8e6f0]/50 rounded-full w-fit">
        <button
          onClick={() => setViewMode("charts")}
          className={cn(
            "px-5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer",
            viewMode === "charts"
              ? "bg-brand-pink text-white shadow-xs"
              : "text-[#7a7a9a] hover:text-[#1a1a2e]",
          )}
        >
          Charts
        </button>
        <button
          onClick={() => setViewMode("tables")}
          className={cn(
            "px-5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer",
            viewMode === "tables"
              ? "bg-brand-pink text-white shadow-xs"
              : "text-[#7a7a9a] hover:text-[#1a1a2e]",
          )}
        >
          Tables
        </button>
      </div>

      {/* CHARTS VIEW */}
      {viewMode === "charts" && (
        <div className="flex flex-col gap-6">
          {/* Advertisers Retention Banner */}
          <BrandRetentionBanner />

          {/* Signup Growth & Active Users Charts Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrandSignupGrowthChart />
            <BrandActiveUsersChart />
          </div>

          {/* Top Advertisers & Profile Completion Cards Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopBrands onViewAll={() => setViewMode("tables")} />
            <BrandProfileCompletionCard />
          </div>

          {/* Industry Breakdown & Country Breakdown Side-by-Side */}
          <BrandDistributions />
        </div>
      )}

      {/* TABLES VIEW */}
      {viewMode === "tables" && <BrandTable />}

      {/* Invite Modal */}
      {isInviteOpen && (
        <InviteBrandModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Success Modal */}
      {isSuccessOpen && (
        <SuccessModal
          isOpen={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
          title="Invitation Sent Successfully"
          message={`An invitation link has been successfully dispatched to the representative of ${invitedBrandName || "the brand"} to join the platform.`}
        />
      )}
    </div>
  );
}
