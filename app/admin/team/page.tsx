"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Link2,
  Copy,
  X,
} from "lucide-react";
import InviteStaffModal from "@/components/admin/team/InviteStaffModal";
import EditStaffModal from "@/components/admin/team/EditStaffModal";
import RemoveStaffModal from "@/components/admin/team/RemoveStaffModal";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/services/usersApi";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending Setup";
  joined: string;
  lastLogin: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "STF-1001",
    name: "Adaeze Okonkwo",
    email: "adaeze@trendupp.com",
    role: "Support Agent",
    status: "Active",
    joined: "Jan 15, 2026",
    lastLogin: "Jun 5, 2026",
  },
  {
    id: "STF-1002",
    name: "Tunde Bello",
    email: "tunde@trendupp.com",
    role: "Finance Admin",
    status: "Active",
    joined: "Feb 1, 2026",
    lastLogin: "Jun 4, 2026",
  },
  {
    id: "STF-1003",
    name: "Ngozi Chukwu",
    email: "ngozi@trendupp.com",
    role: "Finance Admin",
    status: "Pending Setup",
    joined: "Jun 1, 2026",
    lastLogin: "Never",
  },
  {
    id: "STF-1004",
    name: "Emeka Eze",
    email: "emeka@trendupp.com",
    role: "Moderator",
    status: "Active",
    joined: "Mar 10, 2026",
    lastLogin: "Jun 5, 2026",
  },
];

const ROLE_TYPES = [
  {
    title: "Support Agent",
    description: "Handles disputes, tickets, chat approvals.",
    bgColor: "bg-blue-50/50 border-blue-100/60 text-[#2563eb]",
  },
  {
    title: "Finance Admin",
    description: "Manage escrow, payouts, and financial reports.",
    bgColor: "bg-purple-50/50 border-purple-100/60 text-[#7c3aed]",
  },
  {
    title: "Moderator",
    description: "Review content, reports, and flags.",
    bgColor: "bg-orange-50/50 border-orange-100/60 text-[#ea580c]",
  },
  {
    title: "Super Admin",
    description: "Full platform access and management.",
    bgColor: "bg-rose-50/50 border-rose-100/60 text-brand-pink",
  },
];

// Helper to determine role badges
const getRoleBadgeStyle = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes("support") || r.includes("customer")) {
    return "bg-[#edf2fe] text-[#2f63eb] border-[#dbeafe]";
  }
  if (r.includes("finance") || r.includes("account")) {
    return "bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]";
  }
  if (r.includes("moderator") || r.includes("content")) {
    return "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]";
  }
  return "bg-[#fdf2f8] text-brand-pink border-[#fce7f3]"; // Super Admin / Default
};

