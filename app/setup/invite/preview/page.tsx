import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "You're Invited — Trendupp Admin Portal",
  description: "Accept your invitation and set up your Trendupp Admin account.",
};

interface PreviewPageProps {
  searchParams: Promise<{
    name?: string;
    role?: string;
    email?: string;
    otp?: string;
  }>;
}

export default async function InvitePreviewPage({
  searchParams,
}: PreviewPageProps) {
  const {
    name = "Team Member",
    role = "Admin",
    email = "",
    otp = "",
  } = await searchParams;

  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const proto =
    headerList.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL &&
    process.env.NEXT_PUBLIC_APP_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_APP_URL
      : `${proto}://${host}`;

  const activationUrl =
    otp && email
      ? `${baseUrl}/setup/invite/${otp}?email=${encodeURIComponent(email)}`
      : "#";

  const displayUrl =
    otp && email
      ? `${baseUrl}/setup/invite/${otp}?email=${encodeURIComponent(email)}`
      : "—";

  return (
    <div className="w-full">
      {/* Email card container */}
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e8e6f0]">
        {/* ── Header banner ── */}
        <div className="bg-[#c0185c] px-8 py-7 text-center">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Welcome to Trendupp Admin Portal
          </h1>
        </div>

        {/* ── Body ── */}
        <div className="px-8 py-8 flex flex-col gap-5 text-[#2d2d2d]">
          {/* Greeting */}
          <p className="text-sm leading-relaxed">
            Hello <span className="font-bold">{name}</span>,
          </p>

          {/* Invitation copy */}
          <p className="text-sm leading-relaxed">
            You have been invited to join the Trendupp Admin Portal as a{" "}
            <span className="font-bold">{role}</span>.
          </p>
          <p className="text-sm leading-relaxed">
            Click the button below to accept your invitation and set up your
            account password:
          </p>

          {/* CTA button */}
          <div className="flex justify-center my-2">
            <Link
              href={activationUrl}
              className="inline-block bg-[#c0185c] hover:bg-[#a81450] text-white text-sm font-extrabold px-10 py-4 rounded-lg transition-colors"
            >
              Set Up Account Password
            </Link>
          </div>

          {/* Copy-paste section */}
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-[#555]">
              Or copy and paste this link into your browser:
            </p>
            <a
              href={activationUrl}
              className="text-[13px] text-[#c0185c] underline break-all"
            >
              {displayUrl}
            </a>
          </div>

          {/* Validity callout */}
          <div className="border-l-4 border-[#c0185c] bg-[#fdf2f8] px-4 py-3 rounded-r-lg">
            <p className="text-[13px] text-[#c0185c] font-semibold">
              📌 Note: This invitation link is valid for{" "}
              <span className="font-extrabold">7 days.</span>
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-[12px] text-[#888] leading-relaxed">
            If you did not request this invitation, please contact system
            security immediately.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="bg-[#f5f4f9] px-8 py-4 text-center">
          <p className="text-[12px] text-[#aaa]">
            © {new Date().getFullYear()} Trendupp Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Admin helper note */}
      <p className="mt-5 text-center text-[11px] text-[#b0aec8] font-medium">
        Share this page link with the invitee as an alternative to email.
      </p>
    </div>
  );
}
