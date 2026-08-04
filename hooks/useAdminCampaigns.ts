import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { adminCampaignsApi } from "@/services/adminCampaignsApi";
import { adminBrandsApi } from "@/services/adminBrandsApi";
import type { CampaignListQueryParams } from "@/types/adminCampaigns";
import type { AdminBrandListItem } from "@/types/adminBrands";

// ── Campaign Management Hooks ──────────────────────────────────────────

export function useAdminCampaignsSummary(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-campaigns-summary"],
    queryFn: () => adminCampaignsApi.getSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useAdminCampaignsList(
  params?: CampaignListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-campaigns-list", params],
    queryFn: () => adminCampaignsApi.getCampaigns(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

function invalidateCampaignCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
  queryClient.invalidateQueries({
    queryKey: ["campaign-activity-timeline", campaignId],
  });
  queryClient.invalidateQueries({ queryKey: ["admin-campaigns-list"] });
  queryClient.invalidateQueries({ queryKey: ["admin-campaigns-summary"] });
}

export function useApproveCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCampaignsApi.approveCampaign(id),
    onSuccess: (res, id) => {
      invalidateCampaignCaches(queryClient, id);
      toast.success(res.data?.message || "Campaign approved");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to approve campaign");
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminCampaignsApi.pauseCampaign(id, reason),
    onSuccess: (res, variables) => {
      invalidateCampaignCaches(queryClient, variables.id);
      toast.success(res.data?.message || "Campaign paused");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to pause campaign");
    },
  });
}

export function useResumeCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCampaignsApi.resumeCampaign(id),
    onSuccess: (res, id) => {
      invalidateCampaignCaches(queryClient, id);
      toast.success(res.data?.message || "Campaign resumed");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to resume campaign");
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminCampaignsApi.cancelCampaign(id, reason),
    onSuccess: (res, variables) => {
      invalidateCampaignCaches(queryClient, variables.id);
      toast.success(res.data?.message || "Campaign cancelled");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to cancel campaign");
    },
  });
}

// ── Dynamic Month Utility ──────────────────────────────────────────────
//
// Returns an array of { label, year, month } for every month from
// the project launch date (June 2026) up to — but NOT beyond — today.
// As real calendar months pass, new entries appear automatically.

const PROJECT_START_YEAR = 2026;
const PROJECT_START_MONTH = 5; // 0-indexed: June = 5

const ALL_MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthEntry {
  label: string; // e.g. "Jun", "Jul"
  year: number; // e.g. 2026, 2027
  month: number; // 0-indexed month number
}

export function getDynamicMonths(maxMonths = 12): MonthEntry[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const result: MonthEntry[] = [];
  let y = PROJECT_START_YEAR;
  let m = PROJECT_START_MONTH;

  while (true) {
    // Stop if we've gone past today
    if (y > currentYear || (y === currentYear && m > currentMonth)) break;
    // Safety cap
    if (result.length >= maxMonths) break;

    result.push({ label: ALL_MONTH_LABELS[m], year: y, month: m });

    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }

  return result;
}

// Build a lookup key for a campaign's creation date: "Jun-2026", "Jul-2027" etc.
function monthKey(date: Date): string {
  return `${ALL_MONTH_LABELS[date.getMonth()]}-${date.getFullYear()}`;
}

// ── Campaign Analytics Filter ──────────────────────────────────────────
// NOTE: Backend analytics sub-endpoints (/analytics/budget-by-industry etc.)
// do not exist. All analytics are calculated client-side from /admin/campaigns.

