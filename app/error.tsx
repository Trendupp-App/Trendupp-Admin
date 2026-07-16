"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Admin App Exception:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf9fc] p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fee2e2] mb-4">
        <AlertCircle className="text-[#dc2626]" size={24} />
      </div>
      <h2 className="text-base font-bold text-[#1a1a2e]">
        Something went wrong!
      </h2>
      <p className="text-xs text-[#9a99b0] max-w-sm mt-1 mb-4 leading-relaxed">
        An unexpected administrative portal error occurred. The details have
        been logged.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
