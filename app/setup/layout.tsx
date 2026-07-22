import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Trendupp Admin — Account Setup",
  description: "Set up your Trendupp Admin Portal account.",
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9fc] flex flex-col items-center px-4 py-10">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.svg"
          alt="Trendupp"
          width={140}
          height={40}
          style={{ height: "auto" }}
          priority
        />
      </div>

      {/* Page content */}
      <div className="w-full max-w-[680px]">{children}</div>

      {/* Footer */}
      <p className="mt-10 text-[11px] text-[#b0aec8] font-medium">
        © {new Date().getFullYear()} Trendupp Inc. All rights reserved.
      </p>
    </div>
  );
}