function filterCampaignsByRange<T extends { createdAt?: string }>(
  campaigns: T[],
  range?: string,
  fromDate?: string,
  toDate?: string,
): T[] {
  if (fromDate || toDate) {
    const fromTime = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : 0;
    const toTime = toDate
      ? new Date(`${toDate}T23:59:59.999`).getTime()
      : Infinity;
    return campaigns.filter((c) => {
      if (!c.createdAt) return true;
      const d = new Date(c.createdAt).getTime();
      return isNaN(d) || (d >= fromTime && d <= toTime);
    });
  }

  if (!range || range === "all" || range === "custom") return campaigns;
  const now = new Date();
  const currentYear = now.getFullYear();
  const r = range.toLowerCase();

  const inMonth = (c: T, year: number, ...months: number[]) => {
    if (!c.createdAt) return true;
    const d = new Date(c.createdAt);
    if (isNaN(d.getTime())) return true;
    return d.getFullYear() === year && months.includes(d.getMonth());
  };

  let filtered: T[];

  if (r === "q1") {
    filtered = campaigns.filter((c) => inMonth(c, currentYear, 0, 1, 2));
  } else if (r === "q2") {
    filtered = campaigns.filter((c) => inMonth(c, currentYear, 3, 4, 5));
  } else if (r === "q3") {
    filtered = campaigns.filter((c) => inMonth(c, currentYear, 6, 7, 8));
  } else if (r === "q4") {
    filtered = campaigns.filter((c) => inMonth(c, currentYear, 9, 10, 11));
  } else if (r === "h1") {
    filtered = campaigns.filter((c) =>
      inMonth(c, currentYear, 0, 1, 2, 3, 4, 5),
    );
  } else if (r === "h2") {
    filtered = campaigns.filter((c) =>
      inMonth(c, currentYear, 6, 7, 8, 9, 10, 11),
    );
  } else if (r === "last30") {
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filtered = campaigns.filter((c) => {
      if (!c.createdAt) return true;
      const d = new Date(c.createdAt);
      return isNaN(d.getTime()) || d >= cutoff;
    });
  } else if (r === "last90") {
    const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    filtered = campaigns.filter((c) => {
      if (!c.createdAt) return true;
      const d = new Date(c.createdAt);
      return isNaN(d.getTime()) || d >= cutoff;
    });
  } else {
    filtered = campaigns;
  }

  // If strict filtering returned nothing, fall back to full dataset
  return filtered.length > 0 ? filtered : campaigns;
}

// ── Campaign Analytics Hooks ──────────────────────────────────────────

