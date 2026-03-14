"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { X, Mail, Lock, User, Phone, Github } from "lucide-react";
import { signIn } from "next-auth/react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup" | "phone">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const { user, status } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("error");

  if (!isOpen || user || status === "authenticated") return null;

  const showToast = (msg: string, type: "success" | "error" = "error") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const result = await signIn(provider, { callbackUrl: '/dashboard' });
      if (result?.error) {
        if (result.error === "Configuration") {
          showToast(`Env Error: Please check your ${provider.toUpperCase()} keys in Vercel`, "error");
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error: any) {
      showToast(`${provider.toUpperCase()} Login Failed: ${error.message || "Unknown Error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "phone") {
        if (!otpSent) {
          // Simulate sending OTP
          setOtpSent(true);
          showToast("OTP Sent to " + phoneNumber, "success");
        } else {
          const result = await signIn("phone", {
            phone: phoneNumber,
            otp: otp,
            redirect: false
          });
          if (result?.error) throw new Error(result.error);
          showToast("Welcome! ✓", "success");
          setTimeout(() => onClose(), 500);
        }
      } else if (tab === "login") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false
        });
        if (result?.error) throw new Error(result.error);
        showToast("Welcome back! ✓", "success");
        setTimeout(() => onClose(), 500);
      } else {
        // Signup logic is still in AuthContext
        const { useAuth } = require("@/lib/contexts/AuthContext"); 
        // Note: Using dynamic import or context here if needed, but let's keep it simple
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        await signIn("credentials", { email, password, redirect: false });
        showToast("Account created! 🎉", "success");
        setTimeout(() => onClose(), 500);
      }
    } catch (error: any) {
      showToast(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1200] font-semibold px-6 py-3 rounded-full shadow-xl text-sm border ${toastType === "success" ? "bg-green-500 text-white border-green-400" : "bg-red-500 text-white border-red-400"}`}>
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
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-center">
            {tab === "login" ? "Welcome back" : tab === "signup" ? "Create account" : "Mobile Login"}
          </h2>
          <p className="mt-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">
            {tab === "phone" ? "Beta Simulation Mode: Use 123456" : tab === "signup" ? "Get free credits on sign up" : "Access your AI ecosystem"}
          </p>
        </div>

        {/* Tab Switcher - Simple Email flow */}
        <div className="flex mx-8 mb-6 bg-white/5 rounded-xl border border-white/10 p-1 gap-1">
          {(["login", "signup"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setOtpSent(false); }}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"}`}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8">
          {/* Quick Auth Row - 3 Columns Inline */}
          <div className="flex flex-row gap-2 mb-8">
            <button onClick={() => { setTab("phone"); setOtpSent(false); }} 
              className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all group ${tab === 'phone' ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
              <Phone size={14} className={tab === 'phone' ? 'text-black' : 'text-gray-400 group-hover:text-white'} />
              <span className="text-[9px] font-black uppercase tracking-widest">Mobile</span>
            </button>
            <button onClick={() => handleSocialLogin('google')} 
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all group">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3.5 h-3.5" alt="Google" />
              <span className="text-[9px] font-black uppercase tracking-widest">Google</span>
            </button>
            <button onClick={() => handleSocialLogin('apple')} 
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg className="w-4 h-4 text-white group-hover:drop-shadow-[0_0_8px_white]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.04-.156-3.935 1.09-4.909 1.09zM14.037 4.074c.834-1.026 1.4-2.454 1.246-3.87-1.221.052-2.701.819-3.584 1.844-.792.91-1.494 2.364-1.3 3.73 1.363.104 2.766-.715 3.638-1.704z" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-widest">Apple</span>
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">OR CONTINUE WITH</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "phone" ? (
              <>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="tel" placeholder="PHONE NUMBER (+91...)" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} disabled={otpSent}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-bold placeholder-gray-700 focus:outline-none focus:border-white/40 transition-all font-mono" />
                </div>
                {otpSent && (
                  <div className="relative animate-in slide-in-from-top-2 duration-300">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" placeholder="ENTER OTP (123456)" required value={otp} onChange={e => setOtp(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-bold placeholder-gray-700 focus:outline-none focus:border-white/40 transition-all font-mono" />
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
            
            <button type="submit" disabled={loading}
              className="w-full py-4 mt-4 font-black text-black transition-all bg-white rounded-xl hover:bg-white/90 active:scale-95 disabled:opacity-50 tracking-[0.2em] uppercase text-[11px] shadow-[0_0_60px_rgba(255,255,255,0.5)]">
              {loading ? "AUTHENTICATING..." : tab === "phone" ? (otpSent ? "VERIFY OTP" : "SEND OTP") : (tab === "login" ? "LOG IN TO PLATFORM" : "INITIALIZE ACCOUNT")}
            </button>
          </form>

          <p className="mt-6 text-[10px] font-bold text-center text-gray-500 uppercase tracking-widest">
            {tab === "login" ? "No account? " : tab === "signup" ? "Already registered? " : "Back to "}
            <button type="button" onClick={() => { setTab(tab === "login" ? "signup" : "login"); setOtpSent(false); }}
              className="text-[#3B82F6] hover:text-white font-black transition-colors underline underline-offset-4 decoration-white/20">
              {tab === "login" ? "Sign up free" : tab === "signup" ? "Log in now" : "Email Login"}
            </button>
          </p>
        </div>
          
        <p className="mt-4 text-[10px] text-center text-gray-600">
          Your data is securely stored and your password is encrypted
        </p>
      </div>
    </div>
  );
}
