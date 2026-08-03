export type PostPlatform =
  "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";

export type PostResolutionStatus =
  | "pending"
  | "resolved"
  | "unowned"
  | "unsupported"
  | "unauthorized"
  | "error"
  | string;

export interface MetricValueDto {
  value?: number;
  [key: string]: unknown;
}

export interface PlatformMetricsDto {
  platform: PostPlatform;
  platformLabel: string;
  url: string;
  mediaType?: string | null;
  publishedAt?: string | null;
  ownershipVerified: boolean;
  resolutionStatus: PostResolutionStatus;
  resolutionError?: unknown;
  capturedAt?: string | null;
  windowLabel?: string | null;
  metrics: Record<string, MetricValueDto | number>;
}

export interface CampaignMetricsDto {
  campaignId: string;
  posts: PlatformMetricsDto[];
  notComparableAcrossPlatforms: string[];
  totals: Record<string, number>;
}
