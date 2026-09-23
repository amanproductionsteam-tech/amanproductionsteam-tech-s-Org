import { useState, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  Images, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { SERVICES } from '../data';
import { SERVICE_GALLERIES } from '../data/serviceGalleries';

export default function Services() {
  // Mode switcher: 'cards' with embedded preview ribbons vs 'showcase' full 10-photo live explorer
  const [viewMode, setViewMode] = useState<'cards' | 'showcase'>('cards');
  
  // Active category in showcase mode
  const [activeShowcaseServiceId, setActiveShowcaseServiceId] = useState<string>(SERVICES[0].id);

  // Quick Preview Modal state (for previewing 10 photos right on the outside section)
  const [quickPreviewServiceId, setQuickPreviewServiceId] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Selected quick preview items
  const quickPreviewService = useMemo(() => {
    if (!quickPreviewServiceId) return null;
    return SERVICES.find(s => s.id === quickPreviewServiceId) || null;
  }, [quickPreviewServiceId]);

  const quickPreviewItems = useMemo(() => {
    if (!quickPreviewServiceId) return [];
    return SERVICE_GALLERIES[quickPreviewServiceId] || [];
  }, [quickPreviewServiceId]);

  // Showcase items for the currently selected section in the outside showcase
  const activeShowcaseService = useMemo(() => {
    return SERVICES.find(s => s.id === activeShowcaseServiceId) || SERVICES[0];
  }, [activeShowcaseServiceId]);

  const showcaseItems = useMemo(() => {
    return SERVICE_GALLERIES[activeShowcaseServiceId] || [];
  }, [activeShowcaseServiceId]);

  // Open modal preview helper
  const openQuickPreview = (serviceId: string, photoIndex: number = 0, e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setQuickPreviewServiceId(serviceId);
    setActivePhotoIndex(photoIndex);
  };

  const closeQuickPreview = () => {
    setQuickPreviewServiceId(null);
    setActivePhotoIndex(0);
  };

  const handleNextPhoto = (e: MouseEvent) => {
    e.stopPropagation();
    if (!quickPreviewItems.length) return;
    setActivePhotoIndex((prev) => (prev + 1) % quickPreviewItems.length);
  };

  const handlePrevPhoto = (e: MouseEvent) => {
    e.stopPropagation();
    if (!quickPreviewItems.length) return;
    setActivePhotoIndex((prev) => (prev - 1 + quickPreviewItems.length) % quickPreviewItems.length);
  };

  return (
    <section id="services" className="py-24 md:py-36 bg-charcoal relative">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
                Comprehensive Production Archive
              </span>
            </div>
            <h2 id="services-heading" className="text-4xl md:text-5xl font-bold uppercase mb-4 text-white">
              Our Services
            </h2>
            <div className="w-24 h-[1px] bg-white/20 mb-4" />
            <p className="text-sm text-white/60 max-w-xl font-light">
              Full-spectrum production services tailored to brand, corporate, and private commissions across India and worldwide. 
              Explore curated photo previews directly below.
            </p>
          </motion.div>

          {/* View Switcher: Cards with Previews vs Instant 10-Photo Live Showcase */}
          <div className="flex items-center gap-2 bg-[#121212] p-1.5 border border-white/10 rounded-sm self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-sm cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid size={14} />
              <span>Service Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('showcase')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-sm cursor-pointer ${
                viewMode === 'showcase'
                  ? 'bg-emerald-400 text-black font-semibold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Images size={14} />
              <span>10-Photo Live Showcase</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: SERVICE CARDS WITH PHOTO PREVIEWS & MINI THUMBNAIL STRIP    */}
        {/* ========================================================================= */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const galleryItems = SERVICE_GALLERIES[service.id] || [];
              const photoCount = galleryItems.length || 10;
              const coverImage = galleryItems[0]?.src || service.image;
              const previewThumbnails = galleryItems.slice(0, 4);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  className="group relative border border-white/10 hover:border-emerald-500/60 bg-[#0e0e0e] hover:bg-[#121312] rounded-sm flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 overflow-hidden"
                >
                  <div>
                    {/* Photo Preview Banner */}
                    <div 
                      onClick={(e) => openQuickPreview(service.id, 0, e)}
                      className="relative h-44 w-full overflow-hidden bg-neutral-900 cursor-pointer"
                    >
                      <img
                        src={coverImage}
                        alt={`${service.title} preview`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-black/30" />

                      {/* Top Icon */}
                      <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                        <div className="w-8 h-8 rounded-sm bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-all">
                          <Icon className="w-4 h-4" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Photo Category Pill Bottom Right */}
                      <div className="absolute bottom-2.5 right-3">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-white/70 bg-black/60 px-2 py-0.5 rounded-sm backdrop-blur-sm border border-white/10">
                          {galleryItems[0]?.category || 'Curated'}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 pb-3">
                      <Link
                        to={`/services/${service.id}`}
                        className="text-base font-display font-medium text-white uppercase mb-2 block hover:text-emerald-300 transition-colors"
                      >
                        {service.title}
                      </Link>
                      <p className="text-white/60 font-light text-xs leading-relaxed line-clamp-2 mb-4">
                        {service.desc}
                      </p>

                      {/* 4-Photo Thumbnail Preview Strip */}
                      <div className="mb-2">
                        <div className="grid grid-cols-4 gap-1.5">
                          {previewThumbnails.map((item, thumbIdx) => {
                            const isLastThumb = thumbIdx === 3 && galleryItems.length > 4;
                            const remainingCount = galleryItems.length - 3;
                            return (
                              <button
                                key={item.id || thumbIdx}
                                type="button"
                                onClick={(e) => openQuickPreview(service.id, thumbIdx, e)}
                                className="relative aspect-square rounded-sm overflow-hidden border border-white/10 hover:border-emerald-400 transition-all cursor-pointer group/thumb bg-neutral-900"
                                title={item.title}
                              >
                                <img
                                  src={item.src}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                                {isLastThumb ? (
                                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[10px] font-mono font-bold text-white group-hover/thumb:bg-emerald-500/80 group-hover/thumb:text-black transition-colors">
                                    +{remainingCount}
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 py-3.5 border-t border-white/10 bg-black/20 flex items-center justify-between text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => openQuickPreview(service.id, 0, e)}
                      className="text-white/50 hover:text-emerald-400 transition-colors uppercase tracking-wider text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Preview</span>
                    </button>

                    <Link
                      to={`/services/${service.id}`}
                      className="text-white/70 hover:text-white transition-colors uppercase tracking-wider text-[11px] inline-flex items-center gap-1.5 group-hover:text-emerald-400"
                    >
                      <span>Full Gallery</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: INSTANT 10-PHOTO LIVE SHOWCASE INSIDE OUTSIDE SECTION        */}
        {/* ========================================================================= */}
        {viewMode === 'showcase' && (
          <div className="space-y-8">
            {/* Section Category Jump Selector Bar */}
            <div className="bg-[#0e0e0e] border border-white/10 p-3 rounded-sm">
              <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2.5 flex items-center gap-2 font-mono">
                <Sparkles size={12} className="text-emerald-400" />
                <span>Select Any Section to Preview Its 10 Curated Photos:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {SERVICES.map((srv) => {
                  const isActive = srv.id === activeShowcaseServiceId;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setActiveShowcaseServiceId(srv.id)}
                      className={`px-3.5 py-2 text-xs whitespace-nowrap tracking-wider uppercase border transition-all cursor-pointer inline-flex items-center rounded-sm ${
                        isActive
                          ? 'bg-white text-black border-white font-semibold shadow-lg'
                          : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span>{srv.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Section Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#121212] border border-white/10 rounded-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block mb-1">
                  Showing 10 Photos For
                </span>
                <h3 className="text-2xl font-display uppercase text-white font-semibold">
                  {activeShowcaseService.title}
                </h3>
                <p className="text-xs text-white/60 font-light mt-1 max-w-2xl">
                  {activeShowcaseService.desc}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openQuickPreview(activeShowcaseService.id, 0)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer rounded-sm"
                >
                  <Maximize2 size={13} />
                  <span>Slideshow</span>
                </button>
                <Link
                  to={`/services/${activeShowcaseService.id}`}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1.5 rounded-sm"
                >
                  <span>Open Dedicated Page</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>

            {/* 10-Photo Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {showcaseItems.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => openQuickPreview(activeShowcaseService.id, index)}
                  className="group relative aspect-[4/5] bg-neutral-900 border border-white/10 hover:border-emerald-500/80 rounded-sm overflow-hidden cursor-pointer shadow-md"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Photo details on hover */}
                  <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/80">
                        {item.category || 'Production'}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-emerald-400 group-hover:text-black text-white flex items-center justify-center transition-colors">
                        <Eye size={12} />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-display text-white uppercase font-medium leading-tight mb-1 group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                        <span>{item.client || item.location || 'Aman Visual'}</span>
                        <span className="text-white/40">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUICK PREVIEW LIGHTBOX MODAL (Directly on Outside Section)                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickPreviewServiceId && quickPreviewItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickPreview}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8"
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-4 relative z-10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-base font-display text-white uppercase font-semibold">
                    {quickPreviewService?.title}
                  </h3>
                  <span className="text-xs font-mono text-white/50">
                    Photo {activePhotoIndex + 1} of {quickPreviewItems.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/services/${quickPreviewServiceId}`}
                  className="px-3.5 py-1.5 border border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/10 text-emerald-300 hover:text-white text-xs font-mono uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Open Full Gallery Page</span>
                  <ExternalLink size={12} />
                </Link>
                <button
                  type="button"
                  onClick={closeQuickPreview}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Center Image Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2 md:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title="Previous Photo"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Main Active Photo */}
              <div className="relative max-h-[72vh] max-w-[85vw] flex flex-col items-center">
                <motion.img
                  key={quickPreviewItems[activePhotoIndex]?.src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={quickPreviewItems[activePhotoIndex]?.src}
                  alt={quickPreviewItems[activePhotoIndex]?.title}
                  className="max-h-[66vh] max-w-full object-contain rounded-sm border border-white/10 shadow-2xl"
                  referrerPolicy="no-referrer"
                />

                {/* Photo Caption Bar */}
                <div className="mt-3 text-center">
                  <h4 className="text-sm md:text-base font-display text-white uppercase font-medium">
                    {quickPreviewItems[activePhotoIndex]?.title}
                  </h4>
                  <div className="flex items-center justify-center gap-3 text-xs font-mono text-white/50 mt-1">
                    <span>{quickPreviewItems[activePhotoIndex]?.category}</span>
                    {quickPreviewItems[activePhotoIndex]?.client && (
                      <>
                        <span>•</span>
                        <span>Client: {quickPreviewItems[activePhotoIndex]?.client}</span>
                      </>
                    )}
                    {quickPreviewItems[activePhotoIndex]?.gear && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">{quickPreviewItems[activePhotoIndex]?.gear}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2 md:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title="Next Photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Modal Bottom Thumbnail Strip (all 10 photos) */}
            <div className="border-t border-white/10 pt-3 relative z-10" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2 overflow-x-auto justify-center pb-2 max-w-4xl mx-auto scrollbar-none">
                {quickPreviewItems.map((item, idx) => {
                  const isCurrent = idx === activePhotoIndex;
                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                          : 'border-white/10 opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
