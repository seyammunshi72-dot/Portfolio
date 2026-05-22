import { motion } from 'motion/react';
import { useStore } from '../lib/store';

function PushPin({ className }: { className?: string }) {
  return (
    <div className={`absolute w-3 h-3 rounded-full bg-red-600 shadow-[2px_4px_4px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center border-2 border-red-800 ${className}`}>
      <div className="w-1 h-1 rounded-full bg-red-400 absolute top-[1px] left-[1px]"></div>
      <div className="w-[1px] h-3 bg-gray-400 absolute -bottom-2 -z-10 shadow-sm"></div>
    </div>
  );
}

function Tape({ className }: { className?: string }) {
  return (
    <div className={`absolute w-16 h-5 bg-[#e0d6b8]/80 shadow-sm backdrop-blur-sm z-20 mix-blend-multiply ${className}`}></div>
  );
}

export default function About() {
  const { settings } = useStore();

  return (
    <section id="about" className="relative w-full min-h-[100dvh] overflow-x-auto overflow-y-hidden bg-[#e6ddd0] flex items-center justify-start xl:justify-center font-sans"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")'
      }}
    >
      {/* Background vignette & texture */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.7)] z-0 pointer-events-none mix-blend-multiply transition-opacity"></div>

      {/* FIXED SCALED BOARD WRAPPER */}
      <div className="relative z-10 w-[1200px] h-[800px] shrink-0 mx-auto transition-transform mt-10 md:mt-0 lg:scale-100 md:scale-90 sm:scale-75 origin-center">
        
        {/* Red Strings SVG overlay */}
        <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" style={{ filter: 'drop-shadow(2px 4px 2px rgba(0,0,0,0.4))' }}>
          <line x1="50%" y1="32%" x2="28%" y2="38%" stroke="#cc0000" strokeWidth="2.5" />
          <line x1="50%" y1="32%" x2="32%" y2="58%" stroke="#cc0000" strokeWidth="2.5" />
          <line x1="50%" y1="32%" x2="75%" y2="45%" stroke="#cc0000" strokeWidth="2.5" />
          <line x1="50%" y1="32%" x2="72%" y2="72%" stroke="#cc0000" strokeWidth="2.5" />
        </svg>

        {/* Global Connection Pins aligned perfectly with strings */}
        <PushPin className="top-[32%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
        <PushPin className="top-[38%] left-[28%] -translate-x-1/2 -translate-y-1/2" />
        <PushPin className="top-[58%] left-[32%] -translate-x-1/2 -translate-y-1/2" />
        <PushPin className="top-[45%] left-[75%] -translate-x-1/2 -translate-y-1/2" />
        <PushPin className="top-[72%] left-[72%] -translate-x-1/2 -translate-y-1/2" />

        {/* Title Tape */}
        <motion.div 
          initial={{ opacity: 0, y: -20, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true }}
          className="absolute top-[12%] left-[50%] bg-[#d7ceb2] px-10 py-3 shadow-md z-10 mix-blend-multiply -translate-x-1/2 -translate-y-1/2 origin-center"
        >
          <div className="flex gap-4 items-baseline">
            <h2 className="font-handwriting text-5xl md:text-7xl text-black font-bold opacity-80" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.2)' }}>
              Portfolio
            </h2>
            <span className="font-handwriting text-2xl md:text-3xl text-red-700 opacity-60">2025</span>
          </div>
        </motion.div>

        {/* Case File Sticker */}
        <motion.div 
          initial={{ opacity: 0, x: -20, rotate: 2 }}
          whileInView={{ opacity: 1, x: 0, rotate: -2 }}
          viewport={{ once: true }}
          className="absolute top-[22%] left-[22%] bg-[#af3e3e] px-4 py-2 z-10 shadow-[2px_4px_6px_rgba(0,0,0,0.3)] transform -rotate-2 -translate-x-1/2 -translate-y-1/2 origin-center"
        >
          <div className="font-typewriter text-black font-bold text-sm leading-tight mix-blend-color-burn">
            Case File #114:<br/>The Video Editor
          </div>
        </motion.div>

        {/* Central Suspect Photo */}
        <motion.img 
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          src={settings.aboutPhotoUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"}
          alt="Profile"
          className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[260px] h-[340px] object-cover grayscale contrast-125 p-3 pb-12 bg-[#f0eae1] shadow-[5px_10px_20px_rgba(0,0,0,0.5)] z-10 border border-gray-300 pointer-events-none origin-center"
        />
        {/* Caption for central photo */}
        <div className="absolute top-[69%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[220px] text-center z-20 pointer-events-none transform -rotate-1 origin-center">
            <span className="font-handwriting text-xl text-black bg-[#f0eae1]/80 px-2 mix-blend-multiply border-b border-black/20 pb-0.5 whitespace-nowrap">"He is an Expert Editor."</span>
        </div>

        {/* Graphic Design */}
        <motion.div 
          initial={{ opacity: 0, x: -30, rotate: -15 }}
          whileInView={{ opacity: 1, x: 0, rotate: -5 }}
          viewport={{ once: true }}
          className="absolute top-[41%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 w-[220px] h-[60px] origin-center"
        >
           <div className="absolute inset-0 bg-[#e6e6e6] shadow-[2px_4px_8px_rgba(0,0,0,0.3)] transform -skew-x-2 -skew-y-1"></div>
           <Tape className="-top-2 -left-2 rotate-12 w-10" />
           <Tape className="-bottom-2 -right-2 -rotate-6 w-10" />
           <span className="relative font-handwriting text-4xl text-red-700 z-10 font-bold opacity-80 mix-blend-multiply whitespace-nowrap">Graphic Design</span>
        </motion.div>

        {/* Video Graphy Polaroid */}
        <motion.div 
          initial={{ opacity: 0, y: 30, rotate: 10 }}
          whileInView={{ opacity: 1, y: 0, rotate: 6 }}
          viewport={{ once: true }}
          className="absolute top-[63%] left-[32%] -translate-x-1/2 -translate-y-1/2 bg-[#dfc585] p-3 shadow-[4px_6px_10px_rgba(0,0,0,0.4)] z-10 w-[140px] origin-center"
        >
          <Tape className="-top-3 left-4 -rotate-6 w-12 bg-red-600/80 mix-blend-normal" />
          <span className="font-handwriting text-4xl leading-none text-black opacity-80 text-center block mix-blend-multiply font-bold">Video<br/>Graphy</span>
        </motion.div>

        {/* Work Thumbnail 1 */}
        <motion.div 
          initial={{ opacity: 0, rotate: -10 }}
          whileInView={{ opacity: 1, rotate: -8 }}
          viewport={{ once: true }}
          className="absolute top-[58%] left-[16%] -translate-x-1/2 -translate-y-1/2 bg-[#f0eae1] p-2 pb-8 shadow-[3px_5px_8px_rgba(0,0,0,0.4)] z-10 w-[120px] origin-center"
        >
          <Tape className="-top-2 left-2 rotate-12 w-8 bg-red-600/80 mix-blend-normal" />
          <div className="w-full h-[80px] bg-black overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-600 opacity-50 mix-blend-overlay"></div>
             <div className="w-full h-full flex items-center justify-center text-red-500 font-pixel text-xs tracking-widest bg-[#111]">WORKS</div>
          </div>
          <span className="absolute bottom-2 left-0 w-full text-center font-handwriting text-sm text-black opacity-80 leading-tight">this is one<br/>of his works</span>
        </motion.div>

        {/* Photo Graphy Torn Note */}
        <motion.div 
          initial={{ opacity: 0, y: 30, rotate: -15 }}
          whileInView={{ opacity: 1, y: 0, rotate: -12 }}
          viewport={{ once: true }}
          className="absolute top-[82%] left-[25%] -translate-x-1/2 -translate-y-1/2 bg-[#cdbea7] p-4 shadow-[4px_6px_10px_rgba(0,0,0,0.4)] z-10 w-[160px] h-[120px] origin-center"
          style={{ clipPath: 'polygon(0% 0%, 100% 5%, 95% 100%, 5% 95%)' }}
        >
          <span className="font-handwriting text-4xl leading-none text-black opacity-70 mix-blend-multiply block text-center mt-2 font-bold">Photo<br/>Graphy</span>
        </motion.div>

        {/* Work Thumbnail 2 */}
        <motion.div 
          initial={{ opacity: 0, rotate: 15 }}
          whileInView={{ opacity: 1, rotate: 12 }}
          viewport={{ once: true }}
          className="absolute top-[85%] left-[42%] -translate-x-1/2 -translate-y-1/2 bg-[#f0eae1] p-2 pb-8 shadow-[5px_8px_12px_rgba(0,0,0,0.5)] z-20 w-[140px] origin-center"
        >
          <Tape className="-top-2 left-10 -rotate-3 w-12 bg-red-600/70 mix-blend-normal" />
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200" className="w-full h-[90px] object-cover grayscale contrast-125" />
        </motion.div>

        {/* Observation Quote */}
        <motion.div 
          initial={{ opacity: 0, rotate: -5 }}
          whileInView={{ opacity: 1, rotate: -2 }}
          viewport={{ once: true }}
          className="absolute top-[82%] left-[62%] -translate-x-1/2 -translate-y-1/2 max-w-[220px] z-10 origin-center"
        >
          <p className="font-handwriting text-2xl text-red-700 leading-tight mix-blend-multiply font-bold opacity-80">
            "The last thing he said was, 'I will be an <span className="underline decoration-2">important</span> part of the world's progress.'"
          </p>
        </motion.div>

        {/* Illustration Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30, rotate: 10 }}
          whileInView={{ opacity: 1, x: 0, rotate: -6 }}
          viewport={{ once: true }}
          className="absolute top-[49%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-[#b89b6b] p-3 shadow-[4px_6px_10px_rgba(0,0,0,0.4)] z-10 w-[220px] origin-center"
        >
          <span className="font-handwriting text-4xl leading-none text-black opacity-80 mix-blend-multiply block text-center font-bold">Illustration</span>
        </motion.div>

        {/* Clue Text Area */}
        <motion.div 
          initial={{ opacity: 0, rotate: -10 }}
          whileInView={{ opacity: 1, rotate: -8 }}
          viewport={{ once: true }}
          className="absolute top-[32%] left-[78%] -translate-x-1/2 -translate-y-1/2 p-2 z-10 origin-center"
        >
          <span className="font-handwriting text-3xl text-red-600 leading-tight mix-blend-multiply font-bold opacity-70 underline decoration-red-400 text-center block">
            Where was<br/>he last seen?
          </span>
        </motion.div>

        {/* Find out about him torn piece */}
        <motion.div 
          initial={{ opacity: 0, rotate: 15 }}
          whileInView={{ opacity: 1, rotate: 8 }}
          viewport={{ once: true }}
          className="absolute top-[78%] left-[72%] -translate-x-1/2 -translate-y-1/2 bg-[#a88a5c] p-6 shadow-[5px_10px_15px_rgba(0,0,0,0.5)] z-10 w-[200px] h-[220px] origin-center"
          style={{ clipPath: 'polygon(5% 0%, 100% 10%, 90% 90%, 0% 100%)' }}
        >
          <span className="font-handwriting text-5xl leading-[1.1] text-black opacity-60 mix-blend-multiply block font-bold text-center mt-2">
            find<br/>out<br/>about<br/>him!
          </span>
        </motion.div>

      </div>
    </section>
  );
}

