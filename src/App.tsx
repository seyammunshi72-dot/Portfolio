import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import { useStore } from './lib/store';
import AdminDashboard from './components/AdminDashboard';
import CategoryPage from './components/CategoryPage';
import WhatsAppButton from './components/WhatsAppButton';
import { LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppChatUrl, formatSocialUrl } from './lib/socialUtils';

function Home() {
  const { login, user, settings } = useStore();

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const headerOffset = 64;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-brand-primary/30 antialiased bg-noise flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="pt-14 sm:pt-16">
        {/* 1. Home / Hero */}
        <Hero />
        {/* 2. Work / Projects */}
        <Projects />
        {/* 3. Testimonials */}
        <Reviews />
        {/* 4. About */}
        <About />
        {/* 5. Contact Section */}
        <Contact />
      </main>

      {/* Footer Bar */}
      <footer 
        className="py-10 relative z-10 mt-12 bg-black/80"
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-display font-bold tracking-tighter text-white uppercase flex items-center gap-2">
            {settings.footerTitle || 'SEYAM MUNSHI'}<span className="text-brand-primary animate-pulse">.</span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-6 sm:gap-8 text-sm font-medium text-white/70 items-center md:pr-16">
            {/* Email */}
            <a 
              href={`mailto:${settings.contactEmail || 'seyammunshi72@gmail.com'}`} 
              className="hover:text-brand-primary transition-colors flex items-center gap-2 text-white/90"
            >
              {settings.contactEmail || 'seyammunshi72@gmail.com'}
            </a>

            {/* Instagram Profile */}
            {(settings.instagramUrl || (settings.footerLink1Text?.toUpperCase().includes('INSTA') && settings.footerLink1Url)) && (
              <motion.a 
                whileHover={{ y: -2, color: '#fff' }} 
                href={formatSocialUrl('instagram', settings.instagramUrl || settings.footerLink1Url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors hover:text-white"
              >
                INSTAGRAM
              </motion.a>
            )}

            {/* Facebook Profile */}
            {settings.facebookUrl && (
              <motion.a 
                whileHover={{ y: -2, color: '#fff' }} 
                href={formatSocialUrl('facebook', settings.facebookUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors hover:text-white"
              >
                FACEBOOK
              </motion.a>
            )}

            {/* YouTube Channel */}
            {(settings.youtubeUrl || (settings.footerLink2Text?.toUpperCase().includes('YOU') && settings.footerLink2Url)) && (
              <motion.a 
                whileHover={{ y: -2, color: '#fff' }} 
                href={formatSocialUrl('youtube', settings.youtubeUrl || settings.footerLink2Url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors hover:text-white"
              >
                YOUTUBE
              </motion.a>
            )}

            {/* Behance / Portfolio */}
            {(settings.behanceUrl || (settings.footerLink4Text?.toUpperCase().includes('BEHANCE') && settings.footerLink4Url)) && (
              <motion.a 
                whileHover={{ y: -2, color: '#fff' }} 
                href={formatSocialUrl('generic', settings.behanceUrl || settings.footerLink4Url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors hover:text-white"
              >
                BEHANCE
              </motion.a>
            )}

            {/* Other Custom Links if configured (Filter out any duplicate WhatsApp, Insta, YouTube, Behance) */}
            {settings.footerLink1Text && settings.footerLink1Url && !['INSTA', 'WHAT', 'YOU', 'BEHANCE'].some(k => settings.footerLink1Text.toUpperCase().includes(k)) && settings.footerLink1Url !== '#' && (
              <motion.a whileHover={{ y: -2, color: '#fff' }} href={formatSocialUrl('generic', settings.footerLink1Url)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                {settings.footerLink1Text}
              </motion.a>
            )}
            {settings.footerLink2Text && settings.footerLink2Url && !['INSTA', 'WHAT', 'YOU', 'BEHANCE'].some(k => settings.footerLink2Text.toUpperCase().includes(k)) && settings.footerLink2Url !== '#' && (
              <motion.a whileHover={{ y: -2, color: '#fff' }} href={formatSocialUrl('generic', settings.footerLink2Url)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                {settings.footerLink2Text}
              </motion.a>
            )}
            {settings.footerLink4Text && settings.footerLink4Url && !['INSTA', 'WHAT', 'YOU', 'BEHANCE'].some(k => settings.footerLink4Text.toUpperCase().includes(k)) && settings.footerLink4Url !== '#' && (
              <motion.a whileHover={{ y: -2, color: '#fff' }} href={formatSocialUrl('generic', settings.footerLink4Url)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                {settings.footerLink4Text}
              </motion.a>
            )}
            
            {user ? (
              <Link to="/admin" className="ml-2 hover:text-brand-primary transition-colors flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full hover:border-brand-primary/50 text-xs font-semibold">
                ADMIN
              </Link>
            ) : (
              <button onClick={login} className="ml-2 hover:text-brand-primary transition-colors flex items-center gap-2 border border-white/10 px-4 py-2 hover:bg-white/5 rounded-full text-xs font-semibold">
                <LogIn className="w-4 h-4" /> LOGIN
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Dedicated WhatsApp Chat Button */}
      <WhatsAppButton />
    </div>
  );
}

function Main() {
  const location = useLocation();
  const isCategory = location.pathname.startsWith('/category/');

  return (
    <>
      <Home />
      <AnimatePresence>
        {isCategory && (
          <Routes location={location}>
            <Route path="/category/:name" element={<CategoryPage />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
