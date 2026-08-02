// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Overview / KPI ─────────────────────────────────────────────────────────────

export interface EscrowChartItem {
  month: string;
  amount: number;
}

export interface EscrowChartsDto {
  platformRatePercentage?: number;
  advertisersSpend?: EscrowChartItem[];
  agencyCommission?: EscrowChartItem[];
  creatorPayout?: EscrowChartItem[];
  escrowBalance?: EscrowChartItem[];
}

export interface EscrowMonthlyChartItem {
  month: string;
  advertiserSpend?: number;
  agencyCommission?: number;
  creatorPayout?: number;
  totalPayouts?: number;
}

export interface EscrowBreakdownDto {
  commission?: number;
  commissionRate?: number;
  vat?: number;
  vatRate?: number;
  gatewayFee?: number;
  gatewayRate?: number;
  netAmount?: number;
  agencyCommission?: number;
  creatorNetBudget?: number;
}

export interface EscrowRecentActivityItem {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  advertiser?: {
    id?: string;
    name?: string;
  };
  brand?: {
    id?: string;
    name?: string;
  };
  brandName?: string;
  totalFunded?: number;
  totalAmount?: number;
  amount?: number;
  campaignBudget?: number;
  agencyCommission?: number;
  vat?: number;
  breakdown?: EscrowBreakdownDto;
  fundingStatus?: string;
  status?: string;
  campaignStatus?: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EscrowOverviewDto {
  totalEscrowValue?: number;
  totalCampaignsInEscrow?: number;
  totalPayouts?: number;
  totalRefunds?: number;
  charts?: EscrowChartsDto;
  monthlyChart?: EscrowMonthlyChartItem[];
  recentActivity?: EscrowRecentActivityItem[];
  summary?: {
    totalAdvertisersSpend?: number;
    totalAgencyCommission?: number;
    totalCreatorPayout?: number;
    totalEscrowBalance?: number;
    totalEscrowValue?: number;
    totalInEscrow?: number;
    totalPayouts?: number;
    totalRefunds?: number;
  };
}

// ── Escrow Balances ────────────────────────────────────────────────────────────

export type EscrowStatus =
  | "funded"
  | "released"
  | "held"
  | "processing"
  | "failed"
  | "refunded"
  | "pending"
  | "completed"
  | "active"
  | "cancelled";

export interface EscrowBalanceItem {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  campaign?: {
    id?: string;
    title?: string;
    platform?: string;
    status?: string;
  };
  brand?: {
    id?: string;
    name?: string;
    logo?: string;
  };
  brandName?: string;
  advertiser?: {
    id?: string;
    name?: string;
  };
  creator?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  creatorName?: string;
  totalAmount?: number;
  totalFunded?: number;
  escrowAmount?: number;
  amount?: number;
  campaignBudget?: number;
  agencyCommission?: number;
  commission?: number;
  vat?: number;
  netAmount?: number;
  breakdown?: EscrowBreakdownDto;
  status?: EscrowStatus | (string & {});
  fundingStatus?: string;
  campaignStatus?: string;
  dueDate?: string;
  lastUpdated?: string;
  updatedAt?: string;
  createdAt?: string;
  completionPercentage?: number;
}

export interface PaginatedEscrowBalances {
  data: EscrowBalanceItem[];
  meta: PaginationMeta;
  totalMoneyInEscrow?: number;
  currentMoneyInEscrow?: number;
  lastUpdated?: string;
  total?: number;
}

// ── Creator Payouts ────────────────────────────────────────────────────────────

export interface EscrowMetricDetail {
  count?: number;
  totalAmount?: number;
}

export interface EscrowMetrics {
  pending?: EscrowMetricDetail;
  successful?: EscrowMetricDetail;
  failed?: EscrowMetricDetail;
  onHold?: EscrowMetricDetail;
}

export type PayoutStatus =
  "pending" | "processing" | "successful" | "failed" | "paid" | "unpaid";

export interface CreatorPayoutItem {
  id: string;
  creator?: {
    id?: string;
    name?: string;
    avatar?: string;
    accountNumber?: string;
    bankName?: string;
  };
  creatorName?: string;
  creatorAvatar?: string;
  brand?: {
    id?: string;
    name?: string;
  };
  brandName?: string;
  campaign?: {
    id?: string;
    title?: string;
  };
  campaignTitle?: string;
  amount: number;
  status: PayoutStatus | (string & {});
  account?: string;
  transactionTrigger?: string;
  triggeredBy?: string;
  paidAt?: string;
  createdAt?: string;
  dateInitiated?: string;
  lastUpdated?: string;
  updatedAt?: string;
  failureReason?: string;
}

export interface EscrowSummaryDto {
  totalAdvertisersSpend?: number;
  totalAgencyCommission?: number;
  totalCreatorPayout?: number;
  totalEscrowBalance?: number;
  totalEscrowValue?: number;
  totalInEscrow?: number;
  totalPayouts?: number;
  totalRefunds?: number;
}

export interface PaginatedCreatorPayouts {
  data: CreatorPayoutItem[];
  meta: PaginationMeta;
  metrics?: EscrowMetrics;
  summary?: EscrowSummaryDto;
  total?: number;
}

// ── Advertiser Refunds ─────────────────────────────────────────────────────────

export type RefundStatus =
  "pending" | "processing" | "successful" | "failed" | "refunded";

export interface AdvertiserRefundItem {
  id: string;
  advertiser?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  advertiserName?: string;
  brand?: {
    id?: string;
    name?: string;
    logo?: string;
    avatar?: string;
  };
  campaign?: {
    id?: string;
    title?: string;
  };
  campaignTitle?: string;
  amount: number;
  status: RefundStatus | (string & {});
  reason?: string;
  refundedAt?: string;
  createdAt?: string;
  dateInitiated?: string;
  lastUpdated?: string;
  updatedAt?: string;
  account?: string;
  transactionTrigger?: string;
  failureReason?: string;
}

export interface PaginatedAdvertiserRefunds {
  data: AdvertiserRefundItem[];
  meta: PaginationMeta;
  metrics?: EscrowMetrics;
  summary?: EscrowSummaryDto;
  total?: number;
}
