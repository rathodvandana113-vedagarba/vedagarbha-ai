"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { Sparkles, Video, Image as ImageIcon, Mic, ArrowRight, Download, Share2, Settings, History, Info, ChevronLeft, Filter, Check, Copy } from 'lucide-react';

// Voice options for Text-to-Speech (ElevenLabs voice IDs)
const VOICE_OPTIONS = [
  // Female - North America
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", category: "Female", desc: "Calm, natural American" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", category: "Female", desc: "Soft, warm & friendly" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", category: "Female", desc: "Young, expressive American" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", category: "Female", desc: "Confident & bold" },
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Lily", category: "Female", desc: "Bright narration" },
  { id: "piTKgc9n4Y1f6S7S6S8S", name: "Samantha", category: "Female", desc: "Professional, corporate" },
  { id: "Lcf7u3S7Y8S6F7S4G9S1", name: "Audrey", category: "Female", desc: "Mid-Atlantic, sophisticated" },
  
  // Male - North America
  { id: "29vD33N1CtxCmqQRPOHJ", name: "Drew", category: "Male", desc: "Deep, authoritative" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", category: "Male", desc: "Strong, cinematic hero" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", category: "Male", desc: "Warm, conversational" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", category: "Male", desc: "Smooth narrator" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", category: "Male", desc: "Energetic, young" },
  { id: "ODq5zmih8GrVes37Dizd", name: "Patrick", category: "Male", desc: "Charismatic storyteller" },
  { id: "N2lVS1wzXK9X2C3X4C5X", name: "Bill", category: "Male", desc: "Trustworthy, mature" },

  // British / European
  { id: "jBpfAFnaylXS5xSbITun", name: "Freya", category: "Female", desc: "Elegant, refined British" },
  { id: "jsCqWAovK2LkecY7zXl4", name: "Dorothy", category: "Female", desc: "Classic British lady" },
  { id: "ZQe5CZNOzWyzPSCn5a3c", name: "James", category: "Male", desc: "Smooth British gentleman" },
  { id: "Xp3nS4Y5T9X1R2C3X4X5", name: "Oliver", category: "Male", desc: "Youthful British" },
  { id: "Hans_DE", name: "Hans", category: "International", desc: "Deep German accent" },
  { id: "Pierre_FR", name: "Pierre", category: "International", desc: "Soft French accent" },
  { id: "Lorenzo_IT", name: "Lorenzo", category: "International", desc: "Passionate Italian" },
  { id: "Mateo_ES", name: "Mateo", category: "International", desc: "Clear Spanish voice" },

  // Indian Accents
  { id: "Aditi_IN", name: "Aditi", category: "International", desc: "Fluent, mild Indian Accent" },
  { id: "Vikram_IN", name: "Vikram", category: "International", desc: "Professional Indian Male" },
  { id: "Ananya_HI", name: "Ananya", category: "International", desc: "Hindi Accent Female" },
  { id: "Arjun_HI", name: "Arjun", category: "International", desc: "Hindi Accent Male" },

  // Characters
  { id: "Thomas_Wise", name: "Thomas", category: "Character", desc: "Calm, wise elder" },
  { id: "Harry_Animated", name: "Harry", category: "Character", desc: "Lively, animated" },
  { id: "Gnome_Mystical", name: "Gnome", category: "Character", desc: "High pitched, mystical" },
  { id: "Orc_Gritty", name: "Orc", category: "Character", desc: "Gritty, deep growl" },
  { id: "Robo_Bot", name: "Robo-7", category: "Character", desc: "Flat, robotic monotone" },

  // Specialty & News
  { id: "Michael_News", name: "Michael", category: "Specialty", desc: "Newscast male" },
  { id: "Jessica_News", name: "Jessica", category: "Specialty", desc: "Newscast female" },
  { id: "Logan_Promo", name: "Logan", category: "Specialty", desc: "Exciting promo voice" },
  { id: "Asher_ASMR", name: "Asher", category: "Specialty", desc: "Low-frequency ASMR" }
];

