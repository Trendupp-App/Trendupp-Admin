"use client";

import { useState, useEffect } from "react";
import InviteStaffModal from "@/components/admin/team/InviteStaffModal";
import EditStaffModal from "@/components/admin/team/EditStaffModal";
import RemoveStaffModal from "@/components/admin/team/RemoveStaffModal";
import TeamStats from "@/components/admin/team/TeamStats";
import TeamRoleCards from "@/components/admin/team/TeamRoleCards";
import TeamToolbar from "@/components/admin/team/TeamToolbar";
import TeamTable, { StaffMember } from "@/components/admin/team/TeamTable";
import InvitePreviewModal from "@/components/admin/team/InvitePreviewModal";
import AccessDenied from "@/components/admin/AccessDenied";
import { usePermission } from "@/hooks/usePermission";

import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/services/usersApi";

const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      textArea.remove();
      return !!success;
    }
  } catch {
    return false;
  }
};

const formatLastLogin = (dateString?: string | null) => {
  if (!dateString) return "Never";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Never";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Never";
  }
};

const ROLE_TYPES = [
  {
    title: "Support Agent",
    description: "Handles disputes, tickets, chat approvals.",
  },
  {
    title: "Finance Admin",
    description: "Manage escrow, payouts, and financial reports.",
  },
  {
    title: "Moderator",
    description: "Review content, reports, and flags.",
  },
  {
    title: "Super Admin",
    description: "Full platform access and management.",
  },
];

