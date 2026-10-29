// Response shared by the creator/brand suspend, reactivate, campaign-access
// and ban endpoints.
export interface AdminUserActionResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    canApplyToCampaigns: boolean;
    isBanned: boolean;
    bannedAt: string | null;
    banReason: string | null;
  };
}
