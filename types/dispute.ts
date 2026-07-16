export interface CreateDisputePayload {
  campaignId: string;
  reason: string;
  creatorId?: string;
}
export type DisputeStatus = "raised" | "under_review" | "resolved";

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
  resolutionNotes?: string | null;
  action?: "release_to_creator" | "refund_to_brand" | "split" | null;
  splitCreatorAmount?: number | null;
}

export interface RaiseDisputePayload {
  campaignId: string;
  creatorId?: string;
  reason: string;
}

export interface ResolveDisputePayload {
  action: "release_to_creator" | "refund_to_brand" | "split";
  resolutionNotes: string;
  splitCreatorAmount?: number;
}

export interface StreamTokenResponse {
  token: string;
  apiKey: string;
}
