"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useRouter } from 'next/navigation';
import { Copy, Flame, Search, ArrowRight } from 'lucide-react';

const CATEGORIES = ["All", "Cinematic Videos", "Anime Style", "Fantasy Worlds", "AI Portraits", "Product Ads", "Social Media Reels"];

const PROMPTS = [
  { id: 1, title: "Neon City Drive", text: "Cinematic drone shot flying over a futuristic neon city at night, ultra realistic, 4K", category: "Cinematic Videos", type: "text-to-video", trending: true, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: "Epic Fantasy Dragon", text: "Epic fantasy dragon flying above snowy mountains, cinematic lighting, dramatic clouds", category: "Fantasy Worlds", type: "text-to-image", trending: true, image: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: "Rainy Tokyo Walk", text: "Anime girl walking in rainy Tokyo street with neon lights, cinematic atmosphere", category: "Anime Style", type: "text-to-video", trending: true, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: "Luxury Perfume Ad", text: "Luxury product advertisement with golden lighting and slow motion, shallow depth of field, 8k", category: "Product Ads", type: "text-to-video", trending: true, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: "Cyberpunk Portrait", text: "Close up portrait of a cyberpunk hacker with neon reflections in their eyes, hyper-detailed", category: "AI Portraits", type: "text-to-image", trending: false, image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: "Viral TikTok Dance", text: "High energy transition video suited for social media, vibrant colors, dynamic motion", category: "Social Media Reels", type: "text-to-video", trending: false, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80' },
  { id: 7, title: "Ancient Castle Ruins", text: "Overgrown ancient castle ruins in a misty forest, god rays shining through trees", category: "Fantasy Worlds", type: "text-to-image", trending: false, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { id: 8, title: "Sports Car Chase", text: "High speed sports car chase through a desert highway, motion blur, cinematic 8k", category: "Cinematic Videos", type: "text-to-video", trending: false, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80' },
];

export default function PromptLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleUsePrompt = (promptText: string, type: string) => {
    // Navigate to generator with prompt in query
    router.push(`/generate/${type}?prompt=${encodeURIComponent(promptText)}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: show small toast here if desired
  };

  const filteredPrompts = PROMPTS.filter(p => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const trendingPrompts = PROMPTS.filter(p => p.trending);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-[100px] pb-24 max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] text-transparent bg-clip-text">Prompt Library</h1>
            <p className="text-[#A1A1A6] text-lg max-w-[600px]">Discover and use ready-made, high-quality prompts to generate stunning AI content instantly.</p>
          </div>
          
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search prompts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        </div>

        {/* Trending Section */}
        {activeCategory === "All" && !searchQuery && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Flame className="text-[#FF453A]" /> Trending Prompts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingPrompts.map(prompt => (
                <div key={prompt.id} className="bg-[#121218]/80 backdrop-blur-md border border-white/5 hover:border-[#D4AF37]/50 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] relative overflow-hidden h-[340px]">
                  {/* Background Image with Gradient Overlay */}
                  <div className="absolute inset-0 w-full h-full z-0">
                    <img src={prompt.image} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-[#121218]/90 to-transparent"></div>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white/20 z-20 hover:text-white" onClick={() => handleCopy(prompt.text)}>
                    <Copy size={14} className="text-gray-300" />
                  </div>
                  
                  <div className="p-6 relative z-10 flex-1 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[10px] uppercase tracking-wider font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30 backdrop-blur-sm">{prompt.category}</span>
                       <span className="text-[10px] uppercase tracking-wider font-bold bg-black/40 text-gray-300 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">{prompt.type.split('-')[2]}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{prompt.title}</h3>
                    <p className="text-sm text-[#A1A1A6] line-clamp-3 leading-relaxed drop-shadow-md pb-4">"{prompt.text}"</p>
                  
                    <button 
                      onClick={() => handleUsePrompt(prompt.text, prompt.type)}
                      className="w-full py-2.5 rounded-lg bg-black/50 backdrop-blur-md text-white border border-white/20 font-medium group-hover:border-[#D4AF37] group-hover:text-[#F5D97A] transition-all flex items-center justify-center gap-2 mt-auto"
                    >
                      Use Prompt <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories & Filtered Grid */}
        <section>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[#121218] text-[#A1A1A6] hover:text-white hover:bg-white/10 border border-white/5'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.length > 0 ? filteredPrompts.map(prompt => (
              <div key={prompt.id} className="bg-[#121218]/80 border border-white/5 hover:border-white/20 rounded-2xl flex flex-col justify-between group transition-all duration-300 overflow-hidden relative h-[320px]">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full z-0">
                  <img src={prompt.image} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-20 group-hover:opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-[#121218]/95 to-transparent"></div>
                </div>

                <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-black/50 text-gray-300 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">{prompt.category}</span>
                      <button onClick={() => handleCopy(prompt.text)} className="p-1.5 rounded-md hover:bg-white/20 bg-black/30 backdrop-blur-sm text-gray-400 hover:text-white transition-colors border border-white/5">
                        <Copy size={16} />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{prompt.title}</h3>
                    <p className="text-sm text-[#A1A1A6] leading-relaxed line-clamp-4">"{prompt.text}"</p>
                  </div>
                  
                  <button 
                    onClick={() => handleUsePrompt(prompt.text, prompt.type)}
                    className="mt-6 w-max text-sm underline-offset-4 font-semibold text-[#D4AF37] hover:text-[#F5D97A] hover:underline transition-all flex items-center gap-1"
                  >
                    Use Prompt <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-[#A1A1A6] text-lg">No prompts found for "{searchQuery}" in {activeCategory}.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
