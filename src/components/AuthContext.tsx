"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types/auth";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/lib/services/auth-service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => { success: boolean; error?: string };
  register: (params: { fullName: string; email: string; idCard: string; phone: string; password?: string }) => {
    success: boolean;
    error?: string;
  };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string) => {
    const res = loginUser(email);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleRegister = (params: { fullName: string; email: string; idCard: string; phone: string; password?: string }) => {
    const res = registerUser(params);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
