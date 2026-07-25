import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAdsApi } from "@/services/adminAdsApi";
import type {
  AdSummaryDto,
  BannerAdItem,
  CreateAdDto,
  UpdateAdDto,
  AdListQueryParams,
} from "@/types/adminAds";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useAdSummary(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-ads-summary"],
    queryFn: async () => {
      const res = await adminAdsApi.getSummary();
      const data = res.data;
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: AdSummaryDto }).data;
      }
      return data as AdSummaryDto;
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useAdminAds(
  params?: AdListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-ads-list", params],
    queryFn: async () => {
      const res = await adminAdsApi.getAds(params);
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: BannerAdItem[] }).data)
      ) {
        return (data as { data: BannerAdItem[] }).data;
      }
      return [] as BannerAdItem[];
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useAdDetails(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-ad-details", id],
    queryFn: () => {
      if (!id) throw new Error("No ad ID");
      return adminAdsApi.getAdById(id!).then((r) => r.data);
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdDto) => adminAdsApi.createAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-ads-summary"] });
      toast.success("Ad created successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to create ad");
    },
  });
}

export function useUpdateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdDto }) =>
      adminAdsApi.updateAd(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-ads-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-ad-details", variables.id],
      });
      toast.success("Ad updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update ad");
    },
  });
}

export function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminAdsApi.deleteAd(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-ads-summary"] });
      toast.success(res.data?.message || "Ad deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to delete ad");
    },
  });
}
