"use client";

import BroadcastList from "@/components/admin/notifications/BroadcastList";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a2e]">
          Notification Center
        </h1>
        <p className="text-xs text-[#9a99b0] mt-1">
          Manage broadcast notifications
        </p>
      </div>

      <BroadcastList />
    </div>
  );
}
