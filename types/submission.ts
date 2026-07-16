export type SubmissionStatus =
  "in_progress" | "awaiting_review" | "revision_requested" | "live";

export interface CampaignSubmission {
  id: string;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
    rating?: number;
  };
  platform: string;
  submittedAt: string;
  status: SubmissionStatus;
  contentLink?: string;
  caption?: string;
  revisionFeedback?: string;
}
