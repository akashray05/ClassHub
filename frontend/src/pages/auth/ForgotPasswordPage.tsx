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
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
          <MailCheck className="size-6 text-accent-foreground" />
        </div>

        <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-neutral-900">
          Check your email
        </h1>

        <p className="mt-1.5 text-[13.5px] text-neutral-500">
          If an account exists for that email, we&apos;ve sent a link to
          reset your password.
        </p>

        <Button
          variant="outline"
          className="mt-6 w-full"
          render={<Link to="/login" />}
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-neutral-900">
        Forgot password
      </h1>
      <p className="mt-1.5 text-[13.5px] text-neutral-500">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-neutral-500">
        Remembered your password?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
