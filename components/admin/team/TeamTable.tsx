"use client";

import { Link2, Edit2, Trash2 } from "lucide-react";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending Setup" | "Pending";
  joined: string;
  lastLogin: string;
}

interface TeamTableProps {
  staffList: StaffMember[];
  isLoading: boolean;
  onCopyInvite: (member: StaffMember) => void;
  onEdit: (member: StaffMember) => void;
  onRemove: (member: StaffMember) => void;
}

export default function TeamTable({
  staffList,
  isLoading,
  onCopyInvite,
  onEdit,
  onRemove,
}: TeamTableProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e8e6f0] bg-[#faf9fc] text-[#9a99b0] font-bold uppercase tracking-wider text-[10px]">
              <th className="pl-6 py-4">Name</th>
              <th className="py-4">Email</th>
              <th className="py-4">Role</th>
              <th className="py-4">Status</th>
              <th className="py-4">Joined</th>
              <th className="py-4">Last Login</th>
              <th className="pr-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/60">
            {/* Shimmer Loading Skeleton Rows */}
            {isLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-6 py-4.5">
                      <div className="h-4 w-32 bg-[#f4f3f6] rounded-md" />
                    </td>
                    <td className="py-4.5">
                      <div className="h-4 w-40 bg-[#f4f3f6] rounded-md" />
                    </td>
                    <td className="py-4.5">
                      <div className="h-5 w-24 bg-[#f4f3f6] rounded-full" />
                    </td>
                    <td className="py-4.5">
                      <div className="h-5 w-16 bg-[#f4f3f6] rounded-full" />
                    </td>
                    <td className="py-4.5">
                      <div className="h-4 w-20 bg-[#f4f3f6] rounded-md" />
                    </td>
                    <td className="py-4.5">
                      <div className="h-4 w-16 bg-[#f4f3f6] rounded-md" />
                    </td>
                    <td className="pr-6 py-4.5 text-right">
                      <div className="flex gap-2 justify-end">
                        <div className="h-7 w-20 bg-[#f4f3f6] rounded-lg" />
                        <div className="h-7 w-12 bg-[#f4f3f6] rounded-lg" />
                        <div className="h-7 w-16 bg-[#f4f3f6] rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              : staffList.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-[#faf9fc]/60 transition-colors"
                  >
                    {/* Name */}
                    <td className="pl-6 py-4.5 font-bold text-[#1a1a2e]">
                      {member.name || "Unnamed"}
                    </td>

                    {/* Email */}
                    <td className="py-4.5 text-[#5a5a7a] font-medium">
                      {member.email}
                    </td>

                    {/* Role Badge */}
                    <td className="py-4.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f3f6] text-[#5a5a7a] border border-[#e8e6f0]">
                        {member.role}
                      </span>
                    </td>

                    {/* Status Badge */}
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

                    {/* Joined Date */}
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
                        {member.status === "Pending" && (
                          <button
                            onClick={() => onCopyInvite(member)}
                            className="flex items-center gap-1 h-7 px-2 rounded-lg border border-brand-pink/20 text-[10px] font-bold text-brand-pink hover:bg-[#fdf2f8] cursor-pointer"
                          >
                            <Link2 size={10} /> Copy Invite
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(member)}
                          className="flex items-center gap-1 h-7 px-2 rounded-lg border border-[#e8e6f0] text-[10px] font-bold text-[#5a5a7a] hover:bg-[#faf9fc] cursor-pointer"
                        >
                          <Edit2 size={10} /> Edit
                        </button>
                        <button
                          onClick={() => onRemove(member)}
                          className="flex items-center gap-1 h-7 px-2 rounded-lg border border-[#fee2e2] text-[10px] font-bold text-[#dc2626] hover:bg-[#fef2f2] cursor-pointer"
                        >
                          <Trash2 size={10} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

            {!isLoading && staffList.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-[#9a99b0] font-medium"
                >
                  No staff members found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
