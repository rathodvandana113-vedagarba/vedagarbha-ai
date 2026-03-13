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

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10 z-[1000] flex items-center overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0"></div>
          <span className="text-lg md:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Vedagarbha
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className={`text-[15px] font-medium transition-colors py-2 relative group ${pathname === '/' ? 'text-white' : 'text-[#A1A1A6] hover:text-white'}`}>
            Home
            {pathname === '/' && <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] rounded-full"></span>}
          </Link>
          
          <div className="relative group/dropdown">
            <span className={`text-[15px] font-medium transition-colors py-2 cursor-pointer ${pathname.startsWith('/generate') ? 'text-white' : 'text-[#A1A1A6] group-hover/dropdown:text-white'}`}>
              AI Features
              {pathname.startsWith('/generate') && <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] rounded-full"></span>}
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-[10px] bg-[#141416] border border-white/10 rounded-xl p-2 min-w-[200px] opacity-0 invisible transition-all duration-200 shadow-2xl flex flex-col group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-1">
              <Link href="/generate/text-to-video" className="block px-4 py-2 text-[#A1A1A6] text-sm font-medium rounded-md transition-all hover:bg-white/[0.03] hover:text-white hover:pl-5">Text to Video</Link>
              <Link href="/generate/image-to-video" className="block px-4 py-2 text-[#A1A1A6] text-sm font-medium rounded-md transition-all hover:bg-white/[0.03] hover:text-white hover:pl-5">Image to Video</Link>
              <Link href="/generate/text-to-image" className="block px-4 py-2 text-[#A1A1A6] text-sm font-medium rounded-md transition-all hover:bg-white/[0.03] hover:text-white hover:pl-5">Text to Image</Link>
              <Link href="/generate/text-to-speech" className="block px-4 py-2 text-[#A1A1A6] text-sm font-medium rounded-md transition-all hover:bg-white/[0.03] hover:text-white hover:pl-5">Text to Speech</Link>
            </div>
          </div>

          <Link href="/pricing" className={`text-[15px] font-medium transition-colors py-2 relative group ${pathname === '/pricing' ? 'text-white' : 'text-[#A1A1A6] hover:text-white'}`}>
            Pricing
            {pathname === '/pricing' && <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] rounded-full"></span>}
          </Link>
          
          <Link href="/prompts" className={`text-[15px] font-medium transition-colors py-2 relative group ${pathname === '/prompts' ? 'text-white' : 'text-[#A1A1A6] hover:text-white'}`}>
            Prompt Library
            {pathname === '/prompts' && <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] rounded-full"></span>}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#A1A1A6] bg-white/5 px-2 py-0.5 rounded border border-white/10 mb-0.5">
                  <span className="text-[#D4AF37]">Daily Free:</span>
                  <span className="text-white font-bold">{user.dailyFreeCredits}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#A1A1A6]">
                  <span className="text-[#D4AF37] font-bold">✨ {user.credits}</span> Credits
                </div>
              </div>
              <Link href="/pricing" className="bg-white/[0.03] text-white border border-white/10 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-white/[0.08]">
                Upgrade
              </Link>
              <div className="relative group/user">
                <button className="flex items-center gap-2 bg-[#5E6AD2]/20 text-[#8E95E8] px-4 py-2 rounded-lg font-medium text-sm transition-all border border-[#5E6AD2]/30 hover:bg-[#5E6AD2]/40 hover:text-white">
                  {user.name}
                </button>
                <div className="absolute top-full right-0 translate-y-[10px] bg-[#141416] border border-white/10 rounded-xl p-2 min-w-[150px] opacity-0 invisible transition-all duration-200 shadow-2xl flex flex-col group-hover/user:opacity-100 group-hover/user:visible group-hover/user:translate-y-1">
                  <Link href="/dashboard" className="block px-4 py-2 text-[#A1A1A6] text-sm font-medium rounded-md transition-all hover:bg-white/[0.03] hover:text-white text-left">Dashboard</Link>
                  <Link href="/history" className="block px-4 py-2 text-[#A1A1A6] text-sm font-medium rounded-md transition-all hover:bg-white/[0.03] hover:text-white text-left">History</Link>
                  <button onClick={logout} className="block w-full px-4 py-2 text-red-400 text-sm font-medium rounded-md transition-all hover:bg-red-400/10 text-left">Log out</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="bg-white/[0.03] text-white border border-white/10 px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:bg-white/[0.08] hover:border-white/[0.15]"
              >
                Log in
              </button>
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="bg-transparent text-white border border-[#D4AF37] px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(245,217,122,0.4)] hover:border-[#F5D97A] hover:-translate-y-[1px]"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle & Actions */}
        <div className="lg:hidden flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/10 shrink-0">
               <span className="text-[#D4AF37] font-bold text-xs">✨ {user.credits + user.dailyFreeCredits}</span>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider shrink-0"
            >
              Log in
            </button>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-[#0A0A0B]/95 backdrop-blur-2xl z-[999] p-6 animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto pb-24">
          <nav className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-[0.2em]">Navigation</span>
              <div className="flex flex-col gap-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 text-base font-semibold transition-all ${pathname === '/' ? 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'text-white'}`}>
                  Home
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                </Link>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 text-base font-semibold transition-all ${pathname === '/pricing' ? 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'text-white'}`}>
                  Pricing
                  {pathname === '/pricing' && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>}
                </Link>
                <Link href="/prompts" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 text-base font-semibold transition-all ${pathname === '/prompts' ? 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'text-white'}`}>
                  Prompt Library
                  {pathname === '/prompts' && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-[0.2em]">AI Generation Tools</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: "Text to Video", path: "/generate/text-to-video", icon: "🎬" },
                  { name: "Image to Video", path: "/generate/image-to-video", icon: "✨" },
                  { name: "Text to Image", path: "/generate/text-to-image", icon: "🖼" },
                  { name: "Text to Speech", path: "/generate/text-to-speech", icon: "🎙" }
                ].map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl text-sm font-semibold border border-white/5 transition-all ${pathname === item.path ? 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'text-[#A1A1A6]'}`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {!user ? (
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <button onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white transition-all hover:bg-white/10">Log in</button>
                <button onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] rounded-xl font-bold text-[#0A0A0B] shadow-[0_0_20px_rgba(212,175,55,0.3)]">Sign up</button>
              </div>
            ) : (
               <div className="flex flex-col gap-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] flex items-center justify-center text-[#0A0A0B] font-black text-xl shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                       {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-white text-lg">{user.name}</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
                        <span className="animate-pulse">✨</span> {user.credits + user.dailyFreeCredits} Credits Available
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] rounded-xl text-xs font-bold border border-white/5 text-white transition-all active:scale-95">
                      <span className="text-2xl mb-1">📊</span>
                      Dashboard
                    </Link>
                    <Link href="/history" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] rounded-xl text-xs font-bold border border-white/5 text-white transition-all active:scale-95">
                      <span className="text-2xl mb-1">🕒</span>
                      History
                    </Link>
                  </div>
                  <button onClick={logout} className="w-full py-4 bg-red-400/5 border border-red-400/10 rounded-xl font-bold text-red-500/80 transition-all active:scale-95">Log out</button>
               </div>
            )}
          </nav>
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Navbar;
