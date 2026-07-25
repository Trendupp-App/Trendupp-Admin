import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/services/usersApi";

export function useUserById(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getUserById(id!).then((r) => r.data),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5,
  });
}
