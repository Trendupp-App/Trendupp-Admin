import type { AuditLogItem } from "@/types/adminAudit";

export const MASTER_TRACKABLE_ACTIONS: Record<string, string[]> = {
  "Creator Management": [
    "Suspend Account",
    "Suspend Campaign Access",
    "Reactivate Account",
    "Delete Account",
    "Change Creator Tier",
  ],
  "Advertiser Management": [
    "Suspend Account",
    "Reactivate Account",
    "Delete Account",
  ],
  Campaigns: ["Pause Campaign", "Resume Campaign", "Cancel Campaign"],
  "Social Impact Campaigns": [
    "Create Social Impact Campaign",
    "Update Social Impact Campaign",
    "Publish Social Impact Campaign",
    "Pause Social Impact Campaign",
    "Resume Social Impact Campaign",
    "Cancel Social Impact Campaign",
    "Extend Social Impact Campaign End Date",
    "Delete Social Impact Campaign",
  ],
  "Trendupp News": [
    "Create News Article",
    "Update News Article",
    "Publish News Article",
    "Save News Article as Draft",
    "Archive News Article",
  ],
  "Banner Ads": [
    "Create Banner Ad",
    "Update Banner Ad",
    "Publish Banner Ad",
    "Pause Banner Ad",
  ],
  "Chats & Disputes": [
    "Activate Chat",
    "Decline Request",
    "Release to Creator",
    "Refund to Brand",
    "50/50 Split Escrow",
    "Allow Content Submission",
    "Allow Content Review",
    "Allow Revised Submission",
    "Allow Revised Review",
    "Close Dispute",
  ],
  Financial: ["Release Hold"],
  Settings: [
    "Create/Edit Trendupp Contact Info",
    "Create/Edit Trendupp Social Links",
    "Manage FAQs (Create/Edit/Delete)",
    "Manage News Category (Create/Edit/Delete)",
    "Manage Ticket Category (Create/Edit/Delete)",
    "Manage Creator Niche (Create/Edit/Delete)",
    "Manage Brand Industry (Create/Edit/Delete)",
    "Adjust Platform Commission for a Specific Brand (Create/Edit/Delete)",
  ],
};

export interface AuditDiffField {
  label: string;
  previousValue?: string;
  newValue?: string;
  isDiff?: boolean;
  type?: "text" | "bullets" | "chips" | "rewards" | "date" | "boolean";
  bulletItems?: string[];
  chipItems?: string[];
  rewardItems?: { tier: string; reward: string }[];
}

export interface ParsedAuditDiff {
  actionType: "create" | "update" | "delete" | "dispute" | "generic";
  moduleLabel: string;
  confirmationMessage?: string;
  reason?: string;
  disputeOutcome?: string;
  disputeAmount?: string;
  fields: AuditDiffField[];
}

const HUMAN_KEY_MAP: Record<string, string> = {
  title: "Title",
  goal: "Campaign Goal",
  campaignBrief: "Campaign Brief",
  deliverables: "Deliverables",
  contentDirection: "Content Direction",
  dos: "Do's (Guidelines)",
  donts: "Don'ts (Restrictions)",
  creatorTiers: "Target Creator Tiers",
  tierRewards: "Tier Token Rewards",
  coverImageUrl: "Cover Image URL",
  endDate: "End Date",
  isDraft: "Draft Status",
  brandId: "Brand Reference ID",
  category: "Campaign Category",
  niche: "Niche",
  tokenReward: "Token Reward",
  appliedCount: "Applied Creators Count",
};

