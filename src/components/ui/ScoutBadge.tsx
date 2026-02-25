import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const scoutBadgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.06] text-[var(--scout-text-primary)] border border-[var(--scout-border)]",
        teal: "bg-[var(--scout-accent-teal)]/10 text-[var(--scout-accent-teal)] border border-[var(--scout-accent-teal)]/20",
        purple:
          "bg-[var(--scout-accent-purple)]/10 text-[var(--scout-accent-purple)] border border-[var(--scout-accent-purple)]/20",
        blue: "bg-[var(--scout-accent-blue)]/10 text-[var(--scout-accent-blue)] border border-[var(--scout-accent-blue)]/20",
        warning:
          "bg-[var(--scout-warning)]/10 text-[var(--scout-warning)] border border-[var(--scout-warning)]/20",
        error:
          "bg-[var(--scout-error)]/10 text-[var(--scout-error)] border border-[var(--scout-error)]/20",
        success:
          "bg-[var(--scout-success)]/10 text-[var(--scout-success)] border border-[var(--scout-success)]/20",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] uppercase tracking-wider",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ScoutBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof scoutBadgeVariants> {}

const ScoutBadge = React.forwardRef<HTMLSpanElement, ScoutBadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(scoutBadgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
ScoutBadge.displayName = "ScoutBadge";

/* ─── Stage-specific badge helper ─── */
const stageColors: Record<string, VariantProps<typeof scoutBadgeVariants>["variant"]> = {
  "Pre-Seed": "purple",
  Seed: "teal",
  "Series A": "blue",
  "Series B": "blue",
  "Series C": "warning",
  Growth: "success",
};

export function StageBadge({
  stage,
  className,
}: {
  stage: string;
  className?: string;
}) {
  const variant = stageColors[stage] || "default";
  return (
    <ScoutBadge variant={variant} size="sm" className={className}>
      {stage}
    </ScoutBadge>
  );
}

export { ScoutBadge, scoutBadgeVariants };
