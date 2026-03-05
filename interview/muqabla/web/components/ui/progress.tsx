import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "accent" | "success";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = "default",
      size = "md",
      showLabel,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const barColors = {
      default: "bg-primary",
      accent: "bg-accent",
      success: "bg-success",
    };

    const trackSizes = {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
    };

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {showLabel && (
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-500">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-gray-100",
            trackSizes[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              barColors[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