export function formatKeyLabel(key: string): string {
  if (HUMAN_KEY_MAP[key]) return HUMAN_KEY_MAP[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function decouplePayload(
  rawDetails: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const processKey = (k: string, v: unknown) => {
    // Skip empty technical containers like query: {}, params: {}
    if (k === "query" || k === "params" || k === "headers") {
      if (
        !v ||
        (typeof v === "object" &&
          v !== null &&
          Object.keys(v as object).length === 0)
      ) {
        return;
      }
    }

    // Unwrap 'body', 'payload', or 'data' if present
    if ((k === "body" || k === "payload" || k === "data") && v) {
      let parsed = v;
      if (typeof v === "string") {
        try {
          parsed = JSON.parse(v);
        } catch {
          parsed = v;
        }
      }
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        Object.entries(parsed as Record<string, unknown>).forEach(
          ([subK, subV]) => {
            processKey(subK, subV);
          },
        );
        return;
      }
    }

    // Try parsing stringified JSON if it starts with { or [
    if (typeof v === "string" && (v.startsWith("{") || v.startsWith("["))) {
      try {
        result[k] = JSON.parse(v);
        return;
      } catch {
        // Keep string
      }
    }

    result[k] = v;
  };

  Object.entries(rawDetails).forEach(([k, v]) => processKey(k, v));
  return result;
}

export function formatHumanValue(val: unknown): {
  type: "text" | "bullets" | "chips" | "rewards" | "date" | "boolean";
  textVal?: string;
  bulletItems?: string[];
  chipItems?: string[];
  rewardItems?: { tier: string; reward: string }[];
} {
  if (val == null || val === "" || val === "—") {
    return { type: "text", textVal: "—" };
  }

  if (typeof val === "boolean") {
    return { type: "boolean", textVal: val ? "Yes (Draft)" : "No (Published)" };
  }

  // Handle Arrays
  if (Array.isArray(val)) {
    const stringItems = val
      .map((item) =>
        typeof item === "object" ? JSON.stringify(item) : String(item),
      )
      .filter((s) => s.trim().length > 0);

    // If items look like short tags/tiers (e.g. ['Micro', 'Nano'])
    if (stringItems.every((s) => s.length < 20)) {
      return { type: "chips", chipItems: stringItems };
    }
    return { type: "bullets", bulletItems: stringItems };
  }

  // Handle Tier Rewards Object (e.g. { Nano: 50, Micro: 100 })
  if (typeof val === "object" && val !== null) {
    const entries = Object.entries(val as Record<string, unknown>);
    const rewardItems = entries.map(([tier, rew]) => ({
      tier: formatKeyLabel(tier),
      reward: `${rew} Tokens`,
    }));
    return { type: "rewards", rewardItems };
  }

  // Handle ISO Dates (e.g. "2026-08-15")
  const str = String(val);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    try {
      const formattedDate = new Date(str).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return { type: "date", textVal: formattedDate };
    } catch {
      return { type: "text", textVal: str };
    }
  }

  return { type: "text", textVal: str };
}

export function getModuleInfo(action: string): {
  label: string;
  badgeClass: string;
} {
  const a = action.toLowerCase();
  if (a.includes("campaign") || a.includes("social")) {
    return {
      label: "Campaigns",
      badgeClass: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
    };
  }
  if (
    a.includes("user") ||
    a.includes("creator") ||
    a.includes("brand") ||
    a.includes("advertiser")
  ) {
    return {
      label: "Users",
      badgeClass: "bg-[#f5f3ff] text-[#7c3aed] border-[#edd8ff]",
    };
  }
  if (a.includes("dispute") || a.includes("chat") || a.includes("message")) {
    return {
      label: "Disputes",
      badgeClass: "bg-[#fefce8] text-[#ca8a04] border-[#fef08a]",
    };
  }
  if (
    a.includes("auth") ||
    a.includes("login") ||
    a.includes("logout") ||
    a.includes("password")
  ) {
    return {
      label: "Auth",
      badgeClass: "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]",
    };
  }
  if (a.includes("role") || a.includes("team") || a.includes("permission")) {
    return {
      label: "Roles",
      badgeClass: "bg-[#fff0f5] text-brand-pink border-[#fbcfe8]",
    };
  }
  if (a.includes("finance") || a.includes("escrow") || a.includes("payout")) {
    return {
      label: "Finance",
      badgeClass: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
    };
  }
  return {
    label: "System",
    badgeClass: "bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]",
  };
}

