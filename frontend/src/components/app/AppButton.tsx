import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export interface AppButtonProps
  extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

export function AppButton({
  children,
  loading = false,
  disabled,
  className,
  ...props
}: AppButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn(
        "transition-all duration-200",
        "rounded-xl",
        "font-semibold",
        "shadow-sm",
        "hover:scale-[1.04]",
        "active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2
          className="mr-2 h-4 w-4 animate-spin"
        />
      )}

      {children}
    </Button>
  );
}