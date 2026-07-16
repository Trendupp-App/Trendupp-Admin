import apiClient from "@/lib/apiClient";
import type { ExploreCreator, ExploreBrand } from "@/types/explore";

export const exploreApi = {
  getCreators: (categoryId?: string) =>
    apiClient.get<ExploreCreator[]>("/users/explore/creator", {
      params: categoryId ? { category: categoryId } : undefined,
    }),

  getBrands: (categoryId?: string) =>
    apiClient.get<ExploreBrand[]>("/users/explore/brand", {
      params: categoryId ? { category: categoryId } : undefined,
    }),

  // TODO: wire once /users/explore/search is fixed on the backend
  // search: (q: string) => apiClient.get('/users/explore/search', { params: { q } }),
};
