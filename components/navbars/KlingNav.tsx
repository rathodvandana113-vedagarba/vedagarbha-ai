"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Prompt Library', path: '/prompts' },
  ];

  const aiFeatures = [
    { name: "Text to Video", path: "/generate/text-to-video", icon: "🎬" },
    { name: "Image to Video", path: "/generate/image-to-video", icon: "✨" },
    { name: "Text to Image", path: "/generate/text-to-image", icon: "🖼" },
    { name: "Text to Speech", path: "/generate/text-to-speech", icon: "🎙" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0A0A0B]/90 backdrop-blur-2xl border-b border-white/10 z-[1000] flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 flex justify-between items-center h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 z-[1001]">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center">
            <span className="text-black font-black text-sm">V</span>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-white">
            Vedagarbha
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-[15px] font-bold transition-all relative py-1 ${pathname === link.path ? 'text-white' : 'text-[#6E6E73] hover:text-white'}`}
            >
              {link.name}
              {pathname === link.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"></span>
              )}
            </Link>
          ))}
          
          <div className="relative group/dropdown py-1">
            <span className={`text-[15px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${pathname.startsWith('/generate') ? 'text-white' : 'text-[#6E6E73] group-hover/dropdown:text-white'}`}>
              AI Features
              <svg className="w-3.5 h-3.5 transition-transform group-hover/dropdown:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[240px] bg-[#121218]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 opacity-0 invisible translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-300 shadow-2xl">
              {aiFeatures.map((item) => (
                <Link key={item.path} href={item.path} className="flex items-center gap-3 px-4 py-3.5 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-xl transition-all font-bold text-sm">
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-5">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.1em] uppercase">Credits</span>
                <span className="text-sm font-bold text-white tracking-wide">✨ {user.credits + user.dailyFreeCredits}</span>
              </div>
              <div className="relative group/user z-[1001]">
                <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] flex items-center justify-center text-[10px] text-black font-black uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-white hidden md:inline truncate max-w-[100px]">{user.name}</span>
                  <svg className="w-3 h-3 text-[#6E6E73] transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-52 bg-[#121218]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 opacity-0 invisible translate-y-2 group-hover/user:opacity-100 group-hover/user:visible group-hover/user:translate-y-0 transition-all duration-300 shadow-2xl">
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-xl font-bold text-[13px]">📊 Dashboard</Link>
                  <Link href="/history" className="flex items-center gap-3 px-4 py-3 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-xl font-bold text-[13px]">🕒 History</Link>
                  <div className="h-px bg-white/5 my-1 mx-2"></div>
                  <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl font-bold text-[13px] text-left">🚪 Log out</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setIsAuthOpen(true)} className="hidden sm:block text-[#A1A1A6] hover:text-white font-bold text-sm transition-all px-2">Log in</button>
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl font-black text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(245,217,122,0.6)] active:scale-95 transition-all"
              >
                Sign up
              </button>
            </>
          )}

          {/* Hamburger Menu - Improved Style */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl z-[1001]"
          >
            <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
            <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-0 bg-[#0A0A0B] z-[999] transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col h-full pt-28 px-6 pb-12 overflow-y-auto">
          <nav className="flex flex-col gap-9">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-2 px-1">Navigation</span>
              <div className="flex flex-col gap-2">
                {[...navLinks, { name: 'Dashboard', path: '/dashboard' }].map((link) => (
                  <Link 
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-5 rounded-2xl font-black text-lg transition-all border ${pathname === link.path ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-white/[0.03] border-white/5 text-[#6E6E73]'}`}
                  >
                    {link.name}
                    {pathname === link.path && <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-2 px-1">AI Features</span>
              <div className="grid grid-cols-1 gap-2">
                {aiFeatures.map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl text-[#A1A1A6] hover:text-white transition-all font-bold text-base"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {user && (
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="mt-6 flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-lg active:scale-95 transition-all"
              >
                Log out
              </button>
            )}
          </nav>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Navbar;
