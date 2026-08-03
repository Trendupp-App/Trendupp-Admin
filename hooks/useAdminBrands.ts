import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBrandsApi } from "@/services/adminBrandsApi";
import type { BrandListQueryParams } from "@/types/adminBrands";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useBrandSummary(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-brand-summary"],
    queryFn: () => adminBrandsApi.getSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useBrandSignupGrowth(
  period?: string,
  year?: number,
  month?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-brand-signup-growth", period, year, month],
    queryFn: async () => {
      const res = await adminBrandsApi.getSignupGrowth({ period, year, month });
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: typeof data }).data)
      ) {
        return (data as { data: typeof data }).data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useBrandActiveUsers(
  period?: string,
  year?: number,
  month?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-brand-active-users", period, year, month],
    queryFn: async () => {
      const res = await adminBrandsApi.getActiveUsers({ period, year, month });
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: typeof data }).data)
      ) {
        return (data as { data: typeof data }).data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useTopBrands(
  params?: {
    startDate?: string;
    endDate?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    period?: string;
    year?: number;
  },
  enabled: boolean = true,
) {
  const startDate = params?.startDate || params?.fromDate;
  const endDate = params?.endDate || params?.toDate;

  return useQuery({
    queryKey: [
      "admin-top-brands",
      startDate,
      endDate,
      params?.limit,
      params?.period,
      params?.year,
    ],
    queryFn: () =>
      adminBrandsApi
        .getTopBrands({
          startDate,
          endDate,
          limit: params?.limit,
          period: params?.period,
          year: params?.year,
        })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useBrandIndustryBreakdown(
  params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [
      "admin-brand-industry-breakdown",
      params?.period,
      params?.year,
      params?.month,
      params?.startDate,
      params?.endDate,
    ],
    queryFn: () =>
      adminBrandsApi.getIndustryBreakdown(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useBrandCountryBreakdown(
  params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [
      "admin-brand-country-breakdown",
      params?.period,
      params?.year,
      params?.month,
      params?.startDate,
      params?.endDate,
    ],
    queryFn: () =>
      adminBrandsApi.getCountryBreakdown(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useAdminBrandsList(
  params?: BrandListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-brands-list", params],
    queryFn: () => adminBrandsApi.getBrands(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useBrandDetails(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-brand-details", id],
    queryFn: () => {
      if (!id) Promise.reject("No brand ID");
      return adminBrandsApi.getBrandById(id!).then((r) => r.data);
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSuspendBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminBrandsApi.suspendBrand(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-brand-details", id],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-brands-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-brand-summary"] });
      toast.success(res.data?.message || "Brand account suspended");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to suspend brand account",
      );
    },
  });
}

export function useReactivateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminBrandsApi.reactivateBrand(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-brand-details", id],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-brands-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-brand-summary"] });
      toast.success(res.data?.message || "Brand account reactivated");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to reactivate brand account",
      );
    },
  });
}

export function useBrandCampaignHistory(
  id: string | null,
  page = 1,
  limit = 10,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-brand-campaign-history", id, page, limit],
    queryFn: () => {
      if (!id) Promise.reject("No brand ID");
      return adminBrandsApi
        .getBrandCampaignHistory(id!, page, limit)
        .then((r) => r.data);
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useBrandNotes(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-brand-notes", id],
    queryFn: () => {
      if (!id) Promise.reject("No brand ID");
      return adminBrandsApi.getNotes(id!).then((r) => r.data);
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 30,
  });
}

export function useAddBrandNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      adminBrandsApi.addNote(id, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-brand-notes", variables.id],
      });
      toast.success("Brand note added successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to add brand note");
    },
  });
}

export function useUpdateBrandNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      noteId,
      note,
    }: {
      id: string;
      noteId: string;
      note: string;
    }) => adminBrandsApi.updateNote(id, noteId, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-brand-notes", variables.id],
      });
      toast.success("Brand note updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update brand note");
    },
  });
}

export function useDeleteBrandNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, noteId }: { id: string; noteId: string }) =>
      adminBrandsApi.deleteNote(id, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-brand-notes", variables.id],
      });
      toast.success("Brand note deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to delete brand note");
    },
  });
}