export function parseAuditDiff(log: AuditLogItem): ParsedAuditDiff {
  const actionLower = log.action.toLowerCase();
  const rawDetails = log.details || {};
  const details = decouplePayload(rawDetails);

  // Extract reason if present
  const reason =
    (details.reason ??
    details.notes ??
    details.message ??
    details.description ??
    details.note)
      ? String(
          details.reason ??
            details.notes ??
            details.message ??
            details.description ??
            details.note,
        )
      : undefined;

  // 1. DELETE ACTION
  if (
    actionLower.includes("delete") ||
    actionLower.includes("remove") ||
    actionLower.includes("archive")
  ) {
    const resourceName =
      details.title ??
      details.name ??
      details.email ??
      details.targetName ??
      details.id ??
      log.targetUserId ??
      "record";
    const resourceType = getModuleInfo(log.action).label;
    return {
      actionType: "delete",
      moduleLabel: resourceType,
      confirmationMessage: `Deleted ${resourceType}: "${resourceName}"`,
      reason,
      fields: [],
    };
  }

  // 2. DISPUTE ACTION
  if (
    actionLower.includes("dispute") ||
    actionLower.includes("escrow") ||
    actionLower.includes("release") ||
    actionLower.includes("refund") ||
    actionLower.includes("split")
  ) {
    const rawOutcome =
      details.outcome ??
      details.action ??
      details.disputeOutcome ??
      (actionLower.includes("release")
        ? "Release to Creator"
        : actionLower.includes("refund")
          ? "Refund to Brand"
          : actionLower.includes("split")
            ? "50/50 Split Escrow"
            : "Dispute Resolved");
    const rawAmount =
      details.amount ?? details.escrowAmount ?? details.totalAmount;
    let formattedAmount = "—";
    if (
      typeof rawAmount === "number" ||
      (typeof rawAmount === "string" && !isNaN(Number(rawAmount)))
    ) {
      formattedAmount = `₦${Number(rawAmount).toLocaleString()}`;
    } else if (rawAmount) {
      formattedAmount = String(rawAmount);
    }

    return {
      actionType: "dispute",
      moduleLabel: "Disputes",
      disputeOutcome: String(rawOutcome),
      disputeAmount: formattedAmount,
      reason,
      fields: [],
    };
  }

  // 3. CREATE ACTION (Displays ONLY populated non-empty fields)
  if (
    actionLower.includes("create") ||
    actionLower.includes("publish") ||
    actionLower.includes("add")
  ) {
    const fields: AuditDiffField[] = [];
    Object.entries(details).forEach(([key, val]) => {
      // skip metadata / internal keys / empty technical containers
      if (
        key === "reason" ||
        key === "notes" ||
        key === "status" ||
        key === "currentStep" ||
        val == null ||
        val === "" ||
        val === "—"
      ) {
        return;
      }
      const formatted = formatHumanValue(val);
      fields.push({
        label: formatKeyLabel(key),
        newValue: formatted.textVal,
        bulletItems: formatted.bulletItems,
        chipItems: formatted.chipItems,
        rewardItems: formatted.rewardItems,
        type: formatted.type,
        isDiff: false,
      });
    });

    return {
      actionType: "create",
      moduleLabel: getModuleInfo(log.action).label,
      reason,
      fields,
    };
  }

  // 4. UPDATE ACTION (Displays ONLY fields that actually changed Previous -> New)
  if (
    actionLower.includes("update") ||
    actionLower.includes("edit") ||
    actionLower.includes("change") ||
    actionLower.includes("suspend") ||
    actionLower.includes("reactivate") ||
    actionLower.includes("extend") ||
    actionLower.includes("pause") ||
    actionLower.includes("resume") ||
    actionLower.includes("cancel")
  ) {
    const fields: AuditDiffField[] = [];

    // Check if details has a changes dictionary e.g. changes: { tier: { from: 'Micro', to: 'Macro' } }
    if (details.changes && typeof details.changes === "object") {
      Object.entries(
        details.changes as Record<string, { from?: unknown; to?: unknown }>,
      ).forEach(([key, changeObj]) => {
        if (changeObj && typeof changeObj === "object") {
          const prevF = formatHumanValue(changeObj.from);
          const newF = formatHumanValue(changeObj.to);
          fields.push({
            label: formatKeyLabel(key),
            previousValue: prevF.textVal || "—",
            newValue: newF.textVal || "—",
            isDiff: true,
          });
        }
      });
    }

    // Top level previousStatus & newStatus (or from & to)
    const prevStatus =
      details.previousStatus ??
      details.prevStatus ??
      details.from ??
      details.previousValue ??
      details.oldValue;
    const newStatus =
      details.newStatus ??
      details.status ??
      details.to ??
      details.newValue ??
      details.updatedStatus;

    if (
      prevStatus !== undefined &&
      newStatus !== undefined &&
      String(prevStatus).toLowerCase() !== String(newStatus).toLowerCase()
    ) {
      fields.unshift({
        label: "Status",
        previousValue: String(prevStatus),
        newValue: String(newStatus),
        isDiff: true,
      });
    }

    // If tier change
    if (details.previousTier || details.newTier) {
      fields.push({
        label: "Creator Tier",
        previousValue: details.previousTier
          ? String(details.previousTier)
          : "—",
        newValue: details.newTier ? String(details.newTier) : "—",
        isDiff: true,
      });
    }

    // Generic fallback for any changed properties
    if (fields.length === 0) {
      Object.entries(details).forEach(([key, val]) => {
        if (
          key === "reason" ||
          key === "notes" ||
          key === "message" ||
          key === "currentStep" ||
          val == null ||
          val === ""
        ) {
          return;
        }
        const formatted = formatHumanValue(val);
        fields.push({
          label: formatKeyLabel(key),
          newValue: formatted.textVal,
          bulletItems: formatted.bulletItems,
          chipItems: formatted.chipItems,
          rewardItems: formatted.rewardItems,
          type: formatted.type,
          isDiff: false,
        });
      });
    }

    return {
      actionType: "update",
      moduleLabel: getModuleInfo(log.action).label,
      reason,
      fields,
    };
  }

  // 5. GENERIC FALLBACK
  const fields: AuditDiffField[] = [];
  Object.entries(details).forEach(([key, val]) => {
    if (
      key === "reason" ||
      key === "notes" ||
      key === "currentStep" ||
      val == null ||
      val === ""
    )
      return;
    const formatted = formatHumanValue(val);
    fields.push({
      label: formatKeyLabel(key),
      newValue: formatted.textVal,
      bulletItems: formatted.bulletItems,
      chipItems: formatted.chipItems,
      rewardItems: formatted.rewardItems,
      type: formatted.type,
      isDiff: false,
    });
  });

  return {
    actionType: "generic",
    moduleLabel: getModuleInfo(log.action).label,
    reason,
    fields,
  };
}

