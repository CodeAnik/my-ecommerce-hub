import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminMobileNav } from "./AdminMobileNav";

export function AdminLayout() {
  const { isAuthenticated, role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "customer") return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <AdminMobileNav />
    </div>
  );
}
