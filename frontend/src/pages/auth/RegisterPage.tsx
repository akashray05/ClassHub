import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";

import { registerSchema, type RegisterFormData } from "@/schemas/register";
import { register as registerUser } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  async function handleGoogleSuccess() {
    await refreshUser();
    navigate("/dashboard");
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.add({
        title: "Account created",
        description:
          "Check your inbox for a verification link before logging in.",
        type: "success",
      });

      navigate("/login");
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      const message =
        axiosErr.response?.data?.detail ??
        axiosErr.response?.data?.message ??
        "Registration failed. Please try again.";

      toast.add({
        title: "Registration failed",
        description: message,
        type: "error",
      });
    }
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-neutral-900">
        Create your account
      </h1>
      <p className="mt-1.5 text-[13.5px] text-neutral-500">
        Start storing and sharing files on ClassHub.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name" className="text-[13px] text-neutral-700">
            Full name
          </Label>

          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            className="mt-1.5"
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1.5 text-[12.5px] text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-[13px] text-neutral-700">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            className="mt-1.5"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1.5 text-[12.5px] text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-[13px] text-neutral-700">
            Password
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
            Confirm password
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-[11px] uppercase tracking-wide text-neutral-400">
          or
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <GoogleSignInButton
        text="signup_with"
        onSuccess={handleGoogleSuccess}
      />

      <p className="mt-3 text-center text-[12px] text-neutral-400">
        Google sign-up requires a genuine @gmail.com account.
      </p>
    </div>
  );
}
