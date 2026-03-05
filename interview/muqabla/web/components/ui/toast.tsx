"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

const iconStyles: Record<ToastVariant, string> = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const Icon = icons[t.variant];

  React.useEffect(() => {
    const timeout = setTimeout(() => onDismiss(t.id), t.duration || 4000);
    return () => clearTimeout(timeout);
  }, [t.id, t.duration, onDismiss]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-fade-in-up",
        styles[t.variant]
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconStyles[t.variant])} />
      <p className="flex-1 text-sm font-medium">{t.message}</p>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (message: string, variant: ToastVariant = "info", duration?: number) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    []
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
