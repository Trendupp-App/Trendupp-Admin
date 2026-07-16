"use client";

import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/shared/EmptyState";
import { type LucideIcon } from "lucide-react";

export interface AdminColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  keyExtractor: (row: T) => string;
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle = "No data found",
  emptyDescription,
  emptyIcon,
  keyExtractor,
}: AdminDataTableProps<T>) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs text-left">
        <thead>
          <tr className="border-b border-[#e8e6f0]/60">
            {columns.map((col) => (
              <th
                key={String(col.header)}
                className={`pb-3 font-semibold text-[10px] uppercase tracking-wider text-[#7a7a9a] pr-4 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-[#e8e6f0]/40">
                {columns.map((col) => (
                  <td key={String(col.header)} className="py-3 pr-4">
                    <Skeleton className="h-4 w-full rounded-md" />
                  </td>
                ))}
              </tr>
            ))
          ) : !data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="pt-4">
                <EmptyState
                  icon={emptyIcon}
                  title={emptyTitle}
                  description={emptyDescription}
                />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-[#e8e6f0]/40 hover:bg-[#faf9fc] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.header)}
                    className={`py-3 pr-4 text-[#1a1a2e] ${col.className ?? ""}`}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : String(row[col.accessor] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
