"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/lib/api";

interface User {
  _id: string;
  ojassId: string;
  name: string;
  phone: string;
  referralCode: string; // This will be the OJASS ID itself
  email: string;
  referralCount?: number;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(emailOrPhone, password);
      
      // Transform user data to match our interface
      const userData: User = {
        _id: response.user._id,
        ojassId: response.user.ojassId,
        name: response.user.name,
        phone: response.user.phone,
        referralCode: response.user.ojassId, // OJASS ID is the referral code
        email: response.user.email,
        referralCount: response.user.referralCount || 0,
      };

      setUser(userData);
      
      // Store token and user data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          // Clear invalid data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

