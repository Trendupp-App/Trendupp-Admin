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
  agencyCommission?: number;
  vat?: number;
  gatewayCharges?: number;
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
  totalFunded?: number;
  breakdown?: EscrowBreakdownDto;
  fundingStatus?: string;
  campaignStatus?: string;
  lastUpdated?: string;
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
  status?: EscrowStatus | string;
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
  status: PayoutStatus | string;
  account?: string;
  transactionTrigger?: string;
  triggeredBy?: string;
  paidAt?: string;
  createdAt?: string;
  dateInitiated?: string;
}

export interface PaginatedCreatorPayouts {
  data: CreatorPayoutItem[];
  meta: PaginationMeta;
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
  };
  campaign?: {
    id?: string;
    title?: string;
  };
  campaignTitle?: string;
  amount: number;
  status: RefundStatus | string;
  reason?: string;
  refundedAt?: string;
  createdAt?: string;
  dateInitiated?: string;
  account?: string;
  transactionTrigger?: string;
}

export interface PaginatedAdvertiserRefunds {
  data: AdvertiserRefundItem[];
  meta: PaginationMeta;
  total?: number;
}
