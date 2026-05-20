import { Play } from 'lucide-react';

export default function NLEInterface() {
  return (
    <div className="w-[1024px] h-[640px] bg-[#0f0f0f] rounded-lg overflow-hidden flex flex-col border border-white/10 select-none">
      {/* Screen Top Bar */}
      <div className="h-8 w-full bg-[#1a1a1a] flex items-center px-4 border-b border-white/5 space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>

      {/* Screen Content - Mock NLE Interface */}
      <div className="flex-1 p-8 flex flex-col gap-6 relative">
        <div className="flex justify-between items-end mb-2">
          <span className="font-display text-base tracking-widest text-brand-primary">CURRENT PROJECT</span>
          <div className="flex gap-6 text-xs text-white/40 tracking-wider font-mono">
            <span className="text-white">PROJECTS</span>
            <span className="text-white">TIMELINE</span>
            <span>COLOR</span>
            <span>AUDIO</span>
            <span>EXPORT</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-8 h-[240px]">
           <div className="flex flex-col justify-center">
             <h3 className="font-display text-5xl font-bold leading-none mb-4">BEYOND<br/>THE LIMITS</h3>
             <p className="text-sm text-white/50 max-w-[280px] leading-relaxed mb-6">A cinematic travel film about pushing boundaries and discovering yourself.</p>

             <button className="flex items-center justify-center gap-3 glass-panel w-fit px-6 py-3 rounded-full text-xs font-medium hover:bg-white/10 transition-colors z-10 cursor-pointer">
               <Play className="w-4 h-4 fill-white" />
               WATCH REEL
             </button>
           </div>
           
           <div className="relative rounded-xl overflow-hidden border border-white/10 group">
             <img src="https://images.unsplash.com/photo-1542382156909-9ae5a045952c?auto=format&fit=crop&q=80&w=1200" alt="Mountain cinematic" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
             
             {/* Playback controls overlay */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full">
               <div className="w-2 h-2 rounded-full bg-white/50"></div>
               <div className="w-2 h-2 rounded-full bg-white/50"></div>
               <Play className="w-4 h-4 fill-white" />
               <div className="w-2 h-2 rounded-full bg-white/50"></div>
               <div className="w-2 h-2 rounded-full bg-white/50"></div>
             </div>
           </div>
        </div>

        {/* Timeline Simulator */}
        <div className="mt-auto h-32 glass-panel rounded-lg flex flex-col p-3 gap-2 overflow-hidden relative border-t border-white/10">
          <div className="flex justify-between text-[10px] text-white/30 font-mono px-2">
            <span>00:00:00:00</span>
            <span>00:01:30:00</span>
            <span>00:03:00:00</span>
          </div>
          <div className="flex-1 flex gap-1 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-brand-primary shadow-[0_0_15px_rgba(139,92,246,1)] z-10">
               <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-sm bg-brand-primary"></div>
            </div>
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <div key={i} className="flex-1 h-full bg-white/5 rounded overflow-hidden relative opacity-80 hover:opacity-100 transition-opacity cursor-pointer border border-white/5">
                <img src={`https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=200&h=100&fit=crop&auto=format&sig=${i}`} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
          {/* Audio track mock */}
          <div className="h-4 flex gap-0.5 items-center px-1 opacity-50">
             {Array.from({length: 60}).map((_, i) => (
               <div key={i} className="flex-1 bg-brand-secondary/50 rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