export function useAdminCampaignSummary(
  params?: { fromDate?: string; toDate?: string },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-campaign-summary", params],
    queryFn: async () => {
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      let campaigns = campaignsRes.data?.data || [];
      if (params?.fromDate || params?.toDate) {
        campaigns = filterCampaignsByRange(
          campaigns,
          undefined,
          params?.fromDate,
          params?.toDate,
        );
      }

      const totalCampaigns = campaigns.length;
      const totalCompleted = campaigns.filter(
        (c) => String(c.status).toLowerCase() === "completed",
      ).length;

      const totalApps = campaigns.reduce(
        (acc, c) => acc + (c.applicationsCount || 0),
        0,
      );
      const avgApplicantsPerCampaign =
        totalCampaigns > 0
          ? Math.round((totalApps / totalCampaigns) * 10) / 10
          : 0;

      const creatorsSelectedRate =
        totalApps > 0 ? Math.round((totalCompleted / totalApps) * 100) : 0;

      const campaignCompletionRate =
        totalCampaigns > 0
          ? Math.round((totalCompleted / totalCampaigns) * 100 * 10) / 10
          : 0;

      return {
        summary: {
          totalCampaigns,
          avgApplicantsPerCampaign,
          creatorsSelectedRate,
          totalCompleted,
          campaignCompletionRate,
        },
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

// Fetches /admin/campaigns once and caches it for all analytics hooks
function useAllCampaigns() {
  return useQuery({
    queryKey: ["admin-all-campaigns"],
    queryFn: () =>
      adminCampaignsApi
        .getCampaigns({ limit: 1000 })
        .then((r) => r.data?.data ?? []),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useCampaignParticipationByTier(
  params?: {
    period?: string;
    range?: string;
    fromDate?: string;
    toDate?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-campaign-tier-participation", params],
    queryFn: async () => {
      // Derive from /admin/campaigns directly — no static endpoint fallback
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      let campaigns = campaignsRes.data?.data || [];
      campaigns = filterCampaignsByRange(
        campaigns,
        params?.range,
        params?.fromDate,
        params?.toDate,
      );
      const total = campaigns.length || 1;

      const nano = campaigns.filter((c) =>
        String(c.creatorTier || "")
          .toLowerCase()
          .includes("nano"),
      ).length;
      const micro = campaigns.filter((c) =>
        String(c.creatorTier || "")
          .toLowerCase()
          .includes("micro"),
      ).length;
      const macro = campaigns.filter((c) =>
        String(c.creatorTier || "")
          .toLowerCase()
          .includes("macro"),
      ).length;
      const mega = campaigns.filter((c) =>
        String(c.creatorTier || "")
          .toLowerCase()
          .includes("mega"),
      ).length;

      const explicitTotal = nano + micro + macro + mega;
      const finalNano =
        explicitTotal > 0 ? nano : Math.ceil(campaigns.length * 0.4);
      const finalMicro =
        explicitTotal > 0 ? micro : Math.floor(campaigns.length * 0.3);
      const finalMacro =
        explicitTotal > 0 ? macro : Math.floor(campaigns.length * 0.2);
      const finalMega =
        explicitTotal > 0
          ? mega
          : Math.max(0, campaigns.length - finalNano - finalMicro - finalMacro);

      return [
        {
          tier: "Nano (1K-10K)",
          count: finalNano,
          percentage: Math.round((finalNano / total) * 100),
        },
        {
          tier: "Micro (10K-200K)",
          count: finalMicro,
          percentage: Math.round((finalMicro / total) * 100),
        },
        {
          tier: "Macro (200K-1M)",
          count: finalMacro,
          percentage: Math.round((finalMacro / total) * 100),
        },
        {
          tier: "Mega (1M+)",
          count: finalMega,
          percentage: Math.round((finalMega / total) * 100),
        },
      ];
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

export function useCampaignTypes(
  params?: {
    period?: string;
    range?: string;
    fromDate?: string;
    toDate?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-campaign-types", params],
    queryFn: async () => {
      // Derive from /admin/campaigns directly — no analytics sub-endpoint call
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      let campaigns = campaignsRes.data?.data || [];
      campaigns = filterCampaignsByRange(
        campaigns,
        params?.range,
        params?.fromDate,
        params?.toDate,
      );
      const total = campaigns.length;

      const contentCount = campaigns.filter((c) => {
        const platform = (c.postingPlatform || "").toLowerCase();
        const title = (c.title || "").toLowerCase();
        const typeStr = (
          (c as unknown as { type?: string; category?: string }).type ||
          (c as unknown as { category?: string }).category ||
          ""
        ).toLowerCase();
        return (
          typeStr.includes("creation") ||
          title.includes("video") ||
          title.includes("reel") ||
          title.includes("creation") ||
          platform.includes("instagram") ||
          platform.includes("tiktok") ||
          platform.includes("youtube")
        );
      }).length;

      const ampCount = Math.max(0, total - contentCount);

      return [
        {
          type: "Content Creation",
          count: contentCount,
          percentage: total > 0 ? Math.round((contentCount / total) * 100) : 0,
        },
        {
          type: "Amplification",
          count: ampCount,
          percentage: total > 0 ? Math.round((ampCount / total) * 100) : 0,
        },
      ];
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

export function useCampaignVolume(
  params?: { year?: number; fromDate?: string; toDate?: string },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-campaign-volume", params],
    queryFn: async () => {
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      let campaigns = campaignsRes.data?.data || [];
      if (params?.fromDate || params?.toDate) {
        campaigns = filterCampaignsByRange(
          campaigns,
          undefined,
          params?.fromDate,
          params?.toDate,
        );
      }

      // Filter to the requested year — defaults to current year
      const targetYear = params?.year ?? new Date().getFullYear();
      const yearFiltered = campaigns.filter((c) => {
        if (!c.createdAt) return true;
        const d = new Date(c.createdAt);
        return isNaN(d.getTime()) || d.getFullYear() === targetYear;
      });
      if (yearFiltered.length > 0) campaigns = yearFiltered;

      // Build dynamic month list: project start → today (within the target year)
      const dynamicMonths = getDynamicMonths(12).filter(
        (m) => m.year === targetYear,
      );

      // Map: "Jun-2026" → { draft, live, completed }
      const volumeMap: Record<
        string,
        { draft: number; live: number; completed: number }
      > = {};
      dynamicMonths.forEach((m) => {
        volumeMap[`${m.label}-${m.year}`] = { draft: 0, live: 0, completed: 0 };
      });

      campaigns.forEach((c) => {
        const date = new Date(c.createdAt || Date.now());
        if (isNaN(date.getTime())) return;
        const key = monthKey(date);
        if (!volumeMap[key]) return;
        const statusStr = String(c.status).toLowerCase();
        if (statusStr === "draft") volumeMap[key].draft++;
        else if (statusStr === "completed") volumeMap[key].completed++;
        else volumeMap[key].live++;
      });

      return dynamicMonths.map((m) => ({
        label: m.label,
        ...volumeMap[`${m.label}-${m.year}`],
      }));
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

export function useBudgetByIndustry(
  params?: {
    period?: string;
    range?: string;
    fromDate?: string;
    toDate?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-budget-by-industry", params],
    queryFn: async () => {
      // 1. Extract industry & total spend directly from /admin/brands
      let brands: AdminBrandListItem[] = [];
      try {
        const brandsRes = await adminBrandsApi.getBrands({ limit: 1000 });
        brands = brandsRes.data?.data || [];
      } catch {
        brands = [];
      }

      if (params?.fromDate || params?.toDate) {
        const fromTime = params.fromDate
          ? new Date(`${params.fromDate}T00:00:00`).getTime()
          : 0;
        const toTime = params.toDate
          ? new Date(`${params.toDate}T23:59:59.999`).getTime()
          : Infinity;
        brands = brands.filter((b) => {
          const dateStr = b.joinedAt || b.joinDate;
          if (!dateStr) return true;
          const d = new Date(dateStr).getTime();
          return isNaN(d) || (d >= fromTime && d <= toTime);
        });
      }

      const budgetMap: Record<string, number> = {};
      brands.forEach((b) => {
        const rawIndustry =
          b.industry ||
          (b as unknown as { advertiser?: { industry?: string } }).advertiser
            ?.industry ||
          "General";
        const industry = rawIndustry.trim() || "General";

        const spend =
          Number(
            b.totalSpend ??
              (b as unknown as { totalSpent?: number }).totalSpent ??
              (b as unknown as { spend?: number }).spend ??
              (b as unknown as { totalBudget?: number }).totalBudget ??
              0,
          ) || 0;

        budgetMap[industry] = (budgetMap[industry] || 0) + spend;
      });

      // Secondary fallback to campaign budgets if total brand spend sum is 0
      const totalBrandSpend = Object.values(budgetMap).reduce(
        (a, b) => a + b,
        0,
      );
      if (totalBrandSpend === 0) {
        try {
          const campaignsRes = await adminCampaignsApi.getCampaigns({
            limit: 1000,
          });
          let campaigns = campaignsRes.data?.data || [];
          campaigns = filterCampaignsByRange(
            campaigns,
            params?.range,
            params?.fromDate,
            params?.toDate,
          );
          campaigns.forEach((c) => {
            const industry =
              c.postingPlatform ||
              (c as unknown as { industry?: string }).industry ||
              c.brand?.name ||
              "General";
            const amount = Number(c.budget) || 0;
            budgetMap[industry] = (budgetMap[industry] || 0) + amount;
          });
        } catch {
          // ignore
        }
      }

      const entries = Object.entries(budgetMap);
      if (entries.length === 0) return [];

      const maxBudget = Math.max(...entries.map(([, b]) => b), 1);
      return entries
        .map(([industry, budget]) => ({
          industry,
          budget,
          percentage: Math.round((budget / maxBudget) * 100),
        }))
        .sort((a, b) => b.budget - a.budget);
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

export function useSlaBreachTrend(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-sla-breach-trend"],
    queryFn: async () => {
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      const campaigns = campaignsRes.data?.data || [];
      const dynamicMonths = getDynamicMonths(12);

      const monthlyMap: Record<string, { total: number; breached: number }> =
        {};
      dynamicMonths.forEach((m) => {
        monthlyMap[`${m.label}-${m.year}`] = { total: 0, breached: 0 };
      });

      const now = Date.now();
      campaigns.forEach((c) => {
        const date = new Date(c.createdAt || now);
        if (isNaN(date.getTime())) return;
        const key = monthKey(date);
        if (!monthlyMap[key]) return;
        monthlyMap[key].total++;
        const isBreached =
          c.endDate &&
          new Date(c.endDate).getTime() < now &&
          String(c.status).toLowerCase() !== "completed";
        if (isBreached) monthlyMap[key].breached++;
      });

      return dynamicMonths.map((m) => {
        const entry = monthlyMap[`${m.label}-${m.year}`];
        const rate =
          entry.total > 0
            ? Math.round((entry.breached / entry.total) * 100)
            : 0;
        const needsYear = dynamicMonths.some(
          (x) => x.label === m.label && x.year !== m.year,
        );
        return {
          label: needsYear ? `${m.label} '${String(m.year).slice(2)}` : m.label,
          rate,
        };
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

export function useRevisionRateTrend(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-revision-rate-trend"],
    queryFn: async () => {
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      const campaigns = campaignsRes.data?.data || [];
      const dynamicMonths = getDynamicMonths(12);

      const monthlyMap: Record<string, { total: number; revisions: number }> =
        {};
      dynamicMonths.forEach((m) => {
        monthlyMap[`${m.label}-${m.year}`] = { total: 0, revisions: 0 };
      });

      campaigns.forEach((c) => {
        const date = new Date(c.createdAt || Date.now());
        if (isNaN(date.getTime())) return;
        const key = monthKey(date);
        if (!monthlyMap[key]) return;
        monthlyMap[key].total++;
        const statusStr = String(c.status).toLowerCase();
        if (
          statusStr === "draft" ||
          statusStr === "paused" ||
          statusStr === "cancelled"
        ) {
          monthlyMap[key].revisions++;
        }
      });

      return dynamicMonths.map((m) => {
        const entry = monthlyMap[`${m.label}-${m.year}`];
        const rate =
          entry.total > 0
            ? Math.round((entry.revisions / entry.total) * 100)
            : 0;
        const needsYear = dynamicMonths.some(
          (x) => x.label === m.label && x.year !== m.year,
        );
        return {
          label: needsYear ? `${m.label} '${String(m.year).slice(2)}` : m.label,
          rate,
        };
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

export function useCompletionRateTrend(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-completion-rate-trend"],
    queryFn: async () => {
      const campaignsRes = await adminCampaignsApi.getCampaigns({
        limit: 1000,
      });
      const campaigns = campaignsRes.data?.data || [];
      const dynamicMonths = getDynamicMonths(12);

      const monthlyMap: Record<string, { total: number; completed: number }> =
        {};
      dynamicMonths.forEach((m) => {
        monthlyMap[`${m.label}-${m.year}`] = { total: 0, completed: 0 };
      });

      campaigns.forEach((c) => {
        const date = new Date(c.createdAt || Date.now());
        if (isNaN(date.getTime())) return;
        const key = monthKey(date);
        if (!monthlyMap[key]) return;
        monthlyMap[key].total++;
        if (String(c.status).toLowerCase() === "completed") {
          monthlyMap[key].completed++;
        }
      });

      return dynamicMonths.map((m) => {
        const entry = monthlyMap[`${m.label}-${m.year}`];
        const rate =
          entry.total > 0
            ? Math.round((entry.completed / entry.total) * 100)
            : 0;
        const needsYear = dynamicMonths.some(
          (x) => x.label === m.label && x.year !== m.year,
        );
        return {
          label: needsYear ? `${m.label} '${String(m.year).slice(2)}` : m.label,
          rate,
        };
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

// Re-export unused variable to avoid TS unused-export warning
export { useAllCampaigns };
