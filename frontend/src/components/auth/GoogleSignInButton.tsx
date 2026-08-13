import { useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";

import { googleLogin } from "@/services/auth";
import { setTokens } from "@/store/auth";
import type { MessageResponse } from "@/types/auth";
import { toast } from "@/components/ui/toast";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  onSuccess: () => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;

export default function GoogleSignInButton({
  text = "continue_with",
  onSuccess,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) {
      return;
    }

    let cancelled = false;

    async function handleCredential(response: { credential: string }) {
      setIsProcessing(true);

      try {
        const result = await googleLogin(response.credential);

        setTokens(result.access_token, result.refresh_token);

        if (!cancelled) {
          onSuccess();
        }
      } catch (err) {
        const axiosErr = err as AxiosError<MessageResponse>;

        toast.add({
          title: "Google sign-in failed",
          description:
            axiosErr.response?.data?.detail ??
            axiosErr.response?.data?.message ??
            "Only genuine @gmail.com accounts can sign in with Google.",
          type: "error",
        });
      } finally {
        if (!cancelled) {
          setIsProcessing(false);
        }
      }
    }

    function renderButton() {
      if (!window.google || !containerRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID as string,
        callback: handleCredential,
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text,
        shape: "rectangular",
        width: 336,
      });
    }

    if (window.google) {
      renderButton();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          renderButton();
        }
      }, 200);

      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [text, onSuccess]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-xs text-muted-foreground text-center">
        Google sign-in isn&apos;t configured yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={containerRef} />
      {isProcessing && (
        <p className="text-xs text-muted-foreground">Signing you in...</p>
      )}
    </div>
  );
}
