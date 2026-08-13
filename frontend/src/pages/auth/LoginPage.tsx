import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { loginSchema, type LoginFormData } from "@/schemas/login";
import { useAuth } from "@/hooks/useAuth";
import type { MessageResponse } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function handleGoogleSuccess() {
    await refreshUser();
    navigate("/dashboard");
  }

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password);

      navigate("/dashboard");

    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      const message =
        axiosErr.response?.data?.detail ??
        axiosErr.response?.data?.message ??
        "Invalid email or password";

      toast.add({
        title: "Login failed",
        description: message,
        type: "error",
      });
    }
  }

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">
        Welcome back
      </h1>
      <p className="mt-1.5 text-[14.5px] text-neutral-500">
        Log in to access your files.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email" className="text-[15.5px] text-neutral-700">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="youremail@gmail.com"
            className="mt-1.5"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1.5 text-[13.5px] text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[15.5px] text-neutral-700">
              Password
            </Label>

            <Link
              to="/forgot-password"
              className="mb-1.5 text-[14.5px] font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="********"
            className="mt-1.5"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1.5 text-[13.5px] text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[14.5px] text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
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
        text="signin_with"
        onSuccess={handleGoogleSuccess}
      />

      <p className="mt-3 text-center text-[13px] text-neutral-400">
        Google sign-in requires a genuine @gmail.com account.
      </p>
    </div>
  );
}
