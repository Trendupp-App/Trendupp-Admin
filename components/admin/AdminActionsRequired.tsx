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
  const unresolved = actionsRequired?.unresolvedDisputes ?? 0;
  const awaitingPayout = actionsRequired?.creatorsAwaitingPayment ?? 0;
  const failedPayouts = actionsRequired?.failedPayouts ?? 0;

  // Build items and filter strictly for count > 0 (omitting resolved disputes)
  const items = [
    {
      id: "failed-payouts",
      count: failedPayouts,
      label: `${failedPayouts} failed payout${failedPayouts === 1 ? "" : "s"} need${failedPayouts === 1 ? "s" : ""} attention`,
      href: "/admin/finance/escrow",
      btnText: "View →",
      bg: "bg-rose-50/80 border-rose-100 text-rose-900",
      dotBg: "bg-rose-500",
      btnBg: "bg-rose-500 hover:bg-rose-600",
    },
    {
      id: "unresolved-disputes",
      count: unresolved,
      label: `${unresolved} dispute${unresolved === 1 ? "" : "s"} unresolved`,
      href: "/admin/disputes",
      btnText: "Resolve →",
      bg: "bg-rose-50/80 border-rose-100 text-rose-900",
      dotBg: "bg-rose-500",
      btnBg: "bg-rose-500 hover:bg-rose-600",
    },
    {
      id: "awaiting-payouts",
      count: awaitingPayout,
      label: `${awaitingPayout} creator withdrawal${awaitingPayout === 1 ? "" : "s"} awaiting escrow release`,
      href: "/admin/finance/escrow",
      btnText: "Process →",
      bg: "bg-amber-50/80 border-amber-100 text-amber-900",
      dotBg: "bg-amber-500",
      btnBg: "bg-amber-500 hover:bg-amber-600",
    },
  ];

  const activeItems = items.filter((item) => item.count > 0);

  // When all counts are 0, hide the card completely
  if (activeItems.length === 0) {
    return null;
  }

  const totalUrgentCount = activeItems.reduce(
    (acc, item) => acc + item.count,
    0,
  );

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-sm animate-fade-in-up">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={14} />
          </div>
          <h2 className="text-xs font-bold text-[#1a1a2e]">Actions Required</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
          {totalUrgentCount} urgent
        </span>
      </div>

      {/* Dynamic Action Pills Grid */}
      <div
        className={`grid grid-cols-1 ${
          activeItems.length > 1 ? "md:grid-cols-2" : ""
        } gap-3`}
      >
        {activeItems.map((item) => (
          <div
            key={item.id}
            className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 ${item.bg}`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotBg}`} />
              <span className="truncate">{item.label}</span>
            </div>
            <Link
              href={item.href}
              className={`h-7 px-3 text-white text-[11px] font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs ${item.btnBg}`}
            >
              {item.btnText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
