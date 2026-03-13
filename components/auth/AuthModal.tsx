"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { X, Mail, Lock, User, Github } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, signup, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-[#121218]/90 backdrop-blur-2xl border border-white/5 rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.05)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 transition-colors hover:text-white rounded-full hover:bg-white/5"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <span className="text-xl font-black text-[#0B0B0F]">V</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin 
              ? "Enter your details to access Vedagarbha." 
              : "Get 10 free credits to start creating today."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0B0B0F] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0B0F] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B0B0F] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 font-semibold text-white transition-all bg-[#0B0B0F] border border-[#D4AF37] rounded-xl hover:-translate-y-0.5 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(245,217,122,0.4)] hover:border-[#F5D97A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="w-full h-px bg-white/5"></div>
          <span className="absolute px-4 text-sm text-gray-500 bg-[#121218]">or continue with</span>
        </div>

        <button 
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 font-medium text-white transition-all bg-[#0B0B0F] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Google
        </button>

        <p className="mt-8 text-sm text-center text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#D4AF37] hover:text-[#F5D97A] font-medium transition-colors hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
