import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import type { AxiosError } from "axios";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/forgotPassword";
import { forgotPassword } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await forgotPassword({ email: data.email });
      setIsSent(true);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      const message =
        axiosErr.response?.data?.detail ??
        axiosErr.response?.data?.message ??
        "Something went wrong. Please try again.";

      toast.add({
        title: "Request failed",
        description: message,
        type: "error",
      });
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <MailCheck className="size-10 text-cyan-400" />

            <CardTitle className="text-2xl mt-4">
              Check your email
            </CardTitle>

            <CardDescription>
              If an account exists for that email, we&apos;ve sent a link to
              reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button variant="outline" className="w-full" render={<Link to="/login" />}>
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Forgot password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending link..." : "Send reset link"}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Remembered your password?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
