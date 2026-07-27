"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { authApi } from "@/services/authApi";

type ActivationState = "verifying" | "success" | "error";

interface Props {
  // Next 16: route params are a Promise; client components unwrap with use().
  params: Promise<{ otp: string }>;
}

export default function InviteActivationPage({ params }: Props) {
  const { otp } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ActivationState>("verifying");
  const [errorMsg, setErrorMsg] = useState<string>(
    "This invitation link has expired or is invalid.",
  );

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        const email = searchParams.get("email") ?? "";

        if (!otp || !email) {
          if (!cancelled) {
            setErrorMsg(
              "Invalid invitation link. Missing required parameters.",
            );
            setState("error");
          }
          return;
        }

        await authApi.verifyOtpAdmin({ email, code: otp });

        if (cancelled) return;

        setState("success");

        // Brief "verified" flash then redirect
        setTimeout(() => {
          if (!cancelled) {
            router.replace(
              `/admin/signin?step=reset-password&email=${encodeURIComponent(email)}`,
            );
          }
        }, 1200);
      } catch (err: unknown) {
        if (cancelled) return;
        const axiosErr = err as {
          response?: { data?: { message?: unknown } };
        };
        const msg = axiosErr?.response?.data?.message;
        if (msg) {
          setErrorMsg(
            Array.isArray(msg)
              ? String(msg[0])
              : typeof msg === "string"
                ? msg
                : "This invitation link has expired or is invalid.",
          );
        }
        setState("error");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      {/* ── Verifying ── */}
      {state === "verifying" && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-[#fdf2f8] flex items-center justify-center shadow-sm">
            <Loader2 size={28} className="text-[#c0185c] animate-spin" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Verifying your invitation…
            </h2>
            <p className="text-xs text-[#9a99b0] font-medium">
              Please wait while we validate your invite link.
            </p>
          </div>
        </>
      )}

      {/* ── Success ── */}
      {state === "success" && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center shadow-sm">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Invitation verified!
            </h2>
            <p className="text-xs text-[#9a99b0] font-medium">
              Redirecting you to set up your password…
            </p>
          </div>
          {/* Redirect progress bar */}
          <div className="w-48 h-1 bg-[#e8e6f0] rounded-full overflow-hidden">
            <div className="h-full bg-[#c0185c] animate-[progress_1.2s_linear_forwards] rounded-full" />
          </div>
        </>
      )}

      {/* ── Error ── */}
      {state === "error" && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-[#fff1f2] flex items-center justify-center shadow-sm">
            <XCircle size={28} className="text-rose-500" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Invitation link invalid
            </h2>
            <p className="text-sm text-[#9a99b0] font-medium max-w-xs leading-relaxed">
              {errorMsg}
            </p>
            <p className="text-xs text-[#b0aec8]">
              Please contact your administrator for a new invite.
            </p>
          </div>
          <a
            href="/admin/signin"
            className="mt-2 inline-block h-10 px-6 bg-[#c0185c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all"
          >
            Back to Sign In
          </a>
        </>
      )}
    </div>
  );
}
