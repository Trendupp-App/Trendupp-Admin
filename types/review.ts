export interface CreateReviewPayload {
  campaignId: string;
  creatorId: string;
  starRating: number;
  comment?: string;
}
