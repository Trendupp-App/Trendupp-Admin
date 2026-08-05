// ── Admin Role Types ──────────────────────────────────────────────────────────

export type AdminRole =
  "super_admin" | "owner" | "finance_admin" | "moderator" | "support_agent";

// ── Role Sets ─────────────────────────────────────────────────────────────────

const SUPER: AdminRole[] = ["super_admin", "owner"];
const ALL: AdminRole[] = [
  ...SUPER,
  "finance_admin",
  "moderator",
  "support_agent",
];
const FINANCE: AdminRole[] = [...SUPER, "finance_admin"];
const NON_FINANCE: AdminRole[] = [...SUPER, "moderator", "support_agent"];
const CONTENT: AdminRole[] = [...SUPER, "moderator"];
const DISPUTES: AdminRole[] = [...SUPER, "moderator", "support_agent"];

// ── Permission Map ────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Dashboard panels
  "dashboard.view": ALL,
  "dashboard.actions_finance": FINANCE,
  "dashboard.actions_disputes": [...SUPER, "moderator"],

  // Sidebar page access
  "page.finance": FINANCE,
  "page.support_tickets": [...SUPER, "support_agent"],
  "page.team": SUPER,
  "page.notifications": [...SUPER, "moderator"],
  "page.settings": [...SUPER, "finance_admin", "moderator"],

  // User management
  "users.export": SUPER,
  "users.warn": [...SUPER, "moderator"],
  "users.suspend_campaign": [...SUPER, "moderator"],
  "users.suspend_account": SUPER,
  "users.ban": SUPER,

  // Campaigns
  "campaigns.pause": CONTENT,
  "campaigns.remove": CONTENT,
  "campaigns.view_applications": [...SUPER, "moderator", "support_agent"],

  // Social Impact
  "social.view": NON_FINANCE,
  "social.create": CONTENT,
  "social.edit": CONTENT,
  "social.publish": CONTENT,
  "social.end": CONTENT,

  // Trendupp News
  "news.view": NON_FINANCE,
  "news.create": CONTENT,
  "news.edit": CONTENT,
  "news.publish": CONTENT,
  "news.archive": CONTENT,

  // Banner Ads
  "ads.view": NON_FINANCE,
  "ads.create": CONTENT,
  "ads.edit": CONTENT,
  "ads.publish": CONTENT,
  "ads.archive": CONTENT,

  // Chat & Disputes
  "disputes.resolve": [...SUPER, "moderator"],
  "disputes.join_chat": DISPUTES,
  "disputes.payout_actions": [...SUPER, "finance_admin", "moderator"],

  // Support Tickets
  "support.manage_tickets": [...SUPER, "support_agent"],

  // Reports & Audit
  "audit.export": FINANCE,

  // Settings
  "settings.contact_info": SUPER,
  "settings.commission": FINANCE,
  "settings.faqs": [...SUPER, "moderator"],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

// ── Utility ───────────────────────────────────────────────────────────────────

export function hasPermission(
  role: AdminRole,
  permission: PermissionKey,
): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
