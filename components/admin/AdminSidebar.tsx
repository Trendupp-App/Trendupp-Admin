"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShoppingBag,
  Globe,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Wallet,
  BarChart2,
  ClipboardList,
  Bell,
  Users2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import type { AdminRole } from "@/lib/permissions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: AdminRole[];
}
interface NavGroup {
  section: string;
  items: NavItem[];
}

const SUPER: AdminRole[] = ["super_admin", "owner"];
const NON_FINANCE: AdminRole[] = [
  "super_admin",
  "owner",
  "moderator",
  "support_agent",
];

const NAV: NavGroup[] = [
  {
    section: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "USERS",
    items: [
      { label: "Creators", href: "/admin/users/creators", icon: Users },
      { label: "Brand", href: "/admin/users/brands", icon: Building2 },
    ],
  },
  {
    section: "CAMPAIGNS",
    items: [
      { label: "Paid", href: "/admin/campaigns", icon: ShoppingBag },
      {
        label: "Social Impact",
        href: "/admin/campaigns/social",
        icon: Globe,
        roles: NON_FINANCE,
      },
    ],
  },
  {
    section: "CONTENT",
    items: [
      {
        label: "Trendupp News",
        href: "/admin/content/news",
        icon: TrendingUp,
        roles: NON_FINANCE,
      },
      {
        label: "Banner Ads",
        href: "/admin/content/banners",
        icon: Megaphone,
        roles: NON_FINANCE,
      },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [
      {
        label: "Chat & Disputes",
        href: "/admin/disputes",
        icon: MessageSquare,
      },
    ],
  },

  {
    section: "FINANCE",
    items: [
      {
        label: "Escrow",
        href: "/admin/finance/escrow",
        icon: Wallet,
        roles: [...SUPER, "finance_admin"],
      },
    ],
  },
  {
    section: "REPORTS",
    items: [
      { label: "Analytics", href: "/admin/reports", icon: BarChart2 },
      {
        label: "Audit Logs",
        href: "/admin/reports/audit",
        icon: ClipboardList,
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        roles: [...SUPER, "moderator"],
      },
      {
        label: "Team Management",
        href: "/admin/team",
        icon: Users2,
        roles: SUPER,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: [...SUPER, "finance_admin", "moderator"],
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return (
        localStorage.getItem("trendupp_admin_sidebar_collapsed") === "true"
      );
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("trendupp_admin_sidebar_collapsed", String(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Chisom Adeyemi"
    : "Chisom Adeyemi";

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "CA"
    : "CA";

  const formatRole = (role?: string) => {
    if (!role) return "Super Administrator";
    switch (role) {
      case "super_admin":
        return "Super Administrator";
      case "owner":
        return "Owner / Administrator";
      case "finance_admin":
        return "Finance Administrator";
      case "moderator":
        return "Moderator";
      case "support_agent":
        return "Support Agent";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
    }
  };

  const roleLabel = user?.displayName || formatRole(user?.role);

  const handleLogout = () => {
    useAuthStore.setState({ accessToken: null, user: null });
    window.location.href = "/admin/signin";
  };

  return (
    <aside
      className={cn(
        "h-screen bg-[#fef2f6] border-r border-[#fae2ec] flex flex-col justify-between py-6 shrink-0 overflow-y-auto transition-all duration-300 relative select-none",
        isCollapsed ? "w-[76px] px-2.5" : "w-[264px] px-4",
      )}
    >
      <div className="flex flex-col gap-0 text-left">
        {/* Top Bar with Logo & Collapse Toggle */}
        <div
          className={cn(
            "flex items-center mb-5",
            isCollapsed ? "justify-center px-0" : "justify-between px-3",
          )}
        >
          <Link href="/admin/dashboard" className="flex items-center shrink-0">
            {isCollapsed ? (
              <div className="w-9 h-9 rounded-xl bg-brand-pink text-white font-black text-lg flex items-center justify-center shadow-xs">
                T
              </div>
            ) : (
              <Image
                src="/logo.svg"
                alt="Trendupp"
                width={110}
                height={32}
                priority
              />
            )}
          </Link>

          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "w-7 h-7 rounded-lg bg-white border border-[#fae2ec] hover:border-brand-pink/50 text-[#7a7a9a] hover:text-brand-pink flex items-center justify-center transition-all cursor-pointer shadow-2xs",
              isCollapsed && "mt-2",
            )}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* User Profile Card */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 mb-5 transition-all",
            isCollapsed && "justify-center px-0",
          )}
          title={isCollapsed ? `${fullName} (${roleLabel})` : undefined}
        >
          <UserAvatar
            avatarUrl={user?.avatarUrl}
            initials={initials}
            size={38}
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span
                className="text-sm font-semibold text-[#1a1a2e] truncate"
                title={fullName}
              >
                {fullName}
              </span>
              <span className="text-[11px] text-[#9a99b0]">{roleLabel}</span>
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col">
          {NAV.map(({ section, items }) => {
            const visibleItems = items.filter(
              (item) =>
                !item.roles || item.roles.includes(user?.role as AdminRole),
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={section} className="mb-1">
                {!isCollapsed ? (
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#b0aec8] px-3 mt-3 mb-1">
                    {section}
                  </p>
                ) : (
                  <div className="h-px bg-[#fae2ec]/60 my-2 mx-1" />
                )}
                {visibleItems.map(({ label, href, icon: Icon }) => {
                  const active =
                    href === "/admin/campaigns"
                      ? pathname === href ||
                        (pathname.startsWith(href + "/") &&
                          !pathname.startsWith("/admin/campaigns/social"))
                      : href === "/admin/reports"
                        ? pathname === href ||
                          (pathname.startsWith(href + "/") &&
                            !pathname.startsWith("/admin/reports/audit"))
                        : pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      title={isCollapsed ? label : undefined}
                      className={cn(
                        "flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                        isCollapsed ? "justify-center px-0" : "px-3",
                        active
                          ? "bg-brand-pink-light text-brand-pink font-medium"
                          : "text-[#1a1a2e] hover:bg-white/70 hover:text-brand-pink",
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          "shrink-0 transition-colors",
                          active
                            ? "text-brand-pink"
                            : "text-[#9a99b0] group-hover:text-brand-pink",
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        title={isCollapsed ? "Logout" : undefined}
        className={cn(
          "flex items-center gap-3 py-2.5 text-sm text-[#7a7a9a] hover:text-red-500 hover:bg-white/60 rounded-xl transition-all duration-200 group w-full cursor-pointer mt-4",
          isCollapsed ? "justify-center px-0" : "px-3",
        )}
      >
        <LogOut
          size={18}
          className="shrink-0 group-hover:text-red-500 transition-colors"
        />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
