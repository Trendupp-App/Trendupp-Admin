"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BroadcastStatsCards from "@/components/admin/notifications/BroadcastStatsCards";
import BroadcastDrawer from "@/components/admin/notifications/BroadcastDrawer";
import BroadcastDetailDrawer from "@/components/admin/notifications/BroadcastDetailDrawer";
import DeleteBroadcastModal from "@/components/admin/notifications/DeleteBroadcastModal";
import {
  useAdminBroadcasts,
  useCreateAdminBroadcast,
  useUpdateAdminBroadcast,
  useDeleteAdminBroadcast,
} from "@/hooks/useAdminNotifications";
import type {
  AdminBroadcastItem,
  CreateBroadcastPayload,
  UpdateBroadcastPayload,
} from "@/types/adminNotifications";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Drawer / Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] =
    useState<AdminBroadcastItem | null>(null);
  const [viewingBroadcast, setViewingBroadcast] =
    useState<AdminBroadcastItem | null>(null);
  const [deletingBroadcast, setDeletingBroadcast] =
    useState<AdminBroadcastItem | null>(null);

  // Build query params
  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      q: search.trim() || undefined,
      status:
        selectedStatus !== "All" ? selectedStatus.toLowerCase() : undefined,
    };
  }, [page, limit, search, selectedStatus]);

  const { data: broadcastsResponse, isLoading } =
    useAdminBroadcasts(queryParams);

  const broadcastsList = broadcastsResponse?.data ?? [];
  const totalCount = broadcastsResponse?.total ?? 0;
  const totalPages = broadcastsResponse?.totalPages ?? 1;

  // Mutations
  const createMutation = useCreateAdminBroadcast(() => {
    setIsDrawerOpen(false);
    setEditingBroadcast(null);
  });

  const updateMutation = useUpdateAdminBroadcast(() => {
    setIsDrawerOpen(false);
    setEditingBroadcast(null);
  });

  const deleteMutation = useDeleteAdminBroadcast(() => {
    setDeletingBroadcast(null);
  });

  const handleOpenCreate = () => {
    setEditingBroadcast(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (broadcast: AdminBroadcastItem) => {
    setEditingBroadcast(broadcast);
    setIsDrawerOpen(true);
  };

  const handleSaveBroadcast = (payload: CreateBroadcastPayload) => {
    if (editingBroadcast) {
      updateMutation.mutate({
        id: editingBroadcast.id,
        payload: payload as UpdateBroadcastPayload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingBroadcast) {
      deleteMutation.mutate(deletingBroadcast.id);
    }
  };

  const getStatusChip = (s: string) => {
    const statusCap = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const maps: Record<string, string> = {
      Sent: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
      Scheduled: "bg-[#fff7ed] text-[#ea580c] border-[#fde68a]",
      Draft: "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
    };
    return (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit capitalize",
          maps[statusCap] ?? "bg-[#faf9fc] text-[#5a5a7a] border-[#e8e6f0]",
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        {statusCap}
      </span>
    );
  };

  const getAudienceChip = (aud: string) => {
    const maps: Record<string, { label: string; style: string }> = {
      all: {
        label: "All Users",
        style: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
      },
      creators: {
        label: "Creators Only",
        style: "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]",
      },
      brands: {
        label: "Brands Only",
        style: "bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]",
      },
    };
    const target = maps[aud.toLowerCase()] ?? {
      label: aud,
      style: "bg-[#faf9fc] text-[#5a5a7a]",
    };
    return (
      <span
        className={cn(
          "px-2 py-0.5 rounded-md text-[10px] font-bold border",
          target.style,
        )}
      >
        {target.label}
      </span>
    );
  };

  const getChannelBadge = (ch: string) => {
    const maps: Record<string, string> = {
      in_app: "In-App Banner",
      email: "Email Notice",
      both: "In-App + Email",
    };
    return (
      <span className="text-xs text-[#5a5a7a] font-semibold capitalize">
        {maps[ch.toLowerCase()] ?? ch}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up text-left">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">
            Notifications &amp; Broadcasts
          </h1>
          <p className="text-xs text-[#9a99b0] font-medium mt-0.5">
            Create, schedule, and manage system announcements across email and
            in-app channels.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="h-10 px-5 bg-brand-pink text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-sm"
        >
          <Plus size={15} /> New Broadcast
        </button>
      </div>

      {/* KPI Stats Overview */}
      <BroadcastStatsCards
        broadcasts={broadcastsList}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {/* Main Container */}
      <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex items-center w-full sm:max-w-md">
            <Search size={14} className="absolute left-3.5 text-[#9a99b0]" />
            <input
              type="text"
              placeholder="Search announcements by title or content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9.5 w-full bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
            />
          </div>

          {/* Status Tab Pills */}
          <div className="flex items-center gap-1 border-[#e8e6f0]/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none">
            {["All", "Sent", "Scheduled", "Draft"].map((tabLabel) => {
              const active =
                selectedStatus.toLowerCase() === tabLabel.toLowerCase();
              return (
                <button
                  key={tabLabel}
                  onClick={() => {
                    setSelectedStatus(tabLabel);
                    setPage(1);
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    active
                      ? "bg-brand-pink text-white shadow-sm"
                      : "bg-transparent text-[#5a5a7a] hover:text-[#1a1a2e]",
                  )}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Broadcasts List Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Title &amp; Preview</th>
                <th className="pb-3.5">Audience</th>
                <th className="pb-3.5">Channel</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5">Scheduled / Date</th>
                <th className="pb-3.5 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-3 px-2">
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : broadcastsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs text-[#9a99b0] font-medium"
                  >
                    No announcements found matching the search criteria.
                  </td>
                </tr>
              ) : (
                broadcastsList.map((item: AdminBroadcastItem) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#faf9fc]/40 transition-colors"
                  >
                    <td className="py-4 pl-2 max-w-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[#1a1a2e] text-xs leading-snug">
                          {item.title}
                        </span>
                        <p className="text-[11px] text-[#7a7a9a] line-clamp-1 font-normal">
                          {item.message}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">{getAudienceChip(item.audience)}</td>
                    <td className="py-4">{getChannelBadge(item.channel)}</td>
                    <td className="py-4">{getStatusChip(item.status)}</td>
                    <td className="py-4 text-[#7a7a9a] text-[11px]">
                      {item.status === "scheduled" && item.scheduledAt
                        ? formatDate(item.scheduledAt)
                        : formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingBroadcast(item)}
                          className="p-1.5 text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#5a5a7a] hover:bg-[#faf9fc] rounded-lg transition-colors cursor-pointer"
                          title="Edit Broadcast"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingBroadcast(item)}
                          className="p-1.5 text-[#dc2626] hover:bg-[#fef2f2] rounded-lg transition-colors cursor-pointer"
                          title="Delete Broadcast"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#e8e6f0]/40 pt-4 mt-2">
          <span className="text-[11px] text-[#9a99b0] font-medium">
            Showing {broadcastsList.length > 0 ? (page - 1) * limit + 1 : 0}-
            {Math.min(page * limit, totalCount)} of {totalCount} announcements
          </span>

          <div className="flex items-center bg-[#f4f3f6] rounded-xl p-0.5 border border-[#e8e6f0]/60 shrink-0">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: Math.max(1, Math.min(5, totalPages)) }).map(
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                      page === pageNum
                        ? "bg-white text-brand-pink shadow-sm"
                        : "text-[#7a7a9a] hover:text-[#1a1a2e]",
                    )}
                  >
                    {pageNum}
                  </button>
                );
              },
            )}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer disabled:opacity-40"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* Drawers & Modals */}
      <BroadcastDrawer
        key={editingBroadcast?.id || (isDrawerOpen ? "open" : "closed")}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingBroadcast(null);
        }}
        onSave={handleSaveBroadcast}
        broadcast={editingBroadcast}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <BroadcastDetailDrawer
        broadcast={viewingBroadcast}
        onClose={() => setViewingBroadcast(null)}
      />

      <DeleteBroadcastModal
        isOpen={!!deletingBroadcast}
        onClose={() => setDeletingBroadcast(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingBroadcast?.title}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
