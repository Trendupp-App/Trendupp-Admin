"use client";

import { useState } from "react";
import SettingsNav from "@/components/admin/settings/SettingsNav";
import CommissionSettingsView from "@/components/admin/settings/CommissionSettingsView";
import CreatorNichesView from "@/components/admin/settings/CreatorNichesView";
import BrandIndustriesView from "@/components/admin/settings/BrandIndustriesView";
import TicketCategoriesView from "@/components/admin/settings/TicketCategoriesView";
import FaqManagementView from "@/components/admin/settings/FaqManagementView";
import NewsCategoriesView from "@/components/admin/settings/NewsCategoriesView";
import ContactInfoView from "@/components/admin/settings/ContactInfoView";
import ExternalLinksView from "@/components/admin/settings/ExternalLinksView";
import ChangeLoginView from "@/components/admin/settings/ChangeLoginView";
import AccessDenied from "@/components/admin/AccessDenied";
import { usePermission } from "@/hooks/usePermission";
import type { SettingsTab } from "@/types/adminSettings";

export default function SettingsPage() {
  const canAccess = usePermission("page.settings");
  const canEditContactInfo = usePermission("settings.contact_info");
  const canEditCommission = usePermission("settings.commission");
  const [activeTab, setActiveTab] = useState<SettingsTab>("commission");

  if (!canAccess) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 min-h-screen bg-[#fafafa] w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">
          Settings
        </h1>
      </div>

      {/* Main Settings Content with Left/Top Navigation */}
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full min-w-0">
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 w-full min-w-0">
          {activeTab === "commission" ? (
            canEditCommission ? (
              <CommissionSettingsView />
            ) : (
              <AccessDenied />
            )
          ) : activeTab === "creator-niches" ? (
            <CreatorNichesView />
          ) : activeTab === "brand-industries" ? (
            <BrandIndustriesView />
          ) : activeTab === "ticket-categories" ? (
            <TicketCategoriesView />
          ) : activeTab === "faq-management" ? (
            <FaqManagementView />
          ) : activeTab === "news-categories" ? (
            <NewsCategoriesView />
          ) : activeTab === "contact-info" ? (
            canEditContactInfo ? (
              <ContactInfoView />
            ) : (
              <AccessDenied />
            )
          ) : activeTab === "external-links" ? (
            <ExternalLinksView />
          ) : (
            <ChangeLoginView />
          )}
        </main>
      </div>
    </div>
  );
}
