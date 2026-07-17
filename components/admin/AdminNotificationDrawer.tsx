"use client";

import { useState, useEffect } from "react";
import { X, Check, CreditCard, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

interface AdminNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "payment" | "campaign" | "content";
  isUnread: boolean;
}

interface AdminNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 1,
    title: "Payment Released",
    message: "₦180,000 from Zara Africa has been released to your wallet.",
    time: "2 mins ago",
    type: "payment",
    isUnread: true,
  },
  {
    id: 2,
    title: "23 creator profiles pending review",
    message: "awaiting approval",
    time: "2 mins ago",
    type: "campaign",
    isUnread: true,
  },
  {
    id: 3,
    title: "New dispute raised #TR-2208",
    message: "₦180,000 from Zara Africa has been added to the escrow",
    time: "1 hour ago",
    type: "content",
    isUnread: true,
  },
  {
    id: 4,
    title: "New dispute raised #TR-2208",
    message: "₦180,000 from Zara Africa has been added to the escrow",
    time: "1 hour ago",
    type: "content",
    isUnread: true,
  },
  {
    id: 5,
    title: "New dispute raised #TR-2208",
    message: "₦180,000 from Zara Africa has been added to the escrow",
    time: "1 hour ago",
    type: "content",
    isUnread: true,
  },
  {
    id: 6,
    title: "Payment Released",
    message: "₦180,000 from Zara Africa has been released to your wallet.",
    time: "2 mins ago",
    type: "payment",
    isUnread: true,
  },
];

type TabType = "All" | "Campaigns" | "Payments" | "Content";

export default function AdminNotificationDrawer({
  isOpen,
  onClose,
}: AdminNotificationDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("All");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filtered = MOCK_NOTIFICATIONS.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Campaigns") return n.type === "campaign";
    if (activeTab === "Payments") return n.type === "payment";
    if (activeTab === "Content") return n.type === "content";
    return true;
  });

  return (
    <Portal>
      <div
        className={cn(
          "fixed inset-0 z-50 flex justify-end transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div
          className={cn(
            "w-full max-w-[500px] h-full bg-white relative z-10 flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4">
            <h3 className="text-xl font-bold text-[#1a1a2e]">Notification</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 mt-5">
            {(["All", "Campaigns", "Payments", "Content"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all",
                    activeTab === tab
                      ? "bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]"
                      : "bg-[#f4f3f6] text-[#7a7a9a] border-transparent hover:bg-[#eae8ed]",
                  )}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto mt-6 flex flex-col gap-3 pr-1">
            {filtered.map((n) => {
              const isPayment = n.type === "payment";
              const isCampaign = n.type === "campaign";
              const bgClass = isPayment
                ? "bg-[#fdf2f6] text-[#d7176f]"
                : isCampaign
                  ? "bg-[#edf2fe] text-[#2f63eb]"
                  : "bg-[#fef9e7] text-[#ca8a04]";
              const Icon = isPayment
                ? CreditCard
                : isCampaign
                  ? Check
                  : ShieldAlert;

              return (
                <div
                  key={n.id}
                  className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex gap-3.5 relative hover:shadow-[0_2px_12px_rgba(4,0,57,0.03)] transition-all cursor-pointer group"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center",
                      bgClass,
                    )}
                  >
                    <Icon size={16} className="stroke-[2.5]" />
                  </div>

                  <div className="flex flex-col gap-0.5 pr-4">
                    <h4 className="text-sm font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                      {n.title}
                    </h4>
                    <p className="text-xs font-medium text-[#7a7a9a] leading-relaxed mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-[#9a99b0] font-light mt-1.5 block">
                      {n.time}
                    </span>
                  </div>

                  {n.isUnread && (
                    <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-brand-pink rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
}
