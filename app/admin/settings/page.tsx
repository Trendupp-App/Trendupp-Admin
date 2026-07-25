"use client";

import { useState } from "react";
import SettingsNav from "@/components/admin/settings/SettingsNav";
import CommissionSettingsView from "@/components/admin/settings/CommissionSettingsView";
import CreatorNichesView from "@/components/admin/settings/CreatorNichesView";
import FaqManagementView from "@/components/admin/settings/FaqManagementView";
import NewsCategoriesView from "@/components/admin/settings/NewsCategoriesView";
import ContactInfoView from "@/components/admin/settings/ContactInfoView";
import ExternalLinksView from "@/components/admin/settings/ExternalLinksView";
import ChangeLoginView from "@/components/admin/settings/ChangeLoginView";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import type { SettingsTab } from "@/types/adminSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("commission");

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Settings</h1>
      </div>

      {/* Main Settings Content with Left Navigation */}
      <div className="flex items-start gap-6">
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 min-w-0">
          {activeTab === "commission" ? (
            <CommissionSettingsView />
          ) : activeTab === "creator-niches" ? (
            <CreatorNichesView />
          ) : activeTab === "faq-management" ? (
            <FaqManagementView />
          ) : activeTab === "news-categories" ? (
            <NewsCategoriesView />
          ) : activeTab === "contact-info" ? (
            <ContactInfoView />
          ) : activeTab === "external-links" ? (
            <ExternalLinksView />
          ) : activeTab === "change-login" ? (
            <ChangeLoginView />
          ) : (
            <ComingSoonPage
              title={activeTab.replace(/-/g, " ").toUpperCase()}
            />
          )}
        </main>
      </div>
    </div>
  );
}
