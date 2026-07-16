"use client";

import { useState } from "react";
import CampaignStats from "@/components/admin/campaigns/CampaignStats";
import CampaignTable from "@/components/admin/campaigns/CampaignTable";

export default function PaidCampaignsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a2e]">Campaigns</h1>
      </div>

      {/* Campaigns Stats Overview */}
      <CampaignStats
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {/* Campaigns List Table */}
      <CampaignTable
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />
    </div>
  );
}
