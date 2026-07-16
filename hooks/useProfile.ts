import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  profileApi,
  UpdateProfileSocialsPayload,
  UpdateProfilePayoutPayload,
  NotificationSettings,
  SecuritySettings,
  ChangePasswordPayload,
  DeactivateAccountPayload,
  SupportTicket,
} from "@/services/profileApi";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/services/usersApi";

export type { SupportTicket };

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => profileApi.getUserDetail(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePersonalInfo() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updatePersonalInfo(formData),
    onSuccess: ({ data }) => {
      const u = data?.user || data;
      // Sync global auth store
      updateUser({
        firstName: u?.firstName,
        lastName: u?.lastName,
        email: u?.email,
        username: u?.username,
        bio: u?.bio,
        avatarUrl: u?.avatarUrl,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data?.message ?? "Personal info updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not update profile");
    },
  });
}

export function useUpdateProfileNiches() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { nicheIds: string[] }) =>
      profileApi.updateNiches(payload),
    onSuccess: ({ data }) => {
      const u = data?.user || data;
      // Sync global auth store
      updateUser({
        niches: u?.niches,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data?.message ?? "Niches updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not update niches");
    },
  });
}

export function useUpdateProfileSocials() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileSocialsPayload) =>
      profileApi.updateSocials(payload),
    onSuccess: ({ data }) => {
      const u = data?.user || data;
      // Sync global auth store
      updateUser({
        socialsConnected: u?.socialsConnected,
        assignedTier: u?.assignedTier,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data?.message ?? "Social accounts updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not update social connections",
      );
    },
  });
}

export function useUpdateProfilePayout() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayoutPayload) =>
      profileApi.updatePayout(payload),
    onSuccess: ({ data }) => {
      const u = data?.user || data;
      // Sync global auth store
      updateUser({
        bankName: u?.bankName,
        bankAccountNumber: u?.bankAccountNumber,
        bankAccountName: u?.bankAccountName,
      });
      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data?.message ?? "Payout details saved successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not save payout details",
      );
    },
  });
}

export function useNotificationSettings(enabled: boolean) {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: () =>
      profileApi.getNotificationSettings().then((r) => r.data.settings),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<NotificationSettings>) =>
      profileApi.updateNotificationSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      toast.success("Notification preferences updated");
    },
    onError: () => {
      toast.error("Could not update notification preferences");
    },
  });
}

export function useSecuritySettings(enabled: boolean) {
  return useQuery({
    queryKey: ["securitySettings"],
    queryFn: () =>
      profileApi.getSecuritySettings().then((r) => r.data.settings),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<SecuritySettings>) =>
      profileApi.updateSecuritySettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securitySettings"] });
      toast.success("Security settings updated");
    },
    onError: () => {
      toast.error("Could not update security settings");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      profileApi.changePassword(payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Password changed successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not change password");
    },
  });
}

export function useDeactivateAccount() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeactivateAccountPayload) =>
      profileApi.deactivateAccount(payload),
    onSuccess: ({ data }) => {
      // Clear active session
      clearSession();
      // Invalidate queries
      queryClient.clear();
      toast.success(data.message ?? "Account deactivated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not deactivate account",
      );
    },
  });
}

export function useSupportTicketCategories(enabled: boolean) {
  return useQuery({
    queryKey: ["supportTicketCategories"],
    queryFn: () =>
      profileApi.getSupportTicketCategories().then((r) => r.data.categories),
    enabled,
    staleTime: 1000 * 60 * 30,
  });
}

export function useSupportTickets(enabled: boolean) {
  return useQuery<SupportTicket[]>({
    queryKey: ["supportTickets"],
    queryFn: async () => {
      const { data } = await profileApi.getSupportTickets();
      return data.tickets ?? [];
    },
    enabled,
    staleTime: 1000 * 60 * 2, // refresh every 2 min
  });
}

export function useSubmitSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => profileApi.submitSupportTicket(payload),
    onSuccess: ({ data }) => {
      // Refresh the tickets list so "My Tickets" reflects the new submission
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
      toast.success(data.message ?? "Ticket submitted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not submit ticket");
    },
  });
}

export function useCreatorProfile(id: string | null) {
  return useQuery({
    queryKey: ["creator-profile", id],
    queryFn: () => usersApi.getExploreProfile(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}

export function useBrandProfile(id: string | null) {
  return useQuery({
    queryKey: ["brand-profile", id],
    queryFn: () => usersApi.getExploreBrandProfile(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}
export function useTopPerformers() {
  return useQuery({
    queryKey: ["top-performers"],
    queryFn: () => usersApi.getTopPerformers().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}
