import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsApi } from "@/services/adminSettingsApi";
import type {
  BrandIndustry,
  TicketCategory,
  CreateNicheDto,
  UpdateNicheDto,
} from "@/types/adminSettings";
import { toast } from "sonner";
import type { AxiosError } from "axios";

const unwrap = <T>(data: T[] | { data: T[] }): T[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
};

const errMsg = (err: AxiosError<{ message?: string }>, fallback: string) =>
  err.response?.data?.message || fallback;

// ── Brand Industries ─────────────────────────────────────────────────────────

export function useIndustries(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-brand-industries"],
    queryFn: () =>
      adminSettingsApi
        .getIndustries()
        .then((res) => unwrap<BrandIndustry>(res.data)),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreateIndustry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNicheDto) => adminSettingsApi.createIndustry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand-industries"] });
      toast.success("Industry added successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(errMsg(err, "Failed to add industry"));
    },
  });
}

export function useUpdateIndustry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNicheDto }) =>
      adminSettingsApi.updateIndustry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand-industries"] });
      toast.success("Industry updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(errMsg(err, "Failed to update industry"));
    },
  });
}

export function useDeleteIndustry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSettingsApi.deleteIndustry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand-industries"] });
      toast.success("Industry deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(errMsg(err, "Failed to delete industry"));
    },
  });
}

// ── Support Ticket Categories ────────────────────────────────────────────────

export function useTicketCategories(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-ticket-categories"],
    queryFn: () =>
      adminSettingsApi
        .getTicketCategories()
        .then((res) => unwrap<TicketCategory>(res.data)),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreateTicketCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNicheDto) =>
      adminSettingsApi.createTicketCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-categories"] });
      toast.success("Ticket category added successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(errMsg(err, "Failed to add ticket category"));
    },
  });
}

export function useUpdateTicketCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNicheDto }) =>
      adminSettingsApi.updateTicketCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-categories"] });
      toast.success("Ticket category updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(errMsg(err, "Failed to update ticket category"));
    },
  });
}

export function useDeleteTicketCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSettingsApi.deleteTicketCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-categories"] });
      toast.success("Ticket category deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(errMsg(err, "Failed to delete ticket category"));
    },
  });
}
