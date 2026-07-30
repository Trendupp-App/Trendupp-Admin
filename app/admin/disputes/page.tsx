"use client";

import { useState, useEffect } from "react";
import {
  useDisputes,
  useDisputeDetails,
  useActivateDispute,
  useResolveDispute,
} from "@/hooks/useDisputes";
import { useUserById } from "@/hooks/useUsers";
import { useStreamChat } from "@/lib/providers/StreamChatProvider";
import DisputeStats from "@/components/admin/disputes/DisputeStats";
import DisputeToolbar, {
  DisputeTab,
} from "@/components/admin/disputes/DisputeToolbar";
import PendingRequestsList from "@/components/admin/disputes/PendingRequestsList";
import ActivateChatModal from "@/components/admin/disputes/ActivateChatModal";
import ActiveChatsGrid from "@/components/admin/disputes/ActiveChatsGrid";
import ClosedDisputesTable from "@/components/admin/disputes/ClosedDisputesTable";
import DisputeDetailView from "@/components/admin/disputes/DisputeDetailView";
import DisputeSkeleton from "@/components/admin/disputes/DisputeSkeleton";
import { Dispute, ResolveDisputePayload } from "@/types/dispute";

import { useAuthStore } from "@/store/authStore";

interface StreamMessage {
  id: string;
  text?: string;
  created_at: string;
  user?: {
    id: string;
    name?: string;
    image?: string;
  };
}

interface ChatChannel {
  on: (
    event: string,
    callback: (event: {
      message?: {
        id: string;
        text?: string;
        created_at?: string | Date;
        user?: { id: string; name?: string; image?: string };
      };
    }) => void,
  ) => { unsubscribe: () => void };
  sendMessage: (payload: {
    text: string;
  }) => Promise<{ message: StreamMessage }>;
  watch: () => Promise<{ messages: StreamMessage[] }>;
}

