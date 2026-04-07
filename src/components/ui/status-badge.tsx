import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/data/mock-data";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  processing: { label: "Processing", className: "bg-info/10 text-info border-info/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-border" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground border-border" },
  "on-hold": { label: "On Hold", className: "bg-warning/10 text-warning border-warning/20" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", config.className)}>
      {config.label}
    </span>
  );
}
