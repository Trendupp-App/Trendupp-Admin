"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface InviteBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (brandName: string) => void;
}

export default function InviteBrandModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteBrandModalProps) {
  const [brandName, setBrandName] = useState("");
  const [repName, setRepName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !repName || !email || !industry) return;
    onSuccess(brandName);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] overflow-y-auto pb-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-6.5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-[#1a1a2e]">Invite Brand</h2>
              <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
                Send an invitation to onboard a new brand
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#f4f3f6] rounded-lg transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-left"
          >
            {/* Brand Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#5a5a7a]">
                Brand Name <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pepsi Nigeria"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="h-9.5 px-4 rounded-xl border border-[#e8e6f0] text-xs placeholder-[#b0aec8] text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
              />
            </div>

            {/* Representative Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#5a5a7a]">
                Representative Full Name{" "}
                <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Emeka Obi"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                className="h-9.5 px-4 rounded-xl border border-[#e8e6f0] text-xs placeholder-[#b0aec8] text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#5a5a7a]">
                Work Email <span className="text-brand-pink">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. emeka@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9.5 px-4 rounded-xl border border-[#e8e6f0] text-xs placeholder-[#b0aec8] text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
              />
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#5a5a7a]">
                Industry <span className="text-brand-pink">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-9.5 w-full pl-4 pr-9 rounded-xl border border-[#e8e6f0] text-xs text-[#1a1a2e] bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    Select Industry
                  </option>
                  {[
                    "Beverages",
                    "Tech",
                    "Fashion",
                    "Beauty",
                    "Finance",
                    "Food & Beverage",
                  ].map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-10 rounded-2xl bg-brand-pink hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer mt-2.5"
            >
              Send Invitation
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
}
