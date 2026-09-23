import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Play, X, ChevronRight } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

// Generates 50 placeholder items mixing photo and video
const PORTFOLIO_ITEMS = Array.from({ length: 50 }, (_, i) => {
  const isVideo = i % 4 === 0 || i % 7 === 0; // Pseudo-randomly assign videos
  
  // Mix non-event real images for general portfolio overview (all event photos are strictly in Event section)
  const getImageUrl = (index: number) => {
    const realImages = [
      '/services/corp-photo.jpg', '/services/corp-film.jpg', '/services/re-photo.jpg',
      '/services/re-video.jpg', '/services/drone.jpg', '/wedding/traditional-bride-groom.jpg',
      '/wedding/groom-dance-floor-sangeet.jpg', '/fashion/lakme-fashion-week-boys-club.jpg',
      '/services/product.jpg', '/services/reels.jpg', '/services/exhibition.jpg',
      '/services/timelapse.jpg', '/aman-portrait.png'
    ];
    return realImages[index % realImages.length];
  };

  const span = (() => {
    if (i % 8 === 0) return 'col-span-12 md:col-span-8 row-span-2';
    if (i % 5 === 0) return 'col-span-12 md:col-span-6 row-span-1';
    return 'col-span-12 md:col-span-4 row-span-1';
  })();

  return {
    id: i + 1,
    type: isVideo ? 'video' : 'photo',
    src: getImageUrl(i),
    span,
  };
});

export default function PortfolioPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const nextItem = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % PORTFOLIO_ITEMS.length);
    }
  };

  const prevItem = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length);
    }
  };

  return (
    <div className="min-h-screen bg-darker text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-darker/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <Breadcrumbs variant="inline" />
        <div className="font-display font-bold tracking-widest text-sm uppercase hidden sm:block">Selected Works</div>
        <div className="text-xs text-white/40">50 Artifacts</div>
      </header>

      {/* Grid */}
      <main className="container mx-auto px-4 md:px-12 py-12 md:py-20">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">Complete Archive</h1>
          <p className="text-sm text-white/50 font-light">
            A comprehensive index of commercial, editorial, cinematic, and narrative productions captured globally.
          </p>
        </div>

        <div className="grid grid-cols-12 auto-rows-[250px] md:auto-rows-[350px] gap-4 md:gap-6">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 10) * 0.05, duration: 0.6 }}
              onClick={() => setSelectedIndex(index)}
              className={`${item.span} relative group overflow-hidden bg-charcoal cursor-pointer border border-white/5`}
            >
              <img 
                src={item.src} 
                alt={`Portfolio ${item.id}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-darker/20 group-hover:bg-transparent transition-colors duration-500" />
              
              {/* Video Indicator */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                    <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-darker/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-8 right-8 p-4 hover:bg-white/10 rounded-full transition-colors z-[130]"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); prevItem(); }}
              className="absolute left-4 md:left-12 p-4 hover:bg-white/10 rounded-full transition-colors z-[130]"
            >
              <ChevronLeft className="w-10 h-10 text-white" />
            </button>

            <motion.img 
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={PORTFOLIO_ITEMS[selectedIndex].src}
              alt="Fullscreen Portfolio"
              className="max-w-[90vw] max-h-[85vh] object-contain"
            />

            <button 
              onClick={(e) => { e.stopPropagation(); nextItem(); }}
              className="absolute right-4 md:right-12 p-4 hover:bg-white/10 rounded-full transition-colors z-[130]"
            >
              <ChevronRight className="w-10 h-10 text-white" />
            </button>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest font-light">
              {selectedIndex + 1} / {PORTFOLIO_ITEMS.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
