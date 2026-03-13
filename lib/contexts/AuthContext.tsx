"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("vedagarbha_user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      // If the stored user has the placeholder name "Google User", derive a proper name from the email prefix
      if (parsedUser.name === "Google User" && typeof parsedUser.email === "string") {
        parsedUser.name = parsedUser.email.split("@")[0];
      }
      const today = new Date().toISOString().split('T')[0];
      if (parsedUser.lastClaimDate !== today) {
        parsedUser.dailyFreeCredits = 3;
        parsedUser.lastClaimDate = today;
      }
      // Persist any updates to localStorage
      localStorage.setItem("vedagarbha_user", JSON.stringify(parsedUser));
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem("vedagarbha_user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    // Mock login
    const today = new Date().toISOString().split('T')[0];
    setUser({ id: "1", name: email.split("@")[0], email, credits: 0, dailyFreeCredits: 3, lastClaimDate: today, studentStatus: "none", history: [] }); // 0 standard credits initially
  };

  const loginWithGoogle = async () => {
    const today = new Date().toISOString().split('T')[0];
    // Mock Google login using placeholder email
    const email = "googleuser@example.com";
    const name = email.split("@")[0];
    const newUser: User = { id: "2", name, email, credits: 0, dailyFreeCredits: 3, lastClaimDate: today, studentStatus: "none", history: [] };
    setUser(newUser);
    localStorage.setItem("vedagarbha_user", JSON.stringify(newUser));
  };

  const signup = async (name: string, email: string, pass: string) => {
    const today = new Date().toISOString().split('T')[0];
    // New users start with 0 standard credits
    setUser({ id: "3", name, email, credits: 0, dailyFreeCredits: 3, lastClaimDate: today, studentStatus: "none", history: [] });
  };

  const logout = () => {
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
    
    // Check if enough daily free credits
    if (user.dailyFreeCredits >= cost) {
      setUser({ ...user, dailyFreeCredits: user.dailyFreeCredits - cost });
      return true;
    }
    
    // Check if enough total credits (remaining cost)
    const remainingCost = cost - user.dailyFreeCredits;
    if (user.credits >= remainingCost) {
      setUser({ 
        ...user, 
        dailyFreeCredits: 0, 
        credits: parseFloat((user.credits - remainingCost).toFixed(1)) 
      });
      return true;
    }
    
    return false; // Not enough credits
  };

  const addHistoryItem = (item: any) => {
    if (user) {
      setUser({ ...user, history: [item, ...(user.history || [])].slice(0, 20) });
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, login, loginWithGoogle, signup, logout, applyForStudentAuth, adminApproveStudent, updateCredits, deductCredit, addHistoryItem
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
