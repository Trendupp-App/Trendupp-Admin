import { useQueries } from "@tanstack/react-query";
import { usersApi } from "@/services/usersApi";

export function useBrandNames(brandIds: (string | undefined)[]) {
  const uniqueIds = Array.from(
    new Set(brandIds.filter((id): id is string => !!id)),
  );

  const results = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: ["brand-profile", id], // matches useBrandProfile's key — shares cache
      queryFn: () => usersApi.getExploreBrandProfile(id).then((r) => r.data),
      staleTime: 1000 * 60, // same as useBrandProfile
    })),
  });

  const nameById: Record<string, string> = {};
  uniqueIds.forEach((id, idx) => {
    const data = results[idx]?.data;
    if (data?.username) {
      nameById[id] = data.username;
    }
  });

  return { nameById, isLoading: results.some((r) => r.isLoading) };
}
