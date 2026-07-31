"use client";

import { ShieldOff } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center shadow-sm">
        <ShieldOff size={28} className="text-rose-400" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-[#1a1a2e]">
          Access Restricted
        </h2>
        <p className="text-xs text-[#9a99b0] font-medium max-w-xs leading-relaxed">
          You don&apos;t have permission to view this page. Contact your
          administrator if you think this is a mistake.
        </p>
      </div>
    </div>
  );
}
