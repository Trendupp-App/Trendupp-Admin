import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  "super_admin" | "owner" | "finance_admin" | "moderator" | "support_agent";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  displayName?: string;
  isActive?: boolean;
  isEmailVerified: boolean;
  onboardingPercentage?: number;
  onboardingStepsCompleted?: Record<string, boolean>;
  socialsConnected?: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    twitter: boolean;
  };
  username?: string | null;
  niches?: Array<{ id: string; name: string; order: number }>;
  industries?: Array<{ id: string; name: string }>;
  assignedTier?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  nationalityId?: string | null;
  countryId?: string | null;
  stateId?: string | null;
  city?: string | null;
  instagramUsername?: string | null;
  instagramFollowers?: number | null;
  tiktokUsername?: string | null;
  tiktokFollowers?: number | null;
  youtubeUsername?: string | null;
  youtubeFollowers?: number | null;
  twitterUsername?: string | null;
  twitterFollowers?: number | null;
  brandRepresentative?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  avgRating?: number | null;
  totalReviews?: number | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setSession: (accessToken, user) => set({ accessToken, user }),
      clearSession: () => {
        set({ accessToken: null, user: null });
        if (typeof window !== "undefined") {
          window.location.href = "/admin/signin";
        }
      },
      updateUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : null })),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "trendupp-auth",
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
