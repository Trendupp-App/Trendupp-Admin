"use client";

import { useState } from "react";
import BrandStats from "@/components/admin/brands/BrandStats";
import BrandIndustry from "@/components/admin/brands/BrandIndustry";
import TopBrands from "@/components/admin/brands/TopBrands";
import BrandDistributions from "@/components/admin/brands/BrandDistributions";
import BrandTable from "@/components/admin/brands/BrandTable";
import InviteBrandModal from "@/components/admin/brands/InviteBrandModal";
import SuccessModal from "@/components/admin/creators/SuccessModal";

export default function BrandManagementPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [brandName, setBrandName] = useState("");

  const handleInviteSuccess = (name: string) => {
    setBrandName(name);
    setIsInviteOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a2e]">
            Brand Management
          </h1>
          <p className="text-xs text-[#7a7a9a] mt-0.5">
            Manage all registered brands, profiles, and campaigns.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-9 px-4 bg-brand-pink text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>+</span> Invite Brand
        </button>
      </div>

      {/* 4 Stats Cards */}
      <BrandStats />

      {/* Top Brands and Industry Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <TopBrands />
        </div>
        <div className="lg:col-span-7">
          <BrandIndustry />
        </div>
      </div>

      {/* Country and Completion Distributions */}
      <BrandDistributions />

      {/* Brand List Table */}
      <BrandTable />

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
          message={`An invitation link has been successfully dispatched to the representative of ${brandName || "the brand"} to join the platform.`}
        />
      )}
    </div>
  );
}
