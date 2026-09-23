import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Clock, 
  Users, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Calculator, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import CashfreeBookingModal, { type BookingItemDetails } from './CashfreeBookingModal';
import { CORE_PRICING_PACKAGES, CALCULATOR_CONFIG, type PricingPackage } from '../data/pricingData';
import { getCashfreePaymentLink } from '../config/payment';

export default function PricingSection() {
  // Cashfree Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [cashfreeDirectUrl, setCashfreeDirectUrl] = useState<string>(() => getCashfreePaymentLink());
  const [gatewayConfigured, setGatewayConfigured] = useState<boolean | null>(null);

  // Listen for direct link updates from admin or config
  useEffect(() => {
    const updateLink = () => {
      setCashfreeDirectUrl(getCashfreePaymentLink());
    };
    updateLink();
    window.addEventListener('cashfree_link_updated', updateLink);
    window.addEventListener('storage', updateLink);
    // Also fetch config in background
    fetch('/api/cashfree/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.directPaymentLink) {
            setCashfreeDirectUrl(data.directPaymentLink);
          }
          setGatewayConfigured(Boolean(data.isConfigured));
        }
      })
      .catch(() => {});
    return () => {
      window.removeEventListener('cashfree_link_updated', updateLink);
      window.removeEventListener('storage', updateLink);
    };
  }, []);

  const [activeBooking, setActiveBooking] = useState<BookingItemDetails>({
    serviceTitle: 'Cinematic Duo (Photo + Video)',
    totalEstimate: 35000,
    advanceAmount: 17500,
    initialAdvanceType: 'standard',
    packageType: 'package'
  });

  const openPackageBooking = (pkg: PricingPackage) => {
    const advance = Math.round(pkg.startingPrice * 0.5);
    setActiveBooking({
      serviceTitle: pkg.name,
      totalEstimate: pkg.startingPrice,
      advanceAmount: advance,
      initialAdvanceType: 'standard',
      packageType: 'package'
    });
    setIsBookingModalOpen(true);
  };

  // Mini interactive estimator state for quick home page interaction
  const [selectedServiceId, setSelectedServiceId] = useState('portrait');
  const [selectedDurationId, setSelectedDurationId] = useState('half_day');

  const liveEstimate = useMemo(() => {
    const service = CALCULATOR_CONFIG.services.find(s => s.id === selectedServiceId) || CALCULATOR_CONFIG.services[0];
    const duration = CALCULATOR_CONFIG.durations.find(d => d.id === selectedDurationId) || CALCULATOR_CONFIG.durations[0];
    const base = Math.round((service.baseRate * duration.multiplier) / 500) * 500;
    const minPrice = Math.max(7000, base);
    const maxPrice = Math.round((base * 1.2) / 500) * 500;
    return {
      serviceName: service.name,
      durationLabel: duration.label,
      exactEstimated: minPrice,
      rangeText: `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`,
    };
  }, [selectedServiceId, selectedDurationId]);

  const openQuickEstimateBooking = () => {
    setActiveBooking({
      serviceTitle: `${liveEstimate.serviceName} (${liveEstimate.durationLabel})`,
      totalEstimate: liveEstimate.exactEstimated,
      advanceAmount: Math.round(liveEstimate.exactEstimated * 0.5),
      packageType: 'custom_calculator'
    });
    setIsBookingModalOpen(true);
  };

  const getQuickWhatsAppUrl = () => {
    const text = `Hi Aman Visual Team,\n\nI'm looking for a quote for *${liveEstimate.serviceName}* (${liveEstimate.durationLabel}).\nEstimated range: ${liveEstimate.rangeText}.\n\nPlease let me know your availability and tailored package details.`;
    return `https://wa.me/918827474622?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="pricing" className="py-24 md:py-36 bg-[#080808] border-t border-white/10 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-4">
              <Sparkles size={12} />
              <span>Investment & Packages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase text-white mb-4 leading-tight">
              Transparent <br className="hidden md:block" />
              Pricing
            </h2>
            <div className="w-20 h-[2px] bg-emerald-500/60 mb-4" />
            <p className="text-sm md:text-base text-white/70 max-w-xl font-light leading-relaxed">
              Cinematic visual storytelling tailored for bold brands, weddings, and creators across India. Transparent, all-inclusive packages starting from <span className="text-white font-semibold underline decoration-emerald-500 underline-offset-4">₹7,000 onwards</span>—powered by Sony Alpha cinema rigs, bespoke color grading, and seamless cloud delivery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto"
          >
            <Link
              to="/pricing"
              className="px-5 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Full Calculator & Rate Cards</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/918827474622?text=Hello%20Aman%20Visual,%20I%20would%20like%20to%20inquire%20about%20your%20photography%20and%20cinematography%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs font-semibold uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Direct</span>
            </a>
          </motion.div>
        </div>

        {/* 4 Core Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {CORE_PRICING_PACKAGES.map((pkg, index) => {
            const isHighlight = pkg.highlight;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-sm border transition-all duration-300 ${
                  isHighlight
                    ? 'bg-[#141414] border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                    : 'bg-[#0f0f0f] border-white/10 hover:border-white/25 hover:bg-[#121212]'
                }`}
              >
                {/* Popular Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md whitespace-nowrap">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  {/* Package Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-lg font-display uppercase font-bold text-white tracking-wide">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-white/50 mt-1 min-h-[36px] line-clamp-2">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="py-4 my-2 border-y border-white/10">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Starting From</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                        {pkg.displayPrice}
                      </span>
                      <span className="text-xs text-white/50">/ shoot</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Crew & Suitability */}
                  <div className="my-3.5 text-xs text-white/70 flex items-center gap-2">
                    <Users size={14} className="text-white/40 shrink-0" />
                    <span className="font-medium text-white/80">{pkg.crew}</span>
                  </div>

                  {/* Highlighted Inclusions */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                      Core Inclusions:
                    </div>
                    {pkg.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                        <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Direct Booking CTA */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => openPackageBooking(pkg)}
                    className={`w-full py-3.5 px-4 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all duration-200 rounded-sm cursor-pointer shadow-lg active:scale-[0.98] ${
                      isHighlight
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                        : 'bg-white hover:bg-white/90 text-black'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Book Advance (50%) • Cashfree</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-white/55 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Cashfree Gateway • UPI • Cards • NetBanking</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Instant Estimator Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-white/15 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <Calculator size={14} />
                <span>Instant Quick Estimator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-white">
                Calculate Your Commission Budget
              </h3>
              <p className="text-xs text-white/60 max-w-lg font-light">
                Select your service and duration below to preview an instant price range, or launch our full multi-parameter quotation builder.
              </p>
            </div>

            {/* Quick Interactive Pickers */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">Service Type</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="bg-black/60 border border-white/20 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-white cursor-pointer"
                >
                  {CALCULATOR_CONFIG.services.map(s => (
                    <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                      {s.name} (from ₹{s.baseRate.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">Duration</label>
                <select
                  value={selectedDurationId}
                  onChange={(e) => setSelectedDurationId(e.target.value)}
                  className="bg-black/60 border border-white/20 text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-white cursor-pointer"
                >
                  {CALCULATOR_CONFIG.durations.map(d => (
                    <option key={d.id} value={d.id} className="bg-neutral-900 text-white">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Output & Action */}
              <div className="flex items-center gap-2.5 mt-2 sm:mt-0 pt-2 sm:pt-4">
                <div className="px-3.5 py-2 bg-black/80 border border-emerald-500/40 rounded-sm">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-white/50">Est. Range</div>
                  <div className="text-xs sm:text-sm font-display font-extrabold text-emerald-400">
                    {liveEstimate.rangeText}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openQuickEstimateBooking}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <CreditCard size={13} />
                  <span>Book Now</span>
                </button>

                <a
                  href={getQuickWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-white/20 hover:border-white text-white/70 hover:text-white rounded-sm flex items-center justify-center transition-all"
                  title="Inquire on WhatsApp"
                >
                  <MessageSquare size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Guarantees Footer Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/70 font-light">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              <span>₹7,000 Starting Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              <span>48-Hour Preview Turnaround</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              <span>Sony Alpha 4K UHD Clarity</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/pricing" className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium">
                <span>View All 9 Rate Cards</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cashfree Booking Retainer Modal */}
      <CashfreeBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingDetails={activeBooking}
      />
    </section>
  );
}
