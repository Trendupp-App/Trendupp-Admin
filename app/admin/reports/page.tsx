"use client";

import { useState } from "react";
import AnalyticsHeader, {
  ReportTab,
  ModeType,
} from "@/components/admin/reports/AnalyticsHeader";
import CreatorAnalyticsView from "@/components/admin/reports/CreatorAnalyticsView";
import AdvertiserAnalyticsView from "@/components/admin/reports/AdvertiserAnalyticsView";
import PaidCampaignsAnalyticsView from "@/components/admin/reports/PaidCampaignsAnalyticsView";
import ExternalReportView from "@/components/admin/reports/ExternalReportView";

import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("creator");
  const [activeMode, setActiveMode] = useState<ModeType>("internal");
  const [dateRange, setDateRange] = useState("Last 7 Days");

  const handleGlobalExport = () => {
    const reportName =
      activeMode === "external"
        ? "External_Report"
        : `${activeTab.replace(/_/g, " ").toUpperCase()}_Analytics`;
    const filename = `Trendupp_${reportName}_${dateRange.replace(/\s+/g, "_")}`;

    const headers = [
      "Report Type",
      "Mode",
      "Date Range",
      "Metric Name",
      "Metric Value",
      "Notes",
    ];

    const rows = [
      [
        "Platform Overview",
        activeMode === "internal" ? "Internal Analytics" : "External Report",
        dateRange,
        "Active Tab",
        activeTab,
        "Exported from Trendupp Admin Console",
      ],
      [
        "Platform Overview",
        activeMode === "internal" ? "Internal Analytics" : "External Report",
        dateRange,
        "Export Timestamp",
        new Date().toLocaleString(),
        "Live Data Snapshot",
      ],
    ];

    downloadCsv(filename, headers, rows);
    toast.success(
      `Exported ${activeMode === "internal" ? activeTab.replace(/_/g, " ") : "external"} analytics report`,
    );
  };

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
        onExport={handleGlobalExport}
      />

      {/* Render Selected View based on Mode and Tab */}
      {activeMode === "external" ? (
        <ExternalReportView />
      ) : (
        <>
          {activeTab === "creator" && <CreatorAnalyticsView />}
          {activeTab === "advertiser" && <AdvertiserAnalyticsView />}
          {activeTab === "paid_campaigns" && <PaidCampaignsAnalyticsView />}
        </>
      )}
    </div>
  );
}
