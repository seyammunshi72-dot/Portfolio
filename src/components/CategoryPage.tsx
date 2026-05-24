import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { ArrowLeft, PlayCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CategoryPage() {
  const { name } = useParams();
  const { settings } = useStore();
  const projects = settings.projects || [];
  
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Format the name back from URL-friendly slug
  const categoryName = name ? name.toUpperCase().replace(/\-/g, ' ') : '';
  
  // Actually all folders might share the same videos or filter by category?
  // Since earlier we used projects.slice(0,6) as folders, but the real data
  // specifies the category inside each project. Let's filter by category.
  // Because 'name' is URL param (like 'talking-head'), categoryName will perfectly match project category if case is upper.
  const categoryVideos = projects.filter(p => !categoryName || p.category.toUpperCase() === categoryName);

  const getThumbnailUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800';
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=w1000?authuser=0`;
      }
    }
    if (url.includes('drive.google.com/open?id=')) {
      const match = url.match(/id=([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=w1000?authuser=0`;
      }
    }
    return url;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Handle Google Drive links
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url.replace(/\/view.*$/, '/preview');
    }
    if (url.includes('drive.google.com/open?id=')) {
      const match = url.match(/id=([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    // Handle YouTube links
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <div className="bg-[#F2ECE1] min-h-screen text-black font-sans selection:bg-brand-primary/30 antialiased overflow-x-hidden pt-24 pb-20 relative">
      {/* 70s Graphic Design Background Pattern (muted version) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <svg className="absolute w-0 h-0">
          <filter id="noiseFilterCategory">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
          </filter>
        </svg>
        <div className="absolute inset-0 opacity-[0.25] mix-blend-multiply" style={{ filter: 'url(#noiseFilterCategory)' }}></div>
        <div className="absolute top-[20%] right-[10%] w-48 h-48 border-[24px] border-[#DE9033] rounded-full opacity-30"></div>
        <div className="absolute bottom-[10%] -left-[5%] w-[400px] h-[400px] bg-[#E25C3D] rounded-full mix-blend-multiply opacity-20 blur-[4px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-widest text-[#462F24] hover:text-[#E25C3D] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-block bg-[#E25C3D] text-[#F2ECE1] font-sans text-sm font-bold tracking-widest px-3 py-1 mb-6 rounded-sm shadow-sm transform -rotate-2">
            CATEGORY
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-[#1F1F1E] drop-shadow-sm">
            {categoryName}
          </h1>
          <div className="w-24 h-2 mt-6 rounded overflow-hidden flex shadow-sm">
            <div className="w-1/3 h-full bg-[#E25C3D]"></div>
            <div className="w-1/3 h-full bg-[#D3AF36]"></div>
            <div className="w-1/3 h-full bg-[#3B7B61]"></div>
          </div>
        </motion.div>

        {categoryVideos.length === 0 ? (
          <div className="py-20 text-center">
             <p className="text-[#462F24] font-serif text-xl italic opacity-70">No videos found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {categoryVideos.map((video, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={video.id || idx}
                className="group cursor-pointer"
                onClick={() => {
                  if (video.videoUrl) {
                    setActiveVideo(getEmbedUrl(video.videoUrl));
                  } else {
                    alert("No video URL provided for this project. Add one in the Admin dashboard.");
                  }
                }}
              >
                {/* Video Thumbnail wrapped in a vintage TV/Frame style */}
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl mb-4 bg-black border-[3px] border-[#462F24] transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  {/* CRT/Vintage overlay effect over image */}
                  <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1))] bg-[length:100%_4px]"></div>
                  
                  <img 
                    src={getThumbnailUrl(video.image)} 
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="w-16 h-16 rounded-full bg-[#E25C3D]/90 flex items-center justify-center shadow-lg transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm">
                      <PlayCircle className="w-8 h-8 text-[#F2ECE1] ml-1" />
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-[#1F1F1E] group-hover:text-[#E25C3D] transition-colors leading-tight line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    {video.featured && (
                      <span className="bg-[#D3AF36] text-[#1F1F1E] font-sans text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe 
                src={activeVideo} 
                className="w-full h-full"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
