import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-lg border p-5 shadow-card transition-all hover:shadow-elevated", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trendUp ? "text-success" : "text-muted-foreground")}>
              {trend}
            </p>
          )}
        </div>
        <div className="h-11 w-11 rounded-lg gradient-primary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}
