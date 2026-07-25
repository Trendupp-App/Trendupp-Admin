import type { Campaign } from "@/types/campaign";

export type DisputeStatus = "raised" | "under_review" | "resolved";

export type EscrowActionType =
  | "release_to_creator"
  | "refund_to_brand"
  | "split"
  | "allow_content_submission"
  | "allow_content_review"
  | "allow_revised_submission"
  | "allow_revised_review";

export interface DisputeAdminSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

export interface Dispute {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: string;
  creatorId: string;
  brandId: string;
  reason: string;
  status: DisputeStatus;
  notes?: string | null;
  streamChannelId?: string | null;
  escrowAction?: EscrowActionType | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  activatedById?: string | null;
  activatedAt?: string | null;
  resolvedById?: string | null;
  campaign?: Campaign | null;
  activatedBy?: DisputeAdminSummary | null;
  resolvedBy?: DisputeAdminSummary | null;
}

export interface RaiseDisputePayload {
  campaignId: string;
  creatorId?: string;
  reason: string;
}

export interface ResolveDisputePayload {
  action: EscrowActionType;
  resolutionNotes: string;
  splitCreatorAmount?: number;
}

export interface StreamTokenResponse {
  token: string;
  apiKey: string;
}

// Kept for backwards compatibility with existing campaign-side dispute usage.
export interface CreateDisputePayload {
  campaignId: string;
  reason: string;
  creatorId?: string;
}
