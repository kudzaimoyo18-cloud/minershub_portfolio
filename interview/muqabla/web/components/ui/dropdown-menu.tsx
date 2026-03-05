"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

function DropdownMenu({ trigger, children, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[180px] rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg animate-fade-in",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<{ onClose?: () => void }>, {
                onClose: () => setOpen(false),
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  onClose?: () => void;
}

function DropdownItem({
  className,
  children,
  icon,
  variant = "default",
  onClick,
  onClose,
  ...props
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
        variant === "destructive"
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        onClose?.();
      }}
      {...props}
    >
      {icon && <span className="shrink-0 opacity-60">{icon}</span>}
      {children}
    </button>
  );
}

function DropdownSeparator() {
  return <div className="my-1.5 border-t border-gray-100" />;
}

export { DropdownMenu, DropdownItem, DropdownSeparator };
