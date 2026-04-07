import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockCustomer, WooCustomer } from '@/data/mock-data';

/**
 * Auth context for WooCommerce customer dashboard.
 * In production, replace with WordPress nonce-based auth
 * or WooCommerce REST API token authentication.
 */

interface AuthContextType {
  isAuthenticated: boolean;
  customer: WooCustomer | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { first_name: string; last_name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateCustomer: (data: Partial<WooCustomer>) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<WooCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  // Replace with wp_ajax or WooCommerce auth endpoint
  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (email) {
      setCustomer(mockCustomer);
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
    <AuthContext.Provider value={{ isAuthenticated, customer, login, register, logout, updateCustomer, isLoading, isDarkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
