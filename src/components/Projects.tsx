import { motion } from 'motion/react';
import { Eye, Lock, Mic, Volume2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { settings } = useStore();
  const projects = settings.projects || [];

  const folderLabels = ["TALKING HEAD", "PODCAST", "VLOG", "DOCUMENTARY", "GAMING", "REELS"];

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  };

  return (
    <section id="work" className="min-h-screen py-12 md:py-16 relative z-10 bg-[#F2ECE1] overflow-hidden flex flex-col justify-center">
      {/* 70s Graphic Design Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Noise Texture */}
        <svg className="absolute w-0 h-0">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
          </filter>
        </svg>
        <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ filter: 'url(#noiseFilter)' }}></div>

        {/* Geometric Shapes */}
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-[#E25C3D] rounded-full mix-blend-multiply opacity-80 blur-[2px]"></div>
        <div className="absolute top-[60%] -right-[15%] w-[800px] h-[800px] bg-[#3B7B61] rounded-full mix-blend-multiply opacity-70 blur-[4px]"></div>
        <div className="absolute top-[20%] right-[10%] w-48 h-48 border-[24px] border-[#DE9033] rounded-full opacity-60"></div>
        <div className="absolute top-[50%] left-[5%] w-40 h-80 bg-[#D3AF36] rounded-t-full opacity-60 mix-blend-multiply -rotate-12 transform"></div>
        
        {/* Retro Halftone Dots overlapping */}
        <div 
          className="absolute right-0 top-0 w-1/2 h-full opacity-[0.25] mix-blend-multiply"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #222 2px, transparent 2px)',
            backgroundSize: '16px 16px',
            WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
            maskImage: 'linear-gradient(to left, black, transparent)'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20 flex flex-col items-center">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative inline-block mb-12 md:mb-16 text-center"
        >
          {/* Retro offset shadows */}
          <h2 className="relative text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter uppercase font-display text-[#1F1F1E]">
            <span className="absolute -left-[5px] -top-[5px] text-[#E25C3D] z-[-1]">My art</span>
            <span className="absolute -left-[2.5px] -top-[2.5px] text-[#D3AF36] z-[-1]">My art</span>
            My art
          </h2>
          <div className="w-24 h-2 bg-transparent mx-auto mt-6 rounded overflow-hidden flex shadow-sm">
            <div className="w-1/3 h-full bg-[#E25C3D]"></div>
            <div className="w-1/3 h-full bg-[#D3AF36]"></div>
            <div className="w-1/3 h-full bg-[#3B7B61]"></div>
          </div>
        </motion.div>

        {/* Folders Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-x-8 md:gap-y-12 w-full lg:px-8 mx-auto max-w-[1240px]">
          {Array.from(new Set(projects.map(p => (p.category || 'NEW').toUpperCase()))).map((categoryName: any, idx) => {
            const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'));
            // Find first project in this category to act as representative if needed
            const categoryProjects = projects.filter(p => (p.category || 'NEW').toUpperCase() === categoryName);
            const representProject = categoryProjects[0] || {};
            
            return (
              <Link to={`/category/${categorySlug}`} key={categorySlug}>
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="relative w-[280px] h-[200px] group cursor-pointer"
                >
              {/* Back Folder Vector SVG */}
              <svg width="280" height="200" className="absolute bottom-0 left-0 z-0 transition-transform duration-300 group-hover:scale-[1.02] origin-bottom opacity-95 shadow-xl" style={{ filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.3))' }}>
                  <path 
                      d="M 5 30 
                         Q 5 20 15 20 
                         L 85 20 
                         Q 95 20 100 30 
                         L 265 30 
                         Q 275 30 275 40 
                         L 275 185 
                         Q 275 195 265 195 
                         L 15 195 
                         Q 5 195 5 185 
                         Z"
                      fill="#C9987A" stroke="#A86E4B" strokeWidth="1.5"
                  />
              </svg>

              {/* Inner Paper with Content */}
              <div className="absolute left-[18px] right-[18px] top-[30px] h-[140px] bg-[#FEF4CE] border border-[#DECF96] shadow-inner transform -rotate-[2deg] group-hover:-translate-y-9 group-hover:-rotate-[1deg] group-hover:scale-105 transition-all duration-300 z-10 flex flex-col pointer-events-none drop-shadow-sm">
                 {/* Number */}
                 <div className="absolute top-2 right-3 font-serif font-bold text-2xl md:text-[28px] text-[#A86E4B] opacity-80 leading-none italic">
                   {idx + 1}
                 </div>
                 {/* Center Content */}
                 <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 text-center mt-3">
                   <h3 className="font-serif italic font-bold text-[22px] md:text-[24px] leading-tight text-[#462F24]">
                     {toTitleCase(categoryName)}
                   </h3>
                   <p className="text-[#A86E4B] font-sans text-[10px] font-bold tracking-widest mt-2 uppercase opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                     {categoryProjects.length} {categoryProjects.length === 1 ? 'Video' : 'Videos'}
                   </p>
                 </div>
              </div>

              {/* Front Folder Flap Box */}
               <div 
                 className="absolute bottom-1.5 left-1.5 right-1.5 h-[150px] bg-[#EFD29F] rounded-[6px] border-[1.5px] border-[#BCA872] shadow-[-2px_-4px_12px_rgba(0,0,0,0.2)] z-20 transition-transform duration-300 origin-bottom group-hover:scale-[1.01]" 
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[6px]"></div>

                  {/* Folder Label Sticker */}
                  <div className="absolute right-4 top-4 bg-[#F5F2EB] py-1 px-3 border border-[#BCA872] transform rotate-[-2deg] shadow-sm z-10 flex items-center justify-center pointer-events-none">
                    <span className="font-sans text-[11px] uppercase tracking-widest text-[#462F24] font-bold opacity-80">
                       {categoryName}
                    </span>
                  </div>

                  {/* Zipper Logic */}
                  <div className="absolute left-5 top-5 bottom-0 w-5 flex flex-col items-center z-30 transition-transform duration-500 delay-75 group-hover:-translate-y-1">
                     <div className="flex flex-col gap-[3px] w-[85%] h-[80%] pt-1 items-center">
                        {Array.from({length: 16}).map((_, i) => (
                           <div key={i} className="w-full h-1.5 bg-[#C08B5D] rounded-sm transform -skew-y-[20deg] shadow-[0_1px_1px_rgba(0,0,0,0.2)] shrink-0"></div>
                        ))}
                     </div>
                     {/* Pull tab */}
                     <div className="absolute top-[80%] -left-[3px] w-[26px] h-[34px] bg-[#EFD29F] border-[3px] border-[#A86E4B] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.2)] z-30 flex flex-col items-center justify-center p-[2px] transition-all duration-[800ms] group-hover:translate-y-3 origin-top group-hover:-rotate-6 hover:cursor-grab">
                        <div className="w-[8px] h-full rounded border-x border-[#A86E4B]/50 bg-[#C08B5D]/20"></div>
                        <div className="w-[12px] h-[6px] rounded-full border border-[#A86E4B] absolute -top-2 bg-[#EFD29F]"></div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </Link>
          );
        })}
        </div>
      </div>
    </section>
  );
}
