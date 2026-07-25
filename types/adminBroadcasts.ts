export type BroadcastAudience = "all" | "brands" | "creators";
export type BroadcastChannel = "in_app" | "email" | "both";
export type BroadcastStatus = "draft" | "sent" | "scheduled";

export interface BroadcastCreatedByDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AdminBroadcastDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  message: string;
  audience: BroadcastAudience;
  channel: BroadcastChannel;
  status: BroadcastStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  totalRecipients: number;
  createdById: string;
  createdBy: BroadcastCreatedByDto;
}

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedBroadcastsResponse {
  data: AdminBroadcastDto[];
  meta: PaginationMetaDto;
}

export interface BroadcastListQueryParams {
  page?: number;
  limit?: number;
  tab?: "all" | "draft" | "sent" | "scheduled";
  audience?: BroadcastAudience;
  q?: string;
}

export interface CreateBroadcastPayload {
  title: string;
  message: string;
  audience: BroadcastAudience;
  channel: BroadcastChannel;
  status: BroadcastStatus;
  scheduledAt?: string;
}

export interface UpdateBroadcastPayload {
  title?: string;
  message?: string;
  audience?: BroadcastAudience;
  channel?: BroadcastChannel;
  status?: BroadcastStatus;
  scheduledAt?: string;
}

export interface CreateBroadcastResponse {
  message: string;
  broadcast: AdminBroadcastDto;
}

export interface GetBroadcastResponse {
  broadcast: AdminBroadcastDto;
}

export interface UpdateBroadcastResponse {
  message: string;
  broadcast: AdminBroadcastDto;
}
