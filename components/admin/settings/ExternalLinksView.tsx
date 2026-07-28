"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useExternalLinks,
  useUpdateExternalLinks,
} from "@/hooks/useAdminSettingsExtra";
import type { ExternalLinks } from "@/types/adminSettings";

function ExternalLinksFormInner({
  initialData,
}: {
  initialData?: ExternalLinks | null;
}) {
  const updateMutation = useUpdateExternalLinks();

  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl || "");
  const [instagram, setInstagram] = useState(initialData?.instagram || "");
  const [twitter, setTwitter] = useState(initialData?.twitter || "");
  const [linkedin, setLinkedin] = useState(initialData?.linkedin || "");
  const [youtube, setYoutube] = useState(initialData?.youtube || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      websiteUrl: websiteUrl.trim(),
      instagram: instagram.trim(),
      twitter: twitter.trim(),
      linkedin: linkedin.trim(),
      youtube: youtube.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#f0f0f5] rounded-2xl p-4 sm:p-7 flex flex-col gap-5 shadow-xs w-full max-w-2xl"
    >
      {/* Website URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Website URL</label>
        <input
          type="text"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://trendupp.com"
          required
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Instagram */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Instagram</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@trendupp"
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Twitter / X */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Twitter / X</label>
        <input
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="@trendupp_ng"
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">LinkedIn</label>
        <input
          type="text"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="trendupp"
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* YouTube */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">YouTube</label>
        <input
          type="text"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          placeholder="TrenduppAfrica"
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

export default function ExternalLinksView() {
  const { data: linksData, isLoading } = useExternalLinks();

  return (
    <div className="flex-1 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-[#1a1a2e]">External Links</h1>

      {isLoading ? (
        <div className="bg-white border border-[#f0f0f5] rounded-2xl p-7 flex flex-col gap-4 shadow-xs max-w-2xl">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : (
        <ExternalLinksFormInner
          key={linksData ? "loaded" : "default"}
          initialData={linksData}
        />
      )}
    </div>
  );
}
