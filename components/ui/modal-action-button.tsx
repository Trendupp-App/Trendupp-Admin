"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

export function ModalActionButton({
  variant,
  children,
  className,
  ...props
}: ModalActionButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "w-full py-6 rounded-[18px] font-bold text-sm transition-colors cursor-pointer border-none",
        variant === "primary"
          ? "bg-brand-pink text-white hover:bg-brand-pink/90 shadow-sm"
          : "bg-[#f4f2fa] text-[#040039] hover:bg-[#eaeaf0] shadow-none",
        className,
      )}
    >
      {children}
    </Button>
  );
}
