"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { Download, Clock, Video, Image as ImageIcon, Mic, LayoutGrid, List } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: string;
  resultUrl: string;
  prompt: string;
  cost: number;
  timestamp: string;
}
import { useAuth } from '@/lib/contexts/AuthContext';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.history) {
      // Create a shallow copy to sort without mutating state directly
      const parsed = [...user.history];
      parsed.sort((a: any, b: any) => new Date(b.timestamp || Date.now()).getTime() - new Date(a.timestamp || Date.now()).getTime());
      setHistory(parsed);
    }
  }, [user]);

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'video') return item.type.includes('video');
    if (filter === 'image') return item.type.includes('image');
    if (filter === 'audio') return item.type.includes('speech');
    return true;
  });

  const getIcon = (type: string) => {
    if (type.includes('video')) return <Video size={16} className="text-[#D4AF37]" />;
    if (type.includes('image')) return <ImageIcon size={16} className="text-[#32D74B]" />;
    if (type.includes('speech')) return <Mic size={16} className="text-[#0A84FF]" />;
    return <Clock size={16} />;
  };

  const getRelativeTime = (dateString: string) => {
    const time = new Date(dateString).getTime();
    if (isNaN(time)) return "Just now";
    const min = Math.floor((Date.now() - time) / 60000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleDownload = (url: string, type: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `vedagarbha-generation-${Date.now()}.${type.includes('video') ? 'mp4' : type.includes('speech') ? 'mp3' : 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-[100px] pb-24 max-w-[1440px] mx-auto px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-white to-[#A1A1A6] text-transparent bg-clip-text">Generation History</h1>
            <p className="text-[#A1A1A6] text-lg">Manage, review, and download your past AI creations.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-[#121218] rounded-lg p-1 border border-white/5">
              {['all', 'video', 'image', 'audio'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white/10 text-white shadow-sm' : 'text-[#A1A1A6] hover:text-white hover:bg-white/5'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <div className="flex bg-[#121218] rounded-lg p-1 border border-white/5 hidden sm:flex">
               <button onClick={() => setView('grid')} className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-[#A1A1A6] hover:text-white'}`}>
                 <LayoutGrid size={18} />
               </button>
               <button onClick={() => setView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-[#A1A1A6] hover:text-white'}`}>
                 <List size={18} />
               </button>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-32 bg-[#121218]/40 border border-white/5 rounded-3xl backdrop-blur-md">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={32} className="text-[#A1A1A6]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No generations found</h3>
            <p className="text-[#A1A1A6] mb-8">You haven't generated any {filter !== 'all' ? filter : ''} content yet.</p>
            <button 
              onClick={() => window.location.href = '/generate/text-to-video'}
              className="bg-[#D4AF37] hover:bg-[#F5D97A] text-black font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Start Generating
            </button>
          </div>
        ) : (
          <div className={view === 'grid' ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className={`bg-[#121218] border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 group hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] flex ${view === 'list' ? 'flex-row h-32' : 'flex-col'}`}
              >
                {/* Media Preview Area */}
                <div className={`relative bg-black ${view === 'list' ? 'w-48 h-full shrink-0 border-r border-white/5' : 'aspect-video w-full border-b border-white/5'}`}>
                  {item.type.includes('speech') ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A84FF]/20 to-black">
                      <Mic size={32} className="text-[#0A84FF]/60" />
                    </div>
                  ) : item.type.includes('video') ? (
                    <video src={item.resultUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <img src={item.resultUrl} alt="Generated" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                  
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border border-white/10 text-white/80">
                     {getIcon(item.type)} {item.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-sm text-[#A1A1A6] line-clamp-2 md:line-clamp-3 leading-relaxed group-hover:text-white/90 transition-colors">
                      "{item.prompt}"
                    </p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#6E6E73] font-medium uppercase tracking-wider">
                        {getRelativeTime(item.timestamp)}
                      </span>
                      <span className="text-xs text-[#D4AF37] font-semibold">{item.cost} Credits</span>
                    </div>
                    
                    <button 
                      onClick={() => handleDownload(item.resultUrl, item.type)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all shadow-sm"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
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
