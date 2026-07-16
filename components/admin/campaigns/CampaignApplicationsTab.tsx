"use client";

import { ArrowRight } from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";

export default function CampaignApplicationsTab() {
  const apps = [
    {
      name: "Adaeze Obi",
      handle: "@adaeze_eats",
      rating: "4.9",
      pitch:
        "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
      initials: "AO",
      price: null,
    },
    {
      name: "Chisom Nwosu",
      handle: "@chisom.ng",
      rating: "4.9",
      pitch:
        "A 'day in my Ramadan' vlog that features KFC as the iftar meal of choice — authentic, personal, low-key.",
      initials: "CN",
      price: null,
    },
    {
      name: "Emeka Chukwu",
      handle: "@chef_emeka",
      rating: "4.9",
      pitch:
        "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
      initials: "EC",
      price: "₦120,000",
    },
    {
      name: "Fatima Garba",
      handle: "@fatima.foods",
      rating: "4.9",
      pitch:
        "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
      initials: "FG",
      price: "₦120,000",
    },
  ];

  return (
    <div className="flex flex-col gap-4 text-left">
      <h3 className="text-[11px] font-semibold text-[#9a99b0]">
        47 total applications &bull; Admin view only
      </h3>

      <div className="flex flex-col gap-4">
        {apps.map((app, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5.5 flex flex-col md:flex-row justify-between gap-4.5 items-start md:items-center"
          >
            <div className="flex gap-4 items-start flex-1 min-w-0">
              <UserAvatar initials={app.initials} size={40} />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    {app.name}
                  </span>
                  <span className="text-[10px] text-[#9a99b0] font-medium">
                    {app.handle}
                  </span>
                  <span className="text-[10px] font-bold text-[#f59e0b] flex items-center gap-0.5 ml-1">
                    ★ {app.rating}
                  </span>
                </div>
                <p className="text-xs text-[#5a5a7a] font-medium leading-relaxed mt-1.5">
                  {app.pitch}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]">
                    Micro
                  </span>
                  <span className="text-[10px] font-bold text-[#5a5a7a]">
                    180K{" "}
                    <span className="text-[#9a99b0] font-medium">
                      followers
                    </span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9a99b0] shrink-0" />
                  <span className="text-[10px] font-bold text-[#5a5a7a]">
                    5.2%{" "}
                    <span className="text-[#9a99b0] font-medium">
                      engagement
                    </span>
                  </span>
                  {app.price && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9a99b0] shrink-0" />
                      <span className="text-[10px] font-bold text-[#1a1a2e]">
                        {app.price}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button className="h-9 px-4.5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] shrink-0 transition-colors cursor-pointer flex items-center gap-1.5">
              View application <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
