"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner"; // If you use sonner for notifications

type StepType = "signin" | "forgot-password" | "verify-code" | "reset-password";

export default function AdminSigninPage() {
  const router = useRouter();
  const [step, setStep] = useState<StepType>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (step === "forgot-password") setStep("signin");
    else if (step === "verify-code") setStep("forgot-password");
    else if (step === "reset-password") setStep("verify-code");
  };

  const onSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send the login request to the NestJS server
      const response = await authApi.login({ email, password });

      const { accessToken, admin } = response.data;

      const user = admin;

      // Define allowed administrative roles
      const ALLOWED_ADMIN_ROLES = [
        "owner",
        "super_admin",
        "finance_admin",
        "moderator",
        "support_agent",
      ];

      if (!ALLOWED_ADMIN_ROLES.includes(user.role)) {
        toast.error("Access denied. Authorized administrator role required.");
        setLoading(false);
        return;
      }

      // 3. Save the token and user in local Zustand session storage
      useAuthStore.getState().setSession(accessToken, user);

      toast.success(`Welcome back, ${user.firstName}!`);

      // 4. Redirect to the dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      // The apiClient interceptor automatically formats backend validation errors
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || "Failed to sign in. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success("Verification code sent to your email!");
      setStep("verify-code");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("reset-password");
  };

  const onResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, newPassword });
      toast.success(
        "Password successfully reset! Please sign in with your new password.",
      );
      setStep("signin");
      setPassword("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
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
        {/* Back Link */}
        {step !== "signin" && (
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

        {/* Form container */}
        {step === "signin" && (
          <form onSubmit={onSigninSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@trendupp.com"
                className="h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setStep("forgot-password")}
                  className="text-[11px] font-bold text-brand-pink hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
              />
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
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@trendupp.com"
                className="h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
              />
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
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="h-9.5 text-center text-xs tracking-[0.5em] font-bold rounded-xl focus-visible:ring-brand-pink/30"
              />
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
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                New Password
              </Label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">
                Confirm Password
              </Label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9.5 text-xs rounded-xl focus-visible:ring-brand-pink/30 font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={
                loading || !newPassword || newPassword !== confirmPassword
              }
              className="h-9.5 w-full bg-brand-pink hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
