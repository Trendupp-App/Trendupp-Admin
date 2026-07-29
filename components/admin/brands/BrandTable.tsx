"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "../AdminStatusBadge";
import UserAvatar from "@/shared/UserAvatar";
import { useAdminBrandsList } from "@/hooks/useAdminBrands";
import BrandProfileDrawer from "./BrandProfileDrawer";

export default function BrandTable() {
  const [activeTab, setActiveTab] = useState<
    "All" | "Onboarded" | "Suspended" | "Pending"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedCompletion, setSelectedCompletion] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const queryStatus = useMemo(() => {
    if (activeTab === "Onboarded") return "ACTIVE";
    if (activeTab === "Suspended") return "SUSPENDED";
    if (activeTab === "Pending") return "PENDING";
    if (selectedStatus !== "All") return selectedStatus.toUpperCase();
    return undefined;
  }, [activeTab, selectedStatus]);

  const queryCompletion = useMemo(() => {
    if (selectedCompletion !== "All") {
      const num = parseInt(selectedCompletion.replace("%", ""), 10);
      return !isNaN(num) ? num : undefined;
    }
    return undefined;
  }, [selectedCompletion]);

  const { data: apiData, isLoading } = useAdminBrandsList({
    search: searchQuery || undefined,
    status: queryStatus,
    industry: selectedIndustry !== "All" ? selectedIndustry : undefined,
    completion: queryCompletion,
    country: selectedCountry !== "All" ? selectedCountry : undefined,
    page: currentPage,
    limit: 10,
  });

  const formatDateOnly = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatLocation = (
    loc: unknown,
    city?: string | null,
    country?: string | null,
  ): string => {
    if (typeof loc === "string" && loc.trim()) return loc;
    if (loc && typeof loc === "object") {
      const lObj = loc as { city?: string; country?: string; state?: string };
      const parts = [lObj.city || lObj.state, lObj.country].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
    const parts = [city, country].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");
    return "Nigeria";
  };

  const brandsList = useMemo(() => {
    if (apiData?.data && Array.isArray(apiData.data)) {
      let mapped = apiData.data.map((b) => {
        const brandName = b.advertiser?.brandName || b.brandName || "Brand";
        const logoUrl = b.advertiser?.logoUrl || b.logoUrl || null;
        const repName =
          b.representative?.name || b.representativeName || brandName;
        const repEmail =
          b.representative?.email || b.representativeEmail || b.email || "";
        const advertiserId =
          b.displayId || b.brandId || `#AD-${b.id.slice(0, 4)}`;
        const joinedDate = b.joinDate || b.joinedAt;

        const repAccountStatus = (
          b.representative as { accountStatus?: string } | undefined
        )?.accountStatus;

        const rawStatus = String(
          b.status ||
            (b as unknown as { accountStatus?: string }).accountStatus ||
            repAccountStatus ||
            "ACTIVE",
        ).toUpperCase();

        const normalizedStatus =
          rawStatus === "SUSPENDED"
            ? "suspended"
            : rawStatus === "PENDING"
              ? "pending"
              : "active";

        return {
          id: b.id,
          advertiserId,
          name: brandName,
          logoUrl,
          email: repEmail,
          repName,
          repEmail,
          industry: b.industry || "General",
          location: formatLocation(b.location, b.city, b.country),
          completion: b.profileCompletion ?? 0,
          status: normalizedStatus,
          totalSpend: b.totalSpend || 0,
          campaigns: b.campaignsCount || 0,
          joined: formatDateOnly(joinedDate || undefined),
        };
      });

      if (activeTab === "Onboarded") {
        mapped = mapped.filter((b) => b.status === "active");
      } else if (activeTab === "Suspended") {
        mapped = mapped.filter((b) => b.status === "suspended");
      } else if (activeTab === "Pending") {
        mapped = mapped.filter((b) => b.status === "pending");
      }

      if (selectedStatus !== "All") {
        mapped = mapped.filter(
          (b) => b.status === selectedStatus.toLowerCase(),
        );
      }

      return mapped;
    }
    return [];
  }, [apiData, activeTab, selectedStatus]);

  const handleRowClick = (brandId: string) => {
    setSelectedBrandId(brandId);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      {/* Filter Tabs Header */}
      <div className="flex border-b border-[#e8e6f0]/40 gap-6">
        {(["All", "Onboarded", "Suspended", "Pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={cn(
              "pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
              activeTab === tab
                ? "border-brand-pink text-brand-pink"
                : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search by brand, rep name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9 pl-9 pr-4 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl text-xs text-[#1a1a2e] placeholder-[#9a99b0] outline-none focus:border-brand-pink transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="h-9 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-xs font-semibold rounded-xl outline-none cursor-pointer"
          >
            <option value="All">Industry</option>
            <option value="Beverages">Beverages</option>
            <option value="Telecomm">Telecomm</option>
            <option value="Fintech">Fintech</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Tech">Tech</option>
          </select>

          <select
            value={selectedCompletion}
            onChange={(e) => setSelectedCompletion(e.target.value)}
            className="h-9 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-xs font-semibold rounded-xl outline-none cursor-pointer"
          >
            <option value="All">Completion</option>
            <option value="100%">100%</option>
            <option value="80%">80%</option>
            <option value="60%">60%</option>
            <option value="40%">40%</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-xs font-semibold rounded-xl outline-none cursor-pointer"
          >
            <option value="All">Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="h-9 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-xs font-semibold rounded-xl outline-none cursor-pointer"
          >
            <option value="All">Country</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
          </select>

          <div className="h-9 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#5a5a7a] text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0">
            📅 This Month
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="w-full overflow-x-auto no-scrollbar rounded-2xl border border-[#e8e6f0]/60">
        <table className="w-full min-w-[1100px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#faf9fc] border-b border-[#e8e6f0]/60 text-[10px] font-extrabold uppercase tracking-wider text-[#7a7a9a]">
              <th className="py-3.5 px-4 whitespace-nowrap">Advertisers ID</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Advertiser</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Representative</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Industry</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Location</th>
              <th className="py-3.5 px-4 whitespace-nowrap">
                Profile Completion
              </th>
              <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Total Spend</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Campaigns</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="w-16 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e8e6f0]/60 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <div className="w-24 h-3 bg-[#e8e6f0]/60 rounded-md" />
                        <div className="w-20 h-2.5 bg-[#e8e6f0]/40 rounded-md" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="w-20 h-3 bg-[#e8e6f0]/60 rounded-md" />
                      <div className="w-28 h-2.5 bg-[#e8e6f0]/40 rounded-md" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-3 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-14 h-5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-8 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </td>
                </tr>
              ))
            ) : brandsList.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-8 text-center text-[#9a99b0] text-xs"
                >
                  No advertisers found matching your criteria.
                </td>
              </tr>
            ) : (
              brandsList.map((brand) => (
                <tr
                  key={brand.id}
                  onClick={() => handleRowClick(brand.id)}
                  className="hover:bg-[#faf9fc] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1a1a2e]">
                    {brand.advertiserId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        avatarUrl={brand.logoUrl || undefined}
                        initials={brand.name.slice(0, 2)}
                        size={32}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1a1a2e]">
                          {brand.name}
                        </span>
                        <span className="text-[10px] text-[#9a99b0]">
                          {brand.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1a1a2e]">
                        {brand.repName}
                      </span>
                      <span className="text-[10px] text-[#9a99b0]">
                        {brand.repEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#5a5a7a] font-medium">
                    {brand.industry}
                  </td>
                  <td className="py-3.5 px-4 text-[#5a5a7a] font-medium">
                    {brand.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 max-w-[120px]">
                      <div className="flex-1 h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10b981] rounded-full"
                          style={{ width: `${brand.completion}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a2e]">
                        {brand.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={brand.status} />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1a1a2e]">
                    ₦{brand.totalSpend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1a1a2e]">
                    {brand.campaigns}
                  </td>
                  <td className="py-3.5 px-4 text-[#7a7a9a] font-medium">
                    {brand.joined}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {apiData?.meta && (
        <div className="flex items-center justify-between pt-2 text-xs text-[#7a7a9a]">
          <span>
            Page {apiData.meta.page} of {apiData.meta.totalPages} (
            {apiData.meta.total} advertisers)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-[#e8e6f0]/60 rounded-xl font-bold disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= apiData.meta.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 border border-[#e8e6f0]/60 rounded-xl font-bold disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Brand Profile Drawer */}
      {isDrawerOpen && (
        <BrandProfileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          brandId={selectedBrandId}
        />
      )}
    </div>
  );
}
