"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

// Voice options for Text-to-Speech (ElevenLabs voice IDs)
const VOICE_OPTIONS = [
  // Female Voices
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", category: "Female", desc: "Calm, natural American" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", category: "Female", desc: "Soft, warm & friendly" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", category: "Female", desc: "Young, expressive" },
  { id: "jBpfAFnaylXS5xSbITun", name: "Freya", category: "Female", desc: "Elegant, refined British" },
  { id: "oWAxZDx7w5VEj9dCyTzz", name: "Grace", category: "Female", desc: "Warm, Southern charm" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Nicole", category: "Female", desc: "Clear & professional" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", category: "Female", desc: "Soothing, mature" },
  { id: "jsCqWAovK2LkecY7zXl4", name: "Dorothy", category: "Female", desc: "Classic British lady" },
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Lily", category: "Female", desc: "Bright narration" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", category: "Female", desc: "Confident & bold" },
  
  // Male Voices
  { id: "29vD33N1CtxCmqQRPOHJ", name: "Drew", category: "Male", desc: "Deep, authoritative" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", category: "Male", desc: "Strong, cinematic" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", category: "Male", desc: "Warm, conversational" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", category: "Male", desc: "Smooth narrator" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", category: "Male", desc: "Energetic, young" },
  { id: "2EiwWnXFnvU5JabPnv8n", name: "Clyde", category: "Male", desc: "Powerful, deep bass" },
  { id: "ODq5zmih8GrVes37Dizd", name: "Patrick", category: "Male", desc: "Charismatic storyteller" },
  { id: "ZQe5CZNOzWyzPSCn5a3c", name: "James", category: "Male", desc: "Smooth British accent" },
  
  // Character & Specialty Voices
  { id: "GBv7mTt0atIp3Br8iCZE", name: "Thomas", category: "Character", desc: "Calm, wise elder" },
  { id: "SOYHLrjzK2X1ezoPC6cr", name: "Harry", category: "Character", desc: "Lively, animated" },
  { id: "flq6f7yk4E4fJM5XTYuZ", name: "Michael", category: "Specialty", desc: "Newscast style" },
  { id: "z9fAnlkpzviPz146aGWa", name: "Glinda", category: "Specialty", desc: "Magical, whimsical" },
  { id: "t0jbNlBVZ17f02VDIeMI", name: "Jessie", category: "Specialty", desc: "Fast, energetic" },
  { id: "iP95p4xoKVk53GoZ742B", name: "George", category: "Specialty", desc: "Warm narrator" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Female: "#E879F9",
  Male: "#60A5FA",
  Character: "#34D399",
  Specialty: "#FBBF24",
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
    if (file.size > 5 * 1024 * 1024) {
      alert("Image exceeds 5MB limit.");
      return;
    }
    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImprovePrompt = () => {
    if (!prompt.trim()) return;
    setPrompt(prompt + ", Cinematic lighting, dramatic atmosphere, ultra realistic, highly detailed, 4K");
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Basic map to show correct title
  const toolTitles: Record<string, string> = {
    'text-to-video': 'Text to Video',
    'image-to-video': 'Image to Video',
    'text-to-image': 'Text to Image',
    'text-to-speech': 'Text to Speech'
  };

  const title = toolTitles[type] || 'AI Studio';
  const shortType = type?.split('-')[2] || 'creation';
  const isVideo = type.includes('video');

  // Dynamic Cost Calculation
  const getGenerationCost = () => {
    if (type === 'text-to-speech') return 0.5;
    if (type === 'text-to-image') return 1;
    if (isVideo) {
      if (resolution === 'HD') {
        if (duration === 5) return 3;
        if (duration === 10) return 5;
        if (duration === 20) return 8;
        if (duration === 30) return 12;
      } else {
        // 4K
        if (duration === 10) return 10;
        if (duration === 20) return 15;
        if (duration === 30) return 20;
      }
    }
    return 1;
  };

  const cost = getGenerationCost();
  const hasEnoughCredits = user && (user.credits + user.dailyFreeCredits) >= cost;

  // Handle 4k 5s edgecase
  useEffect(() => {
    if (resolution === '4K' && duration === 5) {
      setDuration(10);
    }
  }, [resolution, duration]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (!hasEnoughCredits) {
      router.push('/pricing?reason=insufficient_credits');
      return;
    }
    
    setIsGenerating(true);
    setResultData(null);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => (prev < 90 ? prev + 3 : prev));
    }, 200);

    try {
      let endpoint = '';
      let payload: any = { prompt };

      let aspectRatioObj = { width: 1280, height: 720 };
      if (aspectRatio === "9:16") aspectRatioObj = { width: 720, height: 1280 };
      if (aspectRatio === "1:1") aspectRatioObj = { width: 1024, height: 1024 };

      if (type === 'text-to-image') {
        endpoint = '/api/generate/image';
        payload = { ...payload, ...aspectRatioObj };
      } else if (type.includes('video')) {
        if (type === 'image-to-video' && !imagePreview) {
          alert("Please upload an image to generate a video.");
          setIsGenerating(false);
          return;
        }
        endpoint = '/api/generate/video';
        payload = { prompt, type: type === 'image-to-video' ? 'image' : 'text', motion_value: motionValue, duration, ...aspectRatioObj };
        if (type === 'image-to-video') payload.imageUrl = imagePreview;
      } else if (type === 'text-to-speech') {
        endpoint = '/api/generate/voice';
        payload = { text: prompt, voiceId: selectedVoice };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTimeout(() => {
        if (res.ok) {
          setResultData(data);
          deductCredit(cost);
          addHistoryItem({ ...data.data, cost, type, timestamp: new Date().toISOString() });
          // Scroll result panel into view on mobile
          setTimeout(() => {
            resultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } else {
          alert("Generation Error: " + data.error);
        }
        setIsGenerating(false);
      }, 600);

    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      alert("Network Error: Could not reach backend generation API.");
      setIsGenerating(false);
    }
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen bg-[#0A0A0B] text-white">Loading Workspace...</div>;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0B0B0F] text-white font-sans overflow-x-hidden">
      <Navbar />
      
      <div className="flex flex-col-reverse lg:flex-row flex-1 pt-[72px] w-full overflow-hidden">
        <aside className="w-full lg:w-[320px] shrink-0 bg-[#0B0B0F] lg:bg-[#121218]/80 backdrop-blur-xl lg:border-r border-t lg:border-t-0 border-white/5 flex flex-col p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col gap-6 pb-20 lg:pb-0">
            <h3 className="text-sm uppercase text-[#6E6E73] tracking-widest font-semibold hidden lg:block">Settings</h3>
            
            <div className="flex flex-col gap-3">
              <label className="text-[13px] text-[#A1A1A6] font-medium">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setAspectRatio("16:9")} className={`py-2 md:py-3 rounded-lg text-xs font-semibold transition-all ${aspectRatio === "16:9" ? "bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37]" : "bg-[#121218] border border-white/5 text-white hover:bg-white/[0.04]"}`}>16:9</button>
                <button onClick={() => setAspectRatio("9:16")} className={`py-2 md:py-3 rounded-lg text-xs font-semibold transition-all ${aspectRatio === "9:16" ? "bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37]" : "bg-[#121218] border border-white/5 text-white hover:bg-white/[0.04]"}`}>9:16</button>
                <button onClick={() => setAspectRatio("1:1")} className={`py-2 md:py-3 rounded-lg text-xs font-semibold transition-all ${aspectRatio === "1:1" ? "bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37]" : "bg-[#121218] border border-white/5 text-white hover:bg-white/[0.04]"}`}>1:1</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] text-[#A1A1A6] font-medium">Quality</label>
              <div className="flex bg-[#121218] border border-white/5 rounded-lg p-1">
                <button 
                  onClick={() => setResolution("HD")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${resolution === 'HD' ? 'bg-[#1C1C1F] border border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-[#A1A1A6] hover:text-white border border-transparent'}`}
                >HD</button>
                <button 
                  onClick={() => setResolution("4K")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${resolution === '4K' ? 'bg-[#1C1C1F] border border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-[#A1A1A6] hover:text-white border border-transparent'}`}
                >Ultra (4K)</button>
              </div>
            </div>

            {isVideo && (
              <div className="flex flex-col gap-3">
                <label className="text-[13px] text-[#A1A1A6] font-medium flex justify-between">
                  <span>Duration</span>
                  <span className="text-white">{duration}s</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-[#121218] border border-white/5 rounded-lg p-1">
                  {[5, 10, 20, 30].map(d => {
                    const disabled = resolution === '4K' && d === 5;
                    return (
                      <button 
                        key={d}
                        onClick={() => setDuration(d as 5|10|20|30)}
                        disabled={disabled}
                        className={`py-1.5 text-xs font-semibold rounded-md transition-all ${duration === d ? 'bg-[#1C1C1F] text-[#D4AF37] border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : disabled ? 'opacity-20 cursor-not-allowed text-[#A1A1A6] border border-transparent' : 'text-[#A1A1A6] hover:text-white border border-transparent'}`}
                      >{d}s</button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label className="text-[13px] text-[#A1A1A6] font-medium flex justify-between">
                <span>Motion Value</span>
                <span className="text-white">{motionValue}</span>
              </label>
              <input type="range" min="1" max="100" value={motionValue} onChange={(e) => setMotionValue(parseInt(e.target.value))} className="w-full h-1 bg-[#2C2C30] rounded-full appearance-none outline-none accent-[#D4AF37] cursor-pointer" />
            </div>

            {type === 'image-to-video' && (
              <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
                <label className="text-[13px] text-[#A1A1A6] font-medium">Upload Image</label>
                <div className="relative">
                  <input type="file" id="img-upload" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUpload} />
                  <label htmlFor="img-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl bg-[#121218] hover:bg-white/5 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group px-4 text-center">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-[#D4AF37]">Drop your image here or click to upload</span>
                        <span className="text-xs text-gray-500 mt-1 opacity-70">JPG, PNG, WEBP (Max 5MB)</span>
                      </>
                    )}
                  </label>
                </div>
                {imagePreview && (
                  <button onClick={() => { setUploadedImage(null); setImagePreview(null); }} className="text-xs text-red-400 font-medium self-end hover:underline">Remove Image</button>
                )}
              </div>
            )}

            {/* Voice Selection - only for text-to-speech */}
            {type === 'text-to-speech' && (
              <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
                <label className="text-[13px] text-[#A1A1A6] font-medium">Select Voice</label>

                {/* Grouped Dropdown */}
                <div className="relative">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl text-white text-sm px-4 py-3 pr-10 outline-none focus:border-[#D4AF37]/50 appearance-none cursor-pointer transition-all"
                    style={{ colorScheme: 'dark' }}
                  >
                    <optgroup label="👩 Female Voices" style={{ background: '#121218' }}>
                      <option value="21m00Tcm4TlvDq8ikWAM">Rachel — Calm, Natural American</option>
                      <option value="EXAVITQu4vr4xnSDxMaL">Bella — Soft, Warm &amp; Friendly</option>
                      <option value="MF3mGyEYCl7XYWbV9V6O">Elli — Young, Expressive</option>
                      <option value="jBpfAFnaylXS5xSbITun">Freya — Elegant, Refined British</option>
                      <option value="oWAxZDx7w5VEj9dCyTzz">Grace — Warm, Southern Charm</option>
                      <option value="pNInz6obpgDQGcFmaJgB">Nicole — Clear &amp; Professional</option>
                      <option value="XB0fDUnXU5powFXDhCwa">Charlotte — Soothing, Mature</option>
                      <option value="jsCqWAovK2LkecY7zXl4">Dorothy — Classic British Lady</option>
                      <option value="ThT5KcBeYPX3keUQqHPh">Lily — Bright Narration</option>
                      <option value="AZnzlk1XvdvUeBnXmlld">Domi — Confident &amp; Bold</option>
                      <option value="cgSgspJ2msm6clMCkdW9">Jessica — Bubbly, Cheerful</option>
                      <option value="FGY2WhTYpPnrIDTdsKH5">Laura — Soothing, Scandinavian</option>
                      <option value="XrExE9yKIg1WjnnlVkGX">Matilda — Warm Australian</option>
                      <option value="bVMeCyTHy58xNoL34h3p">Serena — Calm &amp; Composed</option>
                      <option value="nPczCjzI2devNBz1zQrb">Alice — Confident, British</option>
                    </optgroup>
                    <optgroup label="👨 Male Voices" style={{ background: '#121218' }}>
                      <option value="29vD33N1CtxCmqQRPOHJ">Drew — Deep, Authoritative</option>
                      <option value="VR6AewLTigWG4xSOukaG">Arnold — Strong, Cinematic</option>
                      <option value="ErXwobaYiN019PkySvjV">Antoni — Warm, Conversational</option>
                      <option value="yoZ06aMxZJJ28mfd3POQ">Sam — Smooth Narrator</option>
                      <option value="TxGEqnHWrfWFTfGW9XjX">Josh — Energetic, Young</option>
                      <option value="2EiwWnXFnvU5JabPnv8n">Clyde — Powerful, Deep Bass</option>
                      <option value="ODq5zmih8GrVes37Dizd">Patrick — Charismatic Storyteller</option>
                      <option value="ZQe5CZNOzWyzPSCn5a3c">James — Smooth British Accent</option>
                      <option value="N2lVS1w4EtoT3dr4eOWO">Callum — Intense, Dramatic</option>
                      <option value="CYw3kZ02Hs0563khs1Fj">Dave — British, Casual</option>
                      <option value="IKne3meq5aSn9XLyUdCD">Charlie — Casual, Natural</option>
                      <option value="JBFqnCBsd6RMkjVDRZzb">George — Warm Narrator</option>
                      <option value="TX3LPaxmHKxFdv7VOQHJ">Liam — Articulate, Direct</option>
                      <option value="bIHbv24MWmeRgasZH58o">Will — Friendly, American</option>
                      <option value="onwK4e9ZLuTAKqWW03F9">Daniel — Deep, Resonant</option>
                    </optgroup>
                    <optgroup label="🎭 Character &amp; Specialty" style={{ background: '#121218' }}>
                      <option value="GBv7mTt0atIp3Br8iCZE">Thomas — Calm, Wise Elder</option>
                      <option value="SOYHLrjzK2X1ezoPC6cr">Harry — Lively, Animated</option>
                      <option value="flq6f7yk4E4fJM5XTYuZ">Michael — Newscast Style</option>
                      <option value="z9fAnlkpzviPz146aGWa">Glinda — Magical, Whimsical</option>
                      <option value="t0jbNlBVZ17f02VDIeMI">Jessie — Fast, Energetic</option>
                      <option value="iP95p4xoKVk53GoZ742B">Giovanni — Refined Italian</option>
                      <option value="zcAOhNBS3c14rBihAFp1">Giovanni — Wise Storyteller</option>
                      <option value="g5CIjZEefAph4nQFvHAz">Fin — Upbeat Irish</option>
                      <option value="jXel5NcKc44aacaKGNgz">Archer — Confident, BBC</option>
                      <option value="Yko7PKHZNXotIFUBG7I9">Mimi — Childlike Wonder</option>
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A6]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Selected Voice Preview */}
                {(() => {
                  const v = VOICE_OPTIONS.find(v => v.id === selectedVoice);
                  return v ? (
                    <div className="flex items-center gap-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl px-3 py-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: `${CATEGORY_COLORS[v.category]}20`, color: CATEGORY_COLORS[v.category], border: `1px solid ${CATEGORY_COLORS[v.category]}40` }}
                      >{v.name.charAt(0)}</div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#D4AF37]">{v.name}</div>
                        <div className="text-[11px] text-[#6E6E73]">{v.desc}</div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            
            {/* Moved Prompt Area Layout Block */}
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-col gap-3">
              <label className="text-[13px] text-[#A1A1A6] font-medium flex justify-between">
                Prompt
                <button 
                    onClick={handleImprovePrompt}
                    title="AI will enhance your prompt to generate better results."
                    className="text-[#D4AF37] text-[11px] flex items-center gap-1 hover:text-[#F5D97A] transition-colors font-semibold uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20"
                  >
                    ✨ Improve
                  </button>
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                className="w-full h-[100px] md:h-[120px] bg-[#121218] border border-white/5 rounded-xl text-white text-[14px] p-3 resize-none outline-none font-sans placeholder-[#6E6E73] focus:border-[#D4AF37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all" 
                placeholder={`Describe the ${shortType} you want to generate...`}
              ></textarea>
              
               <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || !hasEnoughCredits}
                  className="w-full mt-2 bg-[#D4AF37] border border-[#D4AF37] text-[#0B0B0F] py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_35px_rgba(245,217,122,0.4)] hover:bg-[#F5D97A] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? "Synthesizing..." : resultData ? "Regenerate" : "Generate"}
                  {!isGenerating && <span className="text-[11px] bg-black/10 px-1.5 py-0.5 rounded opacity-90 border border-black/10">{cost} credits</span>}
                </button>
            </div>
            {/* End Moved Layout Block */}
            
          </div>
        </aside>

        <main ref={resultPanelRef} className="flex-1 flex flex-col min-h-[50vh] lg:min-h-0 w-full overflow-hidden shrink-0 border-b border-white/5 lg:border-none">
          <header className="h-[60px] md:h-16 border-b border-white/5 flex justify-between items-center px-3 md:px-6 bg-[#0B0B0F] md:bg-[#0B0B0F]/80 md:backdrop-blur-md gap-2 shrink-0 overflow-hidden w-full relative z-20">
            <div className="flex items-center gap-1 md:gap-4 shrink overflow-hidden">
              <button onClick={() => router.back()} className="text-[#A1A1A6] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-lg md:hover:bg-white/5 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <h2 className="text-[15px] md:text-lg font-semibold whitespace-nowrap truncate shrink min-w-0 pr-2">{title}</h2>
            </div>
            <div className="flex items-center gap-1.5 md:gap-4 text-xs md:text-sm text-[#A1A1A6] shrink-0">
              <div className={`flex flex-col md:flex-row md:items-center bg-white/5 px-1.5 py-1 md:px-3 md:py-1 rounded-lg border border-white/10 shrink-0 ${!hasEnoughCredits ? 'text-red-400 border-red-500/30' : ''}`}>
                <span className="hidden sm:inline">{user?.dailyFreeCredits} Free, {user?.credits} Std</span>
                <span className="sm:hidden text-[10px] font-bold whitespace-nowrap">{user?.credits + user?.dailyFreeCredits} Cr</span>
              </div>
              <button onClick={() => router.push('/pricing')} className="bg-[#D4AF37]/10 text-[#D4AF37] font-semibold border border-[#D4AF37]/30 px-2.5 py-1.5 md:px-4 md:py-1.5 rounded-lg hover:bg-[#D4AF37]/20 transition-colors shrink-0 whitespace-nowrap text-xs md:text-sm">Upgrade</button>
            </div>
          </header>

          <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 min-h-0 relative bg-[#0B0B0F]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0F] to-[#121218] -z-10"></div>
            
            <div className={`flex-1 min-h-0 bg-[#121218]/80 backdrop-blur-3xl border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.8)] mx-auto transition-all duration-500 ease-in-out ${aspectRatio === '16:9' ? 'aspect-video w-full' : aspectRatio === '9:16' ? 'aspect-[9/16] h-full w-auto max-w-full lg:max-w-[360px]' : 'aspect-square h-full w-auto max-w-full lg:max-w-[500px]'}`}>
              {resultData ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  {type === 'text-to-image' && (
                    <img src={resultData.data?.url || resultData.url} alt="Generated" className="w-full h-full object-contain rounded-lg shadow-2xl" />
                  )}
                  {(type === 'text-to-video' || type === 'image-to-video') && (
                    <video src={resultData.data?.videoUrl || resultData.videoUrl} controls autoPlay loop muted playsInline className="w-full h-full object-contain rounded-lg shadow-2xl" />
                  )}
                  {type === 'text-to-speech' && (
                    <div className="w-full max-w-xl bg-[#0A0A0B] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4 w-full">
                        <button onClick={() => {
                          const audio = document.getElementById('audio-player') as HTMLAudioElement;
                           if(audio.paused) audio.play(); else audio.pause();
                        }} className="w-14 h-14 shrink-0 bg-[#D4AF37] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                        <div className="flex-1 h-12 bg-[#121218] rounded-lg overflow-hidden flex items-center px-4 gap-1 relative border border-white/5">
                           {/* Fake Waveform */}
                           {Array.from({length: 40}).map((_, i) => (
                             <div key={i} className="flex-1 bg-[#D4AF37]/40 rounded-full" style={{height: `${Math.max(10, Math.random() * 100)}%`}}></div>
                           ))}
                           <audio id="audio-player" src={resultData.data?.audioUrl || resultData.audioUrl} className="hidden" />
                        </div>
                      </div>
                      <button onClick={() => {
                          const a = document.createElement('a');
                          a.href = resultData.data?.audioUrl || resultData.audioUrl;
                          a.download = 'vedagarbha-voice.mp3';
                          a.click();
                      }} className="text-sm font-semibold text-[#A1A1A6] hover:text-[#D4AF37] border border-white/10 px-8 py-2.5 rounded-full hover:bg-white/5 transition-colors flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download Audio
                      </button>
                    </div>
                  )}
                </div>
              ) : isGenerating ? (
                <div className="w-full max-w-md flex flex-col items-center gap-6 px-4">
                  <div className="text-6xl bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_20px_rgba(245,217,122,0.6)]">✨</div>
                  <div className="w-full flex justify-between text-sm text-[#D4AF37] font-medium uppercase tracking-widest">
                    <span>Synthesizing...</span>
                    <span>{loadingProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0B0B0F] rounded-full overflow-hidden shadow-inner flex justify-start border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] transition-all duration-200 ease-out shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#6E6E73] flex flex-col items-center gap-4 transition-opacity">
                  <div className={`text-6xl opacity-30 bg-gradient-to-br from-[#D4AF37] to-[#F5D97A] text-transparent bg-clip-text grayscale`}>✨</div>
                  <p className="font-medium">
                    {type === 'text-to-speech' ? "Your generated voice will appear here" : "Your cinematic creation will appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GeneratePage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0B0B0F] text-white flex items-center justify-center">Loading...</div>}>
      <GeneratePageContent type={params.type} />
    </Suspense>
  );
}
