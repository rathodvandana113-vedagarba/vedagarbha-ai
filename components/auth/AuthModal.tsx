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
  const { user, status, login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("error");

  if (!isOpen || user || status === "authenticated") return null;

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
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#020202]/95 backdrop-blur-2xl border border-white/20 rounded-[24px] shadow-[0_24px_100px_rgba(0,0,0,1)] custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-colors z-10">
          <X size={20} />
        </button>

        {/* Logo + Title */}
        <div className="flex flex-col items-center pt-8 pb-4 px-8">
          <div className="w-16 h-16 mb-4">
            <img src="/logo.png" alt="Vedagarbha Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">
            {tab === "signup" ? "Get free credits on sign up" : "Access your AI ecosystem"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mx-8 mb-5 bg-white/5 rounded-xl border border-white/10 p-1 gap-1">
          {(["login", "signup"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === t ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"}`}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8">
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" placeholder="FULL NAME" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-bold placeholder-gray-700 focus:outline-none focus:border-white/40 transition-all font-mono" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="email" placeholder="EMAIL ADDRESS" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-bold placeholder-gray-700 focus:outline-none focus:border-white/40 transition-all font-mono" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="password" placeholder="PASSWORD" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-bold placeholder-gray-700 focus:outline-none focus:border-white/40 transition-all font-mono" />
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full py-4 mt-4 font-black text-white transition-all bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 active:scale-95 disabled:opacity-50 tracking-[0.2em] uppercase text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              {loading ? "AUTHENTICATING..." : (tab === "login" ? "LOG IN TO PLATFORM" : "INITIALIZE ACCOUNT")}
            </button>
          </form>

          <p className="mt-6 text-[10px] font-bold text-center text-gray-500 uppercase tracking-widest">
            {tab === "login" ? "No account? " : "Already registered? "}
            <button type="button" onClick={() => setTab(tab === "login" ? "signup" : "login")}
              className="text-[#3B82F6] hover:text-white font-black transition-colors underline underline-offset-4 decoration-white/20">
              {tab === "login" ? "Sign up free" : "Log in now"}
            </button>
          </p>
        </div>
          
          <p className="mt-4 text-[10px] text-center text-gray-600">
            Your data is securely stored and your password is encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
