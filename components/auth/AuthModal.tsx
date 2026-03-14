"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { X, Mail, Lock, User } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("error");

  if (!isOpen) return null;

  const showToast = (msg: string, type: "success" | "error" = "error") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      showToast("Please fill in all fields");
      return;
    }

    if (tab === "signup" && !name.trim()) {
      showToast("Please enter your name");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
        showToast("Welcome back! ✓", "success");
        setTimeout(() => onClose(), 500);
      } else {
        await signup(name, email, password);
        showToast("Account created! Welcome! 🎉", "success");
        setTimeout(() => onClose(), 500);
      }
    } catch (error: any) {
      showToast(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] font-semibold px-6 py-3 rounded-full shadow-xl text-sm border ${toastType === "success" ? "bg-green-500 text-white border-green-400" : "bg-red-500 text-white border-red-400"}`}>
          {toast}
        </div>
      )}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#020202]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_40px_rgba(255,255,255,0.02)] custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-colors z-10">
          <X size={20} />
        </button>

        {/* Logo + Title */}
        <div className="flex flex-col items-center pt-8 pb-4 px-8">
          <div className="w-16 h-16 mb-4">
            <img src="/logo.png" alt="Vedagarbha Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-1 text-sm text-gray-400 text-center">
            {tab === "signup" ? "Get 10 free credits on sign up" : "Access Vedagarbha AI platform"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mx-8 mb-5 bg-[#0B0B0F] rounded-xl border border-white/5 p-1 gap-1">
          {(["login", "signup"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white text-black shadow-lg" : "text-[#8E8E93] hover:text-white"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8">
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#020202] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#020202] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="password" placeholder="Password (min 6 chars)" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#020202] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 mt-2 font-bold text-white transition-all bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:opacity-50 tracking-widest uppercase text-xs">
              {loading ? "Please wait..." : (tab === "login" ? "Sign In" : "Create Account")}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-gray-500">
            {tab === "login" ? "No account? " : "Have an account? "}
            <button type="button" onClick={() => setTab(tab === "login" ? "signup" : "login")}
              className="text-[#3B82F6] hover:text-white font-medium transition-colors hover:underline">
              {tab === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
          
          <p className="mt-4 text-[10px] text-center text-gray-600">
            Your data is securely stored and your password is encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
