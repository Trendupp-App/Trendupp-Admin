import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName?: string, lastName?: string) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return initials || "?";
}

export function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  EUR: "€",
};

export function getCurrencySymbol(currency = "NGN"): string {
  return (
    CURRENCY_SYMBOLS[currency.toUpperCase()] ?? `${currency.toUpperCase()} `
  );
}

export function formatCurrency(amount: number, currency = "NGN"): string {
  return `${getCurrencySymbol(currency)}${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

export function convertUsdToNgn(amountUsd: number, usdToNgnRate: number) {
  return Math.round(amountUsd * usdToNgnRate);
}

// Admin has no "current user" to gate display currency on (unlike the
// creator app, which shows NGN when the logged-in creator is Nigerian) and
// applications carry no per-row currency of their own — only the parent
// campaign's `currency` says what a fee request was submitted in. Since
// Admin is a Nigeria-based back office, always display in NGN, and keep the
// original submitted amount alongside as a secondary value so nothing is
// hidden. Only convert once a live rate is available — an unconverted USD
// number under a ₦ symbol is silently wrong, not a safe fallback (see
// currency-conversion.md).
export function convertForDisplay(
  amount: number,
  sourceCurrency: string | undefined,
  usdToNgnRate: number | undefined,
): {
  amount: number;
  currency: string;
  secondary?: { amount: number; currency: string };
} {
  const normalized = (sourceCurrency || "NGN").toUpperCase();
  if (normalized === "USD" && usdToNgnRate) {
    return {
      amount: convertUsdToNgn(amount, usdToNgnRate),
      currency: "NGN",
      secondary: { amount, currency: "USD" },
    };
  }
  return { amount, currency: normalized };
}
