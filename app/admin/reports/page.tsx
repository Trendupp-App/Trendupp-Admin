"use client";

import { useState } from "react";
import AnalyticsHeader, {
  ReportTab,
  ModeType,
} from "@/components/admin/reports/AnalyticsHeader";
import CreatorAnalyticsView from "@/components/admin/reports/CreatorAnalyticsView";
import AdvertiserAnalyticsView from "@/components/admin/reports/AdvertiserAnalyticsView";
import PaidCampaignsAnalyticsView from "@/components/admin/reports/PaidCampaignsAnalyticsView";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("creator");
  const [activeMode, setActiveMode] = useState<ModeType>("internal");
  const [dateRange, setDateRange] = useState("Last 7 Days");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up text-left">
      {/* Header with Mode Toggle, Tabs & Date Filter */}
      <AnalyticsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Render Selected Analytics Tab */}
      {activeTab === "creator" && <CreatorAnalyticsView />}
      {activeTab === "advertiser" && <AdvertiserAnalyticsView />}
      {activeTab === "paid_campaigns" && <PaidCampaignsAnalyticsView />}
    </div>
  );
}
