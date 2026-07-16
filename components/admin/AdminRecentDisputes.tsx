"use client";

import Link from "next/link";
import { ShieldAlert, ExternalLink } from "lucide-react";
import { AdminDataTable, type AdminColumn } from "./AdminDataTable";
import { AdminStatusBadge } from "./AdminStatusBadge";

interface MockDispute {
  id: string;
  shortId: string;
  reason: string;
  status: string;
  date: string;
}

const MOCK: MockDispute[] = [
  {
    id: "a1b2c3d4",
    shortId: "a1b2c3d4…",
    reason: "Content not delivered within deadline",
    status: "raised",
    date: "11 Jul 2026",
  },
  {
    id: "e5f6g7h8",
    shortId: "e5f6g7h8…",
    reason: "Payment not released after content approval",
    status: "under_review",
    date: "10 Jul 2026",
  },
  {
    id: "i9j0k1l2",
    shortId: "i9j0k1l2…",
    reason: "Creator posted incorrect brand assets",
    status: "resolved",
    date: "09 Jul 2026",
  },
  {
    id: "m3n4o5p6",
    shortId: "m3n4o5p6…",
    reason: "Brand rejected content without valid reason",
    status: "raised",
    date: "08 Jul 2026",
  },
  {
    id: "q7r8s9t0",
    shortId: "q7r8s9t0…",
    reason: "Deliverables count mismatch in agreement",
    status: "under_review",
    date: "07 Jul 2026",
  },
];

const COLS: AdminColumn<MockDispute>[] = [
  {
    header: "Dispute ID",
    accessor: (d) => (
      <span className="font-mono text-[10px] text-[#7a7a9a]">{d.shortId}</span>
    ),
  },
  {
    header: "Reason",
    accessor: (d) => (
      <span className="truncate max-w-[180px] block text-[#1a1a2e]">
        {d.reason.length > 40 ? `${d.reason.slice(0, 40)}…` : d.reason}
      </span>
    ),
  },
  { header: "Status", accessor: (d) => <AdminStatusBadge status={d.status} /> },
  { header: "Date", accessor: "date", className: "whitespace-nowrap" },
  {
    header: "",
    accessor: () => (
      <Link
        href="/admin/disputes"
        className="text-brand-pink hover:underline flex items-center gap-1 text-[10px] font-medium"
      >
        Open <ExternalLink size={10} />
      </Link>
    ),
  },
];

export function AdminRecentDisputes() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#fef9e7] flex items-center justify-center">
            <ShieldAlert size={15} className="text-[#ca8a04]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#1a1a2e]">
              Recent Disputes
            </h2>
            <p className="text-[10px] text-[#7a7a9a]">
              Raised & active mediations
            </p>
          </div>
        </div>
        <Link
          href="/admin/disputes"
          className="text-[10px] text-brand-pink font-semibold hover:underline"
        >
          Manage
        </Link>
      </div>
      <AdminDataTable
        columns={COLS}
        data={MOCK}
        isLoading={false}
        keyExtractor={(d) => d.id}
        emptyTitle="No disputes"
      />
    </section>
  );
}