export default function TeamManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuthStore();
  const canInvite = user?.role === "owner" || user?.role === "super_admin";

  // Modal control states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Invite link state (for copy-link dialog when email system is down)
  const [invitePreviewUrl, setInvitePreviewUrl] = useState<string | null>(null);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);

  // Selected item states
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Stats
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "Active").length;
  const pendingStaff = staffList.filter(
    (s) => s.status === "Pending Setup",
  ).length;
  const rolesAvailable = 5;

  // Filtered members list
  const filteredStaff = staffList.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Invite handler
  const handleInviteSuccess = async (data: {
    name: string;
    email: string;
    role: string;
  }) => {
    setIsInviting(true);
    try {
      // Split name into first and last name
      const parts = data.name.trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      // Map chosen role to API enum
      let apiRole:
        "super_admin" | "finance_admin" | "moderator" | "support_agent" =
        "support_agent";
      if (data.role === "Finance Admin") {
        apiRole = "finance_admin";
      } else if (data.role === "Super Admin") {
        apiRole = "super_admin";
      } else if (data.role === "Moderator") {
        apiRole = "moderator";
      }

      const response = await usersApi.inviteAdmin({
        firstName,
        lastName,
        email: data.email,
        role: apiRole,
      });

      // Build the invite preview URL for the email-system-down fallback
      const otp = response?.data?.otp;
      const serverLink = response?.data?.inviteLink;
      if (otp || serverLink) {
        const base =
          typeof window !== "undefined" ? window.location.origin : "";
        const previewUrl = serverLink
          ? serverLink
          : `${base}/setup/invite/preview?name=${encodeURIComponent(data.name)}&role=${encodeURIComponent(data.role)}&email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(otp!)}`;
        setInvitePreviewUrl(previewUrl);
      }

      const newMember: StaffMember = {
        id: `STF-${1000 + staffList.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        status: "Pending Setup",
        joined: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        lastLogin: "Never",
      };
      setStaffList((prev) => [...prev, newMember]);
      setIsInviteOpen(false);
      toast.success(`Invitation successfully sent to ${data.name}!`);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const errMsg =
        axiosErr?.response?.data?.message ??
        axiosErr?.message ??
        "Failed to send invitation.";
      toast.error(Array.isArray(errMsg) ? String(errMsg[0]) : String(errMsg));
    } finally {
      setIsInviting(false);
    }
  };

  // Edit handler
  const handleEditSuccess = (newRole: string) => {
    if (!selectedStaff) return;
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === selectedStaff.id ? { ...s, role: newRole } : s,
      ),
    );
    setIsEditOpen(false);
    setSelectedStaff(null);
    toast.success("Staff member role updated successfully!");
  };

  // Remove handler
  const handleRemoveSuccess = () => {
    if (!selectedStaff) return;
    setStaffList((prev) => prev.filter((s) => s.id !== selectedStaff.id));
    setIsRemoveOpen(false);
    setSelectedStaff(null);
    toast.success("Staff member access has been revoked.");
  };

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 text-left max-w-7xl mx-auto">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Staff */}
        <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#edf2fe] flex items-center justify-center border border-[#dbeafe]">
            <Users size={20} className="text-[#2f63eb]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-[#1a1a2e]">
              {totalStaff}
            </span>
            <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
              Total Staff
            </span>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center border border-[#dcfce7]">
            <CheckCircle size={20} className="text-[#16a34a]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-[#1a1a2e]">
              {activeStaff}
            </span>
            <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>

        {/* Pending Setup */}
        <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#fef9e7] flex items-center justify-center border border-[#fef08a]">
            <Clock size={20} className="text-[#ca8a04]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-[#1a1a2e]">
              {pendingStaff}
            </span>
            <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
              Pending Setup
            </span>
          </div>
        </div>

        {/* Roles Available */}
        <div className="bg-white border border-[#e8e6f0]/60 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#fdf2f8] flex items-center justify-center border border-[#fce7f3]">
            <ShieldCheck size={20} className="text-brand-pink" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-[#1a1a2e]">
              {rolesAvailable}
            </span>
            <span className="text-[10px] text-[#9a99b0] font-bold uppercase tracking-wider">
              Roles Available
            </span>
          </div>
        </div>
      </div>

      {/* Staff Role Types */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#1a1a2e]">Staff Role Types</h3>
          {canInvite && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 h-9 px-4 bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Invite Staff Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLE_TYPES.map((role) => (
            <div
              key={role.title}
              className={`p-5 rounded-2xl border flex flex-col gap-1.5 text-left transition-all hover:shadow-md ${role.bgColor}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {role.title}
              </span>
              <p className="text-[10px] text-[#7a7a9a] font-medium leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Staff Members */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            Current Staff Members
          </h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex items-center flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 text-[#9a99b0]" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full sm:w-[220px] bg-[#f4f3f6] rounded-full pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 border-none font-medium"
              />
            </div>
            {/* Add Member Shortcut — owner & super_admin only */}
            {canInvite && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-1 h-9 px-3 bg-[#fdf2f8] hover:bg-[#fbcfe8]/40 text-brand-pink text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Plus size={14} /> Add Member
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e6f0]/40 text-[#9a99b0] text-[9.5px] uppercase tracking-wider font-extrabold text-left">
                <th className="pl-6 pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3">Last Login</th>
                <th className="pr-6 pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-[#e8e6f0]/30 hover:bg-[#faf9fc]/30 text-xs text-[#1a1a2e]"
                >
                  {/* Name */}
                  <td className="pl-6 py-4.5 font-bold">{member.name}</td>
                  {/* Email */}
                  <td className="py-4.5 text-[#5a5a7a] font-medium">
                    {member.email}
                  </td>
                  {/* Role */}
                  <td className="py-4.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-bold ${getRoleBadgeStyle(
                        member.role,
                      )}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="py-4.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        member.status === "Active"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  {/* Joined */}
                  <td className="py-4.5 text-[#7a7a9a] font-medium">
                    {member.joined}
                  </td>
                  {/* Last Login */}
                  <td className="py-4.5 text-[#7a7a9a] font-medium">
                    {member.lastLogin}
                  </td>
                  {/* Actions */}
                  <td className="pr-6 py-4.5 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsEditOpen(true);
                        }}
                        className="flex items-center gap-1 h-7 px-2 rounded-lg border border-[#e8e6f0] text-[10px] font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsRemoveOpen(true);
                        }}
                        className="flex items-center gap-1 h-7 px-2 rounded-lg border border-[#fee2e2] text-[10px] font-bold text-[#dc2626] hover:bg-[#fef2f2] cursor-pointer"
                      >
                        <Trash2 size={10} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-[#9a99b0] font-medium"
                  >
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals */}
      <InviteStaffModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={handleInviteSuccess}
        isLoading={isInviting}
      />

      <EditStaffModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        staffName={selectedStaff?.name || ""}
        currentRole={selectedStaff?.role || ""}
        onSuccess={handleEditSuccess}
      />

      <RemoveStaffModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        staffName={selectedStaff?.name || ""}
        onConfirm={handleRemoveSuccess}
      />

      {/* ── Copy Invite Link Dialog (email-system-down fallback) ── */}
      {invitePreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => {
              setInvitePreviewUrl(null);
              setInviteLinkCopied(false);
            }}
          />
          <div className="relative z-10 w-full max-w-[460px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fdf2f8] flex items-center justify-center">
                  <Link2 size={14} className="text-[#c0185c]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a2e]">
                    Share Invite Link
                  </h3>
                  <p className="text-[10px] text-[#9a99b0] font-medium">
                    Email system is down — share this link manually
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setInvitePreviewUrl(null);
                  setInviteLinkCopied(false);
                }}
                className="p-1 hover:bg-[#f4f3f6] rounded-lg transition-colors text-[#9a99b0] hover:text-[#1a1a2e] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Info callout */}
            <div className="bg-[#fdf2f8] border border-[#fce7f3] rounded-xl px-4 py-3 text-[11px] text-[#c0185c] font-semibold leading-relaxed">
              📌 This link takes the invitee to a preview of their invitation
              email. Clicking the button on that page will auto-verify their
              account and redirect them to set their password.
            </div>

            {/* Link box */}
            <div className="flex items-center gap-2 bg-[#f4f3f6] rounded-xl px-3 py-2.5 border border-[#e8e6f0]">
              <p className="flex-1 text-[11px] text-[#5a5a7a] font-medium truncate break-all">
                {invitePreviewUrl}
              </p>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(invitePreviewUrl);
                  setInviteLinkCopied(true);
                  setTimeout(() => setInviteLinkCopied(false), 2500);
                }}
                className="shrink-0 flex items-center gap-1.5 h-8 px-3 bg-[#c0185c] hover:opacity-90 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
              >
                <Copy size={12} />
                {inviteLinkCopied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Done button */}
            <button
              onClick={() => {
                setInvitePreviewUrl(null);
                setInviteLinkCopied(false);
              }}
              className="h-9 w-full bg-[#f4f3f6] hover:bg-[#ebe9f1] text-[#5a5a7a] text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
