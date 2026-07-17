"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import QueryProvider from "@/lib/providers/QueryProvider";
import StreamChatProvider from "@/lib/providers/StreamChatProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNotificationDrawer from "@/components/admin/AdminNotificationDrawer";

const PUBLIC_ADMIN_PATHS = ["/admin/signin"];

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users/creators": "Creators",
  "/admin/users/brands": "Brand",
  "/admin/campaigns": "Campaigns",
  "/admin/campaigns/social": "Social Impact",
  "/admin/campaigns/social/create": "Social Impact",
  "/admin/disputes": "Chat & Disputes",
  "/admin/support": "Support Tickets",
  "/admin/finance/escrow": "Escrow",
  "/admin/reports": "Analytics",
  "/admin/reports/audit": "Audit Logs",
  "/admin/notifications": "Notifications",
  "/admin/team": "Team Management",
  "/admin/settings": "Settings",
};

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic) return <>{children}</>;

  const title = PAGE_TITLES[pathname] ?? "Admin Portal";

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9fc]">
      <AdminSidebar onNotificationClick={() => setIsNotificationOpen(true)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          title={title}
          onNotificationClick={() => setIsNotificationOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <AdminNotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <StreamChatProvider>
        <AdminShell>{children}</AdminShell>
      </StreamChatProvider>
    </QueryProvider>
  );
}
