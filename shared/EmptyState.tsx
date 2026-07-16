// shared/EmptyState.tsx
import { type LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <div className="w-10 h-10 rounded-full bg-[#f4f3f6] flex items-center justify-center">
        <Icon size={18} className="text-[#9a99b0]" />
      </div>
      <p className="text-xs font-semibold text-[#7a7a9a]">{title}</p>
      {description && (
        <p className="text-[10px] text-[#9a99b0] max-w-[220px]">
          {description}
        </p>
      )}
    </div>
  );
}
