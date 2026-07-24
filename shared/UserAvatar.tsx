"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl?: string | null;
  initials?: string;
  className?: string;
  size?: number;
}

export default function UserAvatar({
  avatarUrl,
  initials,
  className,
  size = 36,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://trendupp-server.onrender.com";
    const base = apiBase.replace(/\/api\/v1\/?$/, "");
    return `${base}/${cleanUrl}`;
  };

  const resolvedUrl = getFullImageUrl(avatarUrl);
  const showImage = !!resolvedUrl && !imgError;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-brand-pink-light border border-brand-pink/20 flex items-center justify-center text-brand-pink font-semibold shrink-0",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={resolvedUrl}
          alt="User avatar"
          fill
          unoptimized
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span style={{ fontSize: size * 0.35 }}>{initials}</span>
      ) : (
        <UserRound size={size * 0.5} className="text-brand-pink" />
      )}
    </div>
  );
}
