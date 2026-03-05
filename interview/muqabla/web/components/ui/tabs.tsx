"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={className} data-value={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ value?: string; onValueChange?: (v: string) => void }>, {
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (v: string) => void;
}

function TabsList({ children, className, value, onValueChange }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-gray-100/80 p-1",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ activeValue?: string; onSelect?: (v: string) => void }>, {
            activeValue: value,
            onSelect: onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  activeValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function TabsTrigger({
  value,
  activeValue,
  onSelect,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const isActive = value === activeValue;
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700",
        className
      )}
      onClick={() => onSelect?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  activeValue?: string;
  onValueChange?: (v: string) => void;
}

function TabsContent({
  value: tabValue,
  activeValue,
  onValueChange: _,
  className,
  children,
  ...props
}: TabsContentProps) {
  // Get the value from the parent Tabs data attribute if not passed directly
  const parentValue = activeValue;
  if (tabValue !== parentValue) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
