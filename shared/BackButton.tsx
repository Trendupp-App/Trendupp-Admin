"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => router.back()}
      className={`self-start hover:bg-transparent bg-transparent flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-brand-pink cursor-pointer mb-0 transition-colors ${className}`}
    >
      <ChevronLeft className="size-5" />
      <span>{label}</span>
    </Button>
  );
}
