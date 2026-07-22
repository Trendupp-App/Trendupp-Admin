"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ActionsRequiredDto } from "@/types/adminOverview";

interface AdminActionsRequiredProps {
  actionsRequired?: ActionsRequiredDto;
}

export function AdminActionsRequired({
  actionsRequired,
}: AdminActionsRequiredProps) {
  const unresolved = actionsRequired?.unresolvedDisputes ?? 4;
  const awaitingPayout = actionsRequired?.creatorsAwaitingPayment ?? 11;

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={14} />
          </div>
          <h2 className="text-xs font-bold text-[#1a1a2e]">Actions Required</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
          {unresolved} urgent
        </span>
      </div>

      {/* 2x2 Action Pills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Callout 1 */}
        <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">
              7 payout failed and needs attention
            </span>
          </div>
          <Link
            href="/admin/escrow"
            className="h-7 px-3 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
          >
            View →
          </Link>
        </div>

        {/* Callout 2 */}
        <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">
              7 payout failed and needs attention
            </span>
          </div>
          <Link
            href="/admin/escrow"
            className="h-7 px-3 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
          >
            View →
          </Link>
        </div>

        {/* Callout 3 */}
        <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">
              {unresolved} disputes unresolved — 2 escalated
            </span>
          </div>
          <Link
            href="/admin/disputes"
            className="h-7 px-3 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
          >
            Resolve →
          </Link>
        </div>

        {/* Callout 4 */}
        <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">
              {awaitingPayout} creator withdrawals awaiting escrow release
            </span>
          </div>
          <Link
            href="/admin/escrow"
            className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
          >
            Process →
          </Link>
        </div>
      </div>
    </section>
  );
}
