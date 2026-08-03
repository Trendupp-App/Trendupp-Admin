"use client";

import { cn } from "@/lib/utils";

type Status =
  | "pending"
  | "submitted"
  | "active"
  | "live"
  | "completed"
  | "raised"
  | "under_review"
  | "resolved"
  | "accepted"
  | "rejected"
  | "draft"
  | "paid"
  | "unpaid"
  | "suspended"
  | "onboarded"
  // Escrow-specific statuses
  | "funded"
  | "released"
  | "held"
  | "processing"
  | "failed"
  | "refunded"
  | "successful"
  | "cancelled";

const STATUS_MAP: Record<Status, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-[#fef3c7] text-[#d97706] border-transparent font-bold",
  },
  submitted: {
    label: "Submitted",
    cls: "bg-[#eff6ff] text-[#2563eb] border-transparent font-bold",
  },
  active: {
    label: "Active",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  onboarded: {
    label: "Onboarded",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  suspended: {
    label: "Suspended",
    cls: "bg-[#ffe4e6] text-[#991b1b] border-transparent font-bold",
  },
  live: {
    label: "Live",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  completed: {
    label: "Completed",
    cls: "bg-[#f3e8ff] text-[#7e22ce] border-transparent font-bold",
  },
  raised: {
    label: "Raised",
    cls: "bg-[#fef3c7] text-[#d97706] border-transparent font-bold",
  },
  under_review: {
    label: "In Review",
    cls: "bg-[#eff6ff] text-[#2563eb] border-transparent font-bold",
  },
  resolved: {
    label: "Resolved",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  accepted: {
    label: "Accepted",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-[#ffe4e6] text-[#991b1b] border-transparent font-bold",
  },
  draft: {
    label: "Draft",
    cls: "bg-[#f4f3f6] text-[#7a7a9a] border-transparent font-bold",
  },
  paid: {
    label: "Paid",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  unpaid: {
    label: "Unpaid",
    cls: "bg-[#ffe4e6] text-[#991b1b] border-transparent font-bold",
  },
  // Escrow statuses
  funded: {
    label: "Funded",
    cls: "bg-[#eff6ff] text-[#2563eb] border-transparent font-bold",
  },
  released: {
    label: "Released",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  held: {
    label: "Held",
    cls: "bg-[#fef3c7] text-[#d97706] border-transparent font-bold",
  },
  processing: {
    label: "Processing",
    cls: "bg-[#eff6ff] text-[#2563eb] border-transparent font-bold",
  },
  failed: {
    label: "Failed",
    cls: "bg-[#ffe4e6] text-[#991b1b] border-transparent font-bold",
  },
  refunded: {
    label: "Refunded",
    cls: "bg-[#f3e8ff] text-[#7e22ce] border-transparent font-bold",
  },
  successful: {
    label: "Successful",
    cls: "bg-[#dcfce7] text-[#15803d] border-transparent font-bold",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-[#f4f3f6] text-[#7a7a9a] border-transparent font-bold",
  },
};

interface AdminStatusBadgeProps {
  status: string;
  className?: string;
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const normalizedKey = (status || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
  const config = STATUS_MAP[normalizedKey as Status] ?? {
    label: status,
    cls: "bg-[#f4f3f6] text-[#7a7a9a] border-transparent font-bold",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-bold transition-all",
        config.cls,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
