"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useContactInfo,
  useUpdateContactInfo,
} from "@/hooks/useAdminSettingsExtra";
import type { ContactInfo } from "@/types/adminSettings";

function ContactInfoFormInner({
  initialData,
}: {
  initialData?: ContactInfo | null;
}) {
  const updateMutation = useUpdateContactInfo();

  const [businessAddress, setBusinessAddress] = useState(
    initialData?.businessAddress || "",
  );
  const [supportEmail, setSupportEmail] = useState(
    initialData?.supportEmail || "",
  );
  const [supportPhone, setSupportPhone] = useState(
    initialData?.supportPhone || "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      businessAddress: businessAddress.trim(),
      supportEmail: supportEmail.trim(),
      supportPhone: supportPhone.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#f0f0f5] rounded-2xl p-4 sm:p-7 flex flex-col gap-5 shadow-xs w-full max-w-2xl"
    >
      {/* Business Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">
          Business Address
        </label>
        <input
          type="text"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          placeholder="12 Marina Way, Lagos Island, Lagos, Nigeria"
          required
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Support Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">
          Support Email
        </label>
        <input
          type="email"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
          placeholder="support@trendupp.com"
          required
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Support Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">
          Support Phone
        </label>
        <input
          type="text"
          value={supportPhone}
          onChange={(e) => setSupportPhone(e.target.value)}
          placeholder="+234 800 TRENDUPP"
          required
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Submit */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default function ContactInfoView() {
  const { data: contactData, isLoading } = useContactInfo();

  return (
    <div className="flex-1 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-[#1a1a2e]">Contact Information</h1>

      {isLoading ? (
        <div className="bg-white border border-[#f0f0f5] rounded-2xl p-7 flex flex-col gap-4 shadow-xs max-w-2xl">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : (
        <ContactInfoFormInner
          key={contactData ? "loaded" : "default"}
          initialData={contactData}
        />
      )}
    </div>
  );
}
