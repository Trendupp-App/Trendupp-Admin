export type TransactionStatus = "on_hold" | "available" | "completed";

export interface PayoutTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  direction: "credit" | "debit";
  status: TransactionStatus;
}

export interface EscrowItem {
  id: string;
  title: string;
  brandName: string;
  amount: number;
  progressPercent: number;
  daysRemaining: number;
  withdrawableFrom: string;
}

export interface NeedingFundingItem {
  id: string;
  title: string;
  category: string;
  lastEditedLabel: string;
  sectionsCompleted: number;
  sectionsTotal: number;
}

export interface PayoutSummary {
  availableBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
}
