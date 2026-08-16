"use client";

import { useState, useRef, useEffect } from "react";
import { Dispute, ResolveDisputePayload } from "@/types/dispute";
import {
  X,
  Send,
  Paperclip,
  CheckCircle,
  ExternalLink,
  Settings2,
} from "lucide-react";
import EscrowConfirmModal, { EscrowActionType } from "./EscrowConfirmModal";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useUpdateDisputeNotes } from "@/hooks/useDisputes";
import { useUserById } from "@/hooks/useUsers";
import { useSubmissions } from "@/hooks/useCampaign";
import { Portal } from "@/components/ui/portal";

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
}

interface DisputeDetailViewProps {
  dispute: Dispute;
  onClose: () => void;
  _activeChannel?: ChatChannel | null;
  messages: StreamMessage[];
  isChannelLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onResolve: (payload: ResolveDisputePayload) => void;
  isResolving?: boolean;
}

export type CenterTab = "chat" | "evidence" | "timeline";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  raised: {
    label: "Raised",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  under_review: {
    label: "Open",
    className: "bg-rose-50 text-rose-600 border-rose-200",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const getContentLink = (submission: {
  draftLink: string | null;
  liveLink: Record<string, string | { url: string }> | null;
}) => {
  if (submission.liveLink) {
    const urls = Object.values(submission.liveLink)
      .map((entry) => (typeof entry === "string" ? entry : entry?.url))
      .filter((url): url is string => Boolean(url));
    if (urls.length) return urls[0];
  }
  return submission.draftLink ?? "";
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

export default function DisputeDetailView({
  dispute,
  onClose,
  messages,
  onSendMessage,
  onResolve,
  isResolving = false,
}: DisputeDetailViewProps) {
  const { user } = useAuthStore();
  const [centerTab, setCenterTab] = useState<CenterTab>("chat");
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: brandUser } = useUserById(dispute.brandId);
  const { data: creatorUser } = useUserById(dispute.creatorId);
  const { data: submissions } = useSubmissions(dispute.campaignId);
  const creatorSubmission = submissions?.find(
    (s) => s.creatorId === dispute.creatorId,
  );

  // Admin notes state
  const [adminNotes, setAdminNotes] = useState(dispute.notes || "");
  const updateNotesMutation = useUpdateDisputeNotes();
  // Escrow modal state
  const [escrowAction, setEscrowAction] = useState<EscrowActionType | null>(
    null,
  );
  // Resolution summary drawer state
  const [showResolutionSummary, setShowResolutionSummary] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  // Admin controls drawer (notes + escrow), toggled so chat can use full width
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const campaign = dispute.campaign;
  const brandName =
    `${brandUser?.firstName ?? ""} ${brandUser?.lastName ?? ""}`.trim() ||
    "Brand";
  const creatorName =
    `${creatorUser?.firstName ?? ""} ${creatorUser?.lastName ?? ""}`.trim() ||
    "Creator";
  const campaignTitle = campaign?.title || "Campaign";
  const currencySymbol = campaign?.currency === "USD" ? "$" : "₦";
  const budgetAmount =
    campaign?.paymentBreakdown?.totalToPay ?? campaign?.totalBudget;
  const budget = budgetAmount
    ? `${currencySymbol}${budgetAmount.toLocaleString()}`
    : "—";
  const statusBadge = STATUS_BADGE[dispute.status] ?? {
    label: dispute.status,
    className: "bg-[#f4f3f6] text-[#5a5a7a] border-[#e8e6f0]",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(inputText.trim());
      setInputText("");
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleConfirmEscrowAction = () => {
    if (!escrowAction) return;
    onResolve({
      action: escrowAction,
      resolutionNotes:
        resolutionNotes || `Escrow action executed: ${escrowAction}`,
    });
    setEscrowAction(null);
  };

  const handleConfirmResolve = () => {
    onResolve({
      action: dispute.escrowAction || "release_to_creator",
      resolutionNotes: resolutionNotes || "Dispute resolved by admin.",
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e6f0]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] hover:bg-[#ebe9f1] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#1a1a2e]">
                Dispute #{dispute.id.slice(0, 8).toUpperCase()}
              </h2>
            </div>
            <span className="text-xs text-[#7a7a9a] font-medium">
              {campaignTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdminPanel(true)}
            title="Admin Notes & Escrow Controls"
            className="w-9 h-9 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] hover:bg-[#ebe9f1] transition-colors cursor-pointer"
          >
            <Settings2 size={15} />
          </button>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
          {dispute.status !== "resolved" && (
            <button
              onClick={() => {
                setShowResolutionSummary(true);
                setShowAdminPanel(true);
              }}
              className="flex items-center gap-1.5 h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <CheckCircle size={14} /> Mark Resolved
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Case Overview & Metadata (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Case Overview */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              CASE OVERVIEW
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#7a7a9a] font-medium">Dispute ID</span>
                <span className="font-bold text-[#1a1a2e]">
                  #{dispute.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7a7a9a] font-medium">Submitted</span>
                <span className="font-semibold text-[#1a1a2e]">
                  {formatDate(dispute.createdAt)}
                </span>
              </div>
              {dispute.activatedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-[#7a7a9a] font-medium">Activated</span>
                  <span className="font-semibold text-[#1a1a2e]">
                    {formatDate(dispute.activatedAt)}
                  </span>
                </div>
              )}
              {dispute.resolvedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-[#7a7a9a] font-medium">Resolved</span>
                  <span className="font-semibold text-[#1a1a2e]">
                    {formatDate(dispute.resolvedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Parties */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              PARTIES
            </h4>
            {/* Brand Card */}
            <div className="bg-[#f8f7fa] border border-[#e8e6f0]/80 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pink text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {brandName.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  {brandName}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-medium">
                  Brand
                </span>
              </div>
            </div>

            {/* Creator Card */}
            <div className="bg-[#f8f7fa] border border-[#e8e6f0]/80 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {creatorName.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  {creatorName}
                </span>
                <span className="text-[10px] text-[#9a99b0] font-medium">
                  Creator
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Overview */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              CAMPAIGN
            </h4>
            <div className="bg-[#f8f7fa] border border-[#e8e6f0]/80 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-xs font-bold text-[#1a1a2e]">
                {campaignTitle}
              </span>
              <span className="text-[11px] text-[#7a7a9a] font-semibold">
                {budget} budget
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: Sub-tabs & Main View Area (9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Sub-tabs Header */}
          <div className="flex items-center gap-3 border-b border-[#e8e6f0] pb-2">
            <button
              onClick={() => setCenterTab("chat")}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                centerTab === "chat"
                  ? "bg-emerald-600 text-white"
                  : "text-[#5a5a7a] hover:bg-[#f4f3f6]"
              }`}
            >
              Chat Thread
            </button>
            <button
              onClick={() => setCenterTab("evidence")}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                centerTab === "evidence"
                  ? "bg-[#c0185c] text-white"
                  : "text-[#5a5a7a] hover:bg-[#f4f3f6]"
              }`}
            >
              Evidence
            </button>
            <button
              onClick={() => setCenterTab("timeline")}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                centerTab === "timeline"
                  ? "bg-[#c0185c] text-white"
                  : "text-[#5a5a7a] hover:bg-[#f4f3f6]"
              }`}
            >
              Timeline
            </button>
          </div>

          {/* Sub-tab 1: Chat Thread */}
          {centerTab === "chat" && (
            <div className="flex flex-col gap-4 bg-gradient-to-b from-emerald-50/50 to-[#f8f7fa] border border-emerald-100 rounded-3xl p-4 min-h-112.5 justify-between">
              {/* Message List */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-95 pr-2">
                {/* System Banner */}
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-3 text-center text-[11px] font-medium max-w-md mx-auto">
                  {dispute.activatedAt
                    ? `This chat was activated on ${formatDate(dispute.activatedAt)}. All messages are recorded and monitored.`
                    : "All messages in this chat are recorded and monitored."}
                </div>

                {messages.length === 0 ? (
                  <p className="text-center text-[11px] text-[#9a99b0] font-medium py-6">
                    No messages yet in this dispute chat.
                  </p>
                ) : (
                  messages.map((msg) => {
                    const userId = msg.user?.id;
                    const userName = msg.user?.name || "User";
                    const userNameLower = userName.toLowerCase();

                    const isAdmin =
                      userId === user?.id ||
                      userNameLower.includes("admin") ||
                      userNameLower.includes("trendupp");
                    const isBrand =
                      userId === dispute.brandId ||
                      userNameLower.includes("brand") ||
                      (brandName &&
                        userNameLower.includes(brandName.toLowerCase()));

                    if (isAdmin) {
                      return (
                        <div
                          key={msg.id}
                          className="flex gap-2 items-start justify-end"
                        >
                          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-tr-sm p-3 text-xs max-w-[70%] flex flex-col gap-1 shadow-sm shadow-emerald-500/20">
                            <p>{msg.text}</p>
                            <span className="text-[9px] text-emerald-50/80">
                              {userName} · Admin (mediator)
                            </span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {userName.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                      );
                    }

                    if (isBrand) {
                      return (
                        <div key={msg.id} className="flex gap-2 items-start">
                          <div className="w-7 h-7 rounded-full bg-brand-pink text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="bg-white border border-[#e8e6f0] text-[#1a1a2e] rounded-2xl rounded-tl-sm p-3 text-xs max-w-[70%] flex flex-col gap-1 shadow-sm">
                            <p>{msg.text}</p>
                            <span className="text-[9px] text-[#9a99b0]">
                              {userName} · Brand
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {userName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="bg-white border border-[#e8e6f0] text-[#1a1a2e] rounded-2xl rounded-tl-sm p-3 text-xs max-w-[70%] flex flex-col gap-1 shadow-sm">
                          <p>{msg.text}</p>
                          <span className="text-[9px] text-[#9a99b0]">
                            {userName} · Creator
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="flex flex-col gap-2 bg-white rounded-2xl p-3 border border-emerald-100 shadow-sm focus-within:ring-1 focus-within:ring-emerald-400/40 transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    placeholder="Send a message as Admin…"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none resize-none bg-transparent"
                  />
                  <button
                    type="button"
                    className="p-2 text-[#9a99b0] hover:text-emerald-600 transition-colors"
                  >
                    <Paperclip size={16} />
                  </button>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shrink-0 shadow-sm shadow-emerald-500/30"
                  >
                    <Send size={14} />
                  </button>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold">
                  ⚠️ Your messages are visible to both Brand and Creator. All
                  messages are logged.
                </span>
              </form>
            </div>
          )}

          {/* Sub-tab 2: Evidence */}
          {centerTab === "evidence" && (
            <div className="flex flex-col gap-4">
              {/* Original Campaign Brief */}
              <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Original Campaign Brief
                </span>
                <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium">
                  {campaign?.campaignBrief || "No campaign brief provided."}
                </p>
              </div>

              {/* Creator's Submitted Content */}
              <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Creator&apos;s Submitted Content
                </span>
                {creatorSubmission ? (
                  (() => {
                    const link = getContentLink(creatorSubmission);
                    return link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c0185c] text-brand-pink rounded-xl text-xs font-bold hover:bg-brand-pink/5 transition-colors w-fit"
                      >
                        View Content <ExternalLink size={12} />
                      </a>
                    ) : (
                      <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium">
                        Creator has a submission on file but no link was
                        provided.
                      </p>
                    );
                  })()
                ) : (
                  <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium">
                    No submission found for this creator on this campaign.
                  </p>
                )}
              </div>

              {/* Dispute reason */}
              <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Dispute Reason
                </span>
                <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium whitespace-pre-line">
                  {dispute.reason || "No reason provided."}
                </p>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Timeline */}
          {centerTab === "timeline" && (
            <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-3xl p-6 flex flex-col gap-6">
              {[
                {
                  title: "Dispute raised",
                  subtitle: formatDate(dispute.createdAt),
                  show: true,
                },
                {
                  title: "Chat activated",
                  subtitle: [
                    dispute.activatedBy &&
                      `${dispute.activatedBy.firstName} ${dispute.activatedBy.lastName}`.trim(),
                    formatDate(dispute.activatedAt),
                  ]
                    .filter(Boolean)
                    .join(" · "),
                  show: !!dispute.activatedAt,
                },
                {
                  title: "Dispute resolved",
                  subtitle: [
                    dispute.resolvedBy &&
                      `${dispute.resolvedBy.firstName} ${dispute.resolvedBy.lastName}`.trim(),
                    formatDate(dispute.resolvedAt),
                  ]
                    .filter(Boolean)
                    .join(" · "),
                  show: !!dispute.resolvedAt,
                },
              ]
                .filter((item) => item.show)
                .map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-pink bg-white shrink-0 mt-0.5 z-10" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a2e]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#9a99b0] font-medium">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                ))}
              {dispute.resolutionNotes && (
                <div className="bg-white border border-[#e8e6f0] rounded-2xl p-3 text-xs text-[#5a5a7a] font-medium leading-relaxed">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider block mb-1">
                    Resolution Notes
                  </span>
                  {dispute.resolutionNotes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Admin Notes & Escrow Controls Drawer */}
      {showAdminPanel && (
        <Portal>
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowAdminPanel(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Admin controls"
              className="relative z-10 w-full max-w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-fade-in"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#e8e6f0] shrink-0">
                <h3 className="text-sm font-extrabold text-[#1a1a2e]">
                  Admin Controls
                </h3>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="w-8 h-8 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#5a5a7a] hover:bg-[#ebe9f1] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-6 text-left">
                {/* Admin Notes */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    ADMIN NOTES
                  </h4>
                  <textarea
                    rows={4}
                    placeholder="Internal notes (not visible to parties)…"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-3 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 resize-none font-medium"
                  />
                  <button
                    onClick={() => {
                      if (!adminNotes.trim()) return;
                      updateNotesMutation.mutate({
                        id: dispute.id,
                        notes: adminNotes.trim(),
                      });
                    }}
                    disabled={updateNotesMutation.isPending}
                    className="h-8 px-4 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-xs font-bold rounded-xl transition-all cursor-pointer w-fit disabled:opacity-50"
                  >
                    {updateNotesMutation.isPending ? "Saving..." : "Save Note"}
                  </button>
                </div>

                {/* Escrow Controls */}
                {dispute.status === "resolved" ? (
                  <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-3xl p-4 flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      RESOLUTION
                    </h4>
                    <span className="text-xs font-bold text-[#1a1a2e]">
                      {dispute.escrowAction
                        ? dispute.escrowAction.replace(/_/g, " ")
                        : "Resolved"}
                    </span>
                    {dispute.resolutionNotes && (
                      <p className="text-[11px] text-[#7a7a9a] leading-relaxed">
                        {dispute.resolutionNotes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-3xl p-4 flex flex-col gap-3">
                    <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      ESCROW CONTROLS
                    </h4>
                    <span className="text-xs font-bold text-[#1a1a2e]">
                      {budget} held
                    </span>

                    <button
                      onClick={() => setEscrowAction("release_to_creator")}
                      className="h-9 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Release to Creator
                    </button>

                    <button
                      onClick={() => setEscrowAction("refund_to_brand")}
                      className="h-9 w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Return to Brand
                    </button>

                    <button
                      onClick={() => setEscrowAction("split")}
                      className="h-9 w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      50/50 Split Escrow
                    </button>

                    <button
                      onClick={() =>
                        setEscrowAction("allow_content_submission")
                      }
                      className="h-8 w-full bg-white hover:bg-[#ebe9f1] text-[#5a5a7a] text-[11px] font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
                    >
                      Allow content submission
                    </button>

                    <button
                      onClick={() => setEscrowAction("allow_content_review")}
                      className="h-8 w-full bg-white hover:bg-[#ebe9f1] text-[#5a5a7a] text-[11px] font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
                    >
                      Allow content review
                    </button>

                    <button
                      onClick={() =>
                        setEscrowAction("allow_revised_submission")
                      }
                      className="h-8 w-full bg-white hover:bg-[#ebe9f1] text-[#5a5a7a] text-[11px] font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
                    >
                      Allow revised submission
                    </button>

                    <button
                      onClick={() => setEscrowAction("allow_revised_review")}
                      className="h-8 w-full bg-white hover:bg-[#ebe9f1] text-[#5a5a7a] text-[11px] font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
                    >
                      Allow revised review
                    </button>
                  </div>
                )}

                {/* Resolution Summary */}
                {showResolutionSummary && (
                  <div className="bg-white border border-[#c0185c] rounded-3xl p-4 flex flex-col gap-3 shadow-md animate-fade-in">
                    <h4 className="text-xs font-bold text-[#1a1a2e]">
                      Resolution Summary
                    </h4>
                    <textarea
                      rows={3}
                      placeholder="Resolution notes (sent to both parties)…"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full bg-[#f8f7fa] border border-[#e8e6f0] rounded-xl p-2.5 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 resize-none font-medium"
                    />
                    <button
                      onClick={handleConfirmResolve}
                      disabled={isResolving}
                      className="h-9 w-full bg-[#c0185c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isResolving ? "Resolving…" : "Confirm & Close Dispute"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Escrow Action Confirmation Modal */}
      <EscrowConfirmModal
        isOpen={!!escrowAction}
        onClose={() => setEscrowAction(null)}
        onConfirm={handleConfirmEscrowAction}
        actionType={escrowAction}
        isLoading={isResolving}
      />
    </div>
  );
}
