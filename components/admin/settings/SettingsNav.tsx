"use client";

import {
  Tag,
  Building2,
  HelpCircle,
  Headphones,
  Newspaper,
  Phone,
  Link2,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SettingsTab } from "@/types/adminSettings";

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SETTINGS_NAV_ITEMS: {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "commission", label: "Commission", icon: Percent },
  { id: "creator-niches", label: "Creator Niches", icon: Tag },
  { id: "brand-industries", label: "Brand Industries", icon: Building2 },
  { id: "faq-management", label: "FAQ Management", icon: HelpCircle },
  { id: "ticket-categories", label: "Ticket Categories", icon: Headphones },
  { id: "news-categories", label: "News Categories", icon: Newspaper },
  { id: "contact-info", label: "Contact Info", icon: Phone },
  { id: "external-links", label: "External Links", icon: Link2 },
  { id: "change-login", label: "Change Login", icon: ShieldCheck },
];

export default function SettingsNav({
  activeTab,
  onTabChange,
}: SettingsNavProps) {
  return (
    <aside className="w-full lg:w-[240px] shrink-0 bg-white rounded-2xl p-2 sm:p-3 border border-[#f0f0f5] shadow-xs overflow-x-auto no-scrollbar">
      <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
        {SETTINGS_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer text-left whitespace-nowrap lg:w-full",
                isActive
                  ? "bg-[#fff0f5] text-brand-pink font-semibold"
                  : "text-[#6b6b80] hover:bg-[#fafafa] hover:text-[#1a1a2e]",
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-brand-pink" : "text-[#9a99b0]",
                )}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
