import { useQuery } from "@tanstack/react-query";
import { adminEscrowApi } from "@/services/adminEscrowApi";
import type {
  EscrowOverviewDto,
  PaginatedEscrowBalances,
  PaginatedCreatorPayouts,
  PaginatedAdvertiserRefunds,
} from "@/types/adminEscrow";

// ── Overview KPI + monthly chart ──────────────────────────────────────────────

export function useEscrowOverview(year?: number, enabled = true) {
  return useQuery<EscrowOverviewDto>({
    queryKey: ["admin-escrow-overview", year],
    queryFn: () => adminEscrowApi.getOverview(year).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
}

// ── Escrow Balances table ─────────────────────────────────────────────────────

export function useEscrowBalances(page = 1, limit = 10, enabled = true) {
  return useQuery<PaginatedEscrowBalances>({
    queryKey: ["admin-escrow-balances", page, limit],
    queryFn: () => adminEscrowApi.getBalances(page, limit).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    retry: false,
    enabled,
    placeholderData: (prev) => prev,
  });
}

// ── Creator Payouts table ─────────────────────────────────────────────────────

export function useCreatorPayouts(page = 1, limit = 10, enabled = true) {
  return useQuery<PaginatedCreatorPayouts>({
    queryKey: ["admin-escrow-creator-payouts", page, limit],
    queryFn: () =>
      adminEscrowApi.getCreatorPayouts(page, limit).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    retry: false,
    enabled,
    placeholderData: (prev) => prev,
  });
}

// ── Advertiser Refunds table ──────────────────────────────────────────────────

export function useAdvertiserRefunds(page = 1, limit = 10, enabled = true) {
  return useQuery<PaginatedAdvertiserRefunds>({
    queryKey: ["admin-escrow-advertiser-refunds", page, limit],
    queryFn: () =>
      adminEscrowApi.getAdvertiserRefunds(page, limit).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    retry: false,
    enabled,
    placeholderData: (prev) => prev,
  });
}
