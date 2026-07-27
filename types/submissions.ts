export interface SubmissionCreator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
}

export interface LiveLinkEntry {
  url: string;
  isLive: boolean;
  checkedAt: string;
}

export type LiveLinkMap = Record<string, string | LiveLinkEntry>;

export interface CampaignSubmission {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: string;
  applicationId: string;
  creatorId: string;
  draftLink: string | null;
  liveLink: LiveLinkMap | null;
  status: SubmissionStatus;
  brandFeedback: string | null;
  urlIsLive: boolean | null;
  urlCheckedAt: string | null;
  creator: SubmissionCreator;
  application: SubmissionApplication;
}

export interface SubmissionApplication {
  id: string;
  contentIdea: string;
  pastWorkLink: string;
  primaryPlatformId: string;
  secondaryPlatformId: string | null;
  feeRequest: number;
  comments: string | null;
  status: string;
}

export type SubmissionStatus =
  | "pending_approval"
  | "revision_requested"
  | "approved"
  | "livelink_available"
  | "done"
  | "revision-sent"
  | "live"
  | string;

export interface CampaignSubmission {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: string;
  applicationId: string;
  creatorId: string;
  draftLink: string | null;
  liveLink: LiveLinkMap | null;
  status: SubmissionStatus;
  brandFeedback: string | null;
  urlIsLive: boolean | null;
  urlCheckedAt: string | null;
  creator: SubmissionCreator;
  application: SubmissionApplication;
}

export interface VetDraftPayload {
  decision: "approved" | "request_revision";
  brandFeedback?: string;
}
