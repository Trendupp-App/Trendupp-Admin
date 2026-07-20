"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner"; // If you use sonner for notifications

type StepType = "signin" | "forgot-password" | "verify-code" | "reset-password";

export default function AdminSigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect invite-flow: arrived with ?step=reset-password&email=... from activation page
  const isInviteFlow = searchParams.get("step") === "reset-password";

  // Derive initial step and email directly from URL params (no effect needed)
  const [step, setStep] = useState<StepType>(() => {
    return searchParams.get("step") === "reset-password"
      ? "reset-password"
      : "signin";
  });
  const [email, setEmail] = useState(() => {
    const urlEmail = searchParams.get("email");
    return urlEmail ? decodeURIComponent(urlEmail) : "";
  });
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigateToStep = (nextStep: StepType) => {
    setFieldErrors({});
    setGeneralError(null);
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setStep(nextStep);
  };

  const handleBack = () => {
    if (step === "forgot-password") navigateToStep("signin");
    else if (step === "verify-code") navigateToStep("forgot-password");
    else if (step === "reset-password") navigateToStep("verify-code");
  };

  const mapApiErrors = (err: unknown) => {
    const errors: typeof fieldErrors = {};
    let hasFieldErrors = false;

    const apiError = err as {
      response?: {
        data?: {
          message?: string | string[];
          originalMessages?: string[];
        };
      };
    };

    // Use original messages array if it exists
    const messages: string[] = Array.isArray(
      apiError.response?.data?.originalMessages,
    )
      ? apiError.response.data.originalMessages
      : typeof apiError.response?.data?.message === "string"
        ? [apiError.response.data.message]
        : Array.isArray(apiError.response?.data?.message)
          ? apiError.response.data.message
          : [];

    messages.forEach((msg) => {
      const lower = msg.toLowerCase();

      // Email field
      if (lower.includes("email")) {
        hasFieldErrors = true;
        if (
          lower.includes("must be an email") ||
          lower.includes("must be a valid")
        ) {
          errors.email = "Please enter a valid email address.";
        } else if (lower.includes("empty") || lower.includes("required")) {
          errors.email = "Email address is required.";
        } else {
          errors.email = msg;
        }
      }
      // Verification Code / OTP field
      else if (lower.includes("code") || lower.includes("otp")) {
        hasFieldErrors = true;
        if (lower.includes("should not exist")) {
          errors.code =
            "Verification code is not expected. Please try requesting a new one.";
        } else if (lower.includes("length") || lower.includes("must be")) {
          errors.code = "The code must be exactly 6 digits.";
        } else if (lower.includes("empty") || lower.includes("required")) {
          errors.code = "Verification code is required.";
        } else {
          errors.code = msg;
        }
      }
      // Password or New Password field
      else if (lower.includes("password")) {
        hasFieldErrors = true;
        if (lower.includes("should not exist")) {
          errors.newPassword = "Password property is not allowed here.";
        } else if (
          lower.includes("must include") ||
          lower.includes("uppercase") ||
          lower.includes("special character")
        ) {
          const errMsg =
            "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
          if (step === "reset-password") {
            errors.newPassword = errMsg;
          } else {
            errors.password = errMsg;
          }
        } else if (
          lower.includes("at least 8 characters") ||
          lower.includes("long") ||
          lower.includes("length")
        ) {
          const errMsg = "Password must be at least 8 characters long.";
          if (step === "reset-password") {
            errors.newPassword = errMsg;
          } else {
            errors.password = errMsg;
          }
        } else if (lower.includes("empty") || lower.includes("required")) {
          const errMsg = "Password is required.";
          if (step === "reset-password") {
            errors.newPassword = errMsg;
          } else {
            errors.password = errMsg;
          }
        } else {
          if (step === "reset-password") {
            errors.newPassword = msg;
          } else {
            errors.password = msg;
          }
        }
      }
    });

    if (hasFieldErrors) {
      setFieldErrors(errors);
      setGeneralError(null);
    } else {
      const generalMsg =
        apiError.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setGeneralError(
        typeof generalMsg === "string" ? generalMsg : "An error occurred",
      );
      setFieldErrors({});
    }
  };

  const onSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const response = await authApi.login({ email, password });
      const { accessToken, admin } = response.data;
      const user = admin;

      const ALLOWED_ADMIN_ROLES = [
        "owner",
        "super_admin",
        "finance_admin",
        "moderator",
        "support_agent",
      ];

      if (!ALLOWED_ADMIN_ROLES.includes(user.role)) {
        setGeneralError(
          "Access denied. Authorized administrator role required.",
        );
        setLoading(false);
        return;
      }

      useAuthStore.getState().setSession(accessToken, user);
      toast.success(`Welcome back, ${user.firstName}!`);
      router.push("/admin/dashboard");
    } catch (err) {
      mapApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError(null);
    try {
      await authApi.forgotPassword(email);
      toast.success("Verification code sent to your email!");
      navigateToStep("verify-code");
    } catch (err) {
      mapApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError(null);
    try {
      await authApi.verifyOtpAdmin({ email, code });
      navigateToStep("reset-password");
    } catch (err) {
      mapApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPasswordAdmin({ email, password: newPassword });
      toast.success(
        "Password successfully reset! Please sign in with your new password.",
      );
      navigateToStep("signin");
      setPassword("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      mapApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fc] flex items-center justify-center p-4 relative overflow-hidden animate-fade-in-up">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-pink/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#7c3aed]/5 blur-[120px]" />

      <div className="w-full max-w-[420px] bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6 relative z-10 text-left">
        {/* Back Link — hidden in invite flow (no verify-code step to go back to) */}
        {step !== "signin" && !isInviteFlow && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-[#7a7a9a] hover:text-brand-pink transition-colors font-bold cursor-pointer"
          >
            <ChevronLeft size={14} /> Back
          </button>
        )}

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-[#1a1a2e]">
            {step === "signin" && "Sign in to Admin Portal"}
            {step === "forgot-password" && "Forgot password?"}
            {step === "verify-code" && "Enter verification code"}
            {step === "reset-password" && "Create new password"}
          </h2>
          <p className="text-xs text-[#9a99b0] font-semibold leading-relaxed">
            {step === "signin" && "Restricted access — Trendupp team only"}
            {step === "forgot-password" &&
              "Enter your registered email address and we'll send a 6-digit verification code."}
            {step === "verify-code" && `Code sent to ${email}`}
            {step === "reset-password" &&
              "Choose a strong password with at least 8 characters."}
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed animate-shake">
            {generalError}
          </div>
        )}

        {/* Form container */}
        {step === "signin" && (
          <form onSubmit={onSigninSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a99b0]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    setGeneralError(null);
                  }}
                  placeholder="you@trendupp.com"
                  className="pl-10 h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-red-500 font-bold mt-1 text-left">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => navigateToStep("forgot-password")}
                  className="text-[11px] font-bold text-brand-pink hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a99b0]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                    setGeneralError(null);
                  }}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-brand-pink transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-red-500 font-bold mt-1 text-left">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-9.5 w-full bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        )}

        {step === "forgot-password" && (
          <form onSubmit={onForgotSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a99b0]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    setGeneralError(null);
                  }}
                  placeholder="you@trendupp.com"
                  className="pl-10 h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-red-500 font-bold mt-1 text-left">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="h-9.5 w-full bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              {loading ? "Sending code..." : "Send code"}
            </Button>
          </form>
        )}

        {step === "verify-code" && (
          <form onSubmit={onVerifySubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                6-Digit Code
              </Label>
              <Input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, code: undefined }));
                  setGeneralError(null);
                }}
                placeholder="123456"
                className="h-9.5 text-center text-xs tracking-[0.5em] font-bold rounded-xl focus-visible:ring-brand-pink/30"
              />
              {fieldErrors.code && (
                <p className="text-[10px] text-red-500 font-bold mt-1 text-left">
                  {fieldErrors.code}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="h-9.5 w-full bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              {loading ? "Verifying..." : "Submit Code"}
            </Button>
          </form>
        )}

        {step === "reset-password" && (
          <form onSubmit={onResetSubmit} className="flex flex-col gap-4">
            {/* Show locked email in invite flow so user knows which account they're setting up */}
            {isInviteFlow && email && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Account Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a99b0]" />
                  <Input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    className="pl-10 h-9.5 text-xs rounded-xl font-medium bg-[#f4f3f6] text-[#9a99b0] cursor-not-allowed border-[#e8e6f0]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a99b0]" />
                <Input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      newPassword: undefined,
                    }));
                    setGeneralError(null);
                  }}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-brand-pink transition-colors focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-[10px] text-red-500 font-bold mt-1 text-left">
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a99b0]" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                    setGeneralError(null);
                  }}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-brand-pink transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[10px] text-red-500 font-bold mt-1 text-left">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                loading || !newPassword || newPassword !== confirmPassword
              }
              className="h-9.5 w-full bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              {loading
                ? "Setting up…"
                : isInviteFlow
                  ? "Set Up Password →"
                  : "Reset password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
