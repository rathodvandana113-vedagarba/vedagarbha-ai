"use client";

import React, { useEffect } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading, applyForStudentAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex bg-[#0A0A0B] text-white items-center justify-center h-screen">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-[100px] px-8 max-w-[1200px] mx-auto pb-16">
        <h1 className="text-4xl font-bold mb-8 text-white">My Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#121218]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex flex-col items-start justify-between gap-4">
            <div className="w-full">
              <h2 className="text-[#A1A1A6] font-medium uppercase text-sm tracking-widest text-shadow-sm mb-4">Your Balances</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#A1A1A6] font-medium text-sm">Daily Free Credits</span>
                <span className="text-xl font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">{user.dailyFreeCredits}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mt-4">
                <span className="text-[#A1A1A6] font-medium text-sm">Standard Credits</span>
                <span className="text-2xl font-extrabold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-[#D4AF37]/10 px-3 py-1 rounded-lg border border-[#D4AF37]/20">{user.credits}</span>
              </div>
            </div>
            <Link 
              href="/pricing"
              className="mt-2 text-sm bg-[#0B0B0F] border border-[#D4AF37] text-white px-5 py-2.5 rounded-lg font-semibold hover:-translate-y-0.5 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(245,217,122,0.4)] hover:border-[#F5D97A] block text-center w-full"
            >
              Get More Credits
            </Link>
          </div>

          <div className="bg-[#121218]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex flex-col md:col-span-2 items-start justify-center gap-4 relative overflow-hidden">
            <div className="z-10 relative">
              <h2 className="text-xl font-bold text-white mb-2">Student Verification</h2>
              <p className="text-[#A1A1A6] text-sm max-w-[400px]">
                Verify your status as a student to receive exclusive 25% discounts on bulk credit purchases.
              </p>
              
              <div className="mt-4 flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md border ${
                  user.studentStatus === 'verified' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  user.studentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                  'bg-white/5 text-[#A1A1A6] border-white/10'
                }`}>
                  {user.studentStatus.toUpperCase()}
                </span>
                
                {user.studentStatus === 'none' && (
                  <button 
                    onClick={() => applyForStudentAuth('student@university.edu')}
                    className="text-sm bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition-colors font-medium"
                  > Apply Now </button>
                )}
              </div>
            </div>
            {/* Soft background glow */}
            <div className="absolute -right-20 -bottom-20 w-[300px] h-[300px] bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] opacity-10 blur-[80px] pointer-events-none"></div>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center justify-between">
            Recent Generations
            <span className="text-sm font-medium text-[#A1A1A6] opacity-60">Past 30 Days</span>
          </h2>
          <div className="bg-[#121218]/60 backdrop-blur-2xl border border-white/5 shadow-inner rounded-2xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center p-8 text-center text-[#A1A1A6]">
            {user.history && user.history.length > 0 ? (
              <div className="w-full text-left flex flex-col gap-4">
                {user.history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#0B0B0F]/50 border border-white/5 rounded-xl hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-semibold flex items-center gap-2">
                         <span className="text-xs px-2 py-0.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] text-[#0B0B0F] font-bold uppercase">{item.type}</span>
                         {item.prompt || 'Audio Generation'}
                      </span>
                      <span className="text-xs text-[#A1A1A6]">Cost: {item.cost} credits</span>
                    </div>
                    {item.videoUrl || item.url ? (
                      <a href={item.videoUrl || item.url} target="_blank" className="text-xs bg-[#121218] px-4 py-2 rounded-md hover:border-[#D4AF37] text-white font-medium border border-white/10 transition-all">View Result</a>
                    ) : item.audioUrl ? (
                      <audio src={item.audioUrl} controls className="h-8 w-48" />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-[#0B0B0F]/50 flex items-center justify-center mb-4 text-2xl border border-white/5 shadow-inner select-none grayscale opacity-60">✨</div>
                <h3 className="text-white font-medium mb-1">No generations yet</h3>
                <p className="mb-6 max-w-sm">When you run text-to-video or text-to-image prompts, your creative history will appear here.</p>
                <Link 
                  href="/generate/text-to-video"
                  className="text-sm font-semibold px-6 py-2.5 rounded-lg border border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all text-white"
                >
                  Start Creating
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
