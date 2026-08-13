import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import type { AxiosError } from "axios";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/resetPassword";
import { resetPassword } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) {
      toast.add({
        title: "Invalid link",
        description: "This password reset link is missing a token.",
        type: "error",
      });
      return;
    }

    try {
      await resetPassword({
        token,
        new_password: data.password,
      });

      toast.add({
        title: "Password updated",
        description: "You can now log in with your new password.",
        type: "success",
      });

      navigate("/login");
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      const message =
        axiosErr.response?.data?.detail ??
        axiosErr.response?.data?.message ??
        "This link is invalid or has expired.";

      toast.add({
        title: "Reset failed",
        description: message,
        type: "error",
      });
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="size-6 text-destructive" />
        </div>

        <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-neutral-900">
          Invalid reset link
        </h1>

        <p className="mt-1.5 text-[13.5px] text-neutral-500">
          This password reset link is missing or malformed. Please request a
          new one.
        </p>

        <Button
          className="mt-6 w-full"
          render={<Link to="/forgot-password" />}
        >
          Request new link
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-neutral-900">
        Reset password
      </h1>
      <p className="mt-1.5 text-[13.5px] text-neutral-500">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="password" className="text-[13px] text-neutral-700">
            New password
          </Label>

          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-9"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-[12.5px] text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-[13px] text-neutral-700"
          >
            Confirm new password
          </Label>

          <div className="relative mt-1.5">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-9"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1.5 text-[12.5px] text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating password..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
