"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

export type StudentStatus = "none" | "pending" | "verified" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  dailyFreeCredits: number;
  lastClaimDate: string | null;
  studentStatus: StudentStatus;
  history: any[];
};

type AuthContextType = {
  user: User | null;
  status: "authenticated" | "loading" | "unauthenticated";
  isAuthOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  applyForStudentAuth: (eduEmail: string) => void;
  adminApproveStudent: () => void;
  updateCredits: (amount: number) => void;
  deductCredit: (cost?: number) => boolean;
  addHistoryItem: (item: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setAuthOpen] = useState(false);

  // Sync with NextAuth session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const stored = localStorage.getItem("vedagarbha_user");
      let baseUser = stored ? JSON.parse(stored) : null;

      // If session exists but no local user, or email mismatch, create/update
      if (!baseUser || baseUser.email !== session.user.email) {
        const today = new Date().toISOString().split('T')[0];
        baseUser = {
          id: (session.user as any).id || Date.now().toString(),
          name: session.user.name || "User",
          email: session.user.email,
          credits: 10, // Initial credits for real signup
          dailyFreeCredits: 3,
          lastClaimDate: today,
          studentStatus: "none",
          history: []
        };
      }
      setUser(baseUser);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
    setIsLoading(status === "loading");
  }, [session, status]);

  // Save to local storage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem("vedagarbha_user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    // Handled by handleLogin in component via signIn('credentials')
  };

  const loginWithGoogle = async () => {
    // Handled via signIn('google') in component
  };

  const loginWithApple = async () => {
    // Handled via signIn('apple') in component
  };

  const loginWithPhone = async (phone: string) => {
     // Handled via signIn('phone') in component
  };

  const signup = async (name: string, email: string, pass: string) => {
    const today = new Date().toISOString().split('T')[0];
    setUser({ id: `user_${Date.now()}`, name, email, credits: 10, dailyFreeCredits: 3, lastClaimDate: today, studentStatus: "none", history: [] });
  };

  const logout = () => {
    signOut();
    localStorage.removeItem("vedagarbha_user");
    setUser(null);
  };

  const applyForStudentAuth = (eduEmail: string) => {
    if (user) {
      setUser({ ...user, studentStatus: "pending" });
    }
  };

  const adminApproveStudent = () => {
    if (user) {
      setUser({ ...user, studentStatus: "verified" });
    }
  };

  const updateCredits = (amount: number) => {
    if (user) {
      // Use toFixed to prevent 0.30000000000000004 floating point errors, then parse back
      const newAmount = Math.max(0, parseFloat((user.credits + amount).toFixed(1)));
      setUser({ ...user, credits: newAmount });
    }
  };

  const deductCredit = (cost: number = 1): boolean => {
    if (!user) return false;
    const totalAvailable = user.credits + user.dailyFreeCredits;
    if (totalAvailable < cost) return false;

    setUser(prev => {
      if (!prev) return prev;
      
      let newDaily = prev.dailyFreeCredits;
      let newStd = prev.credits;
      
      if (newDaily >= cost) {
        newDaily -= cost;
      } else {
        const remaining = cost - newDaily;
        newDaily = 0;
        newStd = parseFloat((newStd - remaining).toFixed(1));
      }
      
      return { ...prev, dailyFreeCredits: newDaily, credits: newStd };
    });
    return true;
  };

  const addHistoryItem = (item: any) => {
    setUser(prev => {
      if (!prev) return prev;
      const newHistory = [item, ...(prev.history || [])].slice(0, 50); // Increased history limit
      return { ...prev, history: newHistory };
    });
  };

  return (
    <AuthContext.Provider value={{
      user, status, isAuthOpen, setAuthOpen, isLoading, login, loginWithGoogle, loginWithApple, loginWithPhone, signup, logout, applyForStudentAuth, adminApproveStudent, updateCredits, deductCredit, addHistoryItem
    }}>
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
