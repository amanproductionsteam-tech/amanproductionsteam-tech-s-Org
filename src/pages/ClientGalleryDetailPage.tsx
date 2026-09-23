import { useState, useEffect, useMemo, type MouseEvent, type FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HardDrive, 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart, 
  Check, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Camera, 
  Film, 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  MessageCircle, 
  Copy,
  Info,
  ShieldCheck,
  Play
} from 'lucide-react';
import type { ClientGallery, ClientGalleryItem } from '../data/clientGalleries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ClientGalleryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState<ClientGallery | null>(null);
  const [needsPin, setNeedsPin] = useState(false);
  const [galleryPin, setGalleryPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'photo' | 'video' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDriveGuide, setShowDriveGuide] = useState(false);

  // Always load deliverables from the server. A browser cache cannot grant access.
  useEffect(() => {
    setGallery(null);
    setNeedsPin(false);
    setLoading(true);
    fetch(`/api/client-galleries/${encodeURIComponent(slug || '')}`)
      .then(async response => {
        if (response.status === 403) { setNeedsPin(true); return null; }
        if (!response.ok) throw new Error('Gallery not found.');
        return response.json();
      })
      .then(data => setGallery(data?.gallery || null))
      .catch(() => setGallery(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const unlockGallery = async (e: FormEvent) => {
    e.preventDefault();
    setPinError('');
    try {
      const response = await fetch(`/api/client-galleries/${encodeURIComponent(slug || '')}`, {
        headers: { 'x-gallery-pin': galleryPin }
      });
      if (!response.ok) throw new Error('Incorrect PIN or gallery unavailable.');
      const data = await response.json();
      setGallery(data.gallery);
      setNeedsPin(false);
      setGalleryPin('');
    } catch {
      setPinError('Incorrect PIN. Please check with Aman Visual.');
    }
  };

  // Load saved favorites for this client gallery
  useEffect(() => {
    if (!gallery) return;
    try {
      const saved = localStorage.getItem(`fav_${gallery.id}`);
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, [gallery]);

  const toggleFavorite = (itemId: string, e: MouseEvent) => {
    e.stopPropagation();
    if (!gallery) return;
    setFavorites(prev => {
      const next = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
      try {
        localStorage.setItem(`fav_${gallery.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!gallery) return;
    const text = encodeURIComponent(
      `Check out our official deliverables from Aman Visual!\n\n` +
      `📸 ${gallery.title} (${gallery.clientName})\n` +
      `🔗 Gallery Link: ${window.location.href}\n` +
      `☁️ Google Drive Master Folder: ${gallery.driveFolderUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSendFavoritesToAman = () => {
    if (!gallery || favorites.length === 0) return;
    const selectedTitles = gallery.items
      .filter(item => favorites.includes(item.id))
      .map((item, idx) => `${idx + 1}. ${item.title} (${item.type})`)
      .join('\n');

    const text = encodeURIComponent(
      `Hello Aman! Here is our selected favorites list for ${gallery.title} (${gallery.clientName}):\n\n` +
      `${selectedTitles}\n\n` +
      `Total selected: ${favorites.length} items for print / album selection.\n` +
      `Gallery: ${window.location.href}`
    );
    window.open(`https://wa.me/918827474622?text=${text}`, '_blank');
  };

  const filteredItems = useMemo(() => {
    if (!gallery) return [];
    if (selectedFilter === 'photo') return gallery.items.filter(i => i.type === 'photo');
    if (selectedFilter === 'video') return gallery.items.filter(i => i.type === 'video');
    if (selectedFilter === 'favorites') return gallery.items.filter(i => favorites.includes(i.id));
    return gallery.items;
  }, [gallery, selectedFilter, favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <HardDrive size={32} className="text-emerald-400 animate-pulse mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-white/50">Loading Google Drive Deliverables...</p>
        </div>
      </div>
    );
  }

  if (needsPin) return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <form onSubmit={unlockGallery} className="max-w-sm w-full space-y-5">
        <h1 className="text-2xl font-bold">Private Client Gallery</h1>
        <p className="text-white/60">Enter the gallery PIN shared by Aman Visual.</p>
        <input aria-label="Gallery PIN" type="password" value={galleryPin} onChange={e => setGalleryPin(e.target.value)}
          className="w-full bg-white/10 border border-white/20 p-3 text-white" required />
        {pinError && <p role="alert" className="text-red-400">{pinError}</p>}
        <button type="submit" className="bg-white text-black px-6 py-3">Open Gallery</button>
      </form>
    </div>
  );

  if (!gallery) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-2xl font-display font-bold uppercase mb-2">Gallery Not Found</h2>
        <p className="text-xs text-white/40 mb-6">The requested client deliverables link could not be located.</p>
        <Link to="/client-galleries" className="px-6 py-2.5 bg-white text-black text-xs uppercase font-semibold">
          Return to Client Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Hero Banner with Cover Photo */}
      <section className="relative min-h-[55vh] flex items-end pt-32 pb-16 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={gallery.coverImage}
            alt={gallery.title}
            className="w-full h-full object-cover object-center filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Client Galleries', href: '/client-galleries' },
                { label: gallery.title }
              ]}
              variant="pill" 
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] uppercase tracking-widest font-medium inline-flex items-center gap-1.5 rounded-sm">
                  <HardDrive size={13} />
                  Google Drive Cloud Active
                </span>
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em]">
                  {gallery.clientName}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-white leading-tight">
                {gallery.title}
              </h1>

              <div className="flex items-center gap-5 text-xs text-white/60 mt-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} className="text-white/40" /> {gallery.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-white/40" /> {gallery.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Camera size={13} className="text-white/40" /> {gallery.serviceType}
                </span>
              </div>
            </div>

            {/* Crucial Google Drive Call to Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={gallery.driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all inline-flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 cursor-pointer"
              >
                <HardDrive size={16} />
                <span>Open Google Drive Folder</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-4 bg-[#121212] border border-white/20 text-white/90 hover:text-white hover:border-white/50 text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle size={15} className="text-emerald-400" />
                <span>Share</span>
              </button>

              <button
                onClick={handleCopyShareLink}
                className="px-4 py-4 bg-[#121212] border border-white/20 text-white/90 hover:text-white hover:border-white/50 text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Copy Gallery Link"
              >
                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Stats Bar */}
      <section className="bg-[#0a0a0a] border-b border-white/10 py-6">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Total Photos</span>
              <div className="text-xl md:text-2xl font-display font-bold mt-0.5 text-white">
                {gallery.photoCount} <span className="text-xs font-normal text-white/40">Files</span>
              </div>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Cinema Films & Reels</span>
              <div className="text-xl md:text-2xl font-display font-bold mt-0.5 text-white">
                {gallery.videoCount} <span className="text-xs font-normal text-white/40">Cuts</span>
              </div>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Master Storage</span>
              <div className="text-xl md:text-2xl font-display font-bold mt-0.5 text-emerald-400 font-mono">
                {gallery.totalStorage}
              </div>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Cloud Host</span>
              <div className="text-xl md:text-2xl font-display font-bold mt-0.5 text-white flex items-center gap-1.5">
                <HardDrive size={18} className="text-emerald-400" />
                Google Drive
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Personal Note & Quick Drive Guide */}
      <section className="py-8 bg-[#070707] border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-[#111] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mb-1 block">
                Deliverables Note from Aman Visual
              </span>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                "{gallery.description}"
              </p>
              <div className="mt-3 text-[11px] text-white/40 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Color-graded & prepared in full printable master resolution and optimized web sizing.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setShowDriveGuide(!showDriveGuide)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Info size={14} />
                <span>{showDriveGuide ? 'Hide Download Tips' : 'How to Download via Drive'}</span>
              </button>
              <a
                href={gallery.driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Download All Folder</span>
              </a>
            </div>
          </div>

          {/* Download Instructions Accordion */}
          <AnimatePresence>
            {showDriveGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="p-6 bg-[#0e0e0e] border border-emerald-500/30 text-xs text-white/70 space-y-4">
                  <h4 className="font-display font-bold uppercase tracking-wider text-emerald-400">
                    Google Drive Download Tips for Clients
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[12px]">
                    <div className="space-y-1.5">
                      <strong className="text-white block font-medium">1. Download Entire Album as .ZIP</strong>
                      <p className="text-white/50 leading-relaxed">
                        On your computer, click the title dropdown at the top of the Google Drive folder and choose <strong>"Download"</strong>. Google Drive will automatically zip all high-res photos into one package.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <strong className="text-white block font-medium">2. Save Directly to Your Google Drive</strong>
                      <p className="text-white/50 leading-relaxed">
                        Click <strong>"Add shortcut to Drive"</strong> at the top right of your Google Drive screen to keep permanent instant access inside your personal cloud storage without consuming local hard drive space.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <strong className="text-white block font-medium">3. Saving on iPhone / Android</strong>
                      <p className="text-white/50 leading-relaxed">
                        Open the Google Drive app on your phone, tap the three dots (<span className="font-mono font-bold">•••</span>) beside any photo or video, and tap <strong>"Send a copy" &gt; "Save Image / Save Video"</strong> to save to your camera roll.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Filter Tabs & Favorites Banner */}
      <section className="container mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#111] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              All Deliverables ({gallery.items.length})
            </button>
            <button
              onClick={() => setSelectedFilter('photo')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedFilter === 'photo'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#111] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              Photos ({gallery.items.filter(i => i.type === 'photo').length})
            </button>
            <button
              onClick={() => setSelectedFilter('video')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedFilter === 'video'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#111] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              4K Videos ({gallery.items.filter(i => i.type === 'video').length})
            </button>
            <button
              onClick={() => setSelectedFilter('favorites')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'favorites'
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'bg-[#111] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              <Heart size={13} className={favorites.length > 0 ? 'fill-amber-400 text-amber-400' : ''} />
              <span>Favorites ({favorites.length})</span>
            </button>
          </div>

          {/* Proofing / Album Selection Submission */}
          {favorites.length > 0 && (
            <button
              onClick={handleSendFavoritesToAman}
              className="px-4 py-2 bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <MessageCircle size={14} />
              <span>Send {favorites.length} Selected to Aman</span>
            </button>
          )}
        </div>

        {/* Deliverables Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredItems.map((item, index) => {
            const isFav = favorites.includes(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-[#0e0e0e] border border-white/10 hover:border-white/30 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Media Container */}
                <div className={`relative w-full overflow-hidden bg-black ${item.aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-wider text-white/80 font-medium">
                      {item.type === 'video' ? '4K Cinema Film' : 'Photo Master'}
                    </span>
                    {item.videoDuration && (
                      <span className="px-2 py-0.5 bg-red-600/80 text-white text-[10px] font-mono">
                        {item.videoDuration}
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Toggle */}
                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 rounded-full transition-all cursor-pointer"
                    title={isFav ? 'Remove from favorites' : 'Mark favorite for print / album'}
                  >
                    <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : 'text-white/70'} />
                  </button>

                  {/* Play icon overlay for video */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <Play size={20} className="ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] text-white/90 truncate font-medium">
                      {item.title}
                    </span>
                    <span className="text-xs text-white/60 p-1.5 bg-black/70 rounded">
                      <Maximize2 size={13} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state when filtering */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-[#0c0c0c] border border-white/5">
            <Heart size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-xs uppercase tracking-widest text-white/50">
              No items found in this tab.
            </p>
          </div>
        )}
      </section>

      {/* Floating Bottom Sticky Drive Bar */}
      <aside className="sticky bottom-0 z-30 bg-[#090909]/95 backdrop-blur-md border-t border-white/10 py-3.5 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-white/70">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              All original raw deliverables are stored permanently in your dedicated Google Drive folder.
            </span>
          </div>
          <a
            href={gallery.driveFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-emerald-500 text-black font-semibold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
          >
            <HardDrive size={15} />
            <span>Open in Google Drive</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </aside>

      {/* Fullscreen Media Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
            {/* Top Lightbox Bar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-white/50">
                  {lightboxIndex + 1} / {filteredItems.length}
                </span>
                <span className="h-3 w-[1px] bg-white/20" />
                <h4 className="text-xs font-semibold uppercase tracking-wider truncate max-w-sm">
                  {filteredItems[lightboxIndex].title}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => toggleFavorite(filteredItems[lightboxIndex].id, e)}
                  className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Mark Favorite"
                >
                  <Heart
                    size={18}
                    className={favorites.includes(filteredItems[lightboxIndex].id) ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>

                <a
                  href={gallery.driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-semibold uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                  title="Download / View in Google Drive"
                >
                  <HardDrive size={13} />
                  <span>View in Drive</span>
                </a>

                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 text-white/50 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              <button
                onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length)}
                className="absolute left-4 p-3 bg-black/60 hover:bg-white hover:text-black transition-colors rounded-full z-10 cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>

              <img
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[80vh] max-w-[90vw] object-contain select-none"
              />

              <button
                onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredItems.length)}
                className="absolute right-4 p-3 bg-black/60 hover:bg-white hover:text-black transition-colors rounded-full z-10 cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Bottom Lightbox Bar */}
            <div className="p-3 border-t border-white/10 text-center text-[11px] text-white/40 flex justify-between items-center px-6">
              <span>{filteredItems[lightboxIndex].category}</span>
              <span className="font-mono text-emerald-400">
                {filteredItems[lightboxIndex].resolution || '61MP Master Resolution'}
              </span>
              <span>Use arrow keys to navigate</span>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
