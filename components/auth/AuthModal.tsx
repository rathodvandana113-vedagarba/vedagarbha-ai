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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const { user, status, signup, setAuthOpen } = useAuth();
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
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      showToast(`${provider} login failed`);
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
          if (otp !== "123456") throw new Error("Invalid OTP, use 123456");
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
        await signup(name, email, password);
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[2100] bg-white text-black font-black px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] text-xs border border-white/20 uppercase tracking-widest animate-in slide-in-from-top-4 ${toastType === 'error' ? 'border-red-500/50' : ''}`}>
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
          {/* Social Logins - Temporarily hidden as requested, but logic remains */}
          {/* To re-enable, simply uncomment this block */}
          {/*
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Google</span>
            </button>
            <button onClick={() => handleSocialLogin('apple')} className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black border border-white/10 hover:bg-gray-200 transition-all group">
              <img src="https://www.svgrepo.com/show/452157/apple.svg" className="w-4 h-4 invert" alt="Apple" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Apple</span>
            </button>
          </div>
          */}

          <div className="flex mx-0 mb-8 bg-white/5 rounded-2xl border border-white/10 p-1 gap-1">
            {(["login", "signup", "phone"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setOtpSent(false); }}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tab === t ? "bg-white text-black shadow-lg shadow-white/10" : "text-gray-500 hover:text-white"}`}>
                {t === "login" ? "Log In" : t === "signup" ? "Sign Up" : "Phone"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "phone" ? (
              <>
                 <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-3 mb-2">
                  <Zap size={14} className="text-[#3B82F6]" />
                  <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest">BETA SIMULATION MODE</span>
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                  <input type="tel" placeholder="+91 Phone Number" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} disabled={otpSent}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-bold text-sm" />
                </div>
                {otpSent && (
                  <div className="relative group animate-in slide-in-from-top-2 duration-300">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                    <input type="text" placeholder="123456" required value={otp} onChange={e => setOtp(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-bold text-sm text-center tracking-[0.5em]" />
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
            
            <button type="submit" disabled={loading}
              className="w-full py-4 mt-4 font-black text-black bg-white rounded-2xl hover:bg-[#E2E2E2] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 tracking-widest uppercase text-xs">
              {loading ? "INITIALIZING..." : tab === "phone" ? (otpSent ? "VERIFY OTP" : "SEND SMS CODE") : (tab === "login" ? "SIGN IN" : "GENERATE ACCOUNT")}
            </button>
          </form>

          <p className="mt-8 text-[10px] font-bold text-center text-gray-500 uppercase tracking-widest">
            {tab === "login" ? "Don't have an account? " : tab === "signup" ? "Already joined? " : "Back to "}
            <button type="button" onClick={() => { setTab(tab === "login" ? "signup" : "login"); setOtpSent(false); }}
              className="text-[#3B82F6] hover:text-white transition-colors hover:underline">
              {tab === "login" ? "JOIN THE BETA" : tab === "signup" ? "SIGN IN HERE" : "EMAIL LOGIN"}
            </button>
          </p>
        </div>
          
        <p className="pb-6 text-[9px] text-center text-gray-600 uppercase tracking-tighter">
          SECURE ENCRYPTED ACCESS • VEDAGARBHA AI
        </p>
      </div>
    </div>
  );
}
