"use client";

import { Megaphone, Users2, Award, ShieldCheck } from "lucide-react";

export default function SocialStats() {
  const stats = [
    {
      label: "Active Social Campaigns",
      val: "3",
      icon: Megaphone,
      color: "text-brand-pink bg-[#fff1f2] border-[#ffe4e6]",
    },
    {
      label: "Total Participants",
      val: "2,526",
      icon: Users2,
      color: "text-[#2563eb] bg-[#eff6ff] border-[#dbeafe]",
    },
    {
      label: "Tokens Distributed",
      val: "249,260",
      icon: Award,
      color: "text-[#ea580c] bg-[#fff7ed] border-[#ffedd5]",
    },
    {
      label: "Campaigns Completed",
      val: "1",
      icon: ShieldCheck,
      color: "text-[#16a34a] bg-[#f0fdf4] border-[#dcfce7]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3.5"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider leading-none">
              {s.label}
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${s.color}`}
            >
              <s.icon size={13} />
            </div>
          </div>
          <span className="text-2xl font-bold text-[#1a1a2e] leading-none">
            {s.val}
          </span>
        </div>
      ))}
    </div>
  );
}
