import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", label, ...props }, ref) => {
    if (label) {
      return (
        <div className="relative flex items-center" ref={ref} {...props}>
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-4 shrink-0 text-xs font-medium uppercase tracking-wider text-gray-400">
            {label}
          </span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 bg-gray-200",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
