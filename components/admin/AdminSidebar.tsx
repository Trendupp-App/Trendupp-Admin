"use client";

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
  Headphones,
  Wallet,
  BarChart2,
  ClipboardList,
  Bell,
  Users2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/shared/UserAvatar";
import { useAuthStore } from "@/store/authStore";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}
interface NavGroup {
  section: string;
  items: NavItem[];
}

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
      { label: "Advertisers", href: "/admin/users/brands", icon: Building2 },
    ],
  },
  {
    section: "CAMPAIGNS",
    items: [
      { label: "Paid", href: "/admin/campaigns", icon: ShoppingBag },
      { label: "Social Impact", href: "/admin/campaigns/social", icon: Globe },
    ],
  },
  {
    section: "CONTENT",
    items: [
      { label: "Trendupp News", href: "/admin/content/news", icon: TrendingUp },
      { label: "Banner Ads", href: "/admin/content/banners", icon: Megaphone },
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
      { label: "Support Tickets", href: "/admin/support", icon: Headphones },
    ],
  },
  {
    section: "FINANCE",
    items: [{ label: "Escrow", href: "/admin/finance/escrow", icon: Wallet }],
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
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Team Management", href: "/admin/team", icon: Users2 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

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

  const roleLabel = formatRole(user?.role);

  const handleLogout = () => {
    useAuthStore.setState({ accessToken: null, user: null });
    window.location.href = "/admin/signin";
  };

  return (
    <aside className="w-[264px] h-screen bg-[#fef2f6] border-r border-[#fae2ec] flex flex-col justify-between py-6 px-4 shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-0">
        {/* Logo */}
        <div className="px-3 mb-5">
          <Link href="/admin/dashboard">
            <Image
              src="/logo.svg"
              alt="Trendupp"
              width={110}
              height={32}
              priority
            />
          </Link>
        </div>

        {/* User section */}
        <div className="flex items-center gap-3 px-3 mb-5">
          <UserAvatar
            avatarUrl={user?.avatarUrl}
            initials={initials}
            size={38}
          />
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-semibold text-[#1a1a2e] truncate"
              title={fullName}
            >
              {fullName}
            </span>
            <span className="text-[11px] text-[#9a99b0]">{roleLabel}</span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex flex-col">
          {NAV.map(({ section, items }) => (
            <div key={section} className="mb-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#b0aec8] px-3 mt-3 mb-1">
                {section}
              </p>
              {items.map(({ label, href, icon: Icon }) => {
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
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      active
                        ? "bg-brand-pink-light text-brand-pink font-medium"
                        : "text-[#1a1a2e] hover:bg-white/70 hover:text-brand-pink",
                    )}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        "shrink-0 transition-colors",
                        active
                          ? "text-brand-pink"
                          : "text-[#9a99b0] group-hover:text-brand-pink",
                      )}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#7a7a9a] hover:text-red-500 hover:bg-white/60 rounded-xl transition-all duration-200 group w-full cursor-pointer mt-4"
      >
        <LogOut
          size={16}
          className="shrink-0 group-hover:text-red-500 transition-colors"
        />
        Logout
      </button>
    </aside>
  );
}
