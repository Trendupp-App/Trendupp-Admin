"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Check,
  CreditCard,
  ShieldAlert,
  Megaphone,
  UserRound,
  FileText,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Portal } from "@/components/ui/portal";
import {
  useInboxNotifications,
  useMarkAllRead,
  useMarkRead,
  useMarkSeen,
} from "@/hooks/useAdminInbox";
import type { InboxCategory, InboxNotification } from "@/types/adminInbox";

interface AdminNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS: { label: string; category?: InboxCategory }[] = [
  { label: "All" },
  { label: "Campaigns", category: "campaigns" },
  { label: "Applications", category: "applications" },
  { label: "Payments", category: "payments" },
  { label: "Disputes", category: "chatDispute" },
  { label: "Broadcast", category: "broadcast" },
];

const CATEGORY_STYLES: Record<string, { icon: LucideIcon; className: string }> =
  {
    payments: { icon: CreditCard, className: "bg-[#fdf2f6] text-[#d7176f]" },
    campaigns: { icon: Check, className: "bg-[#edf2fe] text-[#2f63eb]" },
    applications: { icon: FileText, className: "bg-[#edf2fe] text-[#2f63eb]" },
    chatDispute: {
      icon: ShieldAlert,
      className: "bg-[#fef9e7] text-[#ca8a04]",
    },
    broadcast: { icon: Megaphone, className: "bg-[#fdf2f6] text-[#d7176f]" },
    account: { icon: UserRound, className: "bg-[#f4f3f6] text-[#5a5a7a]" },
    security: { icon: ShieldAlert, className: "bg-rose-50 text-rose-600" },
  };

const DEFAULT_STYLE = { icon: Bell, className: "bg-[#f4f3f6] text-[#5a5a7a]" };

export default function AdminNotificationDrawer({
  isOpen,
  onClose,
}: AdminNotificationDrawerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const category = TABS[activeTab]?.category;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInboxNotifications(category, isOpen);
  const markSeen = useMarkSeen();
  const markAllRead = useMarkAllRead();
  const markRead = useMarkRead();

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Clear the badge once each time the drawer opens (items stay unread).
  const markSeenMutate = markSeen.mutate;
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      markSeenMutate();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, markSeenMutate]);

  const handleItemClick = (notification: InboxNotification) => {
    if (!notification.readAt) {
      markRead.mutate(notification.id);
    }
    if (notification.actionUrl) {
      onClose();
      router.push(notification.actionUrl);
    }
  };

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
            <div className="flex items-center gap-3">
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-[11px] text-brand-pink font-semibold hover:underline disabled:opacity-50 cursor-pointer"
              >
                {markAllRead.isPending ? "Marking..." : "Mark all as read"}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a]"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 -mb-1">
            {TABS.map((tab, index) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shrink-0",
                  activeTab === index
                    ? "bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]"
                    : "bg-[#f4f3f6] text-[#7a7a9a] border-transparent hover:bg-[#eae8ed]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto mt-6 flex flex-col gap-3 pr-1">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex gap-3.5 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl shrink-0 bg-[#f4f3f6]" />
                  <div className="flex flex-col gap-2 flex-1 py-0.5">
                    <div className="h-3 w-2/3 bg-[#f4f3f6] rounded" />
                    <div className="h-2.5 w-full bg-[#f4f3f6] rounded" />
                    <div className="h-2 w-16 bg-[#f4f3f6] rounded" />
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <p className="text-xs font-medium text-[#7a7a9a]">
                  Failed to load notifications
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full bg-brand-pink text-white hover:opacity-90 transition-all cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#f4f3f6] text-[#9a99b0] flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <p className="text-xs font-medium text-[#7a7a9a]">
                  No notifications yet
                </p>
              </div>
            ) : (
              <>
                {notifications.map((n) => {
                  const { icon: Icon, className: bgClass } =
                    CATEGORY_STYLES[n.category] ?? DEFAULT_STYLE;
                  const isUnread = n.readAt == null;

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={cn(
                        "border border-[#e8e6f0]/60 rounded-2xl p-4 flex gap-3.5 relative hover:shadow-[0_2px_12px_rgba(4,0,57,0.03)] transition-all cursor-pointer group",
                        isUnread ? "bg-[#fdf7fa]" : "bg-white",
                      )}
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
                        <h4
                          className={cn(
                            "text-sm text-[#1a1a2e] group-hover:text-brand-pink transition-colors",
                            isUnread ? "font-bold" : "font-semibold",
                          )}
                        >
                          {n.title}
                        </h4>
                        <p className="text-xs font-medium text-[#7a7a9a] leading-relaxed mt-0.5">
                          {n.body}
                        </p>
                        <span className="text-[10px] text-[#9a99b0] font-light mt-1.5 block">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>

                      {isUnread && (
                        <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-brand-pink rounded-full" />
                      )}
                    </div>
                  );
                })}

                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-1 mb-2 mx-auto px-5 py-1.5 text-xs font-semibold rounded-full bg-[#f4f3f6] text-[#5a5a7a] hover:bg-[#eae8ed] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
