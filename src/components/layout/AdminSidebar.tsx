import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Settings, LogOut, ChevronLeft, Store, Shield, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { logout, customer, role, hasPermission } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/admin", permission: null },
    { label: "Orders", icon: ShoppingBag, path: "/admin/orders", permission: "manage_orders" },
    { label: "Products", icon: Package, path: "/admin/products", permission: "manage_products" },
    { label: "Users", icon: Users, path: "/admin/users", permission: "manage_customers" },
    { label: "Analytics", icon: BarChart3, path: "/admin/analytics", permission: "view_analytics" },
    { label: "Coupons", icon: Tag, path: "/admin/coupons", permission: "manage_products" },
    { label: "Settings", icon: Settings, path: "/admin/settings", permission: "manage_settings" },
  ].filter(item => item.permission === null || hasPermission(item.permission));

  const roleLabel = role === 'administrator' ? 'Admin' : role === 'shop_manager' ? 'Manager' : 'Editor';

  return (
    <aside className={cn(
      "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 z-30",
      collapsed ? "w-[72px]" : "w-[260px]"
    )}>
      {/* Brand */}
      <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-sidebar-border", collapsed && "justify-center")}>
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight">MyStore</span>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-sidebar-primary" />
              <span className="text-[10px] font-medium text-sidebar-primary">{roleLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      {!collapsed && customer && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
              {customer.first_name[0]}{customer.last_name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{customer.display_name}</p>
              <p className="text-xs text-sidebar-muted truncate">{customer.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map(item => {
          const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-muted hover:text-destructive hover:bg-destructive/10 w-full transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <ChevronLeft className={cn("h-[18px] w-[18px] shrink-0 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
