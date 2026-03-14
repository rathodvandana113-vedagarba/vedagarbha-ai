"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

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
  isLoading: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
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
  const [history, setHistory] = useState<any[]>([]);

  // Fetch full user profile from DB when session is available
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        const storedHistory = localStorage.getItem("vedagarbha_history");
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
        setUser({
          ...data.user,
          history: storedHistory ? JSON.parse(storedHistory) : [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (status === "loading") return;

      if (session?.user) {
        await fetchUserProfile();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [session, status, fetchUserProfile]);

  // REAL login with email + password
  const login = async (email: string, pass: string) => {
    const res = await signIn("credentials", {
      email: email.toLowerCase(),
      password: pass,
      redirect: false,
    });

    if (res?.error) {
      throw new Error(res.error);
    }

    // Wait for session to update, then fetch profile
    await new Promise((r) => setTimeout(r, 500));
    await fetchUserProfile();
  };

  // Google login (placeholder — requires OAuth setup)
  const loginWithGoogle = async () => {
    throw new Error("Google Sign-In requires OAuth configuration. Please use Email/Password for now.");
  };

  // Apple login (placeholder)
  const loginWithApple = async () => {
    throw new Error("Apple Sign-In requires Apple Developer account. Please use Email/Password for now.");
  };

  // Phone login (placeholder)
  const loginWithPhone = async (phone: string) => {
    throw new Error("Phone login requires SMS provider. Please use Email/Password for now.");
  };

  // REAL signup
  const signup = async (name: string, email: string, pass: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Signup failed");
    }

    // Auto-login after signup
    await login(email, pass);
  };

  // REAL logout
  const logout = () => {
    signOut({ redirect: false });
    localStorage.removeItem("vedagarbha_history");
    setUser(null);
    setHistory([]);
  };

  const applyForStudentAuth = async (eduEmail: string) => {
    if (!user) return;
    await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentStatus: "pending" }),
    });
    setUser({ ...user, studentStatus: "pending" });
  };

  const adminApproveStudent = async () => {
    if (!user) return;
    await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentStatus: "verified" }),
    });
    setUser({ ...user, studentStatus: "verified" });
  };

  const updateCredits = async (amount: number) => {
    if (!user) return;
    const newCredits = Math.max(0, parseFloat((user.credits + amount).toFixed(1)));
    await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits: newCredits }),
    });
    setUser({ ...user, credits: newCredits });
  };

  const deductCredit = (cost: number = 1): boolean => {
    if (!user) return false;
    const totalAvailable = user.credits + user.dailyFreeCredits;
    if (totalAvailable < cost) return false;

    let newDaily = user.dailyFreeCredits;
    let newStd = user.credits;

    if (newDaily >= cost) {
      newDaily -= cost;
    } else {
      const remaining = cost - newDaily;
      newDaily = 0;
      newStd = parseFloat((newStd - remaining).toFixed(1));
    }

    // Update DB asynchronously
    fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits: newStd, dailyFreeCredits: newDaily }),
    });

    setUser({ ...user, dailyFreeCredits: newDaily, credits: newStd });
    return true;
  };

  const addHistoryItem = (item: any) => {
    const newHistory = [item, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem("vedagarbha_history", JSON.stringify(newHistory));
    if (user) {
      setUser({ ...user, history: newHistory });
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, status, login, loginWithGoogle, loginWithApple, loginWithPhone, signup, logout, applyForStudentAuth, adminApproveStudent, updateCredits, deductCredit, addHistoryItem
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
