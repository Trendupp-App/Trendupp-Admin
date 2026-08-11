"use client";

import { useState } from "react";
import {
  Info,
  RefreshCw,
  Pause,
  Play,
  X,
  // Lock,
  // Unlock,
  // Calendar,
  // Check,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useApproveCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useCancelCampaign,
} from "@/hooks/useAdminCampaigns";
import AdminActionModal from "./AdminActionModal";

interface CampaignActionsTabProps {
  campaignId: string;
  campaignStatus?: string;
}

type ActionKey = "approve" | "pause" | "resume" | "cancel";

interface ActionDef {
  key: ActionKey;
  title: string;
  desc: string;
  icon: typeof Pause;
  color: string;
  visibleFor: (status?: string) => boolean;
}

const ACTION_DEFS: ActionDef[] = [
  {
    key: "approve",
    title: "Approve Campaign",
    desc: "Approve a pending campaign and take it live",
    icon: CheckCircle,
    color: "text-[#16a34a] bg-[#f0fdf4]",
    visibleFor: (s) => s === "submitted",
  },
  // Commented out for now — using Cancel Campaign instead. Revisit later.
  // {
  //   key: "pause",
  //   title: "Pause Campaign",
  //   desc: "Temporarily suspend all campaign activity",
  //   icon: Pause,
  //   color: "text-[#f59e0b] bg-[#fff7ed]",
  //   visibleFor: (s) => s === "live" || s === "active",
  // },
  {
    key: "resume",
    title: "Resume Campaign",
    desc: "Resume a paused campaign",
    icon: Play,
    color: "text-[#16a34a] bg-[#f0fdf4]",
    visibleFor: (s) => s === "paused",
  },
  {
    key: "cancel",
    title: "Cancel Campaign",
    desc: "Permanently cancel this campaign",
    icon: X,
    color: "text-[#dc2626] bg-[#fef2f2]",
    visibleFor: (s) =>
      !!s && !["completed", "cancelled", "active", "live"].includes(s),
  },
];

// const UNAVAILABLE_ACTIONS = [
//   {
//     title: "Hold Escrow Funds",
//     desc: "Freeze escrow pending investigation",
//     icon: Lock,
//     color: "text-[#7c3aed] bg-[#f5f3ff]",
//   },
//   {
//     title: "Release Escrow Funds",
//     desc: "Manually release funds to creator",
//     icon: Unlock,
//     color: "text-[#2563eb] bg-[#eff6ff]",
//   },
//   {
//     title: "Refund Campaign",
//     desc: "Initiate refund to brand",
//     icon: RefreshCw,
//     color: "text-[#92400e] bg-[#fff7ed]",
//   },
//   {
//     title: "Extend Application Deadline",
//     desc: "Give more time for applications",
//     icon: Calendar,
//     color: "text-brand-pink bg-[#fff1f2]",
//   },
//   {
//     title: "Trigger Manual Verification",
//     desc: "Manually verify posted content",
//     icon: Check,
//     color: "text-[#16a34a] bg-[#f0fdf4]",
//   },
// ];

export default function CampaignActionsTab({
  campaignId,
  campaignStatus,
}: CampaignActionsTabProps) {
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);

  const approveCampaign = useApproveCampaign();
  const pauseCampaign = usePauseCampaign();
  const resumeCampaign = useResumeCampaign();
  const cancelCampaign = useCancelCampaign();

  const isPending =
    approveCampaign.isPending ||
    pauseCampaign.isPending ||
    resumeCampaign.isPending ||
    cancelCampaign.isPending;

  const activeDef = ACTION_DEFS.find((a) => a.key === activeAction);
  const visibleActions = ACTION_DEFS.filter((a) =>
    a.visibleFor(campaignStatus),
  );

  const handleConfirm = (reason: string) => {
    if (!activeAction) return;
    const onSuccess = () => setActiveAction(null);

    switch (activeAction) {
      case "approve":
        approveCampaign.mutate(campaignId, { onSuccess });
        break;
      case "pause":
        pauseCampaign.mutate({ id: campaignId, reason }, { onSuccess });
        break;
      case "resume":
        resumeCampaign.mutate(campaignId, { onSuccess });
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
              className="text-[#9a99b0] opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ))}

        {/* Not implemented yet — revisit later.
        {UNAVAILABLE_ACTIONS.map((act, i) => (
          <div
            key={i}
            className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center justify-between gap-4 opacity-60 cursor-not-allowed w-full text-left"
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
                <span className="text-xs font-bold text-[#1a1a2e]">
                  {act.title}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
                  {act.desc}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#9a99b0] bg-white border border-[#e8e6f0] px-2 py-0.5 rounded-full shrink-0">
              Not available
            </span>
          </div>
        ))}
        */}
      </div>

      <AdminActionModal
        action={activeDef?.title ?? null}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
