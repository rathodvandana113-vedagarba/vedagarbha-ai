"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { Copy, Flame, Search, ArrowRight, Video, Image, Mic, Sparkles, Filter, Check } from 'lucide-react';

const CATEGORIES = ["All", "Cinematic Videos", "Text to Speech", "Text to Image", "Anime Style", "Fantasy Worlds", "AI Portraits", "Product Ads", "Social Media Reels", "Nature & Landscape", "Sci-Fi", "Horror & Dark", "Architecture", "Food & Cooking", "Fashion", "Sports & Action"];

type PromptType = "text-to-video" | "text-to-image" | "text-to-speech";

interface Prompt {
  id: number;
  title: string;
  text: string;
  category: string;
  type: PromptType;
  trending: boolean;
  image: string;
}

const UNSPLASH = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const PROMPTS: Prompt[] = [
  { id:1, title:"Neon City Drive", text:"Cinematic drone shot flying over a futuristic neon city at night, ultra realistic, 4K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1555680202-c86f0e12f086") },
  { id:2, title:"Sports Car Chase", text:"High speed sports car chase through a desert highway, motion blur, cinematic 8K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1492144534655-ae79c964c9d7") },
  { id:3, title:"Ocean Sunrise", text:"Time-lapse of a golden sunrise over calm ocean waves, aerial view, vibrant colors, 4K", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1507525428034-b723cf961d3e") },
  { id:4, title:"Waterfall Mist", text:"Majestic waterfall crashing into a turquoise lagoon, slow motion, ultra HD, cinematic", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1433086966358-54859d0ed716") },
  { id:5, title:"City Time-Lapse", text:"Bustling city time-lapse from golden hour to midnight, lights streak across streets, 4K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1477959858617-67f85cf4f1df") },
  { id:6, title:"Cyberpunk Market", text:"Close up of a neon-lit futuristic street food market in Tokyo, steam rising, crowded, cinematic", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1506744038136-46273834b3fb") },
  { id:7, title:"Galaxy Journey", text:"Epic journey through a colorful nebula, stardust, cinematic space camera movement, 8K", category:"Sci-Fi", type:"text-to-video", trending:true, image:UNSPLASH("photo-1464802686167-b939a67e06a1") },
  { id:8, title:"Samurai Duel", text:"Two samurai facing off in a bamboo forest during a snowstorm, cinematic slow motion, 4K", category:"Anime Style", type:"text-to-video", trending:true, image:UNSPLASH("photo-1514516322520-299289525612") },
  { id:9, title:"Futuristic Lab", text:"High-tech laboratory with glowing holographic displays and robot arms, clean white aesthetic", category:"Sci-Fi", type:"text-to-image", trending:false, image:UNSPLASH("photo-1485827404703-89b55fcc595e") },
  { id:10, title:"Cyberpunk Warrior", text:"Portrait of a futuristic warrior with cybernetic implants, glowing tattoos, urban background", category:"AI Portraits", type:"text-to-image", trending:true, image:UNSPLASH("photo-1542831371-29b0f74f9713") },
  { id:11, title:"Ancient Temple", text:"Grand ancient temple hidden in a jungle, rays of light cutting through vines, cinematic 8K", category:"Nature & Landscape", type:"text-to-image", trending:false, image:UNSPLASH("photo-1518709268805-4e9042af9f23") },
  { id:12, title:"Floating Islands", text:"Breathtaking landscape of floating islands with waterfalls falling into the clouds, fantasy art", category:"Fantasy Worlds", type:"text-to-image", trending:true, image:UNSPLASH("photo-1444723121867-7a241cacace9") },
  { id:13, title:"Coffee Pouring", text:"Cinematic commercial shot of coffee being poured into a mug, morning sun, steam, macro", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1495474472287-4d71bcdd2085") },
  { id:14, title:"Urban Fashion", text:"Dynamic shot of a model in futuristic streetwear walking through a subway station, slow motion", category:"Fashion", type:"text-to-video", trending:true, image:UNSPLASH("photo-1558618666-fcd25c85cd64") },
  { id:15, title:"Mountain Climber", text:"Heroic shot of a climber reaching the summit of a snowy mountain, dramatic sky, 8K", category:"Sports & Action", type:"text-to-image", trending:false, image:UNSPLASH("photo-1522163182402-834f871fd851") },
];

// ── additional speech prompts (IDs 16-500) ─────────────────────────────────
const scripts = [
  "Welcome to Vedagarbha AI. The platform that transforms your imagination into stunning visual content in seconds. Try it today.",
  "Hard work beats talent when talent doesn't work hard. Every single day is a new chance to improve. Take it.",
  "The only limit is the one you set yourself. Dream big, start small, but most importantly — start now.",
  "In this age of artificial intelligence, creativity is the most uniquely human skill we possess. Use it.",
  "Success is not the destination. It is the journey. Every step forward, no matter how small, is progress.",
  "Science is not only a discipline of reason but also one of romance and passion.",
  "The world's fastest growing companies all have one thing in common: they solve real problems.",
  "Nature always wears the colors of the spirit. Protect it, cherish it, and find peace within it.",
  "The future belongs to those who believe in the beauty of their dreams. Believe in yourself.",
];

const EXTRA_PROMPTS: Prompt[] = Array.from({ length: 485 }, (_, i) => {
  const id = 16 + i;
  const isSpeech = id % 3 === 0;
  const isVideo = id % 3 === 1;
  const script = scripts[i % scripts.length];
  const type: PromptType = isSpeech ? "text-to-speech" : (isVideo ? "text-to-video" : "text-to-image");
  
  const catMap: Record<string, string[]> = {
    "text-to-video": ["Cinematic Videos", "Anime Style", "Sports & Action", "Social Media Reels", "Nature & Landscape"],
    "text-to-image": ["Text to Image", "Fantasy Worlds", "AI Portraits", "Architecture", "Food & Cooking"],
    "text-to-speech": ["Text to Speech"]
  };
  
  const categories = catMap[type];
  const category = categories[i % categories.length];
  
  return {
    id,
    title: `${type === "text-to-speech" ? "Speech" : (type === "text-to-video" ? "Video" : "Image")} Prompt ${id}`,
    text: type === "text-to-speech" ? script : `A professional ${category.toLowerCase()} style creation featuring ${id % 2 === 0 ? "futuristic elements" : "natural beauty"}, highly detailed, 8K resolution.`,
    category,
    type,
    trending: id % 17 === 0,
    image: UNSPLASH(id % 2 === 0 ? "photo-1542831371-29b0f74f9713" : "photo-1464802686167-b939a67e06a1"),
  };
});

const ALL_PROMPTS: Prompt[] = [...PROMPTS, ...EXTRA_PROMPTS];

const TYPE_ICON: Record<PromptType, React.ReactNode> = {
  "text-to-video": <Video size={10} />,
  "text-to-image": <Image size={10} />,
  "text-to-speech": <Mic size={10} />,
};
const TYPE_LABEL: Record<PromptType, string> = {
  "text-to-video": "Video",
  "text-to-image": "Image",
  "text-to-speech": "Speech",
};

export default function PromptLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePType, setActivePType] = useState<"all"|PromptType>("all");
  const [copied, setCopied] = useState<number | null>(null);
  const router = useRouter();
  const { user, setAuthOpen } = useAuth();

  const handleUsePrompt = (promptText: string, type: PromptType) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const routeMap: Record<PromptType, string> = {
      "text-to-video": "text-to-video",
      "text-to-image": "text-to-image",
      "text-to-speech": "text-to-speech",
    };
    router.push(`/generate/${routeMap[type]}?prompt=${encodeURIComponent(promptText)}`);
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredPrompts = ALL_PROMPTS.filter(p => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (activePType !== "all" && p.type !== activePType) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const trendingPrompts = ALL_PROMPTS.filter(p => p.trending).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-[100px] pb-24 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Cinematic Header */}
        <div className="relative mb-16 p-8 md:p-12 rounded-[32px] overflow-hidden border border-white/5 bg-[#0B0B0F]/50 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B82F6]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-[700px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-4">
                <Sparkles size={12} /> EXPLORE AI POSSIBILITIES
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none">
                AI Prompt <span className="text-[#3B82F6]">Library</span>
              </h1>
              <p className="text-[#A1A1A6] text-lg md:text-xl leading-relaxed font-light">
                Unlock high-performance AI generation with over 500 professionally crafted prompts. 
                Optimized for cinematic quality, lifelike speech, and photorealistic imagery.
              </p>
            </div>
            
            <div className="w-full md:w-[400px]">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search 500+ prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-white focus:ring-4 focus:ring-white/10 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4 py-3 bg-[#0B0B0F]/40 backdrop-blur-md rounded-2xl border border-white/5">
           <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            <div className="p-1 bg-[#121218] rounded-xl border border-white/5 flex gap-1">
              {([["all","All"], ["text-to-video","Video"], ["text-to-image","Image"], ["text-to-speech","Speech"]] as [string, string][]).map(([val, label]) => (
                <button key={val} onClick={() => setActivePType(val as any)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activePType === val ? "bg-white text-black shadow-lg" : "text-[#A1A1A6] hover:text-white"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[#6E6E73] text-sm">
            <Filter size={14} />
            <span>Found <span className="text-white font-bold">{filteredPrompts.length}</span> matching prompts</span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-white text-black border-white" : "bg-white/5 text-[#A1A1A6] border-white/5 hover:bg-white/10 hover:border-white/10"}`}
            >{cat}</button>
          ))}
        </div>

        {/* Trending Section */}
        {activeCategory === "All" && !searchQuery && activePType === "all" && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
                <Flame className="text-[#FF453A]" /> TRENDING CREATIONS
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
              {trendingPrompts.map(prompt => (
                <div key={prompt.id} className="group relative bg-[#121218] rounded-[24px] overflow-hidden border border-white/5 hover:border-white/40 transition-all duration-500 hover:-translate-y-2 h-[340px] shadow-2xl">
                  <img src={prompt.image} alt={prompt.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/40 to-transparent" />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleCopy(prompt.id, prompt.text)} title="Copy Prompt" className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white hover:text-black transition-all">
                      {copied === prompt.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                   <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-white/10 backdrop-blur-md text-white px-2 py-1 rounded-md border border-white/10">{TYPE_LABEL[prompt.type]}</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#3B82F6] transition-colors">{prompt.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed italic mb-4 opacity-80">"{prompt.text}"</p>
                    <button onClick={() => handleUsePrompt(prompt.text, prompt.type)} className="w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.1)] hover:bg-[#E2E2E2]">
                      Use Prompt <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Prompts List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.length > 0 ? filteredPrompts.map(prompt => (
            <div key={prompt.id} className="group relative bg-[#0B0B0F]/60 backdrop-blur-sm rounded-[24px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 h-[280px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
               <div className="absolute top-4 right-4 z-20">
                <button onClick={() => handleCopy(prompt.id, prompt.text)} className="w-8 h-8 rounded-full bg-[#121218]/80 backdrop-blur-md border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                   {copied === prompt.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="p-6 flex flex-col h-full justify-between relative z-10">
                <div>
                  <div className="flex gap-2 mb-3 items-center">
                    <span className="text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/20">
                      {TYPE_ICON[prompt.type]} {TYPE_LABEL[prompt.type]}
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{prompt.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">{prompt.title}</h3>
                  <p className="text-[13px] text-[#8E8E93] leading-relaxed line-clamp-3 italic opacity-90">"{prompt.text}"</p>
                </div>
                
                <button onClick={() => handleUsePrompt(prompt.text, prompt.type)}
                  className="mt-4 flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#3B82F6] transition-all hover:translate-x-1 uppercase tracking-widest">
                  Generate Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center bg-[#121218]/30 rounded-[32px] border border-dashed border-white/10">
              <Sparkles size={48} className="mx-auto text-gray-700 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">No matching prompts</h3>
              <p className="text-[#A1A1A6]">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