export default function TeamManagementPage() {
  const canAccess = usePermission("page.team");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { user } = useAuthStore();

  const canInvite = user?.role === "owner" || user?.role === "super_admin";

  // Modal control states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Invite link state (for copy-link dialog when email system is down)
  const [invitePreviewUrl, setInvitePreviewUrl] = useState<string | null>(null);
  // Cache of generated OTP codes by email: { [email: string]: string }
  const [invitedCodesMap, setInvitedCodesMap] = useState<
    Record<string, string>
  >({});

  // Selected item states
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Debounce search query input to limit API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load sub-admins from API
  const fetchSubAdmins = async () => {
    setIsLoadingList(true);
    try {
      const apiRole = activeRoleFilter !== "all" ? activeRoleFilter : undefined;
      const response = await usersApi.getSubAdmins({
        q: debouncedSearch || undefined,
        role: apiRole,
      });

      let rawList: unknown[] = [];
      if (Array.isArray(response.data)) {
        rawList = response.data;
      } else if (response.data && typeof response.data === "object") {
        const keys = ["data", "users", "subAdmins", "results"];
        for (const key of keys) {
          const list = (response.data as Record<string, unknown>)[key];
          if (Array.isArray(list)) {
            rawList = list;
            break;
          }
        }
      }

      const mapped: StaffMember[] = rawList.map((item, i) => {
        const u = item as {
          role?: string;
          id?: string;
          firstName?: string;
          lastName?: string;
          email: string;
          isEmailVerified?: boolean;
          createdAt?: string;
          username?: string | null;
          lastLoginAt?: string | null;
          lastLogin?: string | null;
        };

        let uiRole = "Support Agent";
        if (u.role === "finance_admin") uiRole = "Finance Admin";
        else if (u.role === "super_admin") uiRole = "Super Admin";
        else if (u.role === "moderator") uiRole = "Moderator";

        const itemObj = u as {
          status?: string;
          isActive?: boolean;
          isEmailVerified?: boolean;
        };

        const isVerified =
          itemObj.status === "active" ||
          itemObj.isActive === true ||
          String(itemObj.isActive) === "true" ||
          itemObj.isEmailVerified === true ||
          String(itemObj.isEmailVerified) === "true";

        return {
          id: u.id || `STF-${1000 + i}`,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.email,
          role: uiRole,
          status: isVerified ? "Active" : "Pending",
          joined: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—",
          lastLogin: formatLastLogin(u.lastLoginAt || u.lastLogin),
        };
      });
      setStaffList(mapped);
    } catch (err) {
      console.error("Failed to load staff list", err);
      toast.error("Failed to load staff members.");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchSubAdmins();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, activeRoleFilter]);

  // Stats
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "Active").length;
  const pendingStaff = staffList.filter((s) => s.status === "Pending").length;
  const rolesAvailable = 4;

  // Filter staff list according to active search and status filter
  const filteredStaff = staffList.filter((s) => {
    if (activeStatusFilter === "Active" && s.status !== "Active") return false;
    if (activeStatusFilter === "Pending" && s.status !== "Pending")
      return false;
    if (
      searchQuery &&
      !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Invite handler
  const handleInviteSuccess = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => {
    setIsInviting(true);
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const toastId = toast.loading("Inviting staff member...");
    try {
      const apiRole =
        data.role === "Finance Admin"
          ? "finance_admin"
          : data.role === "Super Admin"
            ? "super_admin"
            : data.role === "Moderator"
              ? "moderator"
              : "support_agent";

      const response = await usersApi.inviteAdmin({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: apiRole,
      });

      // Build the invite preview URL with the code generated by the backend API
      const code = response?.data?.code || "";
      if (code && data.email) {
        setInvitedCodesMap((prev) => ({
          ...prev,
          [data.email.toLowerCase()]: code,
        }));

        const base = window.location.origin;
        const previewUrl = `${base}/setup/invite/preview?name=${encodeURIComponent(fullName)}&role=${encodeURIComponent(data.role)}&email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(code)}`;
        setInvitePreviewUrl(previewUrl);
      }

      fetchSubAdmins();
      setIsInviteOpen(false);
      toast.success(`Invitation successfully sent to ${fullName}!`, {
        id: toastId,
      });
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const errMsg =
        axiosErr?.response?.data?.message ??
        axiosErr?.message ??
        "Failed to send invitation.";
      toast.error(Array.isArray(errMsg) ? String(errMsg[0]) : String(errMsg), {
        id: toastId,
      });
    } finally {
      setIsInviting(false);
    }
  };

  // Edit handler
  const handleEditSuccess = async (newRole: string) => {
    if (!selectedStaff) return;

    let apiRole:
      "super_admin" | "finance_admin" | "moderator" | "support_agent" =
      "support_agent";
    if (newRole === "Finance Admin") {
      apiRole = "finance_admin";
    } else if (newRole === "Super Admin") {
      apiRole = "super_admin";
    } else if (newRole === "Moderator") {
      apiRole = "moderator";
    }

    const toastId = toast.loading("Updating staff member role...");
    try {
      await usersApi.updateAdmin(selectedStaff.id, { role: apiRole });
      toast.success("Staff member role updated successfully!", { id: toastId });
      fetchSubAdmins();
      setIsEditOpen(false);
      setSelectedStaff(null);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const errMsg =
        axiosErr?.response?.data?.message ??
        axiosErr?.message ??
        "Failed to update role.";
      toast.error(Array.isArray(errMsg) ? String(errMsg[0]) : String(errMsg), {
        id: toastId,
      });
    }
  };

  // Remove handler
  const handleRemoveSuccess = async () => {
    if (!selectedStaff) return;

    const toastId = toast.loading("Revoking staff member access...");
    try {
      await usersApi.deleteAdmin(selectedStaff.id);
      toast.success("Staff member access has been revoked.", { id: toastId });
      fetchSubAdmins();
      setIsRemoveOpen(false);
      setSelectedStaff(null);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const errMsg =
        axiosErr?.response?.data?.message ??
        axiosErr?.message ??
        "Failed to revoke access.";
      toast.error(Array.isArray(errMsg) ? String(errMsg[0]) : String(errMsg), {
        id: toastId,
      });
    }
  };

  const handleCopyInviteLink = async (member: StaffMember) => {
    const emailKey = member.email.toLowerCase();
    let code = invitedCodesMap[emailKey] || "";

    // If code is not in memory cache, re-trigger invitation API to obtain a fresh OTP code from backend
    if (!code) {
      const toastId = toast.loading(
        `Generating fresh invite link for ${member.name}...`,
      );
      try {
        const nameParts = member.name.trim().split(" ");
        const firstName = nameParts[0] || "Staff";
        const lastName = nameParts.slice(1).join(" ") || "Member";

        let apiRole:
          "super_admin" | "finance_admin" | "moderator" | "support_agent" =
          "support_agent";
        if (member.role === "Finance Admin") apiRole = "finance_admin";
        else if (member.role === "Super Admin") apiRole = "super_admin";
        else if (member.role === "Moderator") apiRole = "moderator";

        const res = await usersApi.inviteAdmin({
          firstName,
          lastName,
          email: member.email,
          role: apiRole,
        });

        code = res?.data?.code || "";
        if (code) {
          setInvitedCodesMap((prev) => ({ ...prev, [emailKey]: code }));
        }
        toast.dismiss(toastId);
      } catch {
        toast.error("Failed to generate invite link code.", { id: toastId });
        return;
      }
    }

    const base = typeof window !== "undefined" ? window.location.origin : "";
    const previewUrl = `${base}/setup/invite/preview?name=${encodeURIComponent(member.name)}&role=${encodeURIComponent(member.role)}&email=${encodeURIComponent(member.email)}&otp=${encodeURIComponent(code)}`;
    const success = await copyToClipboard(previewUrl);
    if (success) {
      toast.success(`Invite link for ${member.name} copied to clipboard!`);
    } else {
      toast.error("Failed to copy link.");
    }
  };

  if (!canAccess) return <AccessDenied />;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 text-left max-w-7xl mx-auto">
      {/* Stats Cards Row with Shimmer Loading */}

      <TeamStats
        totalStaff={totalStaff}
        activeStaff={activeStaff}
        pendingStaff={pendingStaff}
        rolesAvailable={rolesAvailable}
        isLoading={isLoadingList}
      />

      {/* Staff Role Types */}
      <TeamRoleCards
        roleTypes={ROLE_TYPES}
        canInvite={canInvite}
        onInviteClick={() => setIsInviteOpen(true)}
      />

      {/* Toolbar & Table */}
      <div className="flex flex-col gap-4">
        <TeamToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeRoleFilter={activeRoleFilter}
          onRoleFilterChange={setActiveRoleFilter}
          activeStatusFilter={activeStatusFilter}
          onStatusFilterChange={setActiveStatusFilter}
          canInvite={canInvite}
          onInviteClick={() => setIsInviteOpen(true)}
        />

        <TeamTable
          staffList={filteredStaff}
          isLoading={isLoadingList}
          onCopyInvite={handleCopyInviteLink}
          onEdit={(member) => {
            setSelectedStaff(member);
            setIsEditOpen(true);
          }}
          onRemove={(member) => {
            setSelectedStaff(member);
            setIsRemoveOpen(true);
          }}
        />
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <InviteStaffModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onSuccess={handleInviteSuccess}
          isLoading={isInviting}
        />
      )}

      {/* Edit Role Modal */}
      {isEditOpen && selectedStaff && (
        <EditStaffModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedStaff(null);
          }}
          staffName={selectedStaff.name}
          currentRole={selectedStaff.role}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Remove Staff Modal */}
      {isRemoveOpen && selectedStaff && (
        <RemoveStaffModal
          isOpen={isRemoveOpen}
          onClose={() => {
            setIsRemoveOpen(false);
            setSelectedStaff(null);
          }}
          staffName={selectedStaff.name}
          onConfirm={handleRemoveSuccess}
        />
      )}

      {/* Copy Invite Link Dialog (Fallback for disabled email service) */}
      <InvitePreviewModal
        previewUrl={invitePreviewUrl}
        onClose={() => setInvitePreviewUrl(null)}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
}
