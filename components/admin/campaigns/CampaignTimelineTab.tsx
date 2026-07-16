"use client";

import { cn } from "@/lib/utils";

export default function CampaignTimelineTab() {
  const events = [
    {
      role: "Brand",
      time: "Jun 1, 2026 - 10:00 AM",
      text: "Campaign created — Summer Style Collection 2025",
      color: "bg-brand-pink",
    },
    {
      role: "System",
      time: "Jun 1, 2026 - 10:02 AM",
      text: "Campaign submitted for admin review",
      color: "bg-[#7a7a9a]",
    },
    {
      role: "Admin",
      time: "Jun 1, 2026 - 11:30 AM",
      text: "Campaign approved — Chisom Adeyemi",
      color: "bg-[#f59e0b]",
    },
    {
      role: "Brand",
      time: "Jun 1, 2026 - 2:15 PM",
      text: "Escrow funded — ₦3,712,500 secured",
      color: "bg-[#16a34a]",
    },
    {
      role: "System",
      time: "Jun 1, 2026 - 2:16 PM",
      text: "Campaign published — Applications opened (48hr window)",
      color: "bg-[#7a7a9a]",
    },
    {
      role: "Creator",
      time: "Jun 1, 2026 - 3:05 PM",
      text: "Amara Osei applied — fee: ₦120,000",
      color: "bg-brand-pink",
    },
    {
      role: "Creator",
      time: "Jun 1, 2026 - 4:22 PM",
      text: "Tolu Fashola applied — fee: ₦250,000",
      color: "bg-brand-pink",
    },
    {
      role: "System",
      time: "Jun 3, 2026 - 2:16 PM",
      text: "Applications closed automatically after 48hrs",
      color: "bg-[#7a7a9a]",
    },
    {
      role: "Brand",
      time: "Jun 3, 2026 - 4:00 PM",
      text: "Creator selection completed — 3 creators chosen",
      color: "bg-[#16a34a]",
    },
    {
      role: "System",
      time: "Jun 3, 2026 - 4:01 PM",
      text: "Other 44 applications automatically declined",
      color: "bg-[#7a7a9a]",
    },
    {
      role: "Creator",
      time: "Jun 4, 2026 - 8:30 AM",
      text: "Amara Osei accepted campaign",
      color: "bg-brand-pink",
    },
    {
      role: "Creator",
      time: "Jun 4, 2026 - 9:14 AM",
      text: "Amara Osei submitted content for review",
      color: "bg-brand-pink",
    },
  ];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-6 text-left">
      <h3 className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider border-b border-[#e8e6f0]/40 pb-3">
        ACTIVITY TIMELINE &mdash; ALL EVENTS ARE IMMUTABLE AND TIMESTAMPED
      </h3>

      <div className="relative pl-6 flex flex-col gap-6.5">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#e8e6f0]" />

        {events.map((ev, i) => (
          <div
            key={i}
            className="relative flex flex-col gap-1 items-start text-left"
          >
            <div
              className={cn(
                "absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-4 border-white shadow-sm ring-1 ring-[#e8e6f0]",
                ev.color,
              )}
            />

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                  ev.role === "Brand"
                    ? "bg-[#fff1f2] text-brand-pink"
                    : ev.role === "Admin"
                      ? "bg-[#fff7ed] text-[#ea580c]"
                      : ev.role === "Creator"
                        ? "bg-[#f5f3ff] text-[#7c3aed]"
                        : "bg-[#faf9fc] text-[#5a5a7a]",
                )}
              >
                {ev.role}
              </span>
              <span className="text-[10px] text-[#9a99b0] font-semibold">
                {ev.time}
              </span>
            </div>
            <p className="text-xs text-[#1a1a2e] font-bold mt-0.5">{ev.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