export default function AdminDisputesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<DisputeTab>("pending");
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null,
  );

  // Activate Chat Modal State
  const [activateDisputeTarget, setActivateDisputeTarget] =
    useState<Dispute | null>(null);

  // Queries
  const { data: disputesList = [], isLoading: isListLoading } = useDisputes();
  const { data: disputeDetail } = useDisputeDetails(selectedDisputeId);
  const { data: activateBrandUser } = useUserById(
    activateDisputeTarget?.brandId ?? null,
  );
  const { data: activateCreatorUser } = useUserById(
    activateDisputeTarget?.creatorId ?? null,
  );

  // Stream Chat integration
  const { client, isConnected } = useStreamChat();
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isChannelLoading, setIsChannelLoading] = useState(false);

  // Mutations
  const activateMutation = useActivateDispute(() => {
    setActivateDisputeTarget(null);
  });
  const resolveMutation = useResolveDispute(() => {
    setSelectedDisputeId(null);
  });

  // Filtered lists
  const pendingRequests = disputesList.filter(
    (d) => d.status === "raised" || !d.status,
  );
  const activeChats = disputesList.filter((d) => d.status === "under_review");
  const closedDisputes = disputesList.filter((d) => d.status === "resolved");

  // Stream Chat Channel Subscriptions
  useEffect(() => {
    if (
      !client ||
      !isConnected ||
      !disputeDetail ||
      disputeDetail.status !== "under_review"
    ) {
      Promise.resolve().then(() => {
        setActiveChannel(null);
        setMessages([]);
      });
      return;
    }

    let isSubscribed = true;
    Promise.resolve().then(() => {
      setIsChannelLoading(true);
    });

    const channelId =
      disputeDetail.streamChannelId || `dispute_${disputeDetail.id}`;
    const channel = client.channel("messaging", channelId);

    const watchChannel = async () => {
      try {
        const state = await channel.watch();
        if (isSubscribed) {
          setActiveChannel(channel as unknown as ChatChannel);
          setMessages((state.messages as StreamMessage[]) || []);
          setIsChannelLoading(false);
        }
      } catch (err) {
        console.error("Error watching Stream channel:", err);
        if (isSubscribed) {
          setIsChannelLoading(false);
        }
      }
    };

    watchChannel();

    return () => {
      isSubscribed = false;
      Promise.resolve().then(() => {
        setActiveChannel(null);
        setMessages([]);
      });
    };
  }, [client, isConnected, disputeDetail]);

  useEffect(() => {
    if (!activeChannel) return;

    const listener = activeChannel.on("message.new", (event) => {
      if (!event.message) return;
      const newMessage: StreamMessage = {
        id: event.message.id,
        text: event.message.text,
        created_at:
          typeof event.message.created_at === "string"
            ? event.message.created_at
            : event.message.created_at?.toISOString() ||
              new Date().toISOString(),
        user: event.message.user,
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      listener.unsubscribe();
    };
  }, [activeChannel]);

  const handleSendMessage = async (text: string) => {
    if (!activeChannel) return;
    await activeChannel.sendMessage({ text });
  };

  const handleConfirmActivate = () => {
    if (!activateDisputeTarget) return;
    activateMutation.mutate({
      id: activateDisputeTarget.id,
      financeAdminId: user?.id,
    });
  };

  const handleResolveSubmit = (payload: ResolveDisputePayload) => {
    if (!selectedDisputeId) return;
    resolveMutation.mutate({
      id: selectedDisputeId,
      payload,
    });
  };

  const activateBrandName = activateDisputeTarget
    ? `${activateBrandUser?.firstName ?? ""} ${activateBrandUser?.lastName ?? ""}`.trim() ||
      "Brand"
    : "Brand";
  const activateCreatorName = activateDisputeTarget
    ? `${activateCreatorUser?.firstName ?? ""} ${activateCreatorUser?.lastName ?? ""}`.trim() ||
      "Creator"
    : "Creator";

  // If a dispute case detail view is selected, render full detail view
  if (selectedDisputeId && disputeDetail) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <DisputeDetailView
          dispute={disputeDetail}
          onClose={() => setSelectedDisputeId(null)}
          _activeChannel={activeChannel}
          messages={messages}
          isChannelLoading={isChannelLoading}
          onSendMessage={handleSendMessage}
          onResolve={handleResolveSubmit}
          isResolving={resolveMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 text-left max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold text-[#1a1a2e]">
          Chat & Disputes
        </h2>
        <h3 className="text-sm font-bold text-[#1a1a2e]">Manage Disputes</h3>
      </div>

      {/* Top Summary Stats Cards */}
      <DisputeStats
        activeChatsCount={activeChats.length}
        pendingRequestsCount={pendingRequests.length}
        resolvedCount={closedDisputes.length}
      />

      {/* Toolbar & Filter Tabs */}
      <DisputeToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingRequests.length}
        activeCount={activeChats.length}
        closedCount={closedDisputes.length}
      />

      {/* Loading Shimmer Indicator */}
      {isListLoading && <DisputeSkeleton />}

      {/* Tab Content */}
      {!isListLoading && activeTab === "pending" && (
        <PendingRequestsList
          disputes={pendingRequests}
          onActivateClick={(dispute) => setActivateDisputeTarget(dispute)}
        />
      )}

      {!isListLoading && activeTab === "active" && (
        <ActiveChatsGrid
          disputes={activeChats}
          onOpenCase={(disputeId) => setSelectedDisputeId(disputeId)}
        />
      )}

      {!isListLoading && activeTab === "closed" && (
        <ClosedDisputesTable disputes={closedDisputes} />
      )}

      {/* Activate Chat Confirmation Modal */}
      <ActivateChatModal
        isOpen={!!activateDisputeTarget}
        onClose={() => setActivateDisputeTarget(null)}
        onConfirm={handleConfirmActivate}
        brandName={activateBrandName}
        creatorName={activateCreatorName}
        isLoading={activateMutation.isPending}
      />
    </div>
  );
}
