import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trendupp Admin",
    template: "%s | Trendupp Admin",
  },
  description: "Super Admin Portal for Trendupp marketing campaigns.",
  icons: {
    icon: "/Option.png",
  },
};

const slussen = localFont({
  src: [
    {
      path: "./fonts/Slussen-Regular-TRIAL.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Slussen-Bold-TRIAL.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Slussen-Regular-Italic-TRIAL.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${slussen.variable} font-sans`}>
      <body className="antialiased bg-[#faf9fc]">
        {children}
        <Toaster position="top-right" theme="light" closeButton richColors />
      </body>
    </html>
  );
}
