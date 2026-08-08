import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";

import { registerSchema, type RegisterFormData } from "@/schemas/register";
import { register as registerUser } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Create account</CardTitle>
          <CardDescription>
            Sign up to start storing and sharing files on ClassHub.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>Full name</Label>

              <Input
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                {...register("name")}
              />

              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="pr-9"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Confirm password</Label>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="pr-9"
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-200"
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
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs uppercase tracking-wide text-slate-500">
              or
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <GoogleSignInButton
            text="signup_with"
            onSuccess={handleGoogleSuccess}
          />

          <p className="mt-3 text-center text-xs text-slate-500">
            Google sign-up requires a genuine @gmail.com account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
