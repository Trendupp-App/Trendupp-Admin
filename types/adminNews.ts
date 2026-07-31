export interface AdminNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category:
    | "Industry"
    | "Platform Update"
    | "Brands"
    | "Tips"
    | "Announcements"
    | string;
  status:
    | "draft"
    | "published"
    | "scheduled"
    | "archived"
    | "Draft"
    | "Published"
    | "Scheduled"
    | "Archived"
    | string;
  coverImage?: string;
  image?: string;
  isPlatformUpdate?: boolean;
  isTopNews?: boolean;
  industryId?: string;
  brand?: string;
  brandAvatar?: string;
  readTime?: string;
  tags?: string[];
  views?: number;
  authorName?: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNewsDto {
  title: string;
  summary: string;
  content: string;
  category: string;
  status?: string;
  isPlatformUpdate?: boolean;
  isTopNews?: boolean;
  industryId?: string;
  coverImage?: File | string | null;
  brand?: string;
  authorName?: string;
  tags?: string[];
  scheduledAt?: string;
}

export interface UpdateNewsDto {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  status?: string;
  isPlatformUpdate?: boolean;
  isTopNews?: boolean;
  industryId?: string;
  coverImage?: File | string | null;
  brand?: string;
  authorName?: string;
  tags?: string[];
  scheduledAt?: string;
}

export interface NewsQueryParams {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedNewsResponse {
  data: AdminNewsItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
