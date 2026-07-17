"use client";

import { useState, useEffect } from "react";
import {
  X,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Play,
  Star,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  Ban,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "../AdminStatusBadge";
import BrandActionModal from "./BrandActionModal";
import SuccessModal from "../creators/SuccessModal";
import { Portal } from "@/components/ui/portal";

interface BrandProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string | null;
}

type TabType = "Overview" | "Campaign History" | "Notes" | "Actions";

const PepsiLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-18 h-18 rounded-full overflow-hidden shadow-sm shrink-0"
  >
    <path
      d="M 50,5 A 45,45 0 0 1 95,50 C 95,50 80,35 50,45 C 20,55 5,50 5,50 A 45,45 0 0 1 50,5 Z"
      fill="#E31837"
    />
    <path
      d="M 50,95 A 45,45 0 0 1 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 A 45,45 0 0 1 50,95 Z"
      fill="#004B87"
    />
    <path
      d="M 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 C 95,50 78,28 50,38 C 22,48 5,50 5,50 Z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function BrandProfileDrawer({
  isOpen,
  onClose,
  brandId,
}: BrandProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [activeAction, setActiveAction] = useState<
    "suspend" | "reactivate" | "delete" | null
  >(null);

  /* Note state */
  const [notes, setNotes] = useState([
    {
      id: 1,
      author: "Admin Segun",
      date: "Jul 12, 2024",
      text: "Brand requested rate review — escalated to finance team.",
    },
    {
      id: 2,
      author: "Admin Amina",
      date: "Jun 5, 2024",
      text: "Verified business registration documents.",
    },
  ]);
  const [isWritingNote, setIsWritingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  /* Success states */
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !brandId) return null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    if (editingNoteId) {
      setNotes(
        notes.map((n) =>
          n.id === editingNoteId ? { ...n, text: noteText } : n,
        ),
      );
      setEditingNoteId(null);
    } else {
      setNotes([
        {
          id: Date.now(),
          author: "Super Admin",
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          text: noteText,
        },
        ...notes,
      ]);
    }
    setNoteText("");
    setIsWritingNote(false);
  };

  const startEditNote = (id: number, text: string) => {
    setEditingNoteId(id);
    setNoteText(text);
    setIsWritingNote(true);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="w-full max-w-[620px] h-full bg-white relative z-10 flex flex-col shadow-2xl overflow-y-auto">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-[#e8e6f0]/60 px-6 py-4 shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-semibold text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <span className="text-sm font-bold text-[#1a1a2e]">
              Brand Profile
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#5a5a7a] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Brand Summary info */}
          <div className="flex flex-col items-center justify-center py-7 border-b border-[#e8e6f0]/40 shrink-0">
            <PepsiLogo />
            <h3 className="text-base font-bold text-[#1a1a2e] mt-3">
              Pepsi Nigeria
            </h3>
            <span className="text-xs text-[#9a99b0]">pepsi.com.ng</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#faf9fc] text-[#7a7a9a] border border-[#e8e6f0]">
                FMCG
              </span>
              <AdminStatusBadge status="active" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#e8e6f0]/40 px-6 overflow-x-auto shrink-0 scrollbar-none">
            {(
              ["Overview", "Campaign History", "Notes", "Actions"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  activeTab === tab
                    ? "border-brand-pink text-brand-pink"
                    : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col gap-5 p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && (
              <>
                {/* Brand details box */}
                <div className="bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 text-left">
                  <h3 className="text-xs font-bold text-[#1a1a2e]">
                    Brand Details
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                    {[
                      { label: "Brand name", val: "Pepsi Company" },
                      { label: "Email", val: "pepsi@email.com" },
                      { label: "Website", val: "www.pepsi.com.ng" },
                      {
                        label: "Bio",
                        val: "A brand committed to refreshing moments and inspiring connections through bold, modern flavors.",
                        fullWidth: true,
                      },
                      { label: "Country", val: "Nigeria" },
                      { label: "State/City", val: "Lagos/Ikeja" },
                      { label: "Monthly Budget", val: "₦4.7M" },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex flex-col gap-1",
                          row.fullWidth ? "col-span-2" : "",
                        )}
                      >
                        <span className="text-[10px] font-semibold text-[#9a99b0]">
                          {row.label}
                        </span>
                        <span className="font-semibold text-[#1a1a2e] leading-relaxed">
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#e8e6f0]/40 pt-4.5">
                    <h3 className="text-xs font-bold text-[#1a1a2e] mb-3.5">
                      Brand Representative
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                      {[
                        { label: "Full name", val: "Chisom Mary" },
                        { label: "Email", val: "amara@email.com" },
                        { label: "Phone Number", val: "+2348077238262" },
                        { label: "Profile Completion", val: "100%" },
                        { label: "Date Joined", val: "Jan 15, 2026" },
                        {
                          label: "Account Status",
                          val: (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a]">
                              Active
                            </span>
                          ),
                        },
                      ].map((row, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-[#9a99b0]">
                            {row.label}
                          </span>
                          <span className="font-semibold text-[#1a1a2e]">
                            {row.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics cards row */}
                <div>
                  <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider mb-3 text-left">
                    Metrics
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Total Campaigns",
                        val: "14",
                        icon: Briefcase,
                        bg: "bg-[#edf2fe] text-[#2f63eb]",
                      },
                      {
                        label: "Total Spend",
                        val: "₦28M",
                        icon: TrendingUp,
                        bg: "bg-[#fdf2f6] text-[#d7176f]",
                      },
                      {
                        label: "Active Campaigns",
                        val: "3",
                        icon: Play,
                        bg: "bg-[#f0fdf4] text-[#16a34a]",
                      },
                      {
                        label: "Avg Creator Rating",
                        val: "4.7 / 5",
                        icon: Star,
                        bg: "bg-[#fff7ed] text-[#ea580c]",
                      },
                    ].map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={i}
                          className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-3.5 flex flex-col gap-3 items-start text-left"
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                              m.bg,
                            )}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-medium text-[#9a99b0]">
                              {m.label}
                            </span>
                            <span className="text-xs font-bold text-[#1a1a2e]">
                              {m.val}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* CAMPAIGN HISTORY TAB */}
            {activeTab === "Campaign History" && (
              <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 text-left">
                <h3 className="text-xs font-bold text-[#1a1a2e]">
                  Campaign History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                        <th className="pb-3 pl-1">Campaign Name</th>
                        <th className="pb-3">Creators</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3 text-right pr-1">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
                      {[
                        {
                          name: "Summer Glow",
                          creator: "Chisom mary",
                          status: (
                            <span className="px-2 py-0.5 rounded bg-[#f4f3f6] text-[#7a7a9a] text-[10px] font-bold">
                              Completed
                            </span>
                          ),
                          budget: "₦150K",
                          date: "Jan 20, 2026",
                        },
                        {
                          name: "Summer Glow",
                          creator: "Chisom mary",
                          status: (
                            <span className="px-2 py-0.5 rounded bg-[#f4f3f6] text-[#7a7a9a] text-[10px] font-bold">
                              Completed
                            </span>
                          ),
                          budget: "₦150K",
                          date: "Jan 20, 2026",
                        },
                        {
                          name: "Summer Glow",
                          creator: "Chisom mary",
                          status: (
                            <span className="px-2 py-0.5 rounded bg-[#f0fdf4] text-[#16a34a] text-[10px] font-bold">
                              Active
                            </span>
                          ),
                          budget: "₦150K",
                          date: "Jan 20, 2026",
                        },
                        {
                          name: "Summer Glow",
                          creator: "—",
                          status: (
                            <span className="px-2 py-0.5 rounded bg-[#eff6ff] text-[#2f63eb] text-[10px] font-bold">
                              Draft
                            </span>
                          ),
                          budget: "₦150K",
                          date: "Jan 20, 2026",
                        },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="py-3 pl-1 font-bold text-[#1a1a2e]">
                            {row.name}
                          </td>
                          <td className="py-3 text-[#5a5a7a]">{row.creator}</td>
                          <td className="py-3">{row.status}</td>
                          <td className="py-3 text-[#5a5a7a]">{row.budget}</td>
                          <td className="py-3 text-right pr-1 text-[#9a99b0]">
                            {row.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === "Notes" && (
              <div className="flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#5a5a7a] uppercase tracking-wider">
                    Admin Notes
                  </h3>
                  {!isWritingNote && (
                    <button
                      onClick={() => {
                        setIsWritingNote(true);
                        setEditingNoteId(null);
                        setNoteText("");
                      }}
                      className="h-8 px-3 rounded-lg bg-brand-pink text-white text-[10px] font-bold cursor-pointer hover:opacity-90 flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Note
                    </button>
                  )}
                </div>

                {/* Note text editor inline */}
                {isWritingNote && (
                  <form
                    onSubmit={handleSaveNote}
                    className="bg-white border border-[#e8e6f0] rounded-2xl p-4.5 flex flex-col gap-3"
                  >
                    <textarea
                      required
                      placeholder="Write your internal note here..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full h-24 border border-[#e8e6f0] rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 resize-none font-medium placeholder-[#b0aec8]"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="h-8 px-4 bg-brand-pink text-white text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        Save Note
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWritingNote(false)}
                        className="text-[10px] font-bold text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Notes list */}
                <div className="flex flex-col gap-3">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4.5 flex flex-col gap-2.5"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-[#1a1a2e]">
                            {n.author}
                          </span>
                          <span className="text-[#9a99b0]">{n.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#9a99b0]">
                          <button
                            onClick={() => startEditNote(n.id, n.text)}
                            className="p-1 hover:bg-[#f4f3f6] rounded-md transition-colors cursor-pointer hover:text-[#1a1a2e]"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            onClick={() => deleteNote(n.id)}
                            className="p-1 hover:bg-[#fecaca]/30 rounded-md transition-colors cursor-pointer hover:text-[#dc2626]"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#5a5a7a] leading-relaxed">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS TAB */}
            {activeTab === "Actions" && (
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs font-semibold">
                  <AlertTriangle
                    size={14}
                    className="shrink-0 text-[#f59e0b]"
                  />
                  Actions require confirmation and are recorded in the audit
                  log.
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      label: "Suspend Account",
                      desc: "Temporarily restrict creator access to the platform.",
                      action: "suspend" as const,
                      bg: "bg-[#fffbeb] border-[#fde68a] text-[#ea580c]",
                      iconBg: "bg-[#fff7ed]",
                    },
                    {
                      label: "Reactivate Account",
                      desc: "Restore full platform access for a previously suspended brand account.",
                      action: "reactivate" as const,
                      bg: "bg-white border-[#e8e6f0] text-[#16a34a]",
                      iconBg: "bg-[#f0fdf4]",
                    },
                    {
                      label: "Delete Account",
                      desc: "Permanently remove brand account. This cannot be undone.",
                      action: "delete" as const,
                      bg: "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]",
                      iconBg: "bg-[#fee2e2]",
                    },
                  ].map((a, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveAction(a.action)}
                      className={cn(
                        "flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl border transition-all hover:brightness-95 cursor-pointer",
                        a.bg,
                      )}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                          a.iconBg,
                        )}
                      >
                        {a.action === "suspend" ? (
                          <Ban size={16} />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold">{a.label}</span>
                        <span className="text-[11px] text-[#9a99b0] leading-relaxed">
                          {a.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand Actions Modal */}
        {activeAction && (
          <BrandActionModal
            action={activeAction}
            onClose={() => setActiveAction(null)}
            onConfirm={() => {
              if (activeAction === "suspend") {
                setSuccessTitle("Account Suspended");
                setSuccessMsg(
                  "You have successfully suspended this brand account",
                );
              } else if (activeAction === "reactivate") {
                setSuccessTitle("Account Reactivated");
                setSuccessMsg(
                  "You have successfully reactivated this brand account",
                );
              } else {
                setSuccessTitle("Account Deleted");
                setSuccessMsg(
                  "You have successfully deleted this brand account",
                );
              }
              setIsSuccessOpen(true);
            }}
          />
        )}

        {/* Success Modal */}
        {isSuccessOpen && (
          <SuccessModal
            isOpen={isSuccessOpen}
            onClose={() => setIsSuccessOpen(false)}
            title={successTitle}
            message={successMsg}
          />
        )}
      </div>
    </Portal>
  );
}
