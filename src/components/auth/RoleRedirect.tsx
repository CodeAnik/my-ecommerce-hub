import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirects authenticated users to their role-appropriate dashboard.
 * Customers → /dashboard, Admin/Editor/Manager → /admin
 */
export function RoleRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role === "customer") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/admin" replace />;
}
