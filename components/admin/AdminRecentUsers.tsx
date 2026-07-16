"use client";

import { Users } from "lucide-react";
import { AdminDataTable, type AdminColumn } from "./AdminDataTable";
import { AdminStatusBadge } from "./AdminStatusBadge";
import UserAvatar from "@/shared/UserAvatar";

interface MockUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  verified: boolean;
  joined: string;
}

const MOCK: MockUser[] = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    email: "adaeze@gmail.com",
    initials: "AO",
    role: "creator",
    verified: true,
    joined: "11 Jul 2026",
  },
  {
    id: "2",
    name: "Emeka Eze",
    email: "emeka@ykone.com",
    initials: "EE",
    role: "brand",
    verified: true,
    joined: "10 Jul 2026",
  },
  {
    id: "3",
    name: "Chidinma Okafor",
    email: "chidinma@gmail.com",
    initials: "CO",
    role: "creator",
    verified: false,
    joined: "09 Jul 2026",
  },
  {
    id: "4",
    name: "Tunde Balogun",
    email: "tunde@konga.com",
    initials: "TB",
    role: "brand",
    verified: true,
    joined: "08 Jul 2026",
  },
  {
    id: "5",
    name: "Ngozi Uche",
    email: "ngozi@gmail.com",
    initials: "NU",
    role: "creator",
    verified: false,
    joined: "07 Jul 2026",
  },
  {
    id: "6",
    name: "Sola Martins",
    email: "sola@jumiafoods.com",
    initials: "SM",
    role: "brand",
    verified: true,
    joined: "06 Jul 2026",
  },
];

const COLS: AdminColumn<MockUser>[] = [
  {
    header: "User",
    accessor: (u) => (
      <div className="flex items-center gap-2">
        <UserAvatar initials={u.initials} size={28} />
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[#1a1a2e] truncate max-w-[120px]">
            {u.name}
          </span>
          <span className="text-[10px] text-[#9a99b0] truncate">{u.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Role",
    accessor: (u) => (
      <span className="capitalize text-[#7a7a9a]">{u.role}</span>
    ),
  },
  {
    header: "Verified",
    accessor: (u) => (
      <AdminStatusBadge status={u.verified ? "active" : "pending"} />
    ),
  },
  { header: "Joined", accessor: "joined", className: "whitespace-nowrap" },
];

export function AdminRecentUsers() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
          <Users size={15} className="text-[#16a34a]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Recent Users</h2>
          <p className="text-[10px] text-[#7a7a9a]">
            Newly registered accounts
          </p>
        </div>
      </div>
      <AdminDataTable
        columns={COLS}
        data={MOCK}
        isLoading={false}
        keyExtractor={(u) => u.id}
        emptyTitle="No users yet"
      />
    </section>
  );
}
