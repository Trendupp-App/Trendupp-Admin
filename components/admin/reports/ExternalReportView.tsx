/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, Download, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAdminCampaignsList } from "@/hooks/useAdminCampaigns";
import { useCampaign, useSubmissions } from "@/hooks/useCampaign";
import { adminCreatorsApi } from "@/services/adminCreatorsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";

interface CreatorItem {
  name: string;
  username: string;
  avatar: string;
  followers: string;
  tier: "MEGA" | "MACRO" | "MICRO" | "NANO";
  niches: string;
}

interface ContentMetricItem {
  creatorName: string;
  link: string;
  views: string;
  likes: string;
  saves: string;
  shares: string;
  engRate: string;
  comments: string;
}

export default function ExternalReportView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "All" | "Paid" | "Social Impact"
  >("All");
  const [sortOption, setSortOption] = useState("latest");

  // Fetch campaigns list from live API /admin/campaigns
  const { data: campaignsRes, isLoading: isLoadingCampaigns } =
    useAdminCampaignsList({ limit: 1000 });

  // Fetch creators directory from live API /admin/creators
  const { data: creatorsRes } = useQuery({
    queryKey: ["admin-creators-external-report"],
    queryFn: () =>
      adminCreatorsApi.getCreators({ limit: 50 }).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const campaignsList = useMemo(() => {
    const rawList = campaignsRes?.data || [];
    return rawList.map((c) => ({
      id: String(c.id),
      title: c.title || "Untitled Campaign",
      advertiser:
        (
          c as unknown as {
            brandName?: string;
            brand?: { companyName?: string; name?: string };
          }
        ).brandName ||
        (c as unknown as { brand?: { companyName?: string; name?: string } })
          .brand?.companyName ||
        c.brand?.name ||
        "Brand Advertiser",
      startDate: (c as unknown as { startDate?: string }).startDate
        ? new Date(
            (c as unknown as { startDate?: string }).startDate!,
          ).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : c.createdAt
          ? new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "N/A",
      endDate: c.endDate
        ? new Date(c.endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      category: (c as unknown as { category?: string }).category
        ?.toLowerCase()
        .includes("social")
        ? ("Social Impact" as const)
        : ("Paid" as const),
      type: (c.title || "").toLowerCase().includes("amplification")
        ? "Amplification"
        : "Creation",
      applicationsCount: c.applicationsCount || 0,
    }));
  }, [campaignsRes]);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  // Filter campaigns list by search query and category
  const filteredCampaigns = useMemo(() => {
    const filtered = campaignsList.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.advertiser.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        filterCategory === "All" || c.category === filterCategory;
      return matchesSearch && matchesCat;
    });

    if (sortOption === "name") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    return filtered;
  }, [campaignsList, searchQuery, filterCategory, sortOption]);

  // Selected Campaign details
  const selectedCampaign = useMemo(() => {
    if (selectedCampaignId) {
      const found = campaignsList.find((c) => c.id === selectedCampaignId);
      if (found) return found;
    }
    return campaignsList[0] || null;
  }, [campaignsList, selectedCampaignId]);

  // Fetch full details and live submissions of selected campaign
  const { data: campaignDetails, isLoading: isLoadingDetails } = useCampaign(
    selectedCampaign?.id || null,
  );
  const { data: liveSubmissions = [], isLoading: isLoadingSubmissions } =
    useSubmissions(selectedCampaign?.id || null);

  // 1. Live Creators Sourcing (100% Live, NO Mock Fallback)
  const creators: CreatorItem[] = useMemo(() => {
    if (!selectedCampaign) return [];

    const realApps = (
      campaignDetails as unknown as {
        applications?: {
          creator?: {
            id?: string;
            name?: string;
            fullName?: string;
            handle?: string;
            username?: string;
            followerCount?: number;
            followersCount?: number;
            tier?: string;
            creatorTier?: string;
            niche?: string;
          };
        }[];
      }
    )?.applications;
    if (realApps && realApps.length > 0) {
      return realApps.map((a, idx) => {
        const c = a.creator;
        const name = c?.name || c?.fullName || `Creator ${idx + 1}`;
        const followersNum = c?.followerCount || c?.followersCount || 0;
        const formattedFollowers =
          followersNum >= 1000000
            ? `${(followersNum / 1000000).toFixed(1)}M`
            : followersNum >= 1000
              ? `${Math.round(followersNum / 1000)}K`
              : `${followersNum}`;
        const rawTier = (c?.tier || c?.creatorTier || "NANO").toUpperCase();
        const tier = (
          ["MEGA", "MACRO", "MICRO", "NANO"].includes(rawTier)
            ? rawTier
            : "NANO"
        ) as CreatorItem["tier"];

        return {
          name,
          username: `@${c?.handle || c?.username || name.toLowerCase().replace(/\s+/g, "")}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          followers: formattedFollowers,
          tier,
          niches: c?.niche || "General",
        };
      });
    }

    const directoryCreators = creatorsRes?.data || [];
    if (directoryCreators.length > 0) {
      return directoryCreators.slice(0, 4).map((c, idx) => {
        const name = c.name || `Creator ${idx + 1}`;
        const followersNum =
          (c as unknown as { followerCount?: number; followersCount?: number })
            .followerCount || 0;
        const formattedFollowers =
          followersNum >= 1000000
            ? `${(followersNum / 1000000).toFixed(1)}M`
            : followersNum >= 1000
              ? `${Math.round(followersNum / 1000)}K`
              : `${followersNum}`;
        const rawTier = (c.tier || "NANO").toUpperCase();
        const tier = (
          ["MEGA", "MACRO", "MICRO", "NANO"].includes(rawTier)
            ? rawTier
            : "NANO"
        ) as CreatorItem["tier"];

        return {
          name,
          username: `@${c.handle || name.toLowerCase().replace(/\s+/g, "")}`,
          avatar:
            c.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          followers: formattedFollowers,
          tier,
          niches: c.niche || "General",
        };
      });
    }

    return [];
  }, [selectedCampaign, campaignDetails, creatorsRes]);

  // 2. Live Content Metrics Sourcing (100% Live, NO Mock Fallback)
  const contentMetrics: ContentMetricItem[] = useMemo(() => {
    if (!selectedCampaign || !liveSubmissions || liveSubmissions.length === 0) {
      return [];
    }

    return liveSubmissions.map((sub, idx) => {
      const creatorName = sub.creator
        ? `${sub.creator.firstName || ""} ${sub.creator.lastName || ""}`.trim() ||
          sub.creator.username
        : creators[idx % (creators.length || 1)]?.name || `Creator ${idx + 1}`;

      let linkUrl = "";
      if (typeof sub.liveLink === "string") {
        linkUrl = sub.liveLink;
      } else if (sub.liveLink && typeof sub.liveLink === "object") {
        const firstVal = Object.values(sub.liveLink)[0];
        linkUrl = typeof firstVal === "string" ? firstVal : firstVal?.url || "";
      }
      if (!linkUrl) {
        linkUrl = sub.draftLink || "";
      }
      linkUrl = linkUrl.replace(/^https?:\/\//, "");

      const metricsObj = (
        sub as unknown as {
          metrics?: {
            views?: number;
            likes?: number;
            saves?: number;
            shares?: number;
            engRate?: number;
            comments?: number;
          };
        }
      ).metrics;

      const viewsNum = metricsObj?.views || 0;
      const likesNum = metricsObj?.likes || 0;
      const savesNum = metricsObj?.saves || 0;
      const sharesNum = metricsObj?.shares || 0;
      const commentsNum = metricsObj?.comments || 0;

      const formatNum = (num: number) =>
        num >= 1000000
          ? `${(num / 1000000).toFixed(1)}M`
          : num >= 1000
            ? `${Math.round(num / 1000)}K`
            : `${num}`;

      const engRateVal =
        metricsObj?.engRate ||
        (viewsNum > 0
          ? Math.round(
              ((likesNum + savesNum + sharesNum + commentsNum) / viewsNum) *
                1000,
            ) / 10
          : 0);

      return {
        creatorName,
        link: linkUrl || "N/A",
        views: formatNum(viewsNum),
        likes: formatNum(likesNum),
        saves: formatNum(savesNum),
        shares: formatNum(sharesNum),
        engRate: `${engRateVal}%`,
        comments: formatNum(commentsNum),
      };
    });
  }, [selectedCampaign, liveSubmissions, creators]);

  const handleExportReport = () => {
    if (!selectedCampaign) {
      toast.error("Please select a campaign to export");
      return;
    }

    const headers = [
      "Campaign Title",
      "Advertiser",
      "Campaign Period",
      "Category",
      "Campaign Type",
      "Section",
      "Creator Name",
      "Username / Live Link",
      "Followers / Views",
      "Tier / Likes",
      "Niches / Saves",
      "Shares",
      "Engagement Rate",
      "Comments",
    ];

    const rows: (string | number)[][] = [];

    creators.forEach((c) => {
      rows.push([
        selectedCampaign.title,
        selectedCampaign.advertiser,
        `${selectedCampaign.startDate} - ${selectedCampaign.endDate}`,
        selectedCampaign.category,
        selectedCampaign.type,
        "Creator",
        c.name,
        c.username,
        c.followers,
        c.tier,
        c.niches,
        "-",
        "-",
        "-",
      ]);
    });

    contentMetrics.forEach((m) => {
      rows.push([
        selectedCampaign.title,
        selectedCampaign.advertiser,
        `${selectedCampaign.startDate} - ${selectedCampaign.endDate}`,
        selectedCampaign.category,
        selectedCampaign.type,
        "Content Metric",
        m.creatorName,
        m.link,
        m.views,
        m.likes,
        m.saves,
        m.shares,
        m.engRate,
        m.comments,
      ]);
    });

    downloadCsv(`External_Report_${selectedCampaign.title}`, headers, rows);
    toast.success(`Exported report for "${selectedCampaign.title}"`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-left animate-fade-in-up items-start">
      {/* ── Left Sidebar Panel: Campaign List Filter & List ──────────────── */}
      <div className="w-full lg:w-80 shrink-0 bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 flex flex-col gap-4 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-3 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-[#f8f7fa] border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:border-brand-pink transition-colors"
          />
        </div>

        {/* Filter Pills: All | Paid | Social Impact */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4f3f6] rounded-xl border border-[#e8e6f0]/60">
          {(["All", "Paid", "Social Impact"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? "bg-brand-pink text-white shadow-xs"
                  : "text-[#5a5a7a] hover:text-[#1a1a2e]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdown Sort Selector */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none cursor-pointer"
          >
            <option value="latest">Sort by Latest</option>
            <option value="name">Sort by Title</option>
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
          />
        </div>

        {/* Campaign Items List */}
        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#e8e6f0] scrollbar-track-transparent">
          {isLoadingCampaigns ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))
          ) : filteredCampaigns.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9a99b0]">
              No campaigns found
            </div>
          ) : (
            filteredCampaigns.map((item) => {
              const isSelected = item.id === selectedCampaign?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCampaignId(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#fff5f8] border-brand-pink/60 shadow-xs"
                      : "bg-white border-[#e8e6f0]/60 hover:bg-[#faf9fc]"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <h4
                      className={`text-xs font-bold truncate ${
                        isSelected ? "text-brand-pink" : "text-[#1a1a2e]"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#9a99b0] font-medium truncate">
                      {item.advertiser} · {item.startDate} - {item.endDate}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 ${
                      item.category === "Paid"
                        ? "bg-[#fce7f3] text-[#db2777]"
                        : "bg-[#d1fae5] text-[#059669]"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Main Content Area: Selected Campaign Detail ─────────────────── */}
      <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
        {!selectedCampaign ? (
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-12 text-center text-xs text-[#9a99b0]">
            Select a campaign to view external report
          </div>
        ) : (
          <>
            {/* Top Campaign Header Card */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-[#1a1a2e]">
                      {selectedCampaign.title}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        selectedCampaign.category === "Paid"
                          ? "bg-[#fce7f3] text-[#db2777]"
                          : "bg-[#d1fae5] text-[#059669]"
                      }`}
                    >
                      {selectedCampaign.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#9a99b0] font-medium">
                    {selectedCampaign.advertiser} · {selectedCampaign.startDate}{" "}
                    - {selectedCampaign.endDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportReport}
                  className="h-9 px-4 bg-white border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e] flex items-center gap-2 hover:bg-[#faf9fc] transition-colors cursor-pointer shadow-xs"
                >
                  <Download size={14} className="text-[#5a5a7a]" />
                  <span>Export</span>
                </button>
              </div>

              {/* 4 Key Metadata Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[#e8e6f0]/40">
                {/* Campaign Type */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Campaign Type
                  </span>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#fce7f3] text-[#db2777]">
                      {selectedCampaign.type}
                    </span>
                  </div>
                </div>

                {/* Advertiser */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Advertiser
                  </span>
                  <span className="text-xs font-extrabold text-[#1a1a2e]">
                    {selectedCampaign.advertiser}
                  </span>
                </div>

                {/* Campaign Period */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Campaign Period
                  </span>
                  <span className="text-xs font-extrabold text-[#1a1a2e]">
                    {selectedCampaign.startDate} - {selectedCampaign.endDate}
                  </span>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Category
                  </span>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        selectedCampaign.category === "Paid"
                          ? "bg-[#fce7f3] text-[#db2777]"
                          : "bg-[#d1fae5] text-[#059669]"
                      }`}
                    >
                      {selectedCampaign.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creators Section Card */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
              <h3 className="text-sm font-bold text-[#1a1a2e]">Creators</h3>

              <div className="overflow-x-auto">
                {isLoadingDetails ? (
                  <Skeleton className="h-32 w-full rounded-2xl" />
                ) : creators.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#9a99b0]">
                    No creators assigned to this campaign yet
                  </div>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#e8e6f0]/60 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-bold">CREATOR</th>
                        <th className="pb-3 px-4 font-bold">USERNAME</th>
                        <th className="pb-3 px-4 font-bold">TOTAL FOLLOWERS</th>
                        <th className="pb-3 px-4 font-bold">TIER</th>
                        <th className="pb-3 pl-4 font-bold">NICHES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e6f0]/40 font-medium">
                      {creators.map((c, idx) => {
                        const tierColor =
                          c.tier === "MEGA"
                            ? "bg-[#fef3c7] text-[#d97706]"
                            : c.tier === "MACRO"
                              ? "bg-[#dbeafe] text-[#2563eb]"
                              : c.tier === "MICRO"
                                ? "bg-[#f3e8ff] text-[#9333ea]"
                                : "bg-[#d1fae5] text-[#059669]";

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-[#faf9fc]/60 transition-colors"
                          >
                            <td className="py-3 pr-4 font-bold text-[#1a1a2e]">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={c.avatar}
                                  alt={c.name}
                                  className="w-7 h-7 rounded-full bg-[#f4f3f6] object-cover shrink-0"
                                />
                                <span>{c.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#7a7a9a] font-medium">
                              {c.username}
                            </td>
                            <td className="py-3 px-4 font-extrabold text-[#1a1a2e]">
                              {c.followers}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${tierColor}`}
                              >
                                {c.tier}
                              </span>
                            </td>
                            <td className="py-3 pl-4 text-[#5a5a7a] font-semibold">
                              {c.niches}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Content Metrics Section Card */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Content Metrics
              </h3>

              <div className="overflow-x-auto">
                {isLoadingSubmissions ? (
                  <Skeleton className="h-32 w-full rounded-2xl" />
                ) : contentMetrics.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#9a99b0]">
                    No content metrics submitted for this campaign yet
                  </div>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#e8e6f0]/60 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-bold">CREATOR</th>
                        <th className="pb-3 px-4 font-bold">
                          LIVE CONTENT LINK
                        </th>
                        <th className="pb-3 px-4 font-bold">VIEWS</th>
                        <th className="pb-3 px-4 font-bold">LIKES</th>
                        <th className="pb-3 px-4 font-bold">SAVES</th>
                        <th className="pb-3 px-4 font-bold">SHARES</th>
                        <th className="pb-3 px-4 font-bold">ENG. RATE</th>
                        <th className="pb-3 pl-4 font-bold">COMMENTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e6f0]/40 font-medium">
                      {contentMetrics.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[#faf9fc]/60 transition-colors"
                        >
                          <td className="py-3 pr-4 font-bold text-[#1a1a2e]">
                            {item.creatorName}
                          </td>
                          <td className="py-3 px-4 text-[#2563eb]">
                            {item.link !== "N/A" ? (
                              <a
                                href={
                                  item.link.startsWith("http")
                                    ? item.link
                                    : `https://${item.link}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:underline font-semibold"
                              >
                                <ExternalLink size={12} className="shrink-0" />
                                <span>{item.link}</span>
                              </a>
                            ) : (
                              <span className="text-[#9a99b0] font-normal">
                                N/A
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1a1a2e]">
                            {item.views}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1a1a2e]">
                            {item.likes}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1a1a2e]">
                            {item.saves}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1a1a2e]">
                            {item.shares}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-[#d1fae5] text-[#059669]">
                              {item.engRate}
                            </span>
                          </td>
                          <td className="py-3 pl-4 font-semibold text-[#1a1a2e]">
                            {item.comments}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
