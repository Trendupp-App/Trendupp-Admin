"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "@/hooks/useAdminSettingsExtra";

export default function ChangeLoginView() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const changePasswordMutation = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation password do not match.");
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrorMessage("");
        },
      },
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-[#1a1a2e]">Change Password</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#f0f0f5] rounded-2xl p-4 sm:p-7 flex flex-col gap-5 shadow-xs w-full max-w-2xl"
      >
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Current Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">
            Current password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full bg-white border border-[#ececf2] rounded-xl pl-11 pr-11 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer"
              title={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">
            New password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New password"
              required
              className="w-full bg-white border border-[#ececf2] rounded-xl pl-11 pr-11 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer"
              title={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">
            Confirm password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className="w-full bg-white border border-[#ececf2] rounded-xl pl-11 pr-11 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
