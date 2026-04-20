import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { StoreSettingsProvider } from "@/contexts/StoreSettingsContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardHome from "./pages/DashboardHome";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import DownloadsPage from "./pages/DownloadsPage";
import AddressesPage from "./pages/AddressesPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
import WishlistPage from "./pages/WishlistPage";
import SupportPage from "./pages/SupportPage";
import AdminHome from "./pages/admin/AdminHome";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCustomerDetailPage from "./pages/admin/AdminCustomerDetailPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import { Navigate } from "react-router-dom";
import { StorefrontLayout } from "./pages/storefront/StorefrontLayout";
import HomePage from "./pages/storefront/HomePage";
import ContactPage from "./pages/storefront/ContactPage";
import PolicyPage from "./pages/storefront/PolicyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreSettingsProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public storefront */}
              <Route element={<StorefrontLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<PolicyPage />} />
                <Route path="/privacy" element={<PolicyPage />} />
                <Route path="/returns" element={<PolicyPage />} />
                <Route path="/shipping" element={<PolicyPage />} />
              </Route>

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/redirect" element={<RoleRedirect />} />

              {/* Customer dashboard */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="downloads" element={<DownloadsPage />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="account" element={<AccountDetailsPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="support" element={<SupportPage />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="customers" element={<Navigate to="/admin/users" replace />} />
                <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </StoreSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
