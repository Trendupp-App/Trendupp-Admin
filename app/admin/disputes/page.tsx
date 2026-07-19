"use client";

import { useState, useEffect, useRef } from "react";
import {
  useDisputeDetails,
  useActivateDispute,
  useResolveDispute,
} from "@/hooks/useDisputes";
import { useCampaign } from "@/hooks/useCampaign";
import {
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Activity,
  Check,
  Send,
  Loader2,
} from "lucide-react";
import { useStreamChat } from "@/lib/providers/StreamChatProvider";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import type { ResolveDisputePayload } from "@/types/dispute";

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
  state: { messages: StreamMessage[] };
}

export default function AdminDisputesPage() {
  const [disputeIdInput, setDisputeIdInput] = useState("");
  const [loadedDisputeId, setLoadedDisputeId] = useState<string | null>(null);

  // Form states for dispute resolution
  const [resolveAction, setResolveAction] = useState<
    "release_to_creator" | "refund_to_brand" | "split"
  >("release_to_creator");
  const [resolveNotes, setResolveNotes] = useState("");
  const [splitAmount, setSplitAmount] = useState("");

  const {
    data: dispute,
    isLoading: isDisputeLoading,
    error: disputeError,
  } = useDisputeDetails(loadedDisputeId);
  const { data: campaign } = useCampaign(dispute?.campaignId ?? null);

  // Chat integration states
  const { client, isConnected } = useStreamChat();
  const { user } = useAuthStore();
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCampaignTitle = (campaignId: string) => {
    if (
      campaign &&
      (campaign.id === campaignId || campaignId === dispute?.campaignId)
    ) {
      return campaign.title;
    }
    return `Campaign ${campaignId.slice(0, 8)}`;
  };

  const getBrandName = (campaignId: string) => {
    if (
      campaign &&
      (campaign.id === campaignId || campaignId === dispute?.campaignId) &&
      campaign.brand
    ) {
      return `${campaign.brand.firstName} ${campaign.brand.lastName}`;
    }
    return "Unknown Brand";
  };

  const activateMutation = useActivateDispute();
  const resolveMutation = useResolveDispute();

  const handleLoadDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeIdInput.trim()) return;
    setLoadedDisputeId(disputeIdInput.trim());
  };

  const handleActivate = () => {
    if (!loadedDisputeId) return;
    activateMutation.mutate({ id: loadedDisputeId });
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadedDisputeId) return;

    const payload: ResolveDisputePayload = {
      action: resolveAction,
      resolutionNotes: resolveNotes,
    };

    if (resolveAction === "split") {
      const parsedAmount = parseFloat(splitAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return;
      }
      payload.splitCreatorAmount = parsedAmount;
    }

    resolveMutation.mutate({
      id: loadedDisputeId,
      payload,
    });
  };

  // Watch selected dispute channel when it goes under_review
  useEffect(() => {
    if (
      !client ||
      !isConnected ||
      !dispute ||
      dispute.status !== "under_review"
    ) {
      Promise.resolve().then(() => {
        setActiveChannel((prev: ChatChannel | null) =>
          prev !== null ? null : prev,
        );
        setMessages((prev) => (prev.length > 0 ? [] : prev));
      });
      return;
    }

    let isSubscribed = true;
    Promise.resolve().then(() => {
      setIsChannelLoading(true);
    });

    const channel = client.channel("messaging", `dispute_${dispute.id}`);

    const watchChannel = async () => {
      try {
        const state = await channel.watch();
        if (isSubscribed) {
          setActiveChannel(channel as unknown as ChatChannel);
          setMessages((state.messages as StreamMessage[]) || []);
          setIsChannelLoading(false);
        }
      } catch (err) {
        console.error("Error watching channel:", err);
        if (isSubscribed) {
          setIsChannelLoading(false);
        }
      }
    };

    watchChannel();

    return () => {
      isSubscribed = false;
      Promise.resolve().then(() => {
        setActiveChannel((prev: ChatChannel | null) =>
          prev !== null ? null : prev,
        );
        setMessages((prev) => (prev.length > 0 ? [] : prev));
      });
    };
  }, [client, isConnected, dispute]);

  // Subscribe to real-time message events on active channel
  useEffect(() => {
    if (!activeChannel) return;

    const listener = activeChannel.on("message.new", (event) => {
      if (!event.message) return;
      const newMessage: StreamMessage = {
        id: event.message.id,
        text: event.message.text,
        created_at:
          event.message.created_at?.toString() || new Date().toISOString(),
        user: event.message.user
          ? {
              id: event.message.user.id,
              name: event.message.user.name,
              image: event.message.user.image,
            }
          : undefined,
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, dispute?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChannel) return;
    try {
      const textToSend = inputText;
      setInputText("");
      await activeChannel.sendMessage({ text: textToSend });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "under_review":
        return "Active Mediation (Under Review)";
      case "raised":
        return "Raised (Awaiting Activation)";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  const renderAdminChat = () => {
    if (isChannelLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2 text-xs text-[#7a7a9a]">
          <Loader2 className="animate-spin text-brand-pink" size={24} />
          <span>Connecting to mediation channel...</span>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col min-h-[400px]">
        {/* Chat Timeline */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 max-h-[480px] bg-white border border-[#e8e6f0]/40 rounded-3xl mt-2 select-text">
          {messages.map((message) => {
            const isMe = message.user?.id === user?.id;
            const senderName = message.user?.name || "User";

            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1 max-w-[75%]",
                  isMe ? "self-end items-end" : "self-start items-start",
                )}
              >
                <span className="text-[9px] font-bold text-[#7a7a9a] px-1">
                  {senderName} {isMe && "(You)"}
                </span>
                <div
                  className={cn(
                    "rounded-[20px] px-4 py-2.5 text-xs break-words leading-relaxed text-left",
                    isMe
                      ? "bg-brand-pink text-white rounded-tr-none"
                      : "bg-[#faf9fc] text-[#1a1a2e] border border-[#e8e6f0]/60 rounded-tl-none",
                  )}
                >
                  {message.text}
                </div>
                <span className="text-[8px] text-[#9a99b0] px-1 mt-0.5">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Footer */}
        <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Type a message as Mediation Admin..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-2xl bg-brand-pink hover:bg-brand-pink/90 disabled:bg-brand-pink/40 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9fc] text-[#1a1a2e] p-6 md:p-12 flex flex-col items-center animate-fade-in-up">
      <div
        className={cn(
          "w-full transition-all duration-300 flex flex-col items-stretch gap-6",
          dispute && dispute.status === "under_review"
            ? "max-w-6xl md:flex-row"
            : "max-w-2xl flex-col",
        )}
      >
        {/* Left Column (Mediation controls / Details) */}
        <div className="flex-1 bg-white border border-[#e8e6f0]/60 shadow-xl rounded-[32px] p-8 flex flex-col gap-6">
          {/* Title */}
          <div className="flex items-center gap-3 border-b border-[#e8e6f0]/60 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-pink-light flex items-center justify-center text-brand-pink shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-bold">Admin Mediation Panel</h1>
              <p className="text-xs font-light text-[#7a7a9a]">
                Emulate administrator mediation activation & controls
              </p>
            </div>
          </div>

          {/* Load Form */}
          <form onSubmit={handleLoadDispute} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="admin-disp-id"
                className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
              >
                Enter Dispute ID (UUID)
              </label>
              <div className="flex gap-3">
                <input
                  id="admin-disp-id"
                  type="text"
                  placeholder="Paste dispute UUID here..."
                  value={disputeIdInput}
                  onChange={(e) =>
                    disputeIdInput !== e.target.value &&
                    setDisputeIdInput(e.target.value)
                  }
                  className="flex-1 border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e]"
                  required
                />
                <button
                  type="submit"
                  className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  Load Dispute
                </button>
              </div>
            </div>
          </form>

          {/* Dispute Details */}
          {loadedDisputeId && (
            <div className="flex flex-col gap-5 border-t border-[#e8e6f0]/60 pt-6">
              {isDisputeLoading ? (
                <div className="flex items-center justify-center py-10 gap-2 text-xs text-[#7a7a9a]">
                  <Activity className="animate-spin" size={16} />
                  <span>Fetching dispute details...</span>
                </div>
              ) : disputeError ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-left">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 text-[11px] text-red-800">
                    <span className="font-bold">Error Loading Dispute</span>
                    <span className="leading-relaxed font-light">
                      The dispute ID provided could not be found or fetched.
                      Please double check the UUID and try again.
                    </span>
                  </div>
                </div>
              ) : dispute ? (
                <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/50 p-6 rounded-2xl flex flex-col gap-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-[#7a7a9a]">
                        Dispute ID:
                      </span>
                      <span className="col-span-2 select-all font-mono text-[#1a1a2e]">
                        {dispute.id}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-[#7a7a9a]">
                        Campaign:
                      </span>
                      <span className="col-span-2 font-semibold text-[#1a1a2e]">
                        {getCampaignTitle(dispute.campaignId)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-[#7a7a9a]">Brand:</span>
                      <span className="col-span-2 font-semibold text-[#1a1a2e]">
                        {getBrandName(dispute.campaignId)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-[#7a7a9a]">Reason:</span>
                      <span className="col-span-2 font-light text-[#5a5a7a]">
                        {dispute.reason}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-[#7a7a9a]">Status:</span>
                      <span className="col-span-2 font-bold text-brand-pink">
                        {getStatusLabel(dispute.status)}
                      </span>
                    </div>
                    {dispute.status === "resolved" && (
                      <>
                        <div className="grid grid-cols-3 gap-2 border-t border-[#e8e6f0]/60 pt-2 mt-1">
                          <span className="font-bold text-[#7a7a9a]">
                            Resolution Action:
                          </span>
                          <span className="col-span-2 font-semibold text-[#1a1a2e] capitalize">
                            {dispute.action?.replace(/_/g, " ")}
                          </span>
                        </div>
                        {dispute.splitCreatorAmount !== null && (
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-bold text-[#7a7a9a]">
                              Split Creator Payout:
                            </span>
                            <span className="col-span-2 font-semibold text-[#1a1a2e]">
                              ₦{dispute.splitCreatorAmount}
                            </span>
                          </div>
                        )}
                        {(dispute.resolutionNotes || dispute.notes) && (
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-bold text-[#7a7a9a]">
                              Resolution Notes:
                            </span>
                            <span className="col-span-2 font-light text-[#5a5a7a]">
                              {dispute.resolutionNotes || dispute.notes}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Mediation controls based on status */}
                  <div className="flex flex-col gap-5 border-t border-[#e8e6f0]/40 pt-5">
                    {dispute.status === "raised" && (
                      <div className="flex flex-col gap-3">
                        <h2 className="text-xs font-bold text-[#1a1a2e]">
                          Mediation Activation
                        </h2>
                        <p className="text-[10px] text-[#7a7a9a] font-light leading-relaxed">
                          Mediation is not yet active. Activating this dispute
                          will create the GetStream chat channel and notify both
                          creator and brand.
                        </p>
                        <button
                          onClick={handleActivate}
                          disabled={activateMutation.isPending}
                          className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          {activateMutation.isPending
                            ? "Activating Mediation..."
                            : "Activate Dispute"}
                        </button>
                      </div>
                    )}

                    {dispute.status === "under_review" && (
                      <form
                        onSubmit={handleResolveSubmit}
                        className="flex flex-col gap-4 text-left"
                      >
                        <div className="flex flex-col gap-1">
                          <h2 className="text-xs font-bold text-[#1a1a2e]">
                            Dispute Resolution Decision
                          </h2>
                          <p className="text-[10px] text-[#7a7a9a] font-light leading-relaxed mb-2">
                            Mediation is active. Resolve the dispute by
                            selecting a fund release action. This freezes the
                            chat and unlocks payouts.
                          </p>
                        </div>

                        {/* Action Dropdown */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                            Resolution Action
                          </label>
                          <select
                            value={resolveAction}
                            onChange={(e) =>
                              setResolveAction(
                                e.target.value as
                                  | "release_to_creator"
                                  | "refund_to_brand"
                                  | "split",
                              )
                            }
                            className="border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e] w-full"
                          >
                            <option value="release_to_creator">
                              Release Escrow to Creator
                            </option>
                            <option value="refund_to_brand">
                              Refund Escrow to Brand
                            </option>
                            <option value="split">Split Escrow Funds</option>
                          </select>
                        </div>

                        {/* Split Amount Field (Conditional) */}
                        {resolveAction === "split" && (
                          <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                              Split Creator Amount (₦)
                            </label>
                            <input
                              type="number"
                              placeholder="Enter amount to release to the Creator..."
                              value={splitAmount}
                              onChange={(e) => setSplitAmount(e.target.value)}
                              required
                              className="border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e] w-full"
                            />
                          </div>
                        )}

                        {/* Resolution Notes */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                            Resolution Summary Notes
                          </label>
                          <textarea
                            placeholder="Provide the decision reasoning and summary for both parties..."
                            value={resolveNotes}
                            onChange={(e) => setResolveNotes(e.target.value)}
                            required
                            rows={3}
                            className="border border-[#e8e6f0] focus:border-brand-pink rounded-2xl px-4 py-3 text-xs outline-none bg-white text-[#1a1a2e] w-full resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={resolveMutation.isPending}
                          className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                        >
                          <Check size={16} />
                          {resolveMutation.isPending
                            ? "Resolving Dispute..."
                            : "Submit Resolution"}
                        </button>
                      </form>
                    )}

                    {dispute.status === "resolved" && (
                      <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex gap-3 text-left w-full">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1 text-[11px] text-[#15803d]">
                          <span className="font-bold">Dispute Resolved</span>
                          <span className="leading-relaxed font-light">
                            This case is fully settled and closed. Escrow funds
                            have been split/released according to the decision
                            decision.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Column (Live Chat mediation timeline for Admin) */}
        {dispute && dispute.status === "under_review" && (
          <div className="flex-1 bg-white border border-[#e8e6f0]/60 shadow-xl rounded-[32px] p-8 flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e8e6f0]/60 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center text-brand-pink shrink-0">
                <Activity size={20} />
              </div>
              <div className="flex flex-col text-left">
                <h2 className="text-sm font-bold">Mediation Chat Timeline</h2>
                <p className="text-[10px] font-light text-[#7a7a9a]">
                  Exchanging live messages with{" "}
                  {getBrandName(dispute.campaignId)} and Creator
                </p>
              </div>
            </div>

            {/* Chat Renderer */}
            {renderAdminChat()}
          </div>
        )}
      </div>
    </div>
  );
}
