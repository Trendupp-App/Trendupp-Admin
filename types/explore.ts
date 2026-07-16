export interface ExploreCreator {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  followersCount: number;
  niches: { id: string; name: string }[];
  assignedTier: string | null;
  avgRating: number | null;
  totalReviews: number;
}

export interface ExploreBrand {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  followersCount: number;
  industries: { id: string; name: string }[];
  totalCampaigns: number;
}

export interface ExploreCategory {
  id: string;
  name: string;
}
