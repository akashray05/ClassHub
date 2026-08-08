import * as React from "react";
import { cn } from "@/lib/utils";

export interface AppCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function AppCard({
  className,
  hover = true,
  children,
  ...props
}: AppCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        "border border-border",
        "bg-card text-card-foreground",
        "shadow-sm",
        "transition-all duration-200",
        hover &&
          "hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}