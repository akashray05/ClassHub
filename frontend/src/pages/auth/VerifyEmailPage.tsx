import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

import { verifyEmail } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          {status === "verifying" && (
            <Loader2 className="size-10 text-cyan-400 animate-spin" />
          )}

          {status === "success" && (
            <CheckCircle2 className="size-10 text-emerald-400" />
          )}

          {status === "error" && (
            <XCircle className="size-10 text-red-500" />
          )}

          <CardTitle className="text-2xl mt-4">
            {status === "verifying" && "Verifying your email..."}
            {status === "success" && "Email verified"}
            {status === "error" && "Verification failed"}
          </CardTitle>

          <CardDescription>
            {status === "verifying" &&
              "Please wait while we confirm your email address."}
            {status === "success" &&
              "Your email has been verified successfully. You can now log in."}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {status === "success" && (
            <Button className="w-full" render={<Link to="/login" />}>
              Continue to login
            </Button>
          )}

          {status === "error" && (
            <>
              <Button className="w-full" render={<Link to="/resend-verification" />}>
                Resend verification email
              </Button>

              <Button variant="outline" className="w-full" render={<Link to="/login" />}>
                Back to login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
