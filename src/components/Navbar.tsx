import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import SeoMetadata from './SeoMetadata';

const NAV_LINKS = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Client Gallery', href: '/client-galleries' },
  { name: 'Reviews', href: '/#reviews' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-darker/90 backdrop-blur-md py-4' : 'bg-transparent py-8'
        }`}
      >
        {/* Dynamic SEO Metadata Synchronizer */}
        <SeoMetadata />

        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3.5 z-50 group">
            <img 
              src="/logo.png" 
              alt="Aman Visual Logo" 
              className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain rounded-full border border-white/20 group-hover:border-white/50 group-hover:scale-105 transition-all duration-300 shadow-xl shrink-0" 
            />
            <span className="font-display font-bold text-lg sm:text-xl tracking-[0.2em] uppercase text-white group-hover:text-white/90 transition-colors">
              Aman Visual
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isRoute = !link.href.startsWith('/#');
              if (isRoute) {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-xs uppercase tracking-widest underline underline-offset-[6px] decoration-1 transition-all duration-300 ${
                      link.name === 'Client Gallery' 
                        ? 'text-emerald-400 hover:text-emerald-300 font-medium decoration-emerald-400/70 hover:decoration-emerald-300' 
                        : 'text-white/80 hover:text-white decoration-white/40 hover:decoration-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-widest text-white/80 hover:text-white underline underline-offset-[6px] decoration-1 decoration-white/40 hover:decoration-white transition-all duration-300"
                >
                  {link.name}
                </a>
              );
            })}
            <a
              href="/#pricing"
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            >
              Book Advance
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden z-50 text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-darker flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col gap-7 text-center">
              {NAV_LINKS.map((link) => {
                const isRoute = !link.href.startsWith('/#');
                if (isRoute) {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-display text-2xl uppercase tracking-widest underline underline-offset-8 decoration-1 transition-all ${
                        link.name === 'Client Gallery' 
                          ? 'text-emerald-400 decoration-emerald-400/70 hover:decoration-emerald-300' 
                          : 'text-white decoration-white/40 hover:decoration-white hover:text-white/80'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <a 
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-2xl uppercase tracking-widest underline underline-offset-8 decoration-1 decoration-white/40 hover:decoration-white hover:text-white/80 transition-all"
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="pt-4">
                <a
                  href="/#pricing"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                >
                  Book Advance Online
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
