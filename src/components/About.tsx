import { motion } from 'motion/react';
import React from 'react';
import { useStore } from '../lib/store';
import { Star, Briefcase, Users, Globe } from 'lucide-react';

function RetroButton({ icon }: { icon: string }) {
  return (
    <button className="w-5 h-5 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 flex items-center justify-center active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white">
      <span className="font-pixel text-[12px] text-black leading-none font-bold" style={{ transform: icon === '□' ? 'scale(1.2)' : 'none' }}>{icon}</span>
    </button>
  );
}

function RetroWindow({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black p-[3px] flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,0.5)] ${className}`}>
      {/* Title Bar */}
      <div className="bg-[#cc0000] flex justify-between items-center px-1 py-1 mb-[3px]">
        <span className="text-white font-pixel text-xl leading-none tracking-wide ml-1">{title}</span>
        <div className="flex gap-1">
          <RetroButton icon="_" />
          <RetroButton icon="□" />
          <RetroButton icon="X" />
        </div>
      </div>
      {/* Content */}
      <div className="bg-white border-t-2 border-l-2 border-gray-600 border-b-2 border-r-2 border-white flex-1 relative mt-[1px]">
        {children}
        
        {/* Scrollbars (Visual only) */}
        <div className="absolute right-0 top-0 bottom-4 w-5 bg-[#dfdfdf] border-l-2 border-gray-400 flex flex-col justify-between">
           <div className="h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[8px] text-black">▲</div>
           <div className="flex-1 px-[2px] py-1"><div className="w-full h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600"></div></div>
           <div className="h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[8px] text-black transform rotate-180">▲</div>
        </div>
        <div className="absolute left-0 right-5 bottom-0 h-5 bg-[#dfdfdf] border-t-2 border-gray-400 flex justify-between">
           <div className="w-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[8px] text-black transform -rotate-90">▲</div>
           <div className="flex-1 py-[2px] px-1"><div className="w-20 h-full bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600"></div></div>
           <div className="w-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center text-[8px] text-black transform rotate-90">▲</div>
        </div>
        <div className="absolute right-0 bottom-0 w-5 h-5 bg-[#c0c0c0] border-t-2 border-l-2 border-white overflow-hidden">
           {/* Resize grip lines */}
           <div className="absolute w-[1px] h-8 bg-gray-500 origin-top-left -rotate-45 left-[12px] top-0 shadow-[1px_0_0_white]"></div>
           <div className="absolute w-[1px] h-8 bg-gray-500 origin-top-left -rotate-45 left-[8px] top-0 shadow-[1px_0_0_white]"></div>
           <div className="absolute w-[1px] h-8 bg-gray-500 origin-top-left -rotate-45 left-[4px] top-0 shadow-[1px_0_0_white]"></div>
        </div>
      </div>
    </div>
  )
}

function PixelCursor() {
  return (
    <svg 
      className="w-8 h-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)] select-none" 
      viewBox="0 0 16 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Classic Retro Windows Mouse Pointer Arrow */}
      <polygon 
        points="0,0 0,17 4.5,12.5 7.5,19 10,18 7,11.5 12.5,11.5" 
        fill="#FFFFFF" 
        stroke="#000000" 
        strokeWidth="1.8" 
        strokeLinejoin="miter" 
      />
    </svg>
  );
}

export default function About() {
  const { settings } = useStore();

  return (
    <section id="about" className="py-28 relative w-full overflow-hidden" 
      style={{ 
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)
        `,
        backgroundColor: '#7A0000',
        backgroundSize: '4px 4px'
      }}>
      
      <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-0"></div>

      {/* Top Smooth Blend from Testimonials */}
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-36 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent z-10 pointer-events-none" />

      {/* Bottom Smooth Blend into Contact */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 bg-gradient-to-b from-transparent via-[#050505]/70 to-[#050505] z-10 pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-4 relative z-20 flex flex-col md:flex-row gap-10 md:gap-6 items-stretch justify-center">
        
        {/* Main Info Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-[60%] flex flex-col mb-4 md:mb-0"
        >
          <RetroWindow title="Notepad.exe" className="h-auto min-h-[480px] md:h-[550px]">
            <div className="p-4 pr-8 pb-10 h-full bg-white text-black font-pixel overflow-y-auto">
              <div className="inline-block bg-[#cc0000] text-white px-1.5 py-0 mb-6 border border-white outline outline-1 outline-[#cc0000]">
                 <span className="text-3xl font-bold tracking-wide">{settings.aboutSubtitle || 'Who is this guy?!?'}</span>
              </div>
              {settings.aboutText ? (
                settings.aboutText.split('\n').filter(p => p.trim()).map((para, i, arr) => (
                  <p key={i} className={`text-2xl leading-tight ${i < arr.length - 1 ? 'mb-5' : ''}`}>
                    {para}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-2xl leading-tight mb-5">
                    Hey, what's up? My name is Seyam and I've been working as a video editor for almost two years.
                  </p>
                  <p className="text-2xl leading-tight mb-5">
                    My focus is always to deliver engaging videos, with rhythm, narrative and identity, ensuring that each project has quality and retention.
                  </p>
                  <p className="text-2xl leading-tight">
                    I seek to transform ideas into content that really grabs attention and generates results.
                  </p>
                </>
              )}

              {/* Blinking typing cursor */}
              <div className="inline-block w-[10px] h-6 bg-black ml-1 animate-[blink_1s_infinite]"></div>
            </div>
            {/* The classic retro mouse pointer cursor */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 pointer-events-none">
                <PixelCursor />
            </div>
          </RetroWindow>
        </motion.div>

        {/* Right Column: Image and Programs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-[40%] flex flex-col gap-6 h-auto md:h-[550px]"
        >
          {/* Photo Window */}
          <RetroWindow title="viewer.exe" className="h-[380px] md:h-auto md:flex-grow md:min-h-0">
             <div className="p-2 pr-6 pb-6 h-full bg-gray-200">
               <div className="w-full h-full border-t-2 border-l-2 border-gray-600 border-b-2 border-r-2 border-white overflow-hidden bg-[#111] flex items-center justify-center">
                 {settings.aboutPhotoUrl ? (
                   <img 
                     src={settings.aboutPhotoUrl} 
                     alt="Seyam Munshi" 
                     className="w-full h-full object-cover grayscale mix-blend-luminosity brightness-90 contrast-125"
                   />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-[#141414] text-white p-6 text-center select-none">
                     <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-3">
                       <span className="text-white text-xl font-bold font-sans">SM</span>
                     </div>
                     <span className="text-lg font-bold tracking-tight text-white font-sans">SEYAM MUNSHI</span>
                     <span className="text-[11px] text-gray-400 font-sans uppercase tracking-widest mt-1">Video Editor</span>
                   </div>
                 )}
               </div>
             </div>
          </RetroWindow>

          {/* Programs Window */}
          <RetroWindow title="Programs" className="h-[200px] shrink-0">
            <div className="p-3 pr-6 pb-6 h-full bg-white text-black font-pixel flex flex-row items-center justify-center gap-8">
               {/* Premiere Pro Retro Icon */}
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-[#3B3B98] border-[3px] border-t-[#8C8CFF] border-l-[#8C8CFF] border-b-black border-r-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                   <span className="text-[#8C8CFF] text-3xl font-bold font-sans tracking-tighter" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>Pr</span>
                 </div>
                 <span className="mt-2 text-md font-bold text-center leading-tight">Premiere<br/>Pro</span>
               </div>
               
               {/* After Effects Retro Icon */}
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-[#3B3B98] border-[3px] border-t-[#8C8CFF] border-l-[#8C8CFF] border-b-black border-r-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                   <span className="text-[#8C8CFF] text-3xl font-bold font-sans tracking-tighter" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>Ae</span>
                 </div>
                 <span className="mt-2 text-md font-bold text-center leading-tight">After<br/>Effects</span>
               </div>
            </div>
          </RetroWindow>
        </motion.div>

      </div>

      {/* Modern Stats Section below */}
      <div className="max-w-[1000px] mx-auto px-4 mt-20 relative z-10 w-full mb-10 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Card 1 */}
          <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 rounded-[1.25rem] p-6 flex flex-row items-center gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-[#1a1a1a]/90 transition-colors">
             <div className="w-14 h-14 rounded-full border border-[#ff4444]/30 bg-[#2a1717] flex items-center justify-center shrink-0">
                <Star className="text-[#ff4444] w-6 h-6" />
             </div>
             <div className="flex flex-col">
                <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">{settings.aboutStat1Num || '2+'}</span>
                <span className="text-gray-400 text-[11px] md:text-xs font-semibold tracking-widest mt-1 uppercase">{settings.aboutStat1Text || 'Years Experience'}</span>
             </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 rounded-[1.25rem] p-6 flex flex-row items-center gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-[#1a1a1a]/90 transition-colors">
             <div className="w-14 h-14 rounded-full border border-white/10 bg-[#222222] flex items-center justify-center shrink-0">
                <Briefcase className="text-gray-300 w-6 h-6" />
             </div>
             <div className="flex flex-col">
                <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">{settings.aboutStat2Num || '100+'}</span>
                <span className="text-gray-400 text-[11px] md:text-xs font-semibold tracking-widest mt-1 uppercase">{settings.aboutStat2Text || 'Projects Completed'}</span>
             </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 rounded-[1.25rem] p-6 flex flex-row items-center gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-[#1a1a1a]/90 transition-colors">
             <div className="w-14 h-14 rounded-full border border-white/10 bg-[#222222] flex items-center justify-center shrink-0">
                <Users className="text-gray-300 w-6 h-6" />
             </div>
             <div className="flex flex-col">
                <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">{settings.aboutStat3Num || '18+'}</span>
                <span className="text-gray-400 text-[11px] md:text-xs font-semibold tracking-widest mt-1 uppercase">{settings.aboutStat3Text || 'Happy Clients'}</span>
             </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 rounded-[1.25rem] p-6 flex flex-row items-center gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-[#1a1a1a]/90 transition-colors">
             <div className="w-14 h-14 rounded-full border border-white/10 bg-[#222222] flex items-center justify-center shrink-0">
                <Globe className="text-gray-300 w-6 h-6" />
             </div>
             <div className="flex flex-col">
                <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">{settings.aboutStat4Num || '5+'}</span>
                <span className="text-gray-400 text-[11px] md:text-xs font-semibold tracking-widest mt-1 uppercase">{settings.aboutStat4Text || 'Countries Worked'}</span>
             </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

