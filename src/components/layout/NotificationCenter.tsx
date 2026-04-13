import { useState } from "react";
import { Bell, ShoppingBag, AlertTriangle, Settings, Package, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Notification {
  id: string;
  type: "order" | "alert" | "system" | "product";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "order", title: "New Order #1043", message: "Lisa Wong placed a $259.98 order", time: "2026-04-13T09:15:00", read: false },
  { id: "2", type: "alert", title: "Low Stock Alert", message: "Smart Watch Pro has only 3 units left", time: "2026-04-13T08:30:00", read: false },
  { id: "3", type: "order", title: "Payment Failed", message: "Order #1044 payment was declined", time: "2026-04-13T07:45:00", read: false },
  { id: "4", type: "system", title: "Plugin Updated", message: "WooCommerce updated to v9.2.1", time: "2026-04-12T22:00:00", read: true },
  { id: "5", type: "product", title: "New Review", message: "5-star review on Premium Wireless Headphones", time: "2026-04-12T18:30:00", read: true },
  { id: "6", type: "order", title: "Refund Requested", message: "Sarah Mitchell requested a refund for #1038", time: "2026-04-12T14:00:00", read: true },
  { id: "7", type: "system", title: "Backup Complete", message: "Daily store backup completed successfully", time: "2026-04-12T03:00:00", read: true },
];

const typeIcon: Record<Notification["type"], React.ElementType> = {
  order: ShoppingBag,
  alert: AlertTriangle,
  system: Settings,
  product: Package,
};

const typeColor: Record<Notification["type"], string> = {
  order: "bg-primary/10 text-primary",
  alert: "bg-warning/10 text-warning",
  system: "bg-muted text-muted-foreground",
  product: "bg-success/10 text-success",
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-card border rounded-xl shadow-elevated z-50 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="h-5 px-1.5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin divide-y">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                notifications.map(n => {
                  const Icon = typeIcon[n.type];
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors relative group",
                        !n.read && "bg-primary/[0.03]"
                      )}
                    >
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", typeColor[n.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-xs font-semibold truncate", !n.read && "text-foreground")}>{n.title}</p>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{format(new Date(n.time), "MMM d 'at' h:mm a")}</p>
                      </div>
                      <button
                        onClick={() => dismiss(n.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
