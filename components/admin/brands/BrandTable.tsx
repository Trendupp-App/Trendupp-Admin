"use client";

import { useState, useMemo } from "react";
import { Search, Download, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "../AdminStatusBadge";
import UserAvatar from "@/shared/UserAvatar";
import { useAdminBrandsList } from "@/hooks/useAdminBrands";
import BrandProfileDrawer from "./BrandProfileDrawer";
import { CardFilterHeaderControls } from "../creators/CardFilterHeaderControls";
import { CardDateRangeBar } from "../creators/CardDateRangeBar";

export default function BrandTable() {
  const [activeTab, setActiveTab] = useState<
    "All" | "Onboarded" | "Suspended" | "Pending"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompletion, setSelectedCompletion] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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

  const { data: apiData, isLoading } = useAdminBrandsList({
    search: searchQuery || undefined,
    status: queryStatus,
    startDate: fromDate || undefined,
    endDate: toDate || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    limit: 1000,
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

  const rawBrandsList = useMemo(() => {
    if (apiData?.data && Array.isArray(apiData.data)) {
      return apiData.data.map((b) => {
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
    }
    return [];
  }, [apiData]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>([
      "Nigeria",
      "Ghana",
      "Kenya",
      "Togo",
      "Benin Republic",
      "South Africa",
      "United Kingdom",
      "United States",
      "Austria",
      "Australia",
    ]);
    rawBrandsList.forEach((b) => {
      if (b.location && b.location.trim()) {
        const parts = b.location.split(",");
        const countryStr = parts[parts.length - 1].trim();
        if (countryStr) set.add(countryStr);
      }
    });
    return Array.from(set).sort();
  }, [rawBrandsList]);

  const filteredBrands = useMemo(() => {
    return rawBrandsList.filter((b) => {
      if (
        searchQuery &&
        !b.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !b.repName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !b.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !b.advertiserId.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (activeTab === "Onboarded" && b.status !== "active") return false;
      if (activeTab === "Suspended" && b.status !== "suspended") return false;
      if (activeTab === "Pending" && b.status !== "pending") return false;

      if (
        selectedStatus !== "All" &&
        b.status !== selectedStatus.toLowerCase()
      ) {
        return false;
      }

      if (selectedCountry !== "All") {
        const locLower = b.location.toLowerCase().trim();
        const cLower = selectedCountry.toLowerCase().trim();
        if (!locLower.includes(cLower) && !cLower.includes(locLower)) {
          return false;
        }
      }

      if (selectedCompletion !== "All") {
        const reqComp = parseInt(selectedCompletion, 10);
        if (!isNaN(reqComp) && b.completion < reqComp) {
          return false;
        }
      }

      return true;
    });
  }, [
    rawBrandsList,
    searchQuery,
    activeTab,
    selectedStatus,
    selectedCountry,
    selectedCompletion,
  ]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE) || 1;

  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBrands.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBrands, currentPage]);

  const handleRowClick = (brandId: string) => {
    setSelectedBrandId(brandId);
    setIsDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (filteredBrands.length === 0) return;
    const headers = [
      "Brand ID",
      "Brand Name",
      "Representative Name",
      "Email",
      "Industry",
      "Location",
      "Profile Completion",
      "Total Spend",
      "Status",
      "Date Joined",
    ];

    const rows = filteredBrands.map((b) => [
      b.advertiserId,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.repName.replace(/"/g, '""')}"`,
      b.repEmail,
      b.industry,
      `"${b.location.replace(/"/g, '""')}"`,
      `${b.completion}%`,
      `"₦${b.totalSpend.toLocaleString()}"`,
      b.status,
      b.joined,
    ]);

    const csvString = [
      headers.join(","),
      ...rows.map((e: (string | number)[]) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `brands_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCompletion !== "All" ||
    selectedStatus !== "All" ||
    selectedCountry !== "All" ||
    activeTab !== "All" ||
    fromDate !== "" ||
    toDate !== "";

  const clearAllFilters = () => {
    setActiveTab("All");
    setSearchQuery("");
    setSelectedCompletion("All");
    setSelectedStatus("All");
    setSelectedCountry("All");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      {/* Status Filter Tabs (Left) & Frequency Controls + Export (Right) */}
      <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-3 gap-4 flex-wrap">
        {/* Left: Status Filter Tabs */}
        <div className="flex items-center gap-6">
          {(["All", "Onboarded", "Suspended", "Pending"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={cn(
                  "pb-1 text-xs font-bold border-b-2 transition-all cursor-pointer",
                  activeTab === tab
                    ? "border-brand-pink text-brand-pink"
                    : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
                )}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Right: Time Controls, Clear Filters & Export */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <CardFilterHeaderControls />

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RotateCcw size={12} /> Clear all filters
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e6f0] text-[#1a1a2e] hover:bg-[#faf9fc] text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Download size={13} className="text-brand-pink" />
            <span>Export CSV</span>
          </button>
        </div>
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
            className="w-full h-9 pl-9 pr-8 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl text-xs text-[#1a1a2e] placeholder-[#9a99b0] outline-none focus:border-brand-pink transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Unique Advertiser/Brand Dropdown Filters & Date Range Bar */}
        <div className="flex items-center gap-2 flex-wrap">
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
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-xs font-semibold rounded-xl outline-none cursor-pointer"
          >
            <option value="All">Country</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <CardDateRangeBar
            onDateChange={(from, to) => {
              setFromDate(from);
              setToDate(to);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="w-full overflow-x-auto no-scrollbar rounded-2xl border border-[#e8e6f0]/60">
        <table className="w-full min-w-[1100px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#faf9fc] border-b border-[#e8e6f0]/60 text-[10px] font-extrabold uppercase tracking-wider text-[#7a7a9a]">
              <th className="py-3.5 px-4 whitespace-nowrap">Brand ID</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Brand</th>
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
            ) : filteredBrands.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-8 text-center text-[#9a99b0] text-xs"
                >
                  No brands found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedBrands.map((brand) => (
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
      <div className="flex items-center justify-between pt-2 text-xs text-[#7a7a9a]">
        <span>
          Showing{" "}
          {filteredBrands.length > 0
            ? (currentPage - 1) * ITEMS_PER_PAGE + 1
            : 0}{" "}
          - {Math.min(currentPage * ITEMS_PER_PAGE, filteredBrands.length)} of{" "}
          {filteredBrands.length} brands
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 border border-[#e8e6f0]/60 rounded-xl font-bold disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-[#1a1a2e] px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 border border-[#e8e6f0]/60 rounded-xl font-bold disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

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
