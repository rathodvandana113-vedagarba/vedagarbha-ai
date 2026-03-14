"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/navbars/KlingNav';
import AuthModal from '@/components/auth/AuthModal';
import { Play, Sparkles, Zap, Shield, Cpu, Video, Image as ImageIcon, Mic, ArrowRight, MousePointer2 } from 'lucide-react';

const DEMOS = [
  { type: 'Text to Video', prompt: '"Ultra-realistic cinematic shot of vibrant colored ink exploding and swirling in crystal clear water, 4k, slow motion"', media: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-ink-flow-in-water-32918-large.mp4', isVideo: true },
  { type: 'Image to Video', prompt: '"Transform this static portrait into a breathing cinematic scene with subtle wind and dappled lighting"', media: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-eye-with-futuristic-reflections-42866-large.mp4', isVideo: true },
  { type: 'Text to Image', prompt: '"A photorealistic rendering of a futuristic supercar in cyberpunk neon streets at midnight"', media: 'https://images.unsplash.com/photo-1542362567-b05423158c56?auto=format&fit=crop&q=80&w=1200', isVideo: false }
];

const SHOWCASE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-golden-particles-loop-32924-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-futuristic-ai-technology-circuit-background-loop-42861-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-network-lines-and-dots-background-loop-42862-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-digital-ocean-waves-loop-32700-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-traffic-loop-42863-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-particle-explosion-in-dark-background-32926-large.mp4'
];

const SHOWCASE_IMAGES = [
  'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600'
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slower intervals for mobile performance
    const int = setInterval(() => {
      setDemoIdx((prev) => (prev + 1) % DEMOS.length);
    }, 10000); // 10s instead of 6s
    const showcaseInt = setInterval(() => {
      setShowcaseIdx((prev) => (prev + 1) % 6);
    }, 8000); // 8s instead of 4s
    return () => {
      clearInterval(int);
      clearInterval(showcaseInt);
    };
  }, []);

  const handleStart = (path: string) => {
    if (!user) setIsAuthOpen(true);
    else router.push(path);
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden font-sans relative">
      <Navbar />
      
      <main className="relative z-10">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-[#3B82F6] rounded-full blur-[80px] md:blur-[200px] opacity-[0.03] z-[-1] animate-float"></div>
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Hero Section */}
          <section ref={heroRef} className="preserve-3d pt-[160px] pb-24 min-h-[100vh] flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 glass bg-white/5 px-4 py-2 rounded-full border-glow mb-8 animate-float">
                <Sparkles size={16} className="text-[#3B82F6] animate-pulse" />
                <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[#E2E2E2] uppercase">The Future of Creation is Here</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-[90px] font-black leading-[0.95] tracking-tighter mb-8 gradient-text drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                CREATE <br /> 
                <span className="relative inline-block mt-2">
                  MAGIC
                  <div className="absolute -bottom-2 inset-x-0 h-1 bg-[#3B82F6] shadow-[0_0_20px_#3B82F6]"></div>
                </span> <br />
                WITH AI
              </h1>

              <p className="text-lg md:text-2xl text-[#A1A1A6] max-w-[600px] font-medium leading-relaxed mb-12 mx-auto lg:mx-0 opacity-80 backdrop-blur-sm">
                Vedagarbha AI combines cinematic video synthesis, ultra-realistic image generation, and emotional speech into one immersive crystalline ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => handleStart("/generate/text-to-video")}
                  className="glass-card bg-white text-black px-8 py-3.5 md:px-12 md:py-5 rounded-[20px] font-black text-sm md:text-lg uppercase tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.2)] hover:-translate-y-2 transition-all group flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button 
                  onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
                  className="glass bg-white/5 border border-white/10 px-8 py-3.5 md:px-10 md:py-5 rounded-[20px] font-black text-sm md:text-lg uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md w-full sm:w-auto justify-center text-center"
                >
                  Showcase
                </button>
              </div>

              <div className="mt-16 flex items-center gap-4 justify-center lg:justify-start opacity-60">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030303] bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user"/>
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold tracking-wide">
                  <span className="text-[#3B82F6]">18,000+</span> creators joined <br />
                  <span className="text-[10px] text-[#8E8E93] uppercase tracking-[0.2em] font-black">Vedagarbha Ecosystem</span>
                </div>
              </div>
            </div>

            {/* 3D Preview Window */}
            <div className="flex-1 w-full max-w-[800px] perspective-1000 animate-in fade-in scale-90 lg:scale-100 slide-in-from-right-20 duration-1000">
               <div className="glass-card group preserve-3d h-[450px] md:h-[550px] w-full relative">
                  <div className="absolute top-0 inset-x-0 h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2 z-20 backdrop-blur-2xl">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    <div className="mx-auto text-[10px] font-black tracking-[0.3em] uppercase opacity-40">VEDAGARBHA ENGINE V2.0</div>
                  </div>

                  <div className="absolute inset-0 pt-12 overflow-hidden bg-[#030303]">
                     {DEMOS[demoIdx].isVideo ? (
                        <video key={DEMOS[demoIdx].media} src={DEMOS[demoIdx].media} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[3000ms] ease-out" />
                     ) : (
                        <img key={DEMOS[demoIdx].media} src={DEMOS[demoIdx].media} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[3000ms] ease-out" alt="Demo"/>
                     )}
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent"></div>

                     <div className="absolute bottom-10 inset-x-10 glass border-white/20 p-8 rounded-[32px] depth-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] translate-z-20 group-hover:translate-z-40 transition-transform duration-500">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 glass bg-white/10 border-white/20 rounded-2xl">
                             {demoIdx === 0 ? <Video className="text-[#3B82F6]" size={20}/> : demoIdx === 1 ? <Sparkles className="text-[#3B82F6]" size={20}/> : <ImageIcon className="text-[#3B82F6]" size={20}/>}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-black text-[#A1A1A6] uppercase tracking-widest">{DEMOS[demoIdx].type}</span>
                             <span className="text-white font-black uppercase text-glow">Real-time Synthesis</span>
                           </div>
                        </div>
                        <p className="text-[#A1A1A6] font-medium leading-relaxed italic text-sm md:text-base">
                          "{DEMOS[demoIdx].prompt}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Feature Bento Grid */}
          <section id="features" className="py-32">
             <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
                <div>
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">The Creative <span className="text-[#3B82F6] text-glow">Ecosystem</span></h2>
                   <p className="text-[#A1A1A6] text-lg font-medium max-w-xl">Deep integration of generative models creating a fluid workflow for modern studios.</p>
                </div>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="glass bg-white/5 px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/10 text-glow font-black uppercase tracking-widest text-[10px] md:text-sm hover:bg-white hover:text-black hover:border-white transition-all whitespace-nowrap"
                >
                  Join the Beta ➔
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "VIDEO GEN", icon: <Video/>, desc: "4K Cinematic synthesis", class: "md:col-span-2 h-[400px]", path: "/generate/text-to-video", media: SHOWCASE_VIDEOS[0] },
                  { title: "IMAGE GEN", icon: <ImageIcon/>, desc: "Photorealistic art", class: "h-[400px]", path: "/generate/text-to-image", media: SHOWCASE_IMAGES[3], isImg: true },
                  { title: "SPEECH GEN", icon: <Mic/>, desc: "Emotional AI Voice", class: "h-[400px]", path: "/generate/text-to-speech", media: SHOWCASE_IMAGES[5], isImg: true },
                  { title: "MOTION ART", icon: <Sparkles/>, desc: "Liquid physics", class: "md:col-span-2 h-[400px]", path: "/generate/image-to-video", media: SHOWCASE_VIDEOS[2] }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleStart(item.path)}
                    className={`glass-card group cursor-pointer ${item.class} flex flex-col justify-end p-6 md:p-10 overflow-hidden relative border border-white/5 hover:border-white/20 transition-all`}
                  >
                     <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-[#030303] via-[#030303]/90 to-transparent z-10 transition-all group-hover:top-[20%]"></div>
                     {item.media && (
                        item.isImg ? (
                           <img src={item.media} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-[2000ms] group-hover:scale-125 ease-out" alt="Bg"/>
                        ) : (
                           <video src={item.media} poster={SHOWCASE_IMAGES[i]} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-[2000ms] group-hover:scale-125 ease-out" />
                        )
                     )}
                     
                     <div className="relative z-20">
                        <div className="w-12 h-12 md:w-14 md:h-14 glass-card bg-white/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-white group-hover:text-black transition-all">
                           {item.icon}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2 group-hover:text-[#3B82F6] transition-all">{item.title}</h3>
                        <p className="text-[#A1A1A6] font-bold text-xs md:text-sm tracking-widest">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Showcase Section */}
          <section id="showcase" className="py-32 border-t border-white/5">
             <div className="text-center mb-24">
                <span className="text-white font-black uppercase tracking-[0.5em] text-xs mb-4 block">Hall of Wonders</span>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">GALLERY OF <span className="gradient-text">CREATION</span></h2>
             </div>

             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[...SHOWCASE_VIDEOS, ...SHOWCASE_IMAGES].slice(showcaseIdx, showcaseIdx + 6).map((src, i) => (
                   <div key={`${showcaseIdx}-${i}`} className="glass-card aspect-[4/5] md:aspect-square overflow-hidden group border border-glow transition-all duration-1000 animate-in fade-in zoom-in-95">
                      {src.includes('mixkit') ? (
                         <video src={src} poster={SHOWCASE_IMAGES[i % 6]} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                      ) : (
                         <img src={src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="Showcase"/>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         <div className="bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase text-white mb-1">AI Synthesis V2</p>
                            <p className="text-[9px] text-white/60 line-clamp-1 italic">Generated via Vedagarbha Engine</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-white/5 bg-[#030303]/40 backdrop-blur-3xl py-32 relative overflow-hidden">
           <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-[#3B82F6] rounded-full blur-[200px] opacity-[0.05]"></div>
           
           <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-4">
                    <img src="/logo.png" className="w-14 h-14" alt="Vedagarbha Logo"/>
                    <div className="flex flex-col">
                       <span className="text-3xl font-black tracking-tighter uppercase">VEDAGARBHA</span>
                       <span className="text-[10px] font-bold text-[#8E8E93] tracking-[0.5em] uppercase">AI Ecosystem</span>
                    </div>
                 </div>
                 <p className="text-xl text-[#A1A1A6] font-medium leading-relaxed max-w-lg">
                    Architects of the first seamless AI creative stack. Redefining imagination through high-performance synthesis.
                 </p>

                 <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black text-[#3B82F6] tracking-[0.4em] uppercase opacity-60">Connect & Support</span>
                    <a href="mailto:webcraftai.ai@gmail.com" className="text-lg font-black text-white hover:text-[#3B82F6] transition-all">webcraftai.ai@gmail.com</a>
                    <p className="text-sm font-bold text-[#8E8E93] leading-relaxed italic">Bhavnagar, Gujarat, India 364001</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                 <div className="flex flex-col gap-6">
                    <span className="text-[10px] font-black text-[#3B82F6] tracking-[0.4em] uppercase opacity-60">Creative</span>
                    <button onClick={() => handleStart('/generate/text-to-video')} className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all text-left">Video Gen</button>
                    <button onClick={() => handleStart('/generate/image-to-video')} className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all text-left">Motion Gen</button>
                    <button onClick={() => handleStart('/generate/text-to-image')} className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all text-left">Assets Gen</button>
                    <button onClick={() => handleStart('/generate/text-to-speech')} className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all text-left">Voice Gen</button>
                 </div>
                 <div className="flex flex-col gap-6">
                    <span className="text-[10px] font-black text-[#3B82F6] tracking-[0.4em] uppercase opacity-60">Legal</span>
                    <Link href="/privacy" className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all">Privacy</Link>
                    <Link href="/terms" className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all">Terms</Link>
                    <Link href="/pricing" className="text-lg font-black uppercase text-[#A1A1A6] hover:text-white transition-all">Pricing</Link>
                 </div>
              </div>
           </div>
           
           <div className="max-w-[1440px] mx-auto px-10 mt-32 pt-10 border-t border-white/5 flex flex-col items-center gap-8">
              <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                 {[
                   { name: "𝕏", url: "https://x.com", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.005H5.059z"/></svg> },
                   { name: "Instagram", url: "https://instagram.com", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                   { name: "YouTube", url: "https://youtube.com", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> },
                   { name: "LinkedIn", url: "https://linkedin.com", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> }
                 ].map(social => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#3B82F6] transition-colors" title={social.name}>
                       {social.icon}
                    </a>
                 ))}
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full opacity-40">
                 <span className="text-xs font-black uppercase tracking-[0.4em]">© {new Date().getFullYear()} Vedagarbha Platform</span>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Powered by</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3B82F6]">webcraft.in</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
