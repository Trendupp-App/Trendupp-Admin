import { useQuery } from "@tanstack/react-query";
import { adminOverviewApi } from "@/services/adminOverviewApi";
import { adminEscrowApi } from "@/services/adminEscrowApi";
import { disputeApi } from "@/services/disputeApi";
import type { AdminOverviewResponseDto } from "@/types/adminOverview";

export function useAdminOverview(enabled: boolean = true) {
  return useQuery<AdminOverviewResponseDto>({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [overviewRes, payoutsRes, balancesRes, disputesRes] =
        await Promise.allSettled([
          adminOverviewApi.getOverview(),
          adminEscrowApi.getCreatorPayouts(1, 100),
          adminEscrowApi.getBalances(1, 100),
          disputeApi.getDisputes(),
        ]);

const baseOverview: AdminOverviewResponseDto = {
  topMetrics: {
    totalCreators: 0,
    totalBrands: 0,
    totalCampaigns: 0,
    openDisputes: 0,
  },
  actionsRequired: {
    unresolvedDisputes: 0,
    resolvedDisputes: 0,
    creatorsAwaitingPayment: 0,
    failedPayouts: 0,
  },
  campaignOverview: {
    total: 0,
    draft: 0,
    live: 0,
    active: 0,
    postPending: 0,
    completed: 0,
  },
  creatorTiers: {
    totalRegistered: 0,
    pendingVerification: 0,
    newThisWeek: 0,
    tiers: [],
  },
  recentCampaignActivity: [],
  topCreators: [],
};

const overview =
  overviewRes.status === "fulfilled" ? overviewRes.value.data : baseOverview;
      const payouts =
        payoutsRes.status === "fulfilled"
          ? (payoutsRes.value.data?.data ?? [])
          : [];

      const balances =
        balancesRes.status === "fulfilled"
          ? (balancesRes.value.data?.data ?? [])
          : [];

      const disputes =
        disputesRes.status === "fulfilled"
          ? Array.isArray(disputesRes.value.data)
            ? disputesRes.value.data
            : []
          : [];

      // Derive real live counts for actions required
      const liveFailedPayouts = payouts.filter(
        (p) => String(p.status).toLowerCase() === "failed",
      ).length;

      const liveAwaitingPayment =
        payouts.filter((p) =>
          ["pending", "processing", "held"].includes(
            String(p.status).toLowerCase(),
          ),
        ).length ||
        balances.filter((b) =>
          ["funded", "held", "active"].includes(String(b.status).toLowerCase()),
        ).length;

      const liveUnresolvedDisputes = disputes.filter(
        (d) =>
          String(d.status).toLowerCase() !== "resolved" &&
          String(d.status).toLowerCase() !== "closed",
      ).length;

      const liveResolvedDisputes = disputes.filter(
        (d) =>
          String(d.status).toLowerCase() === "resolved" ||
          String(d.status).toLowerCase() === "closed",
      ).length;

      return {
        ...overview,
        actionsRequired: {
          failedPayouts:
            overview?.actionsRequired?.failedPayouts ?? liveFailedPayouts,
          creatorsAwaitingPayment:
            overview?.actionsRequired?.creatorsAwaitingPayment ??
            liveAwaitingPayment,
          unresolvedDisputes:
            overview?.actionsRequired?.unresolvedDisputes ??
            liveUnresolvedDisputes,
          resolvedDisputes:
            overview?.actionsRequired?.resolvedDisputes ?? liveResolvedDisputes,
        },
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    enabled,
  });
}
