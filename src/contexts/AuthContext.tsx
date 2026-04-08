import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockCustomer, mockAdmin, mockEditor, mockShopManager, WooCustomer, UserRole, rolePermissions } from '@/data/mock-data';

/**
 * Auth context for WooCommerce customer dashboard.
 * In production, replace with WordPress nonce-based auth
 * or WooCommerce REST API token authentication.
 */

interface AuthContextType {
  isAuthenticated: boolean;
  customer: WooCustomer | null;
  role: UserRole | null;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { first_name: string; last_name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateCustomer: (data: Partial<WooCustomer>) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map login email to a mock user for demo purposes */
function getUserByEmail(email: string): WooCustomer {
  const e = email.toLowerCase().trim();
  if (e.includes('admin') || e === 'james@mystore.com') return mockAdmin;
  if (e.includes('editor') || e === 'emily@mystore.com') return mockEditor;
  if (e.includes('manager') || e === 'david@mystore.com') return mockShopManager;
  return mockCustomer;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<WooCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const role = customer?.role ?? null;

  const hasPermission = useCallback((permission: string) => {
    if (!role) return false;
    return rolePermissions[role]?.includes(permission) ?? false;
  }, [role]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (email) {
      const user = getUserByEmail(email);
      setCustomer(user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (data: { first_name: string; last_name: string; email: string; password: string }) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setCustomer({ ...mockCustomer, first_name: data.first_name, last_name: data.last_name, email: data.email });
    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCustomer(null);
  }, []);

  const updateCustomer = useCallback((data: Partial<WooCustomer>) => {
    setCustomer(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, customer, role, hasPermission, login, register, logout, updateCustomer, isLoading, isDarkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
