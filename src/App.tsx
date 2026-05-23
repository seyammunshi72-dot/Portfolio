import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import { useStore } from './lib/store';
import AdminDashboard from './components/AdminDashboard';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

function Home() {
  const { login, user, settings } = useStore();

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-brand-primary/30 antialiased bg-noise flex flex-col overflow-x-hidden">
      <main>
        <Hero />
        <Projects />
        <About />

        {/* Client Logos */}
        <section className="py-20 relative z-10 border-t border-white/5 mx-6 lg:mx-auto max-w-7xl mt-12 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 0.3, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-12 md:gap-20 grayscale items-center pointer-events-none"
          >
            <motion.span whileHover={{ scale: 1.1, opacity: 1 }} className="font-display font-bold text-2xl tracking-widest transition-all">SONY</motion.span>
            <motion.span whileHover={{ scale: 1.1, opacity: 1 }} className="font-serif italic font-bold text-2xl transition-all">Canon</motion.span>
            <motion.div whileHover={{ scale: 1.1, opacity: 1 }} className="flex items-center gap-2 font-display font-bold text-xl transition-all">
              Red Bull
              <span className="w-12 h-6 bg-white/10 rounded-full inline-block"></span>
            </motion.div>
            <motion.span whileHover={{ scale: 1.1, opacity: 1 }} className="font-sans font-black text-2xl tracking-widest transition-all">NETFLIX</motion.span>
            <motion.div whileHover={{ scale: 1.1, opacity: 1 }} className="w-12 h-8 flex items-end overflow-hidden transition-all">
               {/* Adidas logo mock */}
               <div className="w-3 h-8 bg-white -skew-x-[30deg]"></div>
               <div className="w-3 h-6 bg-white ml-1 -skew-x-[30deg]"></div>
               <div className="w-3 h-4 bg-white ml-1 -skew-x-[30deg]"></div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Simple Footer/Contact Section */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        id="contact" 
        className="py-12 border-t border-white/5 relative z-10 mt-12 bg-black/50"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-display font-bold tracking-tighter text-white/50 uppercase flex items-center gap-2">
            {settings.footerTitle}<span className="text-brand-primary animate-pulse">.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/50 items-center">
            {settings.footerLink1Text && <motion.a whileHover={{ y: -2, color: '#fff' }} href={settings.footerLink1Url || '#'} className="transition-colors">{settings.footerLink1Text}</motion.a>}
            {settings.footerLink2Text && <motion.a whileHover={{ y: -2, color: '#fff' }} href={settings.footerLink2Url || '#'} className="transition-colors">{settings.footerLink2Text}</motion.a>}
            {settings.footerLink3Text && <motion.a whileHover={{ y: -2, color: '#fff' }} href={settings.footerLink3Url || '#'} className="transition-colors">{settings.footerLink3Text}</motion.a>}
            {settings.footerLink4Text && <motion.a whileHover={{ y: -2, color: '#fff' }} href={settings.footerLink4Url || '#'} className="transition-colors">{settings.footerLink4Text}</motion.a>}
            
            {user ? (
              <Link to="/admin" className="ml-4 hover:text-brand-primary transition-colors flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full hover:border-brand-primary/50">
                ADMIN
              </Link>
            ) : (
              <button onClick={login} className="ml-4 hover:text-brand-primary transition-colors flex items-center gap-2 border border-transparent px-4 py-2 hover:bg-white/5 rounded-full">
                <LogIn className="w-4 h-4" /> LOGIN
              </button>
            )}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
