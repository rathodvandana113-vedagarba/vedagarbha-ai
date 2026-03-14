"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const Navbar = () => {
  const pathname = usePathname();
  const { user, status, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  
  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Pricing", path: "/pricing" },
    { name: "Prompt Library", path: "/prompts" },
  ];

  const aiFeatures = [
    { name: "Text to Video", path: "/generate/text-to-video", icon: "🎬" },
    { name: "Image to Video", path: "/generate/image-to-video", icon: "✨" },
    { name: "Text to Image", path: "/generate/text-to-image", icon: "🖼" },
    { name: "Text to Speech", path: "/generate/text-to-speech", icon: "🎙" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[70px] sm:h-[80px] z-[1000] flex items-center transition-all duration-500 ${
        scrolled
          ? "glass bg-[#020202]/60 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 flex justify-between items-center h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-8 shrink-0 z-[1001]">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-7 h-7 sm:w-12 sm:h-12 preserve-3d group-hover:rotate-y-12 transition-transform duration-500">
              <img
                src="/logo.png"
                alt="Vedagarbha Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
              <div className="absolute inset-0 bg-white blur-2xl opacity-10 -z-10 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-2xl font-black tracking-tighter text-white group-hover:text-white transition-colors leading-none">
                VEDAGARBHA
              </span>
              <span className="hidden sm:block text-[9px] font-bold text-white/40 tracking-[0.3em] uppercase mt-1 text-nowrap">
                AI ECOSYSTEM
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
                pathname === link.path ? "text-white" : "text-[#A1A1A6] hover:text-white"
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_white]"></span>
              )}
            </Link>
          ))}

          <div className="relative group/dropdown py-1">
            <span
              className={`text-sm font-bold tracking-widest uppercase cursor-pointer transition-all flex items-center gap-2 ${
                pathname.startsWith("/generate") ? "text-white" : "text-[#A1A1A6] group-hover/dropdown:text-white"
              }`}
            >
              Tools
              <svg
                className="w-3 h-3 transition-transform group-hover/dropdown:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[280px] glass bg-[#020202]/95 border border-white/10 rounded-3xl p-3 opacity-0 invisible translate-y-4 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              {aiFeatures.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (status !== "authenticated") {
                      // Trigger modal in parent if possible, or just push to home
                      router.push('/');
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 text-[#8E8E93] hover:text-white hover:bg-white/5 rounded-2xl transition-all font-bold text-sm text-left group/item"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl filter group-hover/item:drop-shadow-[0_0_8px_white]">
                      {item.icon}
                    </span>
                    {item.name}
                  </div>
                  <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover/item:opacity-100 translate-x-[-10px] group-hover/item:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-6">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-6">
               <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-white tracking-widest text-glow">
                  {user.credits + user.dailyFreeCredits} CREDITS
                </span>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden mt-1 mt-1 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-white to-[#3B82F6] shadow-[0_0_5px_white]"
                    style={{ width: `${Math.min(100, ((user.credits + user.dailyFreeCredits) / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="relative group/user">
                 <button className="flex items-center gap-1 sm:gap-3 glass-card bg-white/5 border border-white/10 px-1.5 py-1 sm:px-4 sm:py-2 hover:bg-white/10 transition-all">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-white to-[#3B82F6] flex items-center justify-center text-[8px] sm:text-[11px] text-black font-black uppercase shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    {user.name.charAt(0)}
                  </div>
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute top-full right-0 mt-4 w-56 glass bg-[#020202]/95 border border-white/10 rounded-3xl p-3 opacity-0 invisible translate-y-4 group-hover/user:opacity-100 group-hover/user:visible group-hover/user:translate-y-0 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <Link href="/dashboard" className="flex items-center gap-4 px-5 py-3.5 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-2xl font-bold text-sm tracking-wide transition-all">📊 DASHBOARD</Link>
                  <Link href="/history" className="flex items-center gap-4 px-5 py-3.5 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-2xl font-bold text-sm tracking-wide transition-all">🕒 HISTORY</Link>
                  <div className="h-px bg-white/5 my-2 mx-3"></div>
                  <button onClick={logout} className="flex items-center gap-4 w-full px-5 py-3.5 text-red-400 hover:bg-red-400/10 rounded-2xl font-bold text-sm tracking-wide text-left transition-all">🚪 LOG OUT</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-4">
               <button 
                onClick={() => setIsAuthOpen(true)} 
                className="text-[7px] sm:text-xs font-black uppercase tracking-widest text-[#8E8E93] hover:text-white transition-all px-2 sm:px-4 py-2"
              >
                Log In
              </button>
               <button
                onClick={() => setIsAuthOpen(true)}
                className="glass-card bg-white text-black px-1.5 py-1 sm:px-8 sm:py-3.5 font-black text-[7px] sm:text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_45px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center gap-1 sm:gap-2"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 glass bg-white/5 rounded-2xl z-[1001] border border-white/10"
          >
            <span
              className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
              }`}
            ></span>
            <span
              className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "w-0 opacity-0" : "w-4"
              }`}
            ></span>
            <span
              className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
       <div
        className={`lg:hidden fixed inset-0 bg-[#020202]/98 backdrop-blur-3xl z-[999] transition-all duration-700 overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="fixed inset-0 grid-overlay opacity-30 pointer-events-none"></div>
        <div className="flex flex-col min-h-full pt-32 px-10 pb-16 relative z-10 w-full">
            <nav className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-2">NAVIGATION</span>
                {[...navLinks, { name: "AI Ecosystem", path: "#features" }].map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-3xl font-black uppercase tracking-tighter transition-all ${
                      pathname === link.path ? "text-white" : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-8 py-6 px-10 rounded-[32px] glass bg-red-500/5 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-lg hover:bg-red-500/10 transition-all text-center"
                >
                  Log out
                </button>
              )}
           </nav>
        </div>
      </div>

      {/* No internal modal here to avoid duplicates */}
    </header>
  );
};

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default Navbar;
