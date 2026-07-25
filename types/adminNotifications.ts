export type BroadcastAudience = "all" | "creators" | "brands";
export type BroadcastChannel = "in_app" | "email" | "push";
export type BroadcastStatus = "draft" | "scheduled" | "sent";

export interface AdminBroadcastItem {
  id: string;
  title: string;
  message: string;
  audience: BroadcastAudience;
  channel: BroadcastChannel;
  status: BroadcastStatus;
  scheduledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  sentCount?: number;
}

export interface CreateBroadcastPayload {
  title: string;
  message: string;
  audience: BroadcastAudience;
  channel: BroadcastChannel;
  status: BroadcastStatus;
  scheduledAt?: string;
}

export type UpdateBroadcastPayload = Partial<CreateBroadcastPayload>;

export interface AdminBroadcastQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  search?: string;
  status?: string;
  audience?: string;
  channel?: string;
}

export interface PaginatedAdminBroadcastsResponse {
  data: AdminBroadcastItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
