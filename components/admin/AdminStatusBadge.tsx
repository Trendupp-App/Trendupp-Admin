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
  | "unpaid";

const STATUS_MAP: Record<Status, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50   text-amber-600   border-amber-200",
  },
  submitted: {
    label: "Submitted",
    cls: "bg-blue-50    text-blue-600    border-blue-200",
  },
  active: {
    label: "Active",
    cls: "bg-green-50   text-green-600   border-green-200",
  },
  live: {
    label: "Live",
    cls: "bg-green-50   text-green-600   border-green-200",
  },
  completed: {
    label: "Completed",
    cls: "bg-purple-50  text-purple-600  border-purple-200",
  },
  raised: {
    label: "Raised",
    cls: "bg-amber-50   text-amber-600   border-amber-200",
  },
  under_review: {
    label: "In Review",
    cls: "bg-blue-50    text-blue-600    border-blue-200",
  },
  resolved: {
    label: "Resolved",
    cls: "bg-green-50   text-green-600   border-green-200",
  },
  accepted: {
    label: "Accepted",
    cls: "bg-green-50   text-green-600   border-green-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50     text-red-600     border-red-200",
  },
  draft: {
    label: "Draft",
    cls: "bg-[#f4f3f6]  text-[#7a7a9a]   border-[#e8e6f0]",
  },
  paid: {
    label: "Paid",
    cls: "bg-green-50   text-green-600   border-green-200",
  },
  unpaid: {
    label: "Unpaid",
    cls: "bg-red-50     text-red-600     border-red-200",
  },
};

interface AdminStatusBadgeProps {
  status: string;
  className?: string;
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const config = STATUS_MAP[status as Status] ?? {
    label: status,
    cls: "bg-[#f4f3f6] text-[#7a7a9a] border-[#e8e6f0]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
        config.cls,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
