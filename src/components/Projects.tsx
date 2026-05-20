import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    category: 'DOCUMENTARY',
    title: 'WILD BEAUTY',
    duration: '02:45',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  {
    category: 'SHORT FILM',
    title: 'LOST IN SPACE',
    duration: '03:12',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    category: 'MUSIC VIDEO',
    title: 'ECHOES OF SILENCE',
    duration: '04:01',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
  },
  {
    category: 'TRAVEL FILM',
    title: 'THE ROAD AHEAD',
    duration: '03:38',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Projects() {
  return (
    <section id="work" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-brand-primary tracking-widest text-xs font-semibold mb-3">FEATURED WORK</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">SELECTED PROJECTS.</h2>
          </div>
          
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
              <span className="transform rotate-180">→</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative glass-panel rounded-2xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-6 cursor-pointer border hover:border-brand-primary/50 transition-colors duration-500 ${
                project.featured ? 'border-brand-primary/30 shadow-[0_0_30px_rgba(255,85,51,0.15)]' : 'border-white/5'
              }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale-[40%] group-hover:scale-110 group-hover:grayscale-0 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between text-white">
                <div>
                  <p className="text-[10px] tracking-widest text-brand-secondary font-medium mb-2 uppercase">{project.category}</p>
                  <h3 className="font-display text-2xl font-bold leading-tight">{project.title.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}</h3>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <p className="text-sm text-white/70 font-mono">{project.duration}</p>
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12 gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
        </div>

      </div>
    </section>
  );
}
