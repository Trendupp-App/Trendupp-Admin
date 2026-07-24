"use client";

import { useState, useRef, useEffect } from "react";
import { Dispute, ResolveDisputePayload } from "@/types/dispute";
import { Campaign } from "@/types/campaign";
import { X, Send, Paperclip, CheckCircle, ExternalLink } from "lucide-react";
import EscrowConfirmModal, { EscrowActionType } from "./EscrowConfirmModal";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useUpdateDisputeNotes } from "@/hooks/useDisputes";

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
  campaign: Campaign | null;
  onClose: () => void;
  _activeChannel?: ChatChannel | null;
  messages: StreamMessage[];
  isChannelLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onResolve: (payload: ResolveDisputePayload) => void;
  isResolving?: boolean;
}

export type CenterTab = "chat" | "evidence" | "timeline";

export default function DisputeDetailView({
  dispute,
  campaign,
  onClose,
  _activeChannel,
  messages,
  onSendMessage,
  onResolve,
  isResolving = false,
}: DisputeDetailViewProps) {
  const { user } = useAuthStore();
  const [centerTab, setCenterTab] = useState<CenterTab>("chat");
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const brandName = campaign?.brand
    ? `${campaign.brand.firstName} ${campaign.brand.lastName}`.trim()
    : "Konga";
  const creatorName = "Alex Okafor";
  const campaignTitle = campaign?.title || "Summer Style Collection 2025";
  const budget = campaign?.totalBudget
    ? `₦${campaign.totalBudget.toLocaleString()}`
    : "₦3,500,000";

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
      action: dispute.action || "release_to_creator",
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
                Dispute #TR-2205
              </h2>
            </div>
            <span className="text-xs text-[#7a7a9a] font-medium">
              {campaignTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            Open
          </span>
          <button
            onClick={() => setShowResolutionSummary(true)}
            className="flex items-center gap-1.5 h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <CheckCircle size={14} /> Mark Resolved
          </button>
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
                <span className="font-bold text-[#1a1a2e]">#TR-2205</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7a7a9a] font-medium">Escalation</span>
                <span className="font-bold text-amber-600">Level 1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7a7a9a] font-medium">Submitted</span>
                <span className="font-semibold text-[#1a1a2e]">
                  Jun 2, 2025
                </span>
              </div>
            </div>

            {/* Alert banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 font-bold leading-tight">
              Must resolve by Jun 7, 2025 (3 days remaining)
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
                  Creator · Micro
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

        {/* Center Column: Sub-tabs & Main View Area (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Sub-tabs Header */}
          <div className="flex items-center gap-3 border-b border-[#e8e6f0] pb-2">
            <button
              onClick={() => setCenterTab("chat")}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                centerTab === "chat"
                  ? "bg-[#c0185c] text-white"
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
            <div className="flex flex-col gap-4 bg-[#f8f7fa] border border-[#e8e6f0] rounded-3xl p-4 min-h-[450px] justify-between">
              {/* Message List */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[380px] pr-2">
                {/* System Banner */}
                <div className="bg-[#efedf3] text-[#5a5a7a] rounded-2xl p-3 text-center text-[11px] font-medium max-w-md mx-auto">
                  This chat was opened by Trendupp Admin on June 2, 2025. All
                  messages are recorded and monitored.
                </div>

                {/* Stream / Mock Messages */}
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-3">
                    {/* Default Mock Messages matching screenshot */}
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        TA
                      </div>
                      <div className="bg-purple-50 text-[#1a1a2e] rounded-2xl p-3 text-xs max-w-md flex flex-col gap-1">
                        <p>
                          Hi both. I&apos;ve reviewed the campaign brief and the
                          submitted content. Please use this space to resolve
                          the revision disagreement. You have 5 days. Keep
                          communication professional.
                        </p>
                        <span className="text-[9px] text-[#9a99b0]">
                          Admin · Trendupp
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start justify-end">
                      <div className="bg-[#f0eff4] text-[#1a1a2e] rounded-2xl p-3 text-xs max-w-md flex flex-col gap-1 text-right">
                        <p>
                          The content doesn&apos;t match our brief. The product
                          wasn&apos;t shown in the first 5 seconds as required.
                        </p>
                        <span className="text-[9px] text-[#9a99b0]">
                          Konga · Brand
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        AO
                      </div>
                      <div className="bg-rose-50 text-[#c0185c] rounded-2xl p-3 text-xs max-w-md flex flex-col gap-1">
                        <p>
                          The brief said &apos;as early as possible&apos; not
                          specifically 5 seconds. Here is my content link again:
                          drive.google.com/...
                        </p>
                        <span className="text-[9px] text-rose-400">
                          Alex Okafor · Creator
                        </span>
                      </div>
                    </div>
                  </div>
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
                        <div key={msg.id} className="flex gap-2 items-start">
                          <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            TA
                          </div>
                          <div className="bg-purple-50 text-[#1a1a2e] rounded-2xl p-3 text-xs max-w-md flex flex-col gap-1">
                            <p>{msg.text}</p>
                            <span className="text-[9px] text-[#9a99b0]">
                              {userName} · Admin
                            </span>
                          </div>
                        </div>
                      );
                    }

                    if (isBrand) {
                      return (
                        <div
                          key={msg.id}
                          className="flex gap-2 items-start justify-end"
                        >
                          <div className="bg-[#f0eff4] text-[#1a1a2e] rounded-2xl p-3 text-xs max-w-md flex flex-col gap-1 text-right">
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
                        <div className="bg-rose-50 text-[#c0185c] rounded-2xl p-3 text-xs max-w-md flex flex-col gap-1">
                          <p>{msg.text}</p>
                          <span className="text-[9px] text-rose-400">
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
                className="flex flex-col gap-2 bg-white rounded-2xl p-3 border border-[#e8e6f0] shadow-sm"
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
                    className="p-2 text-[#9a99b0] hover:text-[#1a1a2e] transition-colors"
                  >
                    <Paperclip size={16} />
                  </button>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="w-8 h-8 rounded-full bg-[#c0185c] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shrink-0"
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
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-800 font-medium">
                💡 Evidence extracted from dispute request payload. If a
                dedicated evidence files EP is available, provide the endpoint
                to bind full uploads.
              </div>

              {/* Original Campaign Brief */}
              <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Original Campaign Brief
                </span>
                <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium">
                  {campaign?.campaignBrief ||
                    "Campaign requires product to be shown 'as early as possible' in video content. Duration: 30-60 seconds. High energy presentation."}
                </p>
              </div>

              {/* Creator's Submitted Content */}
              <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Creator&apos;s Submitted Content
                </span>
                <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium">
                  Video submitted via Trendupp platform. Product shown at
                  8-second mark.
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Opening submitted content preview...");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c0185c] text-brand-pink rounded-xl text-xs font-bold hover:bg-brand-pink/5 transition-colors w-fit"
                >
                  View Content <ExternalLink size={12} />
                </a>
              </div>

              {/* Brand's Rejection Reason */}
              <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1a1a2e]">
                  Brand&apos;s Rejection Reason / Dispute Cause
                </span>
                <p className="text-xs text-[#7a7a9a] leading-relaxed font-medium">
                  {dispute.reason ||
                    "Product not shown in first 5 seconds. Does not meet our standard brief requirements."}
                </p>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Timeline */}
          {centerTab === "timeline" && (
            <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-3xl p-6 flex flex-col gap-6">
              {[
                { title: "Campaign created", subtitle: "Konga · May 15, 2025" },
                { title: "Escrow funded", subtitle: "Konga · May 18, 2025" },
                {
                  title: "Campaign approved by admin",
                  subtitle: "Admin · May 17, 2025",
                },
                {
                  title: "Creator selected",
                  subtitle: "Platform · May 20, 2025",
                },
                {
                  title: "Content submitted",
                  subtitle: "Alex Okafor · Jun 2, 2025",
                },
                {
                  title: "Brand rejected content",
                  subtitle: "Konga · Jun 2, 2025",
                },
                {
                  title: "Dispute raised by creator",
                  subtitle: "Alex Okafor · Jun 2, 2025",
                },
                {
                  title: "Chat activated by admin",
                  subtitle: "Admin · Jun 2, 2025",
                },
              ].map((item, idx) => (
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
            </div>
          )}
        </div>

        {/* Right Column: Admin Notes & Escrow Controls (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
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
          <div className="bg-[#f8f7fa] border border-[#e8e6f0] rounded-3xl p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              ESCROW CONTROLS
            </h4>
            <span className="text-xs font-bold text-[#1a1a2e]">
              ₦120,000 held
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
                toast.success(
                  "Permission granted: Allow live link resubmission",
                )
              }
              className="h-8 w-full bg-white hover:bg-[#ebe9f1] text-[#5a5a7a] text-[11px] font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
            >
              Allow live link resubmission
            </button>

            <button
              onClick={() =>
                toast.success(
                  "Permission granted: Allow revised content resubmission",
                )
              }
              className="h-8 w-full bg-white hover:bg-[#ebe9f1] text-[#5a5a7a] text-[11px] font-bold rounded-xl border border-[#e8e6f0] transition-all cursor-pointer"
            >
              Allow revised content resubmission
            </button>
          </div>

          {/* Resolution Summary Drawer */}
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
