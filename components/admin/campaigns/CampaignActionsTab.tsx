"use client";

import { useState } from "react";
import { Info, RefreshCw, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useApproveCampaign,
  useCancelCampaign,
} from "@/hooks/useAdminCampaigns";
import AdminActionModal from "./AdminActionModal";

interface CampaignActionsTabProps {
  campaignId: string;
  campaignStatus?: string;
}

type ActionKey = "approve" | "cancel";

interface ActionDef {
  key: ActionKey;
  title: string;
  desc: string;
  icon: typeof X;
  color: string;
  /** Whether the API requires a reason for this action. */
  requiresReason: boolean;
  visibleFor: (status: string) => boolean;
}

// Terminal statuses — no administrative action can be taken from here.
const TERMINAL_STATUSES = ["completed", "cancelled"];

const ACTION_DEFS: ActionDef[] = [
  {
    key: "approve",
    title: "Approve Campaign",
    desc: "Approve a pending campaign and take it live",
    icon: CheckCircle,
    color: "text-[#16a34a] bg-[#f0fdf4]",
    requiresReason: false,
    visibleFor: (s) => s === "submitted" || s === "draft",
  },
  {
    key: "cancel",
    title: "Cancel Campaign",
    desc: "Permanently cancel this campaign",
    icon: X,
    color: "text-[#dc2626] bg-[#fef2f2]",
    requiresReason: true,
    visibleFor: (s) => !TERMINAL_STATUSES.includes(s),
  },
];

export default function CampaignActionsTab({
  campaignId,
  campaignStatus,
}: CampaignActionsTabProps) {
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);

  const approveCampaign = useApproveCampaign();
  const cancelCampaign = useCancelCampaign();

  const isPending = approveCampaign.isPending || cancelCampaign.isPending;

  const status = (campaignStatus ?? "").toLowerCase();
  const activeDef = ACTION_DEFS.find((a) => a.key === activeAction);
  const visibleActions = ACTION_DEFS.filter((a) => a.visibleFor(status));

  const handleConfirm = (reason: string) => {
    if (!activeAction) return;
    const onSuccess = () => setActiveAction(null);

    switch (activeAction) {
      case "approve":
        approveCampaign.mutate(campaignId, { onSuccess });
        break;
      case "cancel":
        cancelCampaign.mutate({ id: campaignId, reason }, { onSuccess });
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="bg-[#fff7ed]/50 border border-[#fde68a]/50 rounded-2xl p-4.5 flex items-start gap-3 text-xs leading-relaxed text-[#92400e] font-medium">
        <Info size={15} className="shrink-0 mt-0.5 text-[#ea580c]" />
        <span>
          All administrative actions require a reason and are permanently
          recorded in the audit log with your identity and timestamp. Financial
          actions require mandatory reasoning.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleActions.length === 0 && (
          <div className="md:col-span-2 text-xs text-[#9a99b0] bg-white border border-[#e8e6f0]/60 rounded-2xl p-4.5">
            No administrative actions are available for this campaign in its
            current status ({campaignStatus ?? "unknown"}).
          </div>
        )}

        {visibleActions.map((act) => (
          <button
            key={act.key}
            onClick={() => setActiveAction(act.key)}
            disabled={isPending}
            className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-brand-pink/30 hover:shadow-sm transition-all group w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center border border-transparent",
                  act.color,
                )}
              >
                <act.icon size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                  {act.title}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
                  {act.desc}
                </span>
              </div>
            </div>
            <RefreshCw
              size={13}
              className={cn(
                "text-[#9a99b0] transition-opacity",
                isPending
                  ? "opacity-100 animate-spin"
                  : "opacity-0 group-hover:opacity-100",
              )}
            />
          </button>
        ))}
      </div>

      <AdminActionModal
        action={activeDef?.title ?? null}
        requiresReason={activeDef?.requiresReason ?? true}
        isPending={isPending}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