export function exportAuditLogsToCSV(logs: AuditLogItem[]): void {
  if (!logs || logs.length === 0) return;

  const headers = [
    "Timestamp",
    "Admin Name",
    "Role",
    "Module",
    "Action Performed",
    "Previous Value",
    "New Value",
    "IP Address",
    "Status",
    "Reason / Details",
  ];

  const csvRows: string[][] = [headers];

  logs.forEach((log) => {
    const timestamp = new Date(log.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const adminName = log.admin
      ? `${log.admin.firstName || ""} ${log.admin.lastName || ""}`.trim() ||
        "Unknown"
      : "Unknown";
    const roleName =
      log.admin?.role?.displayName ?? log.admin?.role?.name ?? "—";
    const moduleInfo = getModuleInfo(log.action).label;
    const actionPerf = log.action
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const diff = parseAuditDiff(log);

    let prevVal = "—";
    let newVal = "—";
    let reasonOrSummary = diff.reason || diff.confirmationMessage || "—";

    if (diff.actionType === "update" && diff.fields.length > 0) {
      const firstDiff = diff.fields.find((f) => f.isDiff) || diff.fields[0];
      prevVal = firstDiff.previousValue || "—";
      newVal = firstDiff.newValue || "—";
    } else if (diff.actionType === "dispute") {
      newVal = diff.disputeOutcome || "—";
      reasonOrSummary = `Amount: ${diff.disputeAmount || "—"}${diff.reason ? ` | Reason: ${diff.reason}` : ""}`;
    }

    const aLower = log.action.toLowerCase();
    const isSuccess =
      !aLower.includes("fail") &&
      !aLower.includes("error") &&
      !aLower.includes("reject");
    const statusText = isSuccess ? "Success" : "Failed";

    csvRows.push([
      `"${timestamp}"`,
      `"${adminName}"`,
      `"${roleName}"`,
      `"${moduleInfo}"`,
      `"${actionPerf}"`,
      `"${prevVal}"`,
      `"${newVal}"`,
      `"${log.ipAddress || "—"}"`,
      `"${statusText}"`,
      `"${reasonOrSummary.replace(/"/g, '""')}"`,
    ]);
  });

  const csvString = csvRows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `trendupp_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
