import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { signIn } from "next-auth/react";
import { X, Mail, Lock, User, Phone, Zap } from "lucide-react";

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
  const { signup, setAuthOpen } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      await signIn(provider);
    } catch (error) {
       showToast(`${provider} Login Error`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (res?.error) {
           showToast(res.error);
        } else {
           setAuthOpen(false);
        }
      } else {
        await signup(name, email, password);
        setAuthOpen(false);
      }
    } catch (error) {
      showToast("Authentication Error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await signIn("phone", {
        phone,
        otp,
        redirect: false
      });
      if (res?.error) {
        showToast("Invalid OTP, try 123456");
      } else {
        showToast("Phone verified ✓");
        setTimeout(() => setAuthOpen(false), 800);
      }
    } catch (error) {
      showToast("Verification Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[2100] bg-white text-black font-black px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] text-xs border border-white/20 uppercase tracking-widest animate-in slide-in-from-top-4">
          {toast}
        </div>
      )}
      <div className="relative w-full max-w-md bg-[#020202]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-all z-10">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center pt-10 pb-6 px-10">
          <div className="w-20 h-20 mb-6 preserve-3d">
            <img src="/logo.png" alt="Vedagarbha Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {tab === "login" ? "Sign In" : tab === "signup" ? "Join Now" : "Phone Login"}
          </h2>
          <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest text-center opacity-70">
            {tab === "signup" ? "Claim 10 free credits" : "Access AI Ecosystem"}
          </p>
        </div>

        <div className="px-10 pb-10">
          {/* Quick Auth Row - Temporarily removed per user request */}
          {/* 
          <div className="flex flex-row items-stretch gap-2 mb-8">
            <button onClick={() => { setTab("phone"); setOtpSent(false); }} 
              className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all group ${tab === 'phone' ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
              <Phone size={14} className={tab === 'phone' ? 'text-black' : 'text-gray-400 group-hover:text-white'} />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Mobile</span>
            </button>
            <button onClick={() => handleSocialLogin('google')} 
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all group">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3.5 h-3.5" alt="Google" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Google</span>
            </button>
            <button onClick={() => handleSocialLogin('apple')} 
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg className="w-4 h-4 text-white group-hover:drop-shadow-[0_0_8px_white]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.04-.156-3.935 1.09-4.909 1.09zM14.037 4.074c.834-1.026 1.4-2.454 1.246-3.87-1.221.052-2.701.819-3.584 1.844-.792.91-1.494 2.364-1.3 3.73 1.363.104 2.766-.715 3.638-1.704z" />
              </svg>
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Apple</span>
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">OR CONTINUE WITH EMAIL</span>
          </div>
          */}

          {/* Email/Password Form */}
          {(tab === "login" || tab === "signup") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                  <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-bold text-sm" />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-bold text-sm" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-bold text-sm" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 mt-2 font-black text-black bg-white rounded-2xl hover:bg-[#E2E2E2] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 tracking-widest uppercase text-xs">
                {loading ? "PROCESSING..." : (tab === "login" ? "SIGN IN" : "CREATE ACCOUNT")}
              </button>
            </form>
          )}

          {/* Phone Login */}
          {tab === "phone" && (
            <div className="space-y-4">
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-3">
                <Zap size={14} className="text-[#3B82F6]" />
                <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest">BETA SIMULATION MODE</span>
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                <input type="tel" placeholder="+91 Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-bold text-sm" />
              </div>
              {!otpSent ? (
                <button onClick={() => { if(phone.length >= 10) { setOtpSent(true); showToast("OTP: 123456"); } }}
                  className="w-full py-4 font-black text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all tracking-widest uppercase text-xs">
                  SEND VERIFICATION CODE
                </button>
              ) : (
                <>
                  <input type="text" placeholder="● ● ● ● ● ●" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all text-center tracking-[0.8em] font-black text-xl" />
                  <button onClick={handleVerifyOtp}
                    className="w-full py-4 font-black text-black bg-white rounded-2xl hover:bg-[#E2E2E2] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-widest uppercase text-xs">
                    VERIFY CODE
                  </button>
                </>
              )}
            </div>
          )}

          <p className="mt-8 text-[10px] font-bold text-center text-gray-500 uppercase tracking-widest">
            {tab === "login" ? "Don't have an account? " : "Already joined? "}
            <button type="button" onClick={() => setTab(tab === "login" ? "signup" : "login")}
              className="text-[#3B82F6] hover:text-white transition-colors hover:underline">
              {tab === "login" ? "JOIN THE BETA" : "SIGN IN HERE"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
