import { useState, useEffect, useMemo, type FormEvent, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HardDrive, 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Plus, 
  Lock, 
  Share2, 
  Check, 
  Calendar, 
  MapPin, 
  Camera, 
  Film, 
  Sparkles, 
  X, 
  Trash2, 
  ShieldCheck,
  Eye,
  MessageCircle,
  Copy
} from 'lucide-react';
import type { ClientGallery } from '../data/clientGalleries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ClientPortalPage() {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<ClientGallery[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New gallery modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    title: '',
    serviceType: 'Event Photography & Videography',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    location: 'Mumbai, India',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    driveFolderUrl: '',
    description: 'Here are all your final color-graded high-resolution photos and 4K cinema cuts. Access raw deliverables anytime via Google Drive.',
    photoCount: '250',
    videoCount: '2',
    totalStorage: '12.5 GB',
    pin: ''
  });
  const [createError, setCreateError] = useState<string | null>(null);

  // The server controls owner access and gallery visibility.
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/session').then(r => r.json()),
      fetch('/api/client-galleries').then(r => r.json())
    ]).then(([session, data]) => {
      setIsOwner(Boolean(session.authenticated));
      setGalleries(data.success && Array.isArray(data.galleries) ? data.galleries : []);
    }).catch(() => setGalleries([]));
  }, []);

  const servicesList = useMemo(() => {
    const set = new Set(galleries.map(g => g.serviceType));
    return ['All', ...Array.from(set)];
  }, [galleries]);

  const filteredGalleries = useMemo(() => {
    return galleries.filter(g => {
      const matchesSearch = 
        g.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === 'All' || g.serviceType === selectedService;
      return matchesSearch && matchesService;
    });
  }, [galleries, searchTerm, selectedService]);

  const handleCreateGallery = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.title.trim() || !formData.driveFolderUrl.trim()) {
      setCreateError('Client Name, Shoot Title, and Google Drive Link are required.');
      return;
    }

    try {
      const res = await fetch('/api/client-galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.gallery) {
        const updated = [data.gallery, ...galleries];
        setGalleries(updated);
        setShowCreateModal(false);
        setFormData({
          clientName: '',
          clientEmail: '',
          title: '',
          serviceType: 'Event Photography & Videography',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          location: 'Mumbai, India',
          coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
          driveFolderUrl: '',
          description: 'Here are all your final color-graded high-resolution photos and 4K cinema cuts. Access raw deliverables anytime via Google Drive.',
          photoCount: '250',
          videoCount: '2',
          totalStorage: '12.5 GB',
          pin: ''
        });
        setCreateError(null);
      } else {
        setCreateError(data.error || 'Failed to create gallery.');
      }
    } catch (err) {
      setCreateError('Could not save the gallery. Please try again.');

    }
  };

  const handleDeleteGallery = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this client gallery?')) return;
    try {
      const response = await fetch(`/api/client-galleries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete gallery.');
      setGalleries(prev => prev.filter(g => g.id !== id));
    } catch {
      alert('Could not delete gallery. Please sign in again and retry.');
    }
  };

  const handleCopyLink = (slug: string, clientName: string, driveUrl: string, e: MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/client-gallery/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsApp = (gallery: ClientGallery, e: MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/client-gallery/${gallery.slug}`;
    const text = encodeURIComponent(
      `Hello ${gallery.clientName}! Your official deliverables from Aman Visual are ready.\n\n` +
      `📁 Project: ${gallery.title}\n` +
      `🔗 Private Gallery: ${url}\n` +
      
      `Thank you for trusting Aman Visual!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/20 blur-[130px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-6">
            <Breadcrumbs variant="pill" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                <HardDrive size={15} />
                <span>Google Drive Cloud Deliverables</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight">
                Client Delivery <span className="text-white/40">Galleries</span>
              </h1>
              <p className="text-sm md:text-base text-white/50 max-w-2xl mt-3 leading-relaxed">
                Access, stream, and download your high-resolution color-graded photography, 
                cinema film cuts, and social media reels hosted securely on dedicated Google Drive cloud folders.
              </p>
            </div>

            {/* Owner Action Buttons */}
            {isOwner && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-3 bg-emerald-500 text-black font-semibold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus size={16} />
                  <span>New Client Gallery</span>
                </button>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-white/5">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client, event title, or city..."
                className="w-full bg-[#111] border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            {/* Service Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {servicesList.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                    selectedService === service 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-[#111] text-white/50 hover:text-white border border-white/5'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galleries Grid */}
      <main className="container mx-auto px-6 md:px-12 py-12 flex-1">
        {filteredGalleries.length === 0 ? (
          <div className="text-center py-20 bg-[#0d0d0d] border border-white/5 p-8">
            <HardDrive size={36} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-display uppercase font-bold text-white/70">No Client Deliveries Found</h3>
            <p className="text-xs text-white/40 mt-1 max-w-md mx-auto">
              No galleries match your search criteria. Try a different query or check your shoot title.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGalleries.map((gallery) => (
              <motion.div
                key={gallery.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-[#0e0e0e] border border-white/10 hover:border-white/25 transition-all flex flex-col relative overflow-hidden"
              >
                {/* Cover Image */}
                <Link to={`/client-gallery/${gallery.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-black/60">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-widest text-emerald-400 font-medium inline-flex items-center gap-1.5">
                      <HardDrive size={11} />
                      Google Drive
                    </span>
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-wider text-white/70">
                      {gallery.serviceType}
                    </span>
                  </div>

                  {/* Media counts indicator */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/80">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                        <Camera size={12} className="text-white/60" /> {gallery.photoCount} Photos
                      </span>
                      {gallery.videoCount > 0 && (
                        <span className="inline-flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                          <Film size={12} className="text-white/60" /> {gallery.videoCount} Videos
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {gallery.totalStorage}
                    </span>
                  </div>
                </Link>

                {/* Body Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-widest mb-1">
                    {gallery.clientName}
                  </div>
                  <Link 
                    to={`/client-gallery/${gallery.slug}`}
                    className="text-base font-display font-bold uppercase tracking-tight text-white group-hover:text-white/80 transition-colors line-clamp-1"
                  >
                    {gallery.title}
                  </Link>

                  <div className="flex items-center gap-4 text-[11px] text-white/40 mt-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {gallery.date}
                    </span>
                    <span className="inline-flex items-center gap-1 line-clamp-1">
                      <MapPin size={12} /> {gallery.location}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <Link
                      to={`/client-gallery/${gallery.slug}`}
                      className="px-4 py-2 bg-white text-black text-[11px] font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>View Gallery</span>
                      <Eye size={13} />
                    </Link>

                    <div className="flex items-center gap-1">
                      {/* Direct Google Drive Folder Button */}
                      {isOwner && gallery.driveFolderUrl && <a
                        href={gallery.driveFolderUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors rounded"
                        title="Open Google Drive Folder Directly"
                      >
                        <HardDrive size={15} />
                      </a>}

                      {/* WhatsApp Share Button */}
                      <button
                        onClick={(e) => handleShareWhatsApp(gallery, e)}
                        className="p-2 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors rounded cursor-pointer"
                        title="Share via WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>

                      {/* Copy Link Button */}
                      <button
                        onClick={(e) => handleCopyLink(gallery.slug, gallery.clientName, gallery.driveFolderUrl, e)}
                        className="p-2 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors rounded cursor-pointer"
                        title="Copy Client Delivery Link"
                      >
                        {copiedId === gallery.slug ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                      </button>

                      {/* Owner Delete Button */}
                      {isOwner && (
                        <button
                          onClick={(e) => handleDeleteGallery(gallery.id, e)}
                          className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded cursor-pointer ml-1"
                          title="Delete Gallery"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* New Client Gallery Modal (For Studio Owner) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-white/15 w-full max-w-xl p-6 sm:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <HardDrive size={16} />
              </div>
              <div>
                <h3 className="font-display uppercase font-bold text-lg tracking-tight">
                  Create Client Delivery Gallery
                </h3>
                <p className="text-xs text-white/40">
                  Deliver full photos and 4K video cuts linked directly to your Google Drive folder.
                </p>
              </div>
            </div>

            {createError && (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateGallery} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Rohan & Aditi Sharma"
                    className="w-full bg-black/60 border border-white/20 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Client Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="e.g. client@email.com"
                    className="w-full bg-black/60 border border-white/20 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                  Shoot / Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Palace Wedding & Grand Reception"
                  className="w-full bg-black/60 border border-white/20 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Crucial Google Drive URL input */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <HardDrive size={13} />
                  Google Drive Shared Folder Link *
                </label>
                <input
                  type="url"
                  required
                  value={formData.driveFolderUrl}
                  onChange={(e) => setFormData({ ...formData, driveFolderUrl: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/1aBcDeFgHi..."
                  className="w-full bg-emerald-950/20 border border-emerald-500/50 px-3.5 py-2.5 text-xs text-emerald-200 placeholder:text-emerald-300/40 focus:outline-none focus:border-emerald-400"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  Tip: In Google Drive, click Share &gt; "Anyone with the link can view", then paste the link here.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Service Type
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Event Photography & Videography">Event Photography & Videography</option>
                    <option value="Wedding Photo & Video">Wedding Photo & Video</option>
                    <option value="Real Estate Photography & Videography">Real Estate</option>
                    <option value="Brand PR Shoots">Brand PR Shoots</option>
                    <option value="Corporate Films">Corporate Films</option>
                    <option value="Fashion & Portfolio Shoot">Fashion & Portfolio</option>
                    <option value="Commercial Visuals">Commercial Visuals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Shoot Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Shoot Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Photo Count
                  </label>
                  <input
                    type="number"
                    value={formData.photoCount}
                    onChange={(e) => setFormData({ ...formData, photoCount: e.target.value })}
                    className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Video Cuts Count
                  </label>
                  <input
                    type="number"
                    value={formData.videoCount}
                    onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
                    className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                    Total Storage
                  </label>
                  <input
                    type="text"
                    value={formData.totalStorage}
                    onChange={(e) => setFormData({ ...formData, totalStorage: e.target.value })}
                    placeholder="e.g. 18.5 GB"
                    className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                  Cover Photo Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /services/..."
                  className="w-full bg-black/60 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                  Personal Message / Note to Client
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/20 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 text-black font-semibold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Create & Generate Client Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 border border-white/20 text-white/70 text-xs uppercase tracking-wider hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
