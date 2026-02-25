import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── ScoutCard ─── */
export interface ScoutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add hover lift effect */
  interactive?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
}

const ScoutCard = React.forwardRef<HTMLDivElement, ScoutCardProps>(
  ({ className, interactive, noPadding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-[var(--scout-bg-card)] border border-[rgba(255,255,255,0.05)]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
          !noPadding && "p-5",
          interactive &&
            "transition-all duration-200 ease-in-out hover:border-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-[1px] cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScoutCard.displayName = "ScoutCard";

/* ─── ScoutCardHeader ─── */
const ScoutCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between mb-4", className)}
    {...props}
  />
));
ScoutCardHeader.displayName = "ScoutCardHeader";

/* ─── ScoutCardTitle ─── */
const ScoutCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-medium text-[var(--scout-text-heading)]",
      className
    )}
    {...props}
  />
));
ScoutCardTitle.displayName = "ScoutCardTitle";

/* ─── ScoutCardContent ─── */
const ScoutCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
ScoutCardContent.displayName = "ScoutCardContent";

export { ScoutCard, ScoutCardHeader, ScoutCardTitle, ScoutCardContent };
