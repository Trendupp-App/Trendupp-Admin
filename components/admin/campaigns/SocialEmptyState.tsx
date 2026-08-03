import {
  Megaphone,
  FileEdit,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type SocialTab = "Draft" | "Active" | "Completed";

const COPY: Record<
  SocialTab,
  { icon: LucideIcon; title: string; description: string }
> = {
  Draft: {
    icon: FileEdit,
    title: "No draft campaigns",
    description:
      'Campaigns you start but haven’t published yet will appear here. Click "Create Campaign" to begin.',
  },
  Active: {
    icon: Megaphone,
    title: "No active campaigns",
    description:
      "Published social impact campaigns that are live or in progress will show up here.",
  },
  Completed: {
    icon: CheckCircle2,
    title: "No completed campaigns",
    description: "Campaigns that have wrapped up will be listed here.",
  },
};

export default function SocialEmptyState({ tab }: { tab: SocialTab }) {
  const { icon: Icon, title, description } = COPY[tab];

  return (
    <div className="col-span-full bg-white border border-[#f0f0f5] rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#9a99b0]">
        <Icon size={22} />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-bold text-[#1a1a2e]">{title}</h4>
        <p className="text-xs text-[#7a7a9a] max-w-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
