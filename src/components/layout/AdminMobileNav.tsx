import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, MoreHorizontal, Users, Settings, LogOut, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const mainItems = [
  { label: "Home", icon: LayoutDashboard, path: "/admin" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
];

export function AdminMobileNav() {
  const location = useLocation();
  const { logout, hasPermission } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const moreItems = [
    hasPermission("manage_customers") && { label: "Users", icon: Users, path: "/admin/users" },
    hasPermission("manage_products") && { label: "Coupons", icon: Tag, path: "/admin/coupons" },
    hasPermission("manage_settings") && { label: "Settings", icon: Settings, path: "/admin/settings" },
  ].filter(Boolean) as { label: string; icon: React.ElementType; path: string }[];

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <div className="absolute bottom-20 left-4 right-4 bg-card rounded-xl border shadow-elevated p-2 space-y-1 animate-fade-in" onClick={e => e.stopPropagation()}>
            {moreItems.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setShowMore(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <item.icon className="h-4 w-4" /><span>{item.label}</span>
              </Link>
            ))}
            <button onClick={() => { setShowMore(false); logout(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors">
              <LogOut className="h-4 w-4" /><span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-card/95 backdrop-blur-lg border-t safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={cn("flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-0",
                  active ? "text-primary" : "text-muted-foreground")}>
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setShowMore(!showMore)}
            className={cn("flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
              showMore ? "text-primary" : "text-muted-foreground")}>
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
