"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function Avatar({
  className,
  size = "md",
  src,
  alt,
  fallback,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials =
    fallback ||
    (alt
      ? alt
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U");

  if (src && !imgError) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark font-semibold text-white",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
