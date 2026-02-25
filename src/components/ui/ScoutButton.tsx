import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const scoutButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scout-accent-teal)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--scout-bg-primary)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--scout-accent-teal)] text-[var(--scout-bg-primary)] font-semibold hover:brightness-110 hover-glow active:scale-[0.98]",
        secondary:
          "border border-white/10 bg-transparent text-[var(--scout-text-primary)] hover:bg-white/[0.06] active:bg-white/[0.08]",
        ghost:
          "bg-transparent text-[var(--scout-accent-teal)] hover:bg-[var(--scout-accent-teal)]/8 hover:underline-offset-4",
        danger:
          "bg-[var(--scout-error)] text-white font-semibold hover:brightness-110 active:scale-[0.98]",
        muted:
          "bg-white/[0.04] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.08]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ScoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof scoutButtonVariants> {
  loading?: boolean;
}

const ScoutButton = React.forwardRef<HTMLButtonElement, ScoutButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(scoutButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
ScoutButton.displayName = "ScoutButton";

export { ScoutButton, scoutButtonVariants };
