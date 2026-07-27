import apiClient from "@/lib/apiClient";
import type {
  EscrowOverviewDto,
  PaginatedEscrowBalances,
  PaginatedCreatorPayouts,
  PaginatedAdvertiserRefunds,
} from "@/types/adminEscrow";

export const adminEscrowApi = {
  // 1. Overview KPI + monthly chart data
  getOverview: (year?: number) =>
    apiClient.get<EscrowOverviewDto>("/admin/escrow/overview", {
      params: year ? { year } : undefined,
    }),

  // 2. Escrow balances table (paginated)
  getBalances: (page = 1, limit = 10) =>
    apiClient.get<PaginatedEscrowBalances>("/admin/escrow/balances", {
      params: { page, limit },
    }),

  // 3. Creator payout records (paginated)
  getCreatorPayouts: (page = 1, limit = 10) =>
    apiClient.get<PaginatedCreatorPayouts>("/admin/escrow/payouts/creators", {
      params: { page, limit },
    }),

  // 4. Advertiser refund records (paginated)
  getAdvertiserRefunds: (page = 1, limit = 10) =>
    apiClient.get<PaginatedAdvertiserRefunds>(
      "/admin/escrow/refunds/advertisers",
      { params: { page, limit } },
    ),
};