const CATEGORY_COLORS: Record<string, string> = {
  Female: "#E879F9",
  Male: "#60A5FA",
  Character: "#F43F5E",
  Specialty: "#FBBF24",
  International: "#A78BFA"
};

function GeneratePageContent({ type }: { type: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, deductCredit, addHistoryItem } = useAuth();
  
  const initialPrompt = searchParams.get('prompt') || "";
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const resultPanelRef = useRef<HTMLDivElement>(null);

  // Settings State
  const [resolution, setResolution] = useState<"HD" | "4K">("HD");
  const [duration, setDuration] = useState<5|10|20|30>(5);
  const [motionValue, setMotionValue] = useState(50);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].id);
  const [voiceFilter, setVoiceFilter] = useState<string>("All");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image exceeds 5MB limit.");
    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImprovePrompt = () => {
    if (!prompt.trim()) return;
    setPrompt(prompt + ", Cinematic lighting, dramatic atmosphere, ultra realistic, highly detailed, 4K");
  };

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Add a small delay to avoid flicker during navigation
    const timer = setTimeout(() => {
      if (!isLoading && !user) {
        setShowAuthModal(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  const toolTitles: Record<string, string> = {
    'text-to-video': 'Cinematic Video',
    'image-to-video': 'Image Animation',
    'text-to-image': 'Generative Image',
    'text-to-speech': 'Lifelike Speech'
  };

  const title = toolTitles[type] || 'AI Studio';
  const shortType = type?.split('-')[2] || 'creation';
  const isVideo = type.includes('video');

  const getGenerationCost = () => {
    if (type === 'text-to-speech') return 0.5;
    if (type === 'text-to-image') return 1;
    if (isVideo) return resolution === '4K' ? 10 : (duration > 10 ? 8 : 4);
    return 1;
  };

  const cost = getGenerationCost();
  const hasEnoughCredits = user && (user.credits + user.dailyFreeCredits) >= cost;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !hasEnoughCredits) return;
    
    setIsGenerating(true);
    setResultData(null);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => (prev < 90 ? prev + (90 - prev) * 0.1 : prev));
    }, 500);

    try {
      const endpoint = type === 'text-to-image' ? '/api/generate/image' : (type === 'text-to-speech' ? '/api/generate/voice' : '/api/generate/video');
      const payload = type === 'text-to-speech' ? { text: prompt, voiceId: selectedVoice } : { prompt, type: type === 'image-to-video' ? 'image' : 'text', motion_value: motionValue, duration, resolution, aspect_ratio: aspectRatio, imageUrl: imagePreview };

      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      
      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTimeout(() => {
        if (res.ok) {
          setResultData(data);
          deductCredit(cost);
          addHistoryItem({ ...data.data, cost, type, prompt, timestamp: new Date().toISOString() });
          setTimeout(() => resultPanelRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
        } else alert("Generation Error: " + data.error);
        setIsGenerating(false);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      alert("Network Error: Could not reach backend.");
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-[#070708] text-white font-bold tracking-widest animate-pulse">LOADING WORKSPACE...</div>;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#070708] text-white font-sans overflow-hidden">
      <Navbar />
      
      <div className="flex flex-col-reverse lg:flex-row flex-1 pt-[72px] lg:overflow-hidden overflow-y-auto">
        {/* Sidebar / Settings */}
        <aside className="w-full lg:w-[350px] bg-[#0B0B0F]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col p-6 overflow-y-auto no-scrollbar z-20">
          <div className="flex items-center gap-2 mb-8">
            <Settings size={18} className="text-white" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Generation Parameters</h3>
          </div>

          <div className="flex flex-col gap-8 pb-10">
            {/* Aspect Ratio */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Canvas Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[["16:9", "Cinematic"], ["9:16", "Vertical"], ["1:1", "Square"]].map(([val, label]) => (
                  <button key={val} onClick={() => setAspectRatio(val as any)} className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${aspectRatio === val ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"}`}>
                    <span className="text-sm font-bold">{val}</span>
                    <span className="text-[9px] opacity-60 uppercase">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Swiper */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Output Resolution</label>
              <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
                {["HD", "4K"].map(q => (
                  <button key={q} onClick={() => setResolution(q as any)} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${resolution === q ? "bg-white text-black shadow-lg shadow-white/10" : "text-gray-500 hover:text-white"}`}>{q} {q === '4K' ? 'ULTRA' : 'FAST'}</button>
                ))}
              </div>
            </div>

            {/* Video Specific */}
            {isVideo && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Clip Duration</span>
                    <span className="text-white">{duration}s</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 20, 30].map(s => (
                      <button key={s} onClick={() => setDuration(s as any)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${duration === s ? "border-white text-white bg-white/5" : "border-white/5 text-gray-500"}`}>{s}s</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Motion Dynamics</span>
                    <span className="text-white">{motionValue}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={motionValue} onChange={(e)=>setMotionValue(parseInt(e.target.value))} className="w-full accent-white" />
                </div>
              </>
            )}

            {/* Speech Specific */}
            {type === 'text-to-speech' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                   <span>Persona Library</span>
                   <div className="flex gap-1.5">
                    {["All", "Female", "Male"].map(f => (
                      <button key={f} onClick={() => setVoiceFilter(f)} className={`px-2 py-0.5 rounded-md text-[9px] transition-all ${voiceFilter === f ? 'bg-white text-black' : 'bg-white/5 text-gray-600'}`}>{f}</button>
                    ))}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                  {VOICE_OPTIONS.filter(v => voiceFilter === "All" || v.category === voiceFilter).map(v => (
                    <button key={v.id} onClick={() => setSelectedVoice(v.id)} className={`flex flex-col items-start gap-1 p-3 rounded-2xl border transition-all ${selectedVoice === v.id ? "bg-white/10 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-white/5 border-white/5 hover:border-white/20"}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black" style={{ background: CATEGORY_COLORS[v.category] + '20', color: CATEGORY_COLORS[v.category], border: `1px solid ${CATEGORY_COLORS[v.category]}40` }}>{v.name.charAt(0)}</div>
                        <span className={`text-[12px] font-bold ${selectedVoice === v.id ? 'text-white' : 'text-gray-300'}`}>{v.name}</span>
                      </div>
                      <span className="text-[9px] text-gray-500 line-clamp-1 text-left">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image to Video */}
            {type === 'image-to-video' && (
              <div className="space-y-3">
                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source Reference</label>
                 <div className="relative aspect-video rounded-2xl border-2 border-dashed border-white/10 overflow-hidden group hover:border-white/30 transition-all cursor-pointer">
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
                        <ImageIcon size={24} />
                        <span className="text-[10px] font-bold">UPLOAD BASE IMAGE</span>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* Prompt Section */}
            <div className="space-y-4 pt-6 mt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Creative Directive</label>
                <button onClick={handleImprovePrompt} className="text-[9px] font-black bg-white/10 text-white px-2 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all">✨ MAGIC IMPROVE</button>
              </div>
              <textarea 
                value={prompt} 
                onChange={(e)=>setPrompt(e.target.value)} 
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-white/40 resize-none transition-all placeholder:text-gray-700"
                placeholder={`Envision your ${shortType} here...`}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || !hasEnoughCredits}
                className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm relative overflow-hidden group hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:grayscale transition-all active:scale-[0.98]"
              >
                <div className="absolute inset-x-0 bottom-0 top-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isGenerating ? "FORGING CREATION..." : resultData ? "REGENERATE" : "INITIALIZE GENERATION"}
                  {!isGenerating && <span className="bg-black/10 px-2 py-0.5 rounded-lg text-[10px]">{cost} Cr</span>}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Display Area */}
        <main ref={resultPanelRef} className="flex-1 flex flex-col relative bg-[#070708] overflow-hidden">
          {/* Header Stats */}
          <header className="h-[72px] border-b border-white/5 flex items-center justify-between px-8 bg-[#070708]/80 backdrop-blur-md z-10 shrink-0">
             <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/5">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-black tracking-tight">{title}</h2>
             </div>
             <div className="flex items-center gap-3">
                <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Available Credits</span>
                  <span className="text-sm font-bold text-white">{(user?.credits || 0) + (user?.dailyFreeCredits || 0)}</span>
                </div>
                <button onClick={() => router.push('/pricing')} className="px-5 py-2 rounded-full bg-white text-black font-black text-xs hover:bg-[#3B82F6] hover:text-white transition-all">RECHARGE</button>
             </div>
          </header>

          <div className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3B82F6]/5 blur-[160px] rounded-full -z-10" />

             {/* Generation Stage */}
             <div className={`relative rounded-[40px] border border-white/5 bg-[#0B0B0F]/50 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-out ${aspectRatio === '16:9' ? 'w-full max-w-[1100px] aspect-video' : aspectRatio === '9:16' ? 'h-full max-h-[800px] aspect-[9/16]' : 'w-full max-w-[800px] aspect-square'}`}>
                
                {!resultData && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 text-center">
                    <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 animate-pulse">
                      <Sparkles size={40} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-2">Awaiting Directive</h3>
                      <p className="text-gray-500 max-w-[400px]">Configure your parameters and press generate to manifest your imagination into reality.</p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0B0B0F]/80 backdrop-blur-sm">
                    <div className="w-[300px] space-y-4">
                       <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] animate-pulse">Analyzing Neural Pathways...</span>
                          <span className="text-sm font-bold text-white">{Math.round(loadingProgress)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-white via-white/40 to-white shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500" style={{ width: `${loadingProgress}%` }} />
                       </div>
                    </div>
                  </div>
                )}

                {resultData && (
                  <div className="absolute inset-0 group">
                    {type === 'text-to-image' ? (
                      <img src={resultData.data?.url || resultData.url} alt="Generated" className="w-full h-full object-contain" />
                    ) : type === 'text-to-speech' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#0B0B14] to-[#010103]">
                        <div className="w-48 h-48 rounded-full border border-white/20 flex items-center justify-center mb-8 relative">
                           <div className="absolute inset-0 rounded-full border border-white/40 animate-ping -z-10" />
                           <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center text-black">
                              <Mic size={64} strokeWidth={3} />
                           </div>
                        </div>
                        <h4 className="text-2xl font-black mb-2 text-white">Synthesized Success</h4>
                        <p className="text-gray-500 mb-8 italic">"{prompt.substring(0, 100)}..."</p>
                        <div className="w-full max-w-md bg-white/5 p-4 rounded-3xl border border-white/10">
                           <audio id="audio-player" src={resultData.data?.audioUrl || resultData.audioUrl} controls className="w-full accent-white" />
                        </div>
                      </div>
                    ) : (
                      <video src={resultData.data?.videoUrl || resultData.videoUrl} controls autoPlay loop muted playsInline className="w-full h-full object-contain" />
                    )}

                    {/* Action Palette */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-black/40 backdrop-blur-2xl px-6 py-4 rounded-[32px] border border-white/10 border-b-white/20">
                      <button onClick={()=>window.open(resultData.data?.url || resultData.data?.videoUrl || resultData.url || resultData.videoUrl)} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black text-xs rounded-2xl hover:bg-[#3B82F6] hover:text-white transition-all"><Download size={14} /> DOWNLOAD RESULT</button>
                      <button className="p-3 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-white/10 transition-all"><Share2 size={16} /></button>
                      <div className="w-[1px] h-6 bg-white/10 mx-2" />
                      <button className="flex items-center gap-2 px-6 py-3 text-white/60 font-black text-xs rounded-2xl hover:text-white transition-all"><History size={14} /> VIEW IN HISTORY</button>
                    </div>
                  </div>
                )}
              </div>
           </div>
         </main>
       </div>
       <AuthModal isOpen={showAuthModal} onClose={() => {
         setShowAuthModal(false);
         if (!user) router.push('/');
       }} />
    </div>
  );
}

// Fixed Default Export to handle dynamic [type]
interface PageProps {
  params: { type: string };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="bg-[#070708] h-screen" />}>
      <GeneratePageContent type={params.type} />
    </Suspense>
  );
}
