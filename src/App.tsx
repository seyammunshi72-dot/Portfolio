import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import { useStore } from './lib/store';
import AdminDashboard from './components/AdminDashboard';
import { LogIn } from 'lucide-react';

function Home() {
  const { login, user, settings } = useStore();

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-brand-primary/30 antialiased bg-noise flex flex-col">
      <main>
        <Hero />
        <Projects />
        <About />

        {/* Client Logos */}
        <section className="py-20 relative z-10 border-t border-white/5 mx-6 lg:mx-auto max-w-7xl mt-12">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-30 grayscale items-center pointer-events-none">
            <span className="font-display font-bold text-2xl tracking-widest">SONY</span>
            <span className="font-serif italic font-bold text-2xl">Canon</span>
            <div className="flex items-center gap-2 font-display font-bold text-xl">
              Red Bull
              <span className="w-12 h-6 bg-white/10 rounded-full inline-block"></span>
            </div>
            <span className="font-sans font-black text-2xl tracking-widest">NETFLIX</span>
            <div className="w-12 h-8 flex items-end overflow-hidden">
               {/* Adidas logo mock */}
               <div className="w-3 h-8 bg-white -skew-x-[30deg]"></div>
               <div className="w-3 h-6 bg-white ml-1 -skew-x-[30deg]"></div>
               <div className="w-3 h-4 bg-white ml-1 -skew-x-[30deg]"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer/Contact Section */}
      <footer id="contact" className="py-12 border-t border-white/5 relative z-10 mt-12 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-display font-bold tracking-tighter text-white/50 uppercase">
            {settings.footerTitle}<span className="text-brand-primary">.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/50 items-center">
            {settings.footerLink1Text && <a href={settings.footerLink1Url || '#'} className="hover:text-white transition-colors">{settings.footerLink1Text}</a>}
            {settings.footerLink2Text && <a href={settings.footerLink2Url || '#'} className="hover:text-white transition-colors">{settings.footerLink2Text}</a>}
            {settings.footerLink3Text && <a href={settings.footerLink3Url || '#'} className="hover:text-white transition-colors">{settings.footerLink3Text}</a>}
            {settings.footerLink4Text && <a href={settings.footerLink4Url || '#'} className="hover:text-white transition-colors">{settings.footerLink4Text}</a>}
            
            {user ? (
              <Link to="/admin" className="ml-4 hover:text-brand-primary transition-colors flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full">
                ADMIN
              </Link>
            ) : (
              <button onClick={login} className="ml-4 hover:text-brand-primary transition-colors flex items-center gap-2">
                <LogIn className="w-4 h-4" /> LOGIN
              </button>
            )}
          </div>
        </div>
      </footer>
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
