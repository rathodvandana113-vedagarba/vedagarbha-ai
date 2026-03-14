"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { X, Mail, Lock, User, Phone } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup" | "phone">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { login, signup, loginWithGoogle, loginWithApple, loginWithPhone } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      onClose();
    } catch (error) {
      console.error(error);
      showToast("Authentication Error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    setLoading(true);
    try {
      await loginWithApple();
      showToast("Signed in with Apple ✓");
      setTimeout(() => onClose(), 800);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 8) return;
    setOtpSent(true);
    showToast(`OTP sent to ${phone}`);
  };

  const handleVerifyOtp = async () => {
    if (otp === "123456" || otp.length >= 4) {
      setLoading(true);
      try {
        await loginWithPhone(phone);
        showToast("Phone verified ✓");
        setTimeout(() => onClose(), 800);
      } finally {
        setLoading(false);
      }
    } else {
      showToast("Invalid OTP, try 123456");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-white text-black font-semibold px-6 py-3 rounded-full shadow-xl text-sm border border-white/20">
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
          <div className="w-16 h-16 mb-4 preserve-3d group-hover:rotate-y-12 transition-transform duration-500">
            <img src="/logo.png" alt="Vedagarbha Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {tab === "login" ? "Welcome back" : tab === "signup" ? "Create account" : "Phone sign in"}
          </h2>
          <p className="mt-1 text-sm text-gray-400 text-center">
            {tab === "signup" ? "Get 10 free credits on sign up" : "Access Vedagarbha AI platform"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mx-8 mb-5 bg-[#0B0B0F] rounded-xl border border-white/5 p-1 gap-1">
          {(["login", "signup", "phone"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white text-black shadow-lg" : "text-[#8E8E93] hover:text-white"}`}>
              {t === "phone" ? "📱 Phone" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8">
          {/* Email/Password Form */}
          {(tab === "login" || tab === "signup") && (
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
                <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#020202] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 mt-2 font-bold text-white transition-all bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:opacity-50 tracking-widest uppercase text-xs">
                {loading ? "Please wait..." : (tab === "login" ? "Sign In" : "Sign Up")}
              </button>
            </form>
          )}

          {/* Phone Login */}
          {tab === "phone" && (
            <div className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="tel" placeholder="+91 Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#020202] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors" />
              </div>
              {!otpSent ? (
                <button onClick={handleSendOtp}
                  className="w-full py-3 font-bold text-white bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:-translate-y-0.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] tracking-widest uppercase text-xs">
                  Send OTP
                </button>
              ) : (
                <>
                  <input type="text" placeholder="Enter OTP (try 123456)" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                    className="w-full bg-[#020202] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors text-center tracking-[0.4em] font-mono text-lg" />
                  <button onClick={handleVerifyOtp}
                    className="w-full py-3 font-bold text-black bg-white rounded-xl hover:bg-[#E2E2E2] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-widest uppercase text-xs">
                    Verify & Sign In
                  </button>
                </>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center my-5">
            <div className="w-full h-px bg-white/5" />
            <span className="absolute px-3 text-xs text-gray-500 bg-[#121218]">or continue with</span>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            {/* Google */}
            <button type="button" onClick={handleGoogle} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 font-medium text-white transition-all bg-[#0B0B0F] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 text-sm">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            {/* Apple */}
            <button type="button" onClick={handleApple} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 font-medium text-white transition-all bg-[#0B0B0F] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 text-sm">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

          <p className="mt-5 text-xs text-center text-gray-500">
            {tab === "login" ? "No account? " : "Have an account? "}
            <button type="button" onClick={() => setTab(tab === "login" ? "signup" : "login")}
              className="text-[#3B82F6] hover:text-white font-medium transition-colors hover:underline">
              {tab === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
