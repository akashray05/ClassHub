import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

import { verifyEmail } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";

import { Button } from "@/components/ui/button";

type VerificationStatus = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        const axiosErr = err as AxiosError<MessageResponse>;

        setStatus("error");
        setErrorMessage(
          axiosErr.response?.data?.detail ??
            axiosErr.response?.data?.message ??
            "This verification link is invalid or has expired."
        );
      });
  }, [token]);

  return (
    <div className="text-center">
      <div
        className={`mx-auto flex size-12 items-center justify-center rounded-full ${
          status === "success"
            ? "bg-accent"
            : status === "error"
            ? "bg-destructive/10"
            : "bg-accent"
        }`}
      >
        {status === "verifying" && (
          <Loader2 className="size-6 text-accent-foreground animate-spin" />
        )}

        {status === "success" && (
          <CheckCircle2 className="size-6 text-accent-foreground" />
        )}

        {status === "error" && (
          <XCircle className="size-6 text-destructive" />
        )}
      </div>

      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-neutral-900">
        {status === "verifying" && "Verifying your email..."}
        {status === "success" && "Email verified"}
        {status === "error" && "Verification failed"}
      </h1>

      <p className="mt-1.5 text-[13.5px] text-neutral-500">
        {status === "verifying" &&
          "Please wait while we confirm your email address."}
        {status === "success" &&
          "Your email has been verified successfully. You can now log in."}
        {status === "error" && errorMessage}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {status === "success" && (
          <Button className="w-full" render={<Link to="/login" />}>
            Continue to login
          </Button>
        )}

        {status === "error" && (
          <>
            <Button
              className="w-full"
              render={<Link to="/resend-verification" />}
            >
              Resend verification email
            </Button>

            <Button
              variant="outline"
              className="w-full"
              render={<Link to="/login" />}
            >
              Back to login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
