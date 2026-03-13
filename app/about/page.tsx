"use client";

import Navbar from '@/components/navbars/KlingNav';
import { Mail, MapPin, Sparkles, Target, Cpu, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-[120px] pb-24 max-w-[1200px] mx-auto px-8 relative">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F5D97A]/5 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>

        <section className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Pioneering the Future of <span className="bg-gradient-to-br from-[#D4AF37] via-[#F5D97A] to-[#D4AF37] text-transparent bg-clip-text">AI Creativity</span>
          </h1>
          <p className="text-xl text-[#A1A1A6] leading-relaxed">
            Vedagarbha AI was founded on a simple principle: to democratize Hollywood-grade production tools through the power of artificial intelligence. We believe imagination should have no technical barriers.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-[#121218]/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl group">
            <div className="w-14 h-14 bg-black/50 border border-[#D4AF37]/50 rounded-2xl flex items-center justify-center mb-6 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[#D4AF37] transition-colors">Our Mission</h2>
            <p className="text-[#A1A1A6] leading-relaxed">
              To empower creators, marketers, and studios with intuitive, lightning-fast generative AI that transforms text into breathtaking visuals and lifelike audio in seconds, completely within the browser.
            </p>
          </div>
          
          <div className="bg-[#121218]/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl group">
            <div className="w-14 h-14 bg-black/50 border border-[#D4AF37]/50 rounded-2xl flex items-center justify-center mb-6 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[#D4AF37] transition-colors">Our Vision</h2>
            <p className="text-[#A1A1A6] leading-relaxed">
              We envision a world where ideas are the only commodity that matters. By pushing the boundaries of multimodal generative models, we are building the ultimate creative engine for the next generation of storytellers.
            </p>
          </div>
        </section>

        <section className="mb-24 py-16 border-y border-white/5 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Built on State-of-the-Art Technology</h2>
              <p className="text-[#A1A1A6] leading-relaxed mb-6">
                Under the hood, Vedagarbha operates an incredibly complex orchestration of the world's finest foundational models. We bridge the gap between heavy compute requirements and seamless user experiences.
              </p>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 text-white">
                  <Cpu className="text-[#D4AF37]" size={20} /> Optimized Multi-GPU Inference
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Users className="text-[#D4AF37]" size={20} /> Private & Secure Generation Silos
                </li>
              </ul>
            </div>
            <div className="relative aspect-square rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="w-[80%] h-[80%] bg-[#121218] rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.1)] backdrop-blur-md">
                 <span className="text-6xl font-black text-transparent bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] bg-clip-text drop-shadow-[0_0_15px_rgba(245,217,122,0.4)]">V</span>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <div className="flex items-center gap-3 bg-[#121218] border border-white/10 px-6 py-4 rounded-xl flex-1 justify-center shadow-lg hover:border-[#D4AF37]/50 transition-colors">
               <Mail className="text-[#D4AF37]" size={20}/>
               <span className="text-[#A1A1A6]">hello@vedagarbha.ai</span>
             </div>
             <div className="flex items-center gap-3 bg-[#121218] border border-white/10 px-6 py-4 rounded-xl flex-1 justify-center shadow-lg hover:border-[#D4AF37]/50 transition-colors">
               <MapPin className="text-[#D4AF37]" size={20}/>
               <span className="text-[#A1A1A6]">Silicon Valley, CA</span>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
