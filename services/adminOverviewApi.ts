import apiClient from "@/lib/apiClient";
import type { AdminOverviewResponseDto } from "@/types/adminOverview";

export const adminOverviewApi = {
  getOverview: () => apiClient.get<AdminOverviewResponseDto>("/admin/overview"),
};
