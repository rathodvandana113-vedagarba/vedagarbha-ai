"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { Download, Clock, Video, Image as ImageIcon, Mic, LayoutGrid, List, Trash2, ExternalLink, Sparkles, Filter, Search } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface HistoryItem {
  id: string;
  type: string;
  resultUrl: string;
  prompt: string;
  cost: number;
  timestamp: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.history) {
      const parsed = [...user.history];
      parsed.sort((a: any, b: any) => new Date(b.timestamp || Date.now()).getTime() - new Date(a.timestamp || Date.now()).getTime());
      setHistory(parsed);
    }
  }, [user]);

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'video' && item.type.includes('video')) ||
                         (filter === 'image' && item.type.includes('image')) ||
                         (filter === 'audio' && item.type.includes('speech'));
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    if (type.includes('video')) return <Video size={14} />;
    if (type.includes('image')) return <ImageIcon size={14} />;
    if (type.includes('speech')) return <Mic size={14} />;
    return <Clock size={14} />;
  };

  const getTypeLabel = (type: string) => {
    if (type.includes('video')) return 'Video';
    if (type.includes('image')) return 'Image';
    if (type.includes('speech')) return 'Speech';
    return 'Creation';
  };

  const getRelativeTime = (dateString: string) => {
    const time = new Date(dateString).getTime();
    if (isNaN(time)) return "Just now";
    const diff = (Date.now() - time) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleDownload = (url: string, type: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = "_blank";
    a.download = `vedagarbha-${Date.now()}.${type.includes('video') ? 'mp4' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-[100px] pb-24 max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Cinematic Header */}
        <div className="relative mb-12 p-10 rounded-[40px] overflow-hidden border border-white/5 bg-[#0B0B0F]/50 backdrop-blur-3xl shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3B82F6]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-[600px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black mb-4 uppercase tracking-widest">
                <Sparkles size={12} /> ARCHIVAL VAULT
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none">
                Your <span className="bg-gradient-to-r from-white to-[#3B82F6] text-transparent bg-clip-text">Generations</span>
              </h1>
              <p className="text-[#A1A1A6] text-lg leading-relaxed">
                A secure history of all your AI-powered visual and vocal creations. 
                Revisit, upscale, or download your best work anytime.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-[350px]">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-all" size={18} />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-[#3B82F6]/50 transition-all placeholder:text-gray-700 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-2 p-1.5 bg-[#121218] rounded-2xl border border-white/5">
            {['all', 'video', 'image', 'audio'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex p-1.5 bg-[#121218] rounded-2xl border border-white/5">
                <button onClick={() => setView('grid')} className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-600 hover:text-white'}`}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setView('list')} className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-600 hover:text-white'}`}>
                  <List size={18} />
                </button>
             </div>
             <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                <Filter size={14} className="text-[#3B82F6]" />
                <span><span className="text-white">{filteredHistory.length}</span> Records</span>
             </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-32 bg-[#0B0B0F]/50 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center text-gray-800">
              <Clock size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">The vault is empty</h3>
              <p className="text-gray-500 max-w-[300px] mx-auto">Either start generating new magic or adjust your search filters.</p>
            </div>
            <button onClick={() => window.location.href = '/generate/text-to-video'} className="mt-4 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-[#3B82F6] hover:text-white transition-all shadow-xl shadow-black/10 tracking-widest uppercase text-xs">Initialize Generation</button>
          </div>
        ) : (
          <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-4"}>
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className={`group relative bg-[#0B0B0F]/80 border border-white/5 rounded-[32px] overflow-hidden hover:border-white/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex ${view === 'list' ? 'flex-row h-[120px] items-center px-4' : 'flex-col'}`}
              >
                {/* Media Container */}
                <div className={`relative bg-black/40 ${view === 'list' ? 'w-[140px] h-[80px] rounded-2xl overflow-hidden shrink-0' : 'aspect-video w-full'}`}>
                   {item.type.includes('speech') ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#121218] to-black">
                      <Mic size={32} className="text-white/20" strokeWidth={3} />
                    </div>
                  ) : item.type.includes('video') ? (
                    <video src={item.resultUrl} loop muted autoPlay className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.resultUrl} alt="Result" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                    {getIcon(item.type)} {getTypeLabel(item.type)}
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                     <p className="text-sm text-gray-400 line-clamp-2 italic font-medium leading-relaxed group-hover:text-white transition-colors">
                      "{item.prompt}"
                    </p>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {getRelativeTime(item.timestamp)}
                      </span>
                      <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded-md bg-white/5 border border-white/10 w-fit">{item.cost} CREDITS</span>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleDownload(item.resultUrl, item.type)}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-transparent transition-all"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
