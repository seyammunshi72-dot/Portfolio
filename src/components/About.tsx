import { motion } from 'motion/react';
import { Download, Star, Briefcase, Users, Globe2 } from 'lucide-react';
import { useStore } from '../lib/store';

export default function About() {
  const { settings } = useStore();

  const photoSizePercentage = settings.aboutPhotoSize || 100;
  const imageScale = photoSizePercentage / 100;

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_1.5fr] gap-16 items-center">
        
        {/* Left: Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          <div className="relative aspect-square overflow-hidden" style={{ width: `${photoSizePercentage}%` }}>
            <div className="absolute inset-0 bg-brand-primary/10 blur-[100px] rounded-full" />
            <div className="relative aspect-square w-full h-full rounded-full overflow-hidden border border-white/5 p-2">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#111]">
                <img 
                  src={settings.aboutPhotoUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800"} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale opacity-90"
                />
              </div>
            </div>
          </div>
          {/* Signature mock */}
          <div className="absolute -bottom-4 right-10 text-brand-primary/80 font-serif italic text-4xl transform -rotate-12">
            Seyam
          </div>
        </motion.div>

        {/* Right: Content & Stats */}
        <div>
          <p className="text-brand-secondary tracking-widest text-xs font-semibold mb-3 uppercase">{settings.aboutSubtitle || 'About Me'}</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            {settings.aboutHeading1}<br/>
            {settings.aboutHeading2}<br/>
            <span className="text-brand-primary">{settings.aboutHeading3}</span>
          </h2>
          
          <p className="text-white/60 mb-10 text-lg leading-relaxed max-w-xl whitespace-pre-wrap">
            {settings.aboutText}
          </p>

          <a href={settings.aboutCvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex glass-panel px-6 py-3 rounded-full text-sm font-medium hover:bg-white/5 transition-colors items-center gap-3 mb-16">
            DOWNLOAD CV <Download className="w-4 h-4" />
          </a>

          {/* Stats Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold">{settings.aboutStat1Num}</div>
                <div className="text-[10px] tracking-wider text-white/50 uppercase">{settings.aboutStat1Text}</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/70">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold">{settings.aboutStat2Num}</div>
                <div className="text-[10px] tracking-wider text-white/50 uppercase">{settings.aboutStat2Text}</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/70">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold">{settings.aboutStat3Num}</div>
                <div className="text-[10px] tracking-wider text-white/50 uppercase">{settings.aboutStat3Text}</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/70">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold">{settings.aboutStat4Num}</div>
                <div className="text-[10px] tracking-wider text-white/50 uppercase">{settings.aboutStat4Text}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
