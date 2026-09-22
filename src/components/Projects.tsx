import { motion } from 'motion/react';
import { Eye, Lock, Mic, Volume2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { settings } = useStore();
  const projects = settings.projects || [];

  const folderLabels = ["TALKING HEAD", "PODCAST", "VLOG", "DOCUMENTARY", "GAMING", "REELS"];
  const projectCategories = Array.from(new Set(projects.map(p => (p.category || '').toUpperCase().trim()).filter(Boolean)));
  const displayedCategories = projectCategories.length > 0 ? projectCategories : folderLabels;

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  };

  return (
    <section id="work" className="min-h-0 sm:min-h-screen pt-4 pb-16 sm:pt-8 sm:pb-14 md:py-16 relative z-10 bg-[#F2ECE1] overflow-hidden flex flex-col justify-start sm:justify-center">
      {/* 70s Graphic Design Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Noise Texture */}
        <svg className="absolute w-0 h-0">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
          </filter>
        </svg>
        <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.35] mix-blend-multiply" style={{ filter: 'url(#noiseFilter)' }}></div>

        {/* Geometric Shapes - Clean and subtle on mobile, bold on desktop */}
        <div className="absolute -top-12 -left-12 w-48 h-48 sm:w-[500px] sm:h-[500px] sm:-top-[10%] sm:-left-[10%] bg-[#E25C3D] rounded-full mix-blend-multiply opacity-25 sm:opacity-80 blur-[8px] sm:blur-[2px]"></div>
        <div className="absolute -bottom-10 -right-10 w-52 h-52 sm:w-[800px] sm:h-[800px] sm:top-[60%] sm:-right-[15%] bg-[#3B7B61] rounded-full mix-blend-multiply opacity-20 sm:opacity-70 blur-[8px] sm:blur-[4px]"></div>
        <div className="hidden sm:block sm:absolute sm:top-[20%] sm:right-[10%] sm:w-48 sm:h-48 sm:border-[24px] sm:border-[#DE9033] sm:rounded-full sm:opacity-60"></div>
        <div className="hidden sm:block sm:absolute sm:top-[50%] sm:left-[5%] sm:w-40 sm:h-80 sm:bg-[#D3AF36] sm:rounded-t-full sm:opacity-60 sm:mix-blend-multiply sm:-rotate-12 sm:transform"></div>
        
        {/* Retro Halftone Dots overlapping */}
        <div 
          className="absolute right-0 top-0 w-1/2 h-full opacity-[0.10] sm:opacity-[0.25] mix-blend-multiply"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #222 2px, transparent 2px)',
            backgroundSize: '16px 16px',
            WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
            maskImage: 'linear-gradient(to left, black, transparent)'
          }}
        ></div>

        {/* Bottom Smooth Blend: subtle on mobile to avoid darkening bottom folders */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 sm:h-44 md:h-56 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505] z-10 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-20 flex flex-col items-center w-full">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative inline-block mb-4 sm:mb-8 md:mb-16 text-center"
        >
          {/* Retro offset shadows */}
          <h2 className="relative text-3xl sm:text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter uppercase font-display text-[#1F1F1E]">
            <span className="absolute -left-[3px] -top-[3px] sm:-left-[5px] sm:-top-[5px] text-[#E25C3D] z-[-1]">My art</span>
            <span className="absolute -left-[1.5px] -top-[1.5px] sm:-left-[2.5px] sm:-top-[2.5px] text-[#D3AF36] z-[-1]">My art</span>
            My art
          </h2>
          <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-transparent mx-auto mt-2.5 sm:mt-4 md:mt-6 rounded overflow-hidden flex shadow-sm">
            <div className="w-1/3 h-full bg-[#E25C3D]"></div>
            <div className="w-1/3 h-full bg-[#D3AF36]"></div>
            <div className="w-1/3 h-full bg-[#3B7B61]"></div>
          </div>
        </motion.div>

        {/* Folders: 2 per line on mobile phones, original flex-wrap on desktop */}
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-6 md:gap-x-8 md:gap-y-12 w-full lg:px-8 mx-auto max-w-[1240px] justify-items-center">
          {displayedCategories.map((categoryName: string, idx: number) => {
            const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'));
            const categoryProjects = projects.filter(p => (p.category || '').toUpperCase().trim() === categoryName);
            
            return (
              <Link 
                to={`/category/${categorySlug}`} 
                key={categorySlug} 
                className="w-full flex justify-center sm:w-auto"
                onClick={() => {
                  sessionStorage.setItem('lastCategoryOrigin', 'work');
                  sessionStorage.setItem('workScrollPos', String(window.scrollY));
                }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="relative w-full max-w-[180px] aspect-[280/200] sm:w-[280px] sm:h-[200px] sm:max-w-none sm:aspect-auto group cursor-pointer select-none"
                >
              {/* Back Folder Vector SVG */}
              <svg viewBox="0 0 280 200" className="w-full h-full absolute bottom-0 left-0 z-0 transition-transform duration-300 group-hover:scale-[1.02] origin-bottom opacity-95 shadow-xl" style={{ filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.3))' }}>
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
              <div className="absolute left-[6.5%] right-[6.5%] top-[15%] h-[70%] sm:left-[18px] sm:right-[18px] sm:top-[30px] sm:h-[140px] bg-[#FEF4CE] border border-[#DECF96] shadow-inner transform -rotate-[2deg] group-hover:-translate-y-4 sm:group-hover:-translate-y-9 group-hover:-rotate-[1deg] group-hover:scale-105 transition-all duration-300 z-10 flex flex-col pointer-events-none drop-shadow-sm rounded-[3px] sm:rounded-none">
                 {/* Number */}
                 <div className="absolute top-1 right-2 sm:top-2 sm:right-3 font-serif font-bold text-sm sm:text-2xl md:text-[28px] text-[#A86E4B] opacity-80 leading-none italic">
                   {idx + 1}
                 </div>
                 {/* Center Content */}
                 <div className="flex-1 flex flex-col items-center justify-center px-1.5 sm:px-4 md:px-8 text-center mt-1 sm:mt-3">
                   <h3 className="font-serif italic font-bold text-[13px] sm:text-[22px] md:text-[24px] leading-tight text-[#462F24] line-clamp-2">
                     {toTitleCase(categoryName)}
                   </h3>
                   <p className="text-[#A86E4B] font-sans text-[8px] sm:text-[10px] font-bold tracking-wider sm:tracking-widest mt-1 sm:mt-2 uppercase opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                     {categoryProjects.length > 0 ? `${categoryProjects.length} ${categoryProjects.length === 1 ? 'Video' : 'Videos'}` : 'View Projects'}
                   </p>
                 </div>
              </div>

              {/* Front Folder Flap Box */}
               <div 
                 className="absolute bottom-[2%] left-[2%] right-[2%] h-[75%] sm:bottom-1.5 sm:left-1.5 sm:right-1.5 sm:h-[150px] bg-[#EFD29F] rounded-[4px] sm:rounded-[6px] border-[1.2px] sm:border-[1.5px] border-[#BCA872] shadow-[-2px_-4px_12px_rgba(0,0,0,0.2)] z-20 transition-transform duration-300 origin-bottom group-hover:scale-[1.01]" 
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[4px] sm:rounded-[6px]"></div>

                  {/* Folder Label Sticker */}
                  <div className="absolute right-1.5 top-1.5 sm:right-4 sm:top-4 bg-[#F5F2EB] py-0.5 px-1.5 sm:py-1 sm:px-3 border border-[#BCA872] transform rotate-[-2deg] shadow-sm z-10 flex items-center justify-center pointer-events-none max-w-[65%] sm:max-w-none">
                    <span className="font-sans text-[8px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-[#462F24] font-bold opacity-80 truncate">
                       {categoryName}
                    </span>
                  </div>

                  {/* Zipper Logic */}
                  <div className="absolute left-2 top-2 sm:left-5 sm:top-5 bottom-0 w-3 sm:w-5 flex flex-col items-center z-30 transition-transform duration-500 delay-75 group-hover:-translate-y-1">
                     <div className="flex flex-col gap-[2px] sm:gap-[3px] w-[85%] h-[80%] pt-0.5 sm:pt-1 items-center overflow-hidden">
                        {Array.from({length: 16}).map((_, i) => (
                           <div key={i} className="w-full h-1 sm:h-1.5 bg-[#C08B5D] rounded-sm transform -skew-y-[20deg] shadow-[0_1px_1px_rgba(0,0,0,0.2)] shrink-0"></div>
                        ))}
                     </div>
                     {/* Pull tab */}
                     <div className="absolute top-[76%] sm:top-[80%] -left-[1px] sm:-left-[3px] w-[16px] h-[22px] sm:w-[26px] sm:h-[34px] bg-[#EFD29F] border-[2px] sm:border-[3px] border-[#A86E4B] rounded-[5px] sm:rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.2)] z-30 flex flex-col items-center justify-center p-[1px] sm:p-[2px] transition-all duration-[800ms] group-hover:translate-y-2 sm:group-hover:translate-y-3 origin-top group-hover:-rotate-6 hover:cursor-grab">
                        <div className="w-[4px] sm:w-[8px] h-full rounded border-x border-[#A86E4B]/50 bg-[#C08B5D]/20"></div>
                        <div className="w-[8px] sm:w-[12px] h-[3px] sm:h-[6px] rounded-full border border-[#A86E4B] absolute -top-1 sm:-top-2 bg-[#EFD29F]"></div>
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
