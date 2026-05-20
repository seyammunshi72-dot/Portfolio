import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-display font-bold tracking-tighter">
          EDIT<span className="text-brand-primary">.</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-wide text-black/60">
          <a href="#home" className="text-black relative group">
            HOME
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full" />
          </a>
          <a href="#work" className="hover:text-black transition-colors">WORK</a>
          <a href="#about" className="hover:text-black transition-colors">ABOUT</a>
          <a href="#services" className="hover:text-black transition-colors">SERVICES</a>
          <a href="#contact" className="hover:text-black transition-colors">CONTACT</a>
        </div>

        <button className="glass-panel px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/5 transition-all flex items-center gap-2 group">
          LET'S TALK
          <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </button>
      </div>
    </motion.nav>
  );
}
