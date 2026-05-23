import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Reviews from './components/Reviews';
import Pricing from './components/Pricing';
import { useStore } from './lib/store';
import AdminDashboard from './components/AdminDashboard';
import CategoryPage from './components/CategoryPage';
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
        <Reviews />
        <Pricing />
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
        <Route path="/category/:name" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
