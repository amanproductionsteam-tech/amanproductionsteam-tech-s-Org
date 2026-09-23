import { useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  Camera, 
  MapPin, 
  Sliders, 
  Plus, 
  Check, 
  Sparkles,
  ArrowRight,
  Maximize2,
  Lock,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  Key,
  AlertCircle,
  Trash2,
  ExternalLink,
  FolderUp,
  HardDrive,
  Instagram
} from 'lucide-react';
import { SERVICES } from '../data';
import { SERVICE_GALLERIES, type ServiceGalleryItem } from '../data/serviceGalleries';
import { extractYouTubeId } from '../lib/youtubeUtils';
import { 
  extractGoogleDriveId, 
  isGoogleDriveUrl, 
  getGoogleDrivePreviewUrl, 
  getGoogleDriveThumbnailUrl, 
  getGoogleDriveDirectPlayUrl, 
  openGoogleDriveDirectly,
  isInstagramUrl,
  openInstagramDirectly,
  cleanInstagramUrl
} from '../lib/driveUtils';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ServiceGalleryPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  // Find active service
  const activeService = useMemo(() => {
    return SERVICES.find(s => s.id === serviceId) || SERVICES[0];
  }, [serviceId]);

  // Local storage uploaded items for this service
  const [customItems, setCustomItems] = useState<ServiceGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`custom_gallery_${activeService.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load custom items when service changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`custom_gallery_${activeService.id}`);
      setCustomItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCustomItems([]);
    }
    setSelectedSubCategory('All');
    setLightboxIndex(null);
  }, [activeService.id]);

  // Service gallery items for this specific service
  const baseItems = SERVICE_GALLERIES[activeService.id] || [];
  const allItems = useMemo(() => {
    return [...customItems, ...baseItems];
  }, [customItems, baseItems]);

  // Filter by subcategory
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const subCategories = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [allItems]);

  const filteredItems = useMemo(() => {
    if (selectedSubCategory === 'All') return allItems;
    return allItems.filter(item => item.category === selectedSubCategory);
  }, [allItems, selectedSubCategory]);

  // Owner authentication state (Aman Visual exclusive access)
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aman_is_owner') === 'true';
    } catch {
      return false;
    }
  });
  const [showOwnerUnlockModal, setShowOwnerUnlockModal] = useState(false);
  const [ownerPasscode, setOwnerPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Sync owner state across tabs/windows
  useEffect(() => {
    const handleStorage = () => {
      try {
        setIsOwner(localStorage.getItem('aman_is_owner') === 'true');
      } catch {
        setIsOwner(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleOwnerUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (ownerPasscode.trim() === '8827474622') {
      try {
        localStorage.setItem('aman_is_owner', 'true');
      } catch {}
      setIsOwner(true);
      setShowOwnerUnlockModal(false);
      setOwnerPasscode('');
      setPasscodeError(false);
      setIsAddModalOpen(true);
    } else {
      setPasscodeError(true);
    }
  };

  const handleOwnerLock = () => {
    try {
      localStorage.removeItem('aman_is_owner');
    } catch {}
    setIsOwner(false);
  };

  const handleOpenAddModal = () => {
    if (isOwner) {
      setIsAddModalOpen(true);
    } else {
      setShowOwnerUnlockModal(true);
    }
  };

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Add Media Modal State (Photo or Video)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('video');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(activeService.title);
  const [newClient, setNewClient] = useState('');
  const [newLocation, setNewLocation] = useState('Mumbai, India');
  const [newGear, setNewGear] = useState('Sony A7IV • Cinema');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('0:45');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Quick Google Drive Video Paste state on the empty state section
  const [quickDriveUrl, setQuickDriveUrl] = useState('');
  const [quickDriveTitle, setQuickDriveTitle] = useState('');
  const [quickDriveSuccess, setQuickDriveSuccess] = useState(false);
  const [quickDriveError, setQuickDriveError] = useState('');

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);

    const isVideoFile = file.type.startsWith('video/');
    if (isVideoFile) {
      setMediaType('video');
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setNewMediaUrl(result);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setIsUploadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomItem = (e: FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      setIsAddModalOpen(false);
      setShowOwnerUnlockModal(true);
      return;
    }

    if (!newMediaUrl.trim() || !newTitle.trim()) return;

    // Detect if entered URL is a Google Drive video, Instagram link, YouTube link, or local media
    const driveId = extractGoogleDriveId(newMediaUrl);
    const isDrive = !!driveId;
    const isYouTube = !!extractYouTubeId(newMediaUrl);
    const isInsta = isInstagramUrl(newMediaUrl);
    const resolvedType = (mediaType === 'video' || isDrive || isYouTube || isInsta) ? 'video' : 'photo';

    const cleanInsta = isInsta ? cleanInstagramUrl(newMediaUrl) : undefined;
    const resolvedSrc = isInsta 
      ? (customCoverUrl.trim() || activeService.image) 
      : newMediaUrl.trim();

    const newItem: ServiceGalleryItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      type: resolvedType,
      src: resolvedSrc,
      category: newCategory.trim() || activeService.title,
      client: newClient.trim() || 'Aman Visual Production',
      location: newLocation.trim() || 'Mumbai, India',
      gear: isInsta 
        ? (newGear.trim() || 'Instagram Reel • Aman Visual') 
        : (newGear.trim() || 'Sony Alpha Series • FX3 Cinema'),
      aspectRatio: isInsta ? 'portrait' : 'landscape',
      videoDuration: resolvedType === 'video' 
        ? (newVideoDuration.trim() || (isInsta ? 'REEL' : isDrive ? 'G-DRIVE' : 'CINEMA')) 
        : undefined,
      isGoogleDrive: isDrive,
      driveFileId: driveId || undefined,
      isInstagram: isInsta,
      instagramUrl: cleanInsta,
      thumbnailUrl: isInsta ? (customCoverUrl.trim() || activeService.image) : undefined
    };

    const updated = [newItem, ...customItems];
    setCustomItems(updated);
    try {
      localStorage.setItem(`custom_gallery_${activeService.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    // Reset & Close
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewMediaUrl('');
    setCustomCoverUrl('');
    setNewClient('');
    setNewVideoDuration('0:45');
  };

  const handleQuickGoogleDriveSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuickDriveError('');

    const rawUrl = quickDriveUrl.trim();
    if (!rawUrl) {
      setQuickDriveError('Please paste a Google Drive video link or Instagram link.');
      return;
    }

    const driveId = extractGoogleDriveId(rawUrl);
    const isInsta = isInstagramUrl(rawUrl);

    if (!driveId && !isInsta) {
      setQuickDriveError('Please paste a valid Google Drive video link or Instagram Reel/Post URL.');
      return;
    }

    const videoTitle = quickDriveTitle.trim() || (isInsta ? `${activeService.title} Instagram Reel` : `${activeService.title} Video Reel`);

    const newItem: ServiceGalleryItem = {
      id: isInsta ? `custom-insta-${Date.now()}` : `custom-drive-${Date.now()}`,
      title: videoTitle,
      type: 'video',
      src: isInsta ? activeService.image : rawUrl,
      category: activeService.title,
      client: 'Aman Visual Production',
      location: 'Mumbai, India',
      gear: isInsta ? 'Instagram Reel • Aman Visual' : 'Sony FX3 Cinema • 4K Master',
      aspectRatio: isInsta ? 'portrait' : 'landscape',
      videoDuration: isInsta ? 'REEL' : 'G-DRIVE',
      isGoogleDrive: !!driveId,
      driveFileId: driveId || undefined,
      isInstagram: isInsta,
      instagramUrl: isInsta ? cleanInstagramUrl(rawUrl) : undefined,
      thumbnailUrl: isInsta ? activeService.image : undefined
    };

    const updated = [newItem, ...customItems];
    setCustomItems(updated);
    try {
      localStorage.setItem(`custom_gallery_${activeService.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    // Give visual confirmation
    setQuickDriveSuccess(true);
    setQuickDriveUrl('');
    setQuickDriveTitle('');
    setTimeout(() => {
      setQuickDriveSuccess(false);
    }, 4000);
  };

  const handleDeleteCustomItem = (idToDelete: string) => {
    if (!isOwner) return;
    const updated = customItems.filter(item => item.id !== idToDelete);
    setCustomItems(updated);
    try {
      localStorage.setItem(`custom_gallery_${activeService.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update localStorage', err);
    }
    if (lightboxIndex !== null) {
      setLightboxIndex(null);
    }
  };

  const Icon = activeService.icon;
  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-darker text-white selection:bg-white selection:text-black">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-40 bg-darker/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/#services' },
              { label: activeService.title }
            ]}
            variant="inline"
          />
        </div>

        <div className="flex items-center gap-3">
          {isOwner ? (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-500 text-black text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg"
              title="Upload Photos & Videos as Owner"
            >
              <Plus size={14} />
              <span>Upload Media (Owner)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              title="Owner Authentication Required to Upload"
            >
              <Lock size={12} className="text-white/60" />
              <span>Owner Upload</span>
            </button>
          )}
          <Link
            to="/portfolio"
            className="px-3 py-1.5 border border-white/20 text-white/70 hover:text-white text-[11px] tracking-wider uppercase transition-colors"
          >
            Full Portfolio
          </Link>
        </div>
      </header>

      {/* Hero Banner with Dynamic Visual & Service Title */}
      <section className="relative border-b border-white/10 py-16 sm:py-24 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 z-0">
          <img 
            src={activeService.image} 
            alt={activeService.title} 
            className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darker via-darker/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-white mb-4">
              {activeService.title}
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-light max-w-2xl leading-relaxed mb-8">
              {activeService.desc} Handcrafted visual archive showcasing high-resolution compositions, dynamic lighting, and cinematic storytelling.
            </p>

            {/* Quick Service Category Navigation Bar */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-[11px] uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                <Sliders size={12} />
                <span>Jump to Section (12 Services Available)</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {SERVICES.map((srv) => {
                  const isActive = srv.id === activeService.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => navigate(`/services/${srv.id}`)}
                      className={`px-3 py-1.5 text-xs whitespace-nowrap tracking-wider uppercase border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white text-black border-white font-medium shadow-md' 
                          : 'bg-black/40 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {srv.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Filter & Counter Bar */}
      <section className="py-6 border-b border-white/10 bg-darker/60 backdrop-blur-sm sticky top-[65px] z-30">
        <div className="container mx-auto px-6 md:px-12 flex flex-wrap justify-between items-center gap-4">
          {/* Subcategory Pills */}
          {subCategories.length > 1 ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer rounded-full ${
                    selectedSubCategory === sub
                      ? 'bg-white/20 text-white border border-white/40 font-medium'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs uppercase tracking-widest text-white/50 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
              <span>{activeService.title}</span>
            </div>
          )}

          {/* Counter info & Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-white/40 uppercase tracking-widest font-mono hidden sm:block">
              {filteredItems.length > 0 ? (
                <>Showing <span className="text-white font-semibold">{filteredItems.length}</span> works</>
              ) : (
                <span>0 media works</span>
              )}
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-wider font-medium rounded-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open Studio Uploader"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Upload Media</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const itemNumber = String(index + 1).padStart(2, '0');
                const isVideo = item.type === 'video';
                const isDrive = item.isGoogleDrive || isGoogleDriveUrl(item.src);
                const driveId = item.driveFileId || extractGoogleDriveId(item.src);
                const isInstagram = item.isInstagram || isInstagramUrl(item.src) || Boolean(item.instagramUrl && isInstagramUrl(item.instagramUrl));
                const instaUrl = item.instagramUrl || (isInstagramUrl(item.src) ? item.src : undefined);

                // Crystal-clear preview source
                const displaySrc = isDrive && driveId 
                  ? getGoogleDriveThumbnailUrl(driveId) 
                  : (isInstagram && isInstagramUrl(item.src) ? (item.thumbnailUrl || activeService.image) : item.src);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: (index % 6) * 0.05, duration: 0.5 }}
                    onClick={() => {
                      if (isInstagram && instaUrl) {
                        openInstagramDirectly(instaUrl);
                      } else if (isDrive && driveId) {
                        openGoogleDriveDirectly(driveId);
                      } else if (isVideo) {
                        const ytId = extractYouTubeId(item.src);
                        if (ytId) {
                          window.open(`https://www.youtube.com/watch?v=${ytId}`, '_blank', 'noopener,noreferrer');
                        } else if (item.src.startsWith('http')) {
                          window.open(item.src, '_blank', 'noopener,noreferrer');
                        } else {
                          setLightboxIndex(index);
                        }
                      } else {
                        setLightboxIndex(index);
                      }
                    }}
                    className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 border border-white/15 hover:border-white/50 cursor-pointer transition-all duration-300 shadow-xl rounded-sm"
                  >
                    {/* Normal clear photo preview - crystal clear, no blur filter */}
                    <img
                      src={displaySrc}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        // High quality fallback if needed
                        (e.target as HTMLImageElement).src = activeService.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1200';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                    />

                    {/* Clean subtle bottom gradient for text readability without obscuring photo */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                    {/* Video / Reel / Drive Badge */}
                    {isVideo && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 z-10 pointer-events-none">
                        {isInstagram ? (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-[10px] font-bold tracking-wider uppercase text-white flex items-center gap-1.5 rounded-sm shadow-md">
                            <Instagram size={11} />
                            Instagram Reel
                          </span>
                        ) : isDrive ? (
                          <span className="px-2.5 py-1 bg-blue-600 text-[10px] font-bold tracking-wider uppercase text-white flex items-center gap-1 rounded-sm shadow-md">
                            <ExternalLink size={10} />
                            Google Drive
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-600 text-[10px] font-bold tracking-wider uppercase text-white flex items-center gap-1 rounded-sm shadow-md">
                            <Play size={10} fill="currentColor" />
                            {item.videoDuration || 'VIDEO'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Prominent Play Button: Tapping visits the link directly */}
                    {isVideo ? (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInstagram && instaUrl) {
                              openInstagramDirectly(instaUrl);
                            } else if (isDrive && driveId) {
                              openGoogleDriveDirectly(driveId);
                            } else if (extractYouTubeId(item.src)) {
                              window.open(`https://www.youtube.com/watch?v=${extractYouTubeId(item.src)}`, '_blank', 'noopener,noreferrer');
                            } else if (item.src.startsWith('http')) {
                              window.open(item.src, '_blank', 'noopener,noreferrer');
                            } else {
                              setLightboxIndex(index);
                            }
                          }}
                          aria-label={`Play ${item.title}`}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white shadow-2xl flex items-center justify-center transform group-hover:scale-115 transition-all duration-300 border-2 border-white/95 cursor-pointer drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] ${
                            isInstagram 
                              ? 'bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 hover:brightness-110' 
                              : 'bg-red-600 hover:bg-red-500'
                          }`}
                          title={isInstagram ? "Tap to Watch on Instagram" : "Tap to Play Video"}
                        >
                          {isInstagram ? (
                            <Instagram size={26} className="text-white" />
                          ) : (
                            <Play size={26} fill="currentColor" className="ml-1" />
                          )}
                        </button>
                      </div>
                    ) : (
                      /* Hover action for photos */
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-xl">
                          <Maximize2 size={18} />
                        </div>
                      </div>
                    )}

                    {/* Bottom title & metadata overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end pointer-events-none">
                      <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-white/60 mb-1">
                        <span>#{itemNumber} • {item.category}</span>
                        <span className="text-white/50">{item.gear.split('•')[0]}</span>
                      </div>
                      <h3 className="text-sm font-semibold tracking-wide text-white transition-colors truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-white/60 mt-1">
                        <MapPin size={11} className="text-white/50" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div 
                id="gallery-empty-state"
                className="col-span-full py-14 px-6 md:px-14 border border-dashed border-white/20 rounded-md bg-gradient-to-b from-neutral-900/60 to-neutral-950/80 text-center max-w-3xl mx-auto my-6 transition-all duration-300 shadow-2xl backdrop-blur-sm"
              >
                {isOwner ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center mx-auto mb-5 text-white shadow-lg">
                      <Instagram size={28} strokeWidth={1.5} className="text-pink-400" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded-full text-emerald-400 text-xs uppercase tracking-wider font-mono mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Owner Mode • {activeService.title}</span>
                    </div>
                    <h3 className="text-2xl font-display uppercase font-bold text-white mb-2 tracking-wide">
                      Add Video / Reel to {activeService.title}
                    </h3>
                    <p className="text-sm text-white/70 font-light max-w-lg mx-auto mb-6 leading-relaxed">
                      Paste any Instagram Reel URL or shareable Google Drive video link below. The interactive preview will immediately appear in this gallery, and tapping it takes viewers straight to the link.
                    </p>

                    {/* Quick Media Direct Paste Form */}
                    <form onSubmit={handleQuickGoogleDriveSubmit} className="max-w-xl mx-auto mb-6 text-left bg-black/80 border border-white/15 p-4 sm:p-5 rounded-md shadow-xl">
                      <label className="block text-[11px] uppercase tracking-wider text-white/80 font-semibold mb-1.5 flex items-center justify-between">
                        <span>Paste Instagram Reel or Google Drive Link</span>
                        <span className="text-pink-400 text-[10px] lowercase font-mono">instagram.com/reel/...</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          placeholder="https://www.instagram.com/reel/... or Google Drive"
                          value={quickDriveUrl}
                          onChange={(e) => {
                            setQuickDriveUrl(e.target.value);
                            setQuickDriveError('');
                          }}
                          className="flex-1 bg-neutral-900 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-white/35 focus:border-pink-500 focus:outline-none rounded-sm"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-white hover:bg-white/90 text-black text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap rounded-sm shadow-md"
                        >
                          <Plus size={15} />
                          <span>Add to Gallery</span>
                        </button>
                      </div>

                      {/* Optional Title input */}
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder={`Title (Optional, default: ${activeService.title} Reel)`}
                          value={quickDriveTitle}
                          onChange={(e) => setQuickDriveTitle(e.target.value)}
                          className="w-full bg-neutral-900/70 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/35 focus:border-white/40 focus:outline-none rounded-sm"
                        />
                      </div>

                      {/* Error or Success notification */}
                      {quickDriveError && (
                        <div className="mt-2.5 text-xs text-red-400 flex items-center gap-1.5">
                          <AlertCircle size={14} />
                          <span>{quickDriveError}</span>
                        </div>
                      )}
                      {quickDriveSuccess && (
                        <div className="mt-2.5 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                          <Check size={14} />
                          <span>Media added! Preview is now live in this gallery.</span>
                        </div>
                      )}

                      {/* Instant Live Preview while typing/pasting */}
                      {quickDriveUrl && isInstagramUrl(quickDriveUrl) && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-[11px] text-white/70 mb-2">
                            <span className="uppercase tracking-wider font-mono text-pink-400 font-semibold">Instagram Preview:</span>
                            <button
                              type="button"
                              onClick={() => openInstagramDirectly(quickDriveUrl)}
                              className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-[11px] underline cursor-pointer"
                            >
                              <span>Test Direct Open</span>
                              <ExternalLink size={11} />
                            </button>
                          </div>
                          <div 
                            onClick={() => openInstagramDirectly(quickDriveUrl)}
                            title="Click preview to open Instagram link"
                            className="w-full aspect-video rounded-sm overflow-hidden bg-gradient-to-br from-[#833ab4]/30 via-[#fd1d1d]/20 to-[#fcb045]/30 border border-pink-500/40 hover:border-pink-400 relative cursor-pointer group shadow-xl flex flex-col items-center justify-center p-4 text-center"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 text-white shadow-2xl flex items-center justify-center border-2 border-white/95 group-hover:scale-110 transition-transform mb-2">
                              <Instagram size={26} />
                            </div>
                            <div className="px-3 py-1 bg-black/80 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/20">
                              <span>Tap to Open Instagram Link</span>
                              <ExternalLink size={12} />
                            </div>
                            <span className="text-[10px] text-white/50 mt-1.5">Directly takes viewers to this reel on Instagram</span>
                          </div>
                        </div>
                      )}

                      {quickDriveUrl && !isInstagramUrl(quickDriveUrl) && extractGoogleDriveId(quickDriveUrl) && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-[11px] text-white/70 mb-2">
                            <span className="uppercase tracking-wider font-mono text-blue-400 font-semibold">Live Preview:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const id = extractGoogleDriveId(quickDriveUrl);
                                if (id) openGoogleDriveDirectly(id);
                              }}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px] underline cursor-pointer"
                            >
                              <span>Test Direct Open</span>
                              <ExternalLink size={11} />
                            </button>
                          </div>
                          <div 
                            onClick={() => {
                              const id = extractGoogleDriveId(quickDriveUrl);
                              if (id) openGoogleDriveDirectly(id);
                            }}
                            title="Click preview to open & play in Google Drive"
                            className="w-full aspect-video rounded-sm overflow-hidden bg-black border border-white/20 hover:border-red-500/60 relative cursor-pointer group shadow-xl"
                          >
                            <img
                              src={getGoogleDriveThumbnailUrl(extractGoogleDriveId(quickDriveUrl)!)}
                              alt="Preview"
                              className="w-full h-full object-cover select-none"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1200';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 flex flex-col items-center justify-center transition-all">
                              <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-2xl flex items-center justify-center border-2 border-white/95 group-hover:scale-110 transition-transform">
                                <Play size={24} fill="currentColor" className="ml-0.5" />
                              </div>
                              <div className="mt-2.5 px-3 py-1 bg-black/80 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/20">
                                <span>Tap to Open & Play in Google Drive</span>
                                <ExternalLink size={12} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg rounded-sm"
                      >
                        <Plus size={14} />
                        <span>Open Full Studio Uploader</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOwnerLock}
                        className="px-4 py-2.5 border border-white/20 text-white/70 font-medium text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all inline-flex items-center gap-2 cursor-pointer rounded-sm"
                        title="Lock back to public visitor mode"
                      >
                        <Lock size={12} />
                        <span>Lock Mode</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mx-auto mb-5 text-white/50">
                      <Lock size={26} strokeWidth={1.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs uppercase tracking-wider font-mono mb-4">
                      <Lock size={12} className="text-white/40" />
                      <span>{activeService.title} Portfolio</span>
                    </div>
                    <h3 className="text-2xl font-display uppercase font-bold text-white mb-2 tracking-wide">
                      Aman Visual • {activeService.title}
                    </h3>
                    <p className="text-sm text-white/60 font-light max-w-lg mx-auto mb-8 leading-relaxed">
                      Custom productions are captured on high-end cinema cameras and delivered directly to clients. Aman Visual owners can unlock and paste Google Drive videos or upload media to this gallery.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <a
                        href="/#contact"
                        className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-lg rounded-sm"
                      >
                        <span>Inquire for Commission</span>
                        <ArrowRight size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowOwnerUnlockModal(true)}
                        className="px-5 py-3 bg-blue-600/20 border border-blue-500/40 text-blue-300 font-semibold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all inline-flex items-center gap-2 cursor-pointer rounded-sm shadow-md"
                        title="Owner passcode authentication to add Google Drive video"
                      >
                        <HardDrive size={13} />
                        <span>Owner Unlock & Add Google Drive Video</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between"
          >
            {/* Lightbox Header Bar */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center text-xs tracking-wider uppercase z-20">
              <div className="flex items-center gap-3">
                <span className="text-white/40 font-mono">
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-white font-medium">{currentItem.title}</span>
                <span className="px-2 py-0.5 text-[10px] border border-white/20 rounded text-white/60">
                  {currentItem.category}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {isOwner && currentItem.id.startsWith('custom-') && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomItem(currentItem.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white transition-all text-xs uppercase tracking-wider cursor-pointer"
                    title="Delete uploaded item"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Lightbox Center Media Stage */}
            <div className="flex-1 relative flex items-center justify-center p-4 sm:p-12 overflow-hidden">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length))}
                className="absolute left-4 sm:left-8 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
                {currentItem.type === 'video' ? (
                  currentItem.isInstagram || isInstagramUrl(currentItem.src) || Boolean(currentItem.instagramUrl && isInstagramUrl(currentItem.instagramUrl)) ? (
                    <div className="w-full max-w-md bg-neutral-900 border border-white/20 rounded-md p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 flex items-center justify-center text-white shadow-xl mb-4">
                        <Instagram size={40} />
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-[11px] font-bold tracking-wider uppercase rounded-full mb-3 shadow">
                        Instagram Reel / Post
                      </span>
                      <h3 className="text-xl font-display uppercase font-bold text-white mb-2">
                        {currentItem.title}
                      </h3>
                      <p className="text-xs text-white/60 mb-6 max-w-xs">
                        This production is hosted on Instagram. Tap below to view full video and audio directly on Instagram.
                      </p>
                      <button
                        type="button"
                        onClick={() => openInstagramDirectly(currentItem.instagramUrl || currentItem.src)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm shadow-xl transition-all cursor-pointer"
                      >
                        <Instagram size={16} />
                        <span>Open & Watch on Instagram</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  ) : currentItem.isGoogleDrive || isGoogleDriveUrl(currentItem.src) ? (
                    <div className="w-full aspect-video max-h-[75vh] max-w-4xl shadow-2xl rounded-sm overflow-hidden bg-black flex flex-col border border-white/20">
                      {/* Top banner explaining preview & direct play */}
                      <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-white/10 text-xs">
                        <span className="text-white/80 font-medium flex items-center gap-1.5">
                          <HardDrive size={14} className="text-blue-400" />
                          <span>Google Drive Video Reel</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const driveId = currentItem.driveFileId || extractGoogleDriveId(currentItem.src);
                            if (driveId) openGoogleDriveDirectly(driveId);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Open & Play in Google Drive</span>
                          <ExternalLink size={12} />
                        </button>
                      </div>
                      
                      {/* Google Drive Preview Iframe with click trigger */}
                      <div className="relative flex-1 bg-black">
                        <iframe
                          src={getGoogleDrivePreviewUrl(currentItem.driveFileId || extractGoogleDriveId(currentItem.src)!)}
                          title={currentItem.title}
                          allow="autoplay"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                    </div>
                  ) : extractYouTubeId(currentItem.src) ? (
                    <div className="w-full aspect-video max-h-[75vh] max-w-4xl shadow-2xl rounded-sm overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(currentItem.src)}?autoplay=1&rel=0`}
                        title={currentItem.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <video
                      controls
                      autoPlay
                      playsInline
                      src={currentItem.src}
                      className="max-h-[75vh] max-w-full object-contain shadow-2xl rounded-sm bg-black"
                    />
                  )
                ) : (
                  <motion.img
                    key={currentItem.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    src={currentItem.src}
                    alt={currentItem.title}
                    className="max-h-[75vh] max-w-full object-contain shadow-2xl select-none"
                  />
                )}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length))}
                className="absolute right-4 sm:right-8 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Next (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Bottom Info Bar */}
            <div className="px-6 py-4 border-t border-white/10 bg-darker/90 flex flex-wrap justify-between items-center gap-4 text-xs text-white/70 z-20">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-mono">Commission</span>
                  <span className="text-white font-medium">{currentItem.client}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-mono">Location</span>
                  <span className="text-white">{currentItem.location}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-white/40 block text-[10px] uppercase font-mono">Equipment Specs</span>
                  <span className="text-white">{currentItem.gear}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/#contact"
                  onClick={() => setLightboxIndex(null)}
                  className="px-4 py-2 bg-white text-black font-semibold uppercase text-xs tracking-wider hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                >
                  <span>Inquire for Project</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Studio Media Uploader Modal (Photos & Videos) */}
      {isAddModalOpen && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141414] border border-white/20 p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-mono">Owner Studio</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-mono">
                Aman Visual
              </span>
            </div>

            <h3 className="text-xl font-display uppercase font-bold text-white mb-2">
              Upload Media to {activeService.title}
            </h3>
            <p className="text-xs text-white/60 mb-5">
              Only you (Aman Visual) can upload photos and videos to this showcase.
            </p>

            {/* Media Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 border border-white/10 rounded-sm mb-5">
              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all cursor-pointer ${
                  mediaType === 'photo' ? 'bg-white text-black shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                <ImageIcon size={14} />
                <span>Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all cursor-pointer ${
                  mediaType === 'video' ? 'bg-white text-black shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                <Video size={14} />
                <span>Video</span>
              </button>
            </div>

            <form onSubmit={handleSaveCustomItem} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                  Upload {mediaType === 'video' ? 'Video' : 'Image'} File
                </label>
                <input
                  type="file"
                  accept={mediaType === 'video' ? 'video/*,image/*' : 'image/*'}
                  onChange={handleFileUpload}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:bg-white file:text-black file:font-semibold hover:file:bg-white/90 cursor-pointer border border-white/10 p-2 bg-black/50"
                />
                {isUploadingFile && <p className="text-[11px] text-white/50 mt-1">Processing file...</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 flex items-center justify-between">
                  <span>Or {mediaType === 'video' ? 'Instagram Reel / Google Drive / YouTube / Video URL' : 'Image Web URL'}</span>
                  {mediaType === 'video' && <span className="text-[10px] text-pink-400 lowercase font-mono">supports Instagram & Google Drive</span>}
                </label>
                <input
                  type="text"
                  placeholder={mediaType === 'video' ? "https://www.instagram.com/reel/... or Google Drive or YouTube" : "https://... or /events/r.jpg"}
                  value={newMediaUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewMediaUrl(val);
                    if (isInstagramUrl(val) && !newTitle) {
                      setNewTitle(`${activeService.title} Instagram Reel`);
                    }
                  }}
                  className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Preview preview container */}
              {newMediaUrl && (
                <div className="w-full h-36 bg-black/80 border border-white/10 overflow-hidden flex items-center justify-center relative rounded-sm">
                  {isInstagramUrl(newMediaUrl) ? (
                    <div 
                      onClick={() => openInstagramDirectly(newMediaUrl)}
                      title="Tap to open Instagram link"
                      className="w-full h-full relative group cursor-pointer overflow-hidden bg-gradient-to-br from-[#833ab4]/30 via-[#fd1d1d]/20 to-[#fcb045]/30 border border-pink-500/40 p-3 flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 text-white shadow-xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        <Instagram size={22} />
                      </div>
                      <div className="px-2.5 py-0.5 bg-black/80 text-white rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-md border border-white/20">
                        <span>Instagram Reel / Post (Tap to Test Link)</span>
                        <ExternalLink size={10} />
                      </div>
                      <span className="text-[10px] text-white/50 mt-1">Directly takes viewers to this reel on Instagram</span>
                    </div>
                  ) : extractGoogleDriveId(newMediaUrl) ? (
                    <div 
                      onClick={() => openGoogleDriveDirectly(extractGoogleDriveId(newMediaUrl)!)}
                      className="w-full h-full relative group cursor-pointer overflow-hidden bg-black"
                    >
                      <img
                        src={getGoogleDriveThumbnailUrl(extractGoogleDriveId(newMediaUrl)!)}
                        alt="Drive Preview"
                        className="w-full h-full object-cover select-none"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1200';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 flex flex-col items-center justify-center transition-colors p-2 text-center">
                        <div className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl flex items-center justify-center border border-white/90 group-hover:scale-110 transition-transform mb-1.5">
                          <Play size={18} fill="currentColor" className="ml-0.5" />
                        </div>
                        <div className="px-2.5 py-0.5 bg-black/80 text-white rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-md border border-white/20">
                          <span>Tap to Open & Play in Google Drive</span>
                          <ExternalLink size={10} />
                        </div>
                      </div>
                    </div>
                  ) : mediaType === 'video' || extractYouTubeId(newMediaUrl) ? (
                    extractYouTubeId(newMediaUrl) ? (
                      <div className="text-center p-4">
                        <Play size={24} className="mx-auto text-red-500 mb-1" />
                        <span className="text-[11px] text-white/70 block">YouTube Video Linked</span>
                      </div>
                    ) : (
                      <video src={newMediaUrl} className="h-full w-full object-contain" controls />
                    )
                  ) : (
                    <img src={newMediaUrl} alt="Preview" className="h-full w-full object-contain" />
                  )}
                </div>
              )}

              {/* Optional custom cover photo for Instagram */}
              {isInstagramUrl(newMediaUrl) && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-pink-400 mb-1 flex items-center justify-between">
                    <span>Optional Cover Image URL</span>
                    <span className="text-[10px] text-white/40">Shown on gallery card</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. image URL or leave empty for service showcase cover"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    {mediaType === 'video' ? 'Video Title' : 'Photo Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={mediaType === 'video' ? "e.g. Cinema Teaser 4K" : "e.g. VIP Gala Reception"}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  {mediaType === 'video' ? (
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                        Video Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0:45 or 1:30"
                        value={newVideoDuration}
                        onChange={(e) => setNewVideoDuration(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                        Subcategory Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Showcase"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    Client / Production
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai Summit"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    Gear Specs
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sony FX3 • 24-70mm GM"
                    value={newGear}
                    onChange={(e) => setNewGear(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-xs uppercase tracking-wider text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMediaUrl || !newTitle}
                  className="px-5 py-2 bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-white/90 disabled:opacity-40 cursor-pointer"
                >
                  Save {mediaType === 'video' ? 'Video' : 'Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Owner Unlock Passcode Modal */}
      {showOwnerUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#141414] border border-white/20 p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setShowOwnerUnlockModal(false);
                setPasscodeError(false);
                setOwnerPasscode('');
              }}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white">
              <Lock size={20} />
            </div>

            <h3 className="text-xl font-display uppercase font-bold text-white mb-2">
              Owner Authentication
            </h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              Only the portfolio owner (Aman Visual) can upload photos and videos to this showcase. Enter your studio passcode to authenticate.
            </p>

            <form onSubmit={handleOwnerUnlock} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Studio Passcode / PIN
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter passcode..."
                  value={ownerPasscode}
                  onChange={(e) => {
                    setOwnerPasscode(e.target.value);
                    if (passcodeError) setPasscodeError(false);
                  }}
                  className={`w-full bg-black/60 border px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none tracking-widest ${
                    passcodeError ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                />
                {passcodeError && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Incorrect passcode. Only the verified owner can upload.</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key size={14} />
                  <span>Verify & Unlock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commission CTA Footer */}
      <section className="py-20 border-t border-white/10 bg-dark text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display uppercase font-bold text-white mb-4">
            Commission Aman Visual for {activeService.title}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 font-light">
            Available for high-profile productions, commercial campaigns, corporate summits, and luxury coverage across Mumbai, Goa, Bengaluru, and worldwide.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/#contact"
              className="px-8 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-xl"
            >
              <span>Get in Touch</span>
              <ArrowRight size={14} />
            </a>
            <Link
              to="/portfolio"
              className="px-8 py-3.5 border border-white/30 text-white font-medium text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
            >
              Explore All 50 Works
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
