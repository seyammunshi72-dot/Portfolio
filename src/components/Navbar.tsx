import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // When near bottom of the page -> Contact section
      if (scrollY + windowHeight >= fullHeight - 120) {
        setActiveSection('contact');
        return;
      }

      // When near top -> Home section
      if (scrollY < 120) {
        setActiveSection('home');
        return;
      }

      const sectionIds = ['home', 'work', 'testimonials', 'about', 'contact'];
      const triggerPoint = scrollY + windowHeight * 0.35;

      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (top <= triggerPoint) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setActiveSection(id);

    if (id === 'home' || href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', window.location.pathname);
      return;
    }

    const target = document.querySelector(href) as HTMLElement | null;
    if (target) {
      const headerOffset = 64; // height of fixed top bar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#050505] border-b border-white/10 py-2.5 sm:py-3 px-3 sm:px-6 flex justify-center select-none shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      <nav className="flex items-center gap-1 sm:gap-2 bg-[#171717] border border-white/10 rounded-full p-1 sm:p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] max-w-full">
        {/* Left Circular White Button with Home Icon acting as home button */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home', 'home')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
          title="Home"
          aria-label="Home"
        >
          <Home className="w-4 h-4 text-black stroke-[2.2]" />
        </a>

        {/* Center Nav Links: Home, Work, Testimonials, About, Contact */}
        <div className="flex items-center gap-0.5 sm:gap-1 px-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-black font-semibold shadow-sm' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
