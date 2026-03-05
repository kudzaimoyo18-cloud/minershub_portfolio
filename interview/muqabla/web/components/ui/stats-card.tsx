import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  className?: string;
}

function StatsCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  className,
}: StatsCardProps) {
  const trendColors = {
    up: "text-green-600 bg-green-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {change && (
          <span
            className={cn(
              "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              trendColors[trend]
            )}
          >
            {trend === "up" && "+"}{change}
          </span>
        )}
      </div>
    </div>
  );
}

export { StatsCard };
