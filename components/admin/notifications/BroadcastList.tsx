"use client";

import { useState } from "react";
import { Eye, Trash2, Megaphone, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminBroadcastsList,
  useAdminBroadcastDetails,
  useDeleteBroadcast,
} from "@/hooks/useAdminBroadcasts";
import type { AdminBroadcastDto } from "@/types/adminBroadcasts";
import CreateBroadcastModal, {
  type CreateBroadcastInitialValues,
} from "./CreateBroadcastModal";
import BroadcastDetailsModal from "./BroadcastDetailsModal";
import DeleteBroadcastModal from "./DeleteBroadcastModal";

type TabOption = "all" | "draft" | "sent" | "scheduled";

const TABS: { value: TabOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "scheduled", label: "Scheduled" },
];

const AUDIENCE_BADGE: Record<string, string> = {
  all: "bg-[#f5f3ff] text-[#7c3aed]",
  brands: "bg-[#eff6ff] text-[#2563eb]",
  creators: "bg-[#f0fdf4] text-[#16a34a]",
};

const AUDIENCE_LABEL: Record<string, string> = {
  all: "All",
  brands: "Brands",
  creators: "Creators",
};

const STATUS_BADGE: Record<string, string> = {
  sent: "bg-[#f0fdf4] text-[#16a34a]",
  draft: "bg-[#faf9fc] text-[#5a5a7a]",
  scheduled: "bg-[#fff7ed] text-[#ea580c]",
};

const STATUS_LABEL: Record<string, string> = {
  sent: "Sent",
  draft: "Draft",
  scheduled: "Scheduled",
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BroadcastList() {
  const [activeTab, setActiveTab] = useState<TabOption>("all");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [duplicateValues, setDuplicateValues] =
    useState<CreateBroadcastInitialValues | null>(null);

  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBroadcastDto | null>(
    null,
  );

  const { data: apiData, isLoading } = useAdminBroadcastsList({
    tab: activeTab,
    page,
    limit: 10,
  });
  const { data: detailsBroadcast, isLoading: isDetailsLoading } =
    useAdminBroadcastDetails(detailsId);
  const deleteBroadcast = useDeleteBroadcast();

  const broadcasts = apiData?.data ?? [];
  const meta = apiData?.meta;

  const openCreate = () => {
    setDuplicateValues(null);
    setCreateOpen(true);
  };

  const handleDuplicate = (broadcast: AdminBroadcastDto) => {
    setDetailsId(null);
    setDuplicateValues({
      title: broadcast.title,
      message: broadcast.message,
      audience: broadcast.audience,
      channel: broadcast.channel,
    });
    setCreateOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteBroadcast.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Status tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#e8e6f0]/60 p-1 rounded-xl w-fit">
        {TABS.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={cn(
                "px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                active
                  ? "bg-brand-pink text-white shadow-sm"
                  : "bg-transparent text-[#5a5a7a] hover:text-[#1a1a2e]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1a1a2e]">Broadcasts</h2>
          <button
            onClick={openCreate}
            className="h-9.5 px-4 bg-brand-pink text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
          >
            <Megaphone size={14} /> Create Broadcast
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center justify-between gap-3 animate-pulse"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-1/3 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  <div className="flex gap-2">
                    <div className="w-10 h-4 bg-[#e8e6f0]/50 rounded-md" />
                    <div className="w-10 h-4 bg-[#e8e6f0]/50 rounded-md" />
                    <div className="w-16 h-4 bg-[#e8e6f0]/40 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 bg-[#e8e6f0]/50 rounded-xl" />
                  <div className="w-8 h-8 bg-[#e8e6f0]/50 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="w-11 h-11 rounded-full bg-[#faf9fc] text-[#9a99b0] flex items-center justify-center border border-[#e8e6f0]/60">
              <Inbox size={18} />
            </div>
            <p className="text-xs font-bold text-[#1a1a2e]">
              No broadcasts found
            </p>
            <p className="text-[11px] text-[#9a99b0]">
              {activeTab === "all"
                ? "Create your first broadcast to notify users."
                : "No broadcasts in this status yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex items-center justify-between gap-3 hover:bg-[#faf9fc]/40 transition-colors"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#1a1a2e] truncate">
                    {b.title}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-bold",
                        AUDIENCE_BADGE[b.audience] ??
                          "bg-[#f4f3f6] text-[#5a5a7a]",
                      )}
                    >
                      {AUDIENCE_LABEL[b.audience] ?? b.audience}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-bold",
                        STATUS_BADGE[b.status] ?? "bg-[#f4f3f6] text-[#5a5a7a]",
                      )}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                    <span className="text-[10px] text-[#9a99b0] font-medium">
                      {formatDate(b.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setDetailsId(b.id)}
                    aria-label={`View broadcast ${b.title}`}
                    title="View details"
                    className="h-8 w-8 bg-[#eff6ff] text-[#2563eb] rounded-xl hover:bg-[#dbeafe] transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(b)}
                    aria-label={`Delete broadcast ${b.title}`}
                    title="Delete broadcast"
                    className="h-8 w-8 bg-[#fef2f2] text-[#dc2626] rounded-xl hover:bg-[#fee2e2] transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e8e6f0]/40 pt-4">
            <span className="text-[11px] text-[#9a99b0] font-medium">
              Page {meta.page} of {meta.totalPages} ({meta.total} broadcasts)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-[#e8e6f0]/60 rounded-xl text-[11px] font-bold text-[#5a5a7a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-[#e8e6f0]/60 rounded-xl text-[11px] font-bold text-[#5a5a7a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {createOpen && (
        <CreateBroadcastModal
          onClose={() => setCreateOpen(false)}
          initialValues={duplicateValues}
        />
      )}

      <BroadcastDetailsModal
        broadcast={detailsBroadcast ?? null}
        isLoading={isDetailsLoading}
        onClose={() => setDetailsId(null)}
        onDuplicate={handleDuplicate}
      />

      {deleteTarget && (
        <DeleteBroadcastModal
          broadcastTitle={deleteTarget.title}
          isDeleting={deleteBroadcast.isPending}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
