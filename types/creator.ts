export interface TopPerformerCreator {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  instagramUsername: string | null;
  instagramFollowers: number;
  twitterUsername: string | null;
  twitterFollowers: number;
  tiktokUsername: string | null;
  tiktokFollowers: number;
  youtubeUsername: string | null;
  youtubeFollowers: number;
  avatarUrl: string | null;
  assignedTier: string | null;
  avgRating: number | null;
  totalReviews: number;
}
