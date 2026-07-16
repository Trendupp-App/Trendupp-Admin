/**
 * DEV/TESTING CONVENIENCE ONLY.
 * The backend currently echoes the OTP in the signup response message
 * (e.g. "...Here is your OTP: 869059"). This should never happen in a real
 * production environment — it defeats the purpose of an OTP. This helper
 * exists purely to speed up local/staging testing, and every call site using
 * it MUST also check isOtpAutofillEnabled() before using the extracted value.
 */
export function extractOtpFromMessage(message?: string | null): string | null {
  if (!message) return null;
  const match = message.match(/\b(\d{6})\b/);
  return match ? match[1] : null;
}

export function isOtpAutofillEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENV !== "production";
}
