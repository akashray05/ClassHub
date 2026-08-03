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
        "border border-slate-800",
        "bg-slate-900",
        "shadow-sm",
        "transition-all duration-200",
        hover &&
          "hover:border-cyan-500/50 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}