import { useAuthStore } from "@/store/authStore";
import {
  hasPermission,
  type AdminRole,
  type PermissionKey,
} from "@/lib/permissions";

/**
 * Returns true if the logged-in admin has the given permission.
 * Always returns false if the user is not authenticated.
 */
export function usePermission(permission: PermissionKey): boolean {
  const role = useAuthStore((s) => s.user?.role);
  if (!role) return false;
  return hasPermission(role as AdminRole, permission);
}
