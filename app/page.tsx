"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/navbars/KlingNav';
import AuthModal from '@/components/auth/AuthModal';
import { Play, Sparkles, Zap, Shield, Cpu, Video, Image as ImageIcon, Mic, ArrowRight } from 'lucide-react';

const DEMOS = [
  { type: 'Text to Video', prompt: '"Ultra-realistic cinematic shot of vibrant colored ink exploding and swirling in crystal clear water, 4k, slow motion"', media: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-ink-flow-in-water-32918-large.mp4', isVideo: true },
  { type: 'Image to Video', prompt: '"Transform this static portrait into a breathing cinematic scene with subtle wind and dappled lighting"', media: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-eye-with-futuristic-reflections-42866-large.mp4', isVideo: true },
  { type: 'Text to Image', prompt: '"A photorealistic rendering of a futuristic supercar in cyberpunk neon streets at midnight"', media: 'https://images.unsplash.com/photo-1542362567-b05423158c56?auto=format&fit=crop&q=80&w=1200', isVideo: false }
];

const HERO_BGS = [
  'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-golden-particles-loop-32924-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-futuristic-ai-technology-circuit-background-loop-42861-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-geometric-shapes-background-loop-32694-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-network-lines-and-dots-background-loop-42862-large.mp4'
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
  const [bgVideo, setBgVideo] = useState(HERO_BGS[0]);

  useEffect(() => {
    // Select a random background video on mount
    setBgVideo(HERO_BGS[Math.floor(Math.random() * HERO_BGS.length)]);
    
    const int = setInterval(() => {
      setDemoIdx((prev) => (prev + 1) % DEMOS.length);
    }, 5000);
    return () => clearInterval(int);
  }, []);

  const handleStart = (path: string) => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-x-hidden font-sans relative">
      <Navbar />
      
      <main>
        {/* Premium Cinematic Hero Background - Fixed Full Page */}
        <div className="fixed inset-0 overflow-hidden -z-10 bg-[#0A0A0B]">
          <video 
            key={bgVideo}
            src={bgVideo} 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover opacity-30 md:opacity-40 transition-opacity duration-1000 scale-[1.05]"
          ></video>
          <div className="absolute inset-0 bg-[#0A0A0B]/20 bg-gradient-to-b from-[#0A0A0B]/30 via-[#0A0A0B]/80 to-[#0A0A0B]"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-16 relative z-10">
          <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 min-h-[100vh] pt-[120px] lg:pt-[100px] items-center">
            <div className="flex flex-col gap-4 md:gap-6 text-center lg:text-left transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-max mx-auto lg:mx-0 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]"></span>
                <span className="text-[10px] md:text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">Vedagarbha Engine 2.0 Live</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg">
                Vedagarbha AI <span className="bg-gradient-to-br from-[#D4AF37] via-[#F5D97A] to-[#D4AF37] text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_15px_rgba(245,217,122,0.6)]">Platform v3.2</span>
              </h1>
              <p className="text-lg md:text-xl text-[#A1A1A6] max-w-[500px] leading-relaxed mx-auto lg:mx-0">
                Create hyper-realistic videos, images, and voice using AI. The ultimate creative ecosystem inside your browser.
              </p>
              <div className="flex flex-col gap-4 mt-4 justify-center lg:justify-start sm:flex-row px-4 sm:px-0">
                <button 
                  onClick={() => handleStart("/generate/text-to-video")}
                  className="bg-[#0B0B0F] border border-[#D4AF37] text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(245,217,122,0.5)] hover:border-[#F5D97A] hover:-translate-y-1 relative overflow-hidden group w-full sm:w-auto"
                >
                  <span className="relative z-10">Start Creating</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl font-bold text-base transition-all backdrop-blur-md hover:-translate-y-1 w-full sm:w-auto"
                >
                  Explore Features
                </button>
              </div>
            </div>
            
            {/* macOS-style Floating Preview Window */}
            <div className="relative flex justify-center items-center h-full w-full max-w-[650px] mx-auto transition-all duration-1000 animate-in fade-in slide-in-from-right-12 mt-8 lg:mt-0">
              <div className="w-full aspect-video bg-[#121218]/90 rounded-[12px] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_80px_rgba(212,175,55,0.08)] overflow-hidden flex flex-col relative group backdrop-blur-3xl transform transition-transform hover:scale-[1.02] duration-500">
                
                {/* macOS Header bar */}
                <div className="h-10 bg-[#1C1C1F]/80 border-b border-white/5 flex items-center justify-between px-4 backdrop-blur-md relative z-20">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></span>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-[#A1A1A6] font-medium tracking-wide flex items-center gap-2 bg-white/5 px-4 py-1 rounded-md border border-white/5">
                    <Sparkles size={12} className="text-[#D4AF37]" /> {DEMOS[demoIdx].type}
                  </div>
                  <div className="w-12"></div> {/* Spacer for balance */}
                </div>
                
                <div className="flex-1 w-full h-full relative overflow-hidden bg-black">
                  {DEMOS[demoIdx].isVideo ? (
                    <video 
                      key={DEMOS[demoIdx].media}
                      src={DEMOS[demoIdx].media} 
                      autoPlay loop muted playsInline 
                      className="w-full h-full object-cover animate-in fade-in duration-700"
                    ></video>
                  ) : (
                    <img 
                      key={DEMOS[demoIdx].media}
                      src={DEMOS[demoIdx].media}
                      alt="Demo"
                      className="w-full h-full object-cover animate-in fade-in duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                  
                  {/* Floating Animated Prompt Box Overlay */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] bg-[#121218]/80 backdrop-blur-2xl border border-white/10 py-3 px-5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent animate-pulse"></div>
                     <p className="text-white text-sm font-medium flex items-start gap-3 leading-relaxed">
                       <span className="text-[#D4AF37] translate-y-0.5">✨</span> 
                       <span key={demoIdx} className="opacity-90 animate-in fade-in slide-in-from-bottom-2 duration-500">{DEMOS[demoIdx].prompt}</span>
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Showcases Section */}
          <section className="py-24 border-t border-white/5 mt-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
            
            <div className="mb-20">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#A1A1A6] text-transparent bg-clip-text">AI Generated Video Showcase</h2>
                  <p className="text-[#A1A1A6] mt-2 font-medium">Hyper-realistic cinematic motion generated completely by AI.</p>
                </div>
                <button onClick={() => handleStart('/generate/text-to-video')} className="text-[#D4AF37] hover:text-[#F5D97A] text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">
                  Try it <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {SHOWCASE_VIDEOS.map((src, i) => (
                  <div key={i} onClick={() => handleStart('/generate/text-to-video')} className="cursor-pointer aspect-video bg-[#121218] rounded-xl overflow-hidden group relative border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform text-white">
                        <Play size={20} className="ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#A1A1A6] text-transparent bg-clip-text">AI Generated Images Showcase</h2>
                  <p className="text-[#A1A1A6] mt-2 font-medium">Photorealistic assets crafted from simple text descriptions.</p>
                </div>
                <button onClick={() => handleStart('/generate/text-to-image')} className="text-[#D4AF37] hover:text-[#F5D97A] text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">
                  Try it <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {SHOWCASE_IMAGES.map((src, i) => (
                  <div key={i} onClick={() => handleStart('/generate/text-to-image')} className="cursor-pointer aspect-square bg-[#121218] rounded-xl overflow-hidden group relative border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <img src={src} alt="AI Showcase" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-[#D4AF37] text-sm font-semibold flex items-center gap-2"><ImageIcon size={16}/> High Resolution</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Premium Features Section */}
          <section id="features" className="py-24 border-t border-white/5 relative">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ultimate Creative Suite</h2>
              <p className="text-[#A1A1A6] max-w-2xl mx-auto text-base md:text-lg">One unified platform integrating state-of-the-art models for video, image, and voice synthesis.</p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                { title: "Text to Video", icon: <Video className="text-[#D4AF37]" size={28}/>, desc: "Transform your ideas into cinematic videos with ultra-realistic motion and physics.", path: "/generate/text-to-video", img: SHOWCASE_VIDEOS[0] },
                { title: "Image to Video", icon: <Sparkles className="text-[#D4AF37]" size={28}/>, desc: "Bring your static images to life with motion. Maintain character consistency effortlessly.", path: "/generate/image-to-video", img: SHOWCASE_VIDEOS[2] },
                { title: "Text to Image", icon: <ImageIcon className="text-[#D4AF37]" size={28}/>, desc: "Generate photorealistic images and digital art from simple intuitive text prompts.", path: "/generate/text-to-image", bg: SHOWCASE_IMAGES[3] },
                { title: "Text to Speech", icon: <Mic className="text-[#D4AF37]" size={28}/>, desc: "Ultra-realistic AI voices with human prosody, emotional range, and multiple languages.", path: "/generate/text-to-speech", bg: SHOWCASE_IMAGES[5] }
              ].map((feature, i) => (
                <div 
                  key={feature.title} 
                  onClick={() => handleStart(feature.path)}
                  className="bg-[#121218]/60 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/40 hover:shadow-[0_20px_40px_rgba(212,175,55,0.1)] cursor-pointer group flex flex-col h-[400px]"
                >
                  <div className="p-8 pb-0 z-10 relative bg-gradient-to-b from-[#121218] via-[#121218]/80 to-transparent">
                    <div className="w-14 h-14 bg-[#0B0B0F] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:border-[#D4AF37]/50 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">{feature.title}</h3>
                    <p className="text-[#A1A1A6] text-base leading-relaxed pr-8">{feature.desc}</p>
                    <button className="mt-6 text-white font-semibold flex items-center gap-2 group-hover:text-[#F5D97A] transition-colors bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 w-max">
                      Try Now <ArrowRight size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-auto flex-1 relative overflow-hidden flex items-end justify-center min-h-[200px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121218] to-transparent z-10 w-full h-full object-cover mask-image-bottom"></div>
                    {feature.img ? (
                      <video src={feature.img} autoPlay loop muted playsInline className="absolute bottom-0 w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"></video>
                    ) : (
                      <img src={feature.bg} className="absolute bottom-0 w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="bg"/>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#121218] to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Vedagarbha Section */}
          <section className="py-24 border-t border-white/5 relative bg-[#0B0B0F]">
            <div className="absolute top-0 right-1/4 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Vedagarbha Platform?</h2>
              <p className="text-[#A1A1A6] max-w-2xl mx-auto">Experience the intersection of luxury design and powerful AI processing.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: <Zap size={24}/>, title: "Fast Generation", desc: "Optimized pipelines deliver 4K video and HD images in seconds, not hours." },
                { icon: <Cpu size={24}/>, title: "High Quality Models", desc: "Access the most advanced foundational AI models available on the market." },
                { icon: <Sparkles size={24}/>, title: "Easy Interface", desc: "Intuitive prompting and real-time settings without complex workflows." },
                { icon: <Shield size={24}/>, title: "Professional Results", desc: "Commercial-ready resolutions designed for enterprise and creative studios." }
              ].map((benefit, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#121218]/40 border border-white/5 hover:bg-[#121218] transition-colors h-full">
                  <div className="w-16 h-16 rounded-full bg-[#121218] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-[#A1A1A6] text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      {/* Global Footer */}
      <footer className="border-t border-white/10 bg-[#0B0B0F] py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          <div className="flex flex-col gap-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <span className="text-sm font-black text-[#0B0B0F]">V</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Vedagarbha</span>
            </div>
            <p className="text-[#6E6E73] text-sm leading-relaxed">
              The premier SaaS platform for hyper-realistic AI video, image, and speech generation. Unleash your creativity inside the browser.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="flex flex-col gap-4 text-[#A1A1A6] text-sm">
              <li><button onClick={() => handleStart('/generate/text-to-video')} className="hover:text-[#D4AF37] transition-colors">Text to Video</button></li>
              <li><button onClick={() => handleStart('/generate/image-to-video')} className="hover:text-[#D4AF37] transition-colors">Image to Video</button></li>
              <li><button onClick={() => handleStart('/generate/text-to-image')} className="hover:text-[#D4AF37] transition-colors">Text to Image</button></li>
              <li><button onClick={() => handleStart('/generate/text-to-speech')} className="hover:text-[#D4AF37] transition-colors">Text to Speech</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-[#A1A1A6] text-sm">
              <li><button onClick={() => router.push('/about')} className="hover:text-[#D4AF37] transition-colors">About Us</button></li>
              <li><button onClick={() => router.push('/pricing')} className="hover:text-[#D4AF37] transition-colors">Pricing</button></li>
              <li><button onClick={() => router.push('/about')} className="hover:text-[#D4AF37] transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-[#A1A1A6] text-sm">
              <li><Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-8 mt-16 pt-8 border-t border-white/5 text-center text-[#6E6E73] text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Vedagarbha AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B0B0F] transition-all">𝕏</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B0B0F] transition-all">in</a>
          </div>
        </div>
      </footer>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
