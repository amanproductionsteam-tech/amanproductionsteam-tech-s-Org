import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Calculator, 
  Calendar, 
  Send, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Users, 
  Camera, 
  Video, 
  MapPin, 
  Award, 
  Phone,
  Copy,
  ExternalLink,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import CashfreeBookingModal, { type BookingItemDetails } from '../components/CashfreeBookingModal';
import { 
  CORE_PRICING_PACKAGES, 
  SERVICE_RATE_CARDS, 
  CALCULATOR_CONFIG, 
  PRICING_FAQS,
  type PricingPackage,
  type ServiceRateCard 
} from '../data/pricingData';
import { getCashfreePaymentLink } from '../config/payment';

export default function PricingPage() {
  // Cashfree Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [cashfreeDirectUrl, setCashfreeDirectUrl] = useState<string>(() => getCashfreePaymentLink());
  const [gatewayConfigured, setGatewayConfigured] = useState<boolean | null>(null);

  // Listen for direct link updates from admin or config
  useEffect(() => {
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
  }, []);
  const [activeBooking, setActiveBooking] = useState<BookingItemDetails>({
    serviceTitle: 'Portrait & Headshot Session',
    totalEstimate: 14000,
    advanceAmount: 7000,
    packageType: 'package'
  });

  // Calculator State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('portrait');
  const [selectedDurationId, setSelectedDurationId] = useState<string>('half_day');
  const [selectedCrewId, setSelectedCrewId] = useState<string>('photo_only');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('mumbai');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  // Client Inquiry form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Active Category Filter for Rate Cards
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Calculate live estimate
  const calculatedEstimate = useMemo(() => {
    const service = CALCULATOR_CONFIG.services.find(s => s.id === selectedServiceId) || CALCULATOR_CONFIG.services[0];
    const duration = CALCULATOR_CONFIG.durations.find(d => d.id === selectedDurationId) || CALCULATOR_CONFIG.durations[0];
    const crew = CALCULATOR_CONFIG.crewOptions.find(c => c.id === selectedCrewId) || CALCULATOR_CONFIG.crewOptions[0];
    const location = CALCULATOR_CONFIG.locations.find(l => l.id === selectedLocationId) || CALCULATOR_CONFIG.locations[0];

    // Base calculation
    const base = service.baseRate * duration.multiplier * crew.multiplier;
    
    // Add-ons calculation
    let addOnsTotal = 0;
    selectedAddOns.forEach(addOnId => {
      const addOn = CALCULATOR_CONFIG.addOns.find(a => a.id === addOnId);
      if (addOn) addOnsTotal += addOn.price;
    });

    const subtotal = Math.round((base + addOnsTotal + location.travelFee) / 500) * 500;
    // Estimated range (usually ±10% variation based on exact logistics)
    const minPrice = Math.max(7000, Math.round((subtotal * 0.95) / 500) * 500);
    const maxPrice = Math.max(minPrice + 2000, Math.round((subtotal * 1.15) / 500) * 500);

    return {
      serviceName: service.name,
      durationLabel: duration.label,
      crewLabel: crew.label,
      locationLabel: location.label,
      addOnsCount: selectedAddOns.length,
      estimatedExact: subtotal,
      minPrice,
      maxPrice,
      displayRange: `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`,
    };
  }, [selectedServiceId, selectedDurationId, selectedCrewId, selectedLocationId, selectedAddOns]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Booking trigger handlers for Cashfree
  const openPackageBooking = (pkg: PricingPackage) => {
    setActiveBooking({
      serviceTitle: pkg.name,
      totalEstimate: pkg.startingPrice,
      advanceAmount: Math.round(pkg.startingPrice * 0.5),
      packageType: 'package',
      eventDate,
      eventVenue,
      customNotes
    });
    setIsBookingModalOpen(true);
  };

  const openCalculatorBooking = () => {
    setActiveBooking({
      serviceTitle: `${calculatedEstimate.serviceName} (${calculatedEstimate.durationLabel})`,
      totalEstimate: calculatedEstimate.estimatedExact,
      advanceAmount: Math.round(calculatedEstimate.estimatedExact * 0.5),
      packageType: 'custom_calculator',
      eventDate,
      eventVenue,
      customNotes
    });
    setIsBookingModalOpen(true);
  };

  const openRateCardBooking = (card: ServiceRateCard) => {
    setActiveBooking({
      serviceTitle: card.serviceTitle,
      totalEstimate: card.startingPrice,
      advanceAmount: Math.round(card.startingPrice * 0.5),
      packageType: 'rate_card',
      eventDate,
      eventVenue
    });
    setIsBookingModalOpen(true);
  };

  // Build WhatsApp Quotation link
  const generateWhatsAppMessage = () => {
    const addOnNames = selectedAddOns.map(id => {
      const addOn = CALCULATOR_CONFIG.addOns.find(a => a.id === id);
      return addOn ? addOn.name : '';
    }).filter(Boolean).join(', ');

    const text = `Hello Aman Visual Team,\n\nI would like to request an official quotation with the following project details:\n\n` +
      `📌 *Service:* ${calculatedEstimate.serviceName}\n` +
      `⏱ *Duration:* ${calculatedEstimate.durationLabel}\n` +
      `👥 *Crew Selection:* ${calculatedEstimate.crewLabel}\n` +
      `📍 *Location:* ${calculatedEstimate.locationLabel}\n` +
      (addOnNames ? `✨ *Add-Ons:* ${addOnNames}\n` : '') +
      `💰 *Estimated Budget Range:* ${calculatedEstimate.displayRange}\n\n` +
      (clientName ? `👤 *Name:* ${clientName}\n` : '') +
      (clientPhone ? `📞 *Phone:* ${clientPhone}\n` : '') +
      (eventDate ? `🗓 *Event Date:* ${eventDate}\n` : '') +
      (eventVenue ? `🏛 *Venue / City:* ${eventVenue}\n` : '') +
      (customNotes ? `📝 *Notes:* ${customNotes}\n` : '') +
      `\nPlease let me know your availability and detailed quote. Thank you!`;

    return `https://wa.me/918827474622?text=${encodeURIComponent(text)}`;
  };

  const copyQuoteToClipboard = () => {
    const addOnNames = selectedAddOns.map(id => {
      const addOn = CALCULATOR_CONFIG.addOns.find(a => a.id === id);
      return addOn ? addOn.name : '';
    }).filter(Boolean).join(', ');

    const quoteText = `AMAN VISUAL - PROJECT ESTIMATE & QUOTATION\n` +
      `Service: ${calculatedEstimate.serviceName}\n` +
      `Duration: ${calculatedEstimate.durationLabel}\n` +
      `Crew: ${calculatedEstimate.crewLabel}\n` +
      `Location: ${calculatedEstimate.locationLabel}\n` +
      (addOnNames ? `Add-Ons: ${addOnNames}\n` : '') +
      `Estimated Range: ${calculatedEstimate.displayRange}\n` +
      (eventDate ? `Date: ${eventDate}\n` : '') +
      `Inquiries: +91 8827474622 | amanproductionsteam@gmail.com`;

    navigator.clipboard.writeText(quoteText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  // Filter rate cards
  const categories = useMemo(() => {
    const set = new Set<string>();
    SERVICE_RATE_CARDS.forEach(card => set.add(card.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredRateCards = useMemo(() => {
    if (activeCategoryFilter === 'All') return SERVICE_RATE_CARDS;
    return SERVICE_RATE_CARDS.filter(card => card.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  return (
    <div className="min-h-screen bg-darker text-white selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#080808] via-darker to-charcoal">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
          {/* Breadcrumb Navigation */}
          <div className="flex justify-center mb-6">
            <Breadcrumbs variant="pill" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-white mb-6">
            Transparent Pricing & <br />
            <span className="text-white/70">Bespoke Quotations</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Standard photography and cinematography rates for India, starting from <span className="text-white font-semibold underline decoration-emerald-500 underline-offset-4">₹7,000 onwards</span>. Honest, all-inclusive packages backed by Sony Alpha cinema-grade gear and fast Google Drive client delivery.
          </p>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="#core-packages" 
              className="px-5 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all rounded-sm shadow-md"
            >
              Standard Packages
            </a>
            <a 
              href="#calculator" 
              className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs font-semibold uppercase tracking-wider transition-all rounded-sm inline-flex items-center gap-2"
            >
              <Calculator size={14} />
              <span>Instant Quote Calculator</span>
            </a>
            <a 
              href="#rate-cards" 
              className="px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white text-xs font-semibold uppercase tracking-wider transition-all rounded-sm"
            >
              Service Rate Cards
            </a>
          </div>

          {/* Starting Tag Banner */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">₹7,000+</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Starting Rate (Portraits)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">48 Hours</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Fast Preview Turnaround</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">4K UHD</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Master Resolution</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">0% Hidden</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Transparent Milestones</div>
            </div>
          </div>

          {/* Cashfree Payment Gateway Trust Banner */}
          <div className="mt-8 p-3 bg-[#0c0c0c] border border-emerald-500/30 rounded-full max-w-2xl mx-auto flex items-center justify-between gap-4 px-6 text-xs text-white/80 shadow-xl flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Direct Booking via <strong className="text-white">Cashfree Payments</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-mono text-emerald-400/90 tracking-wider">
              <span>Instant UPI (GPay / PhonePe / Paytm)</span>
              <span>•</span>
              <span>Cards & NetBanking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Packages Section */}
      <section id="core-packages" className="py-20 md:py-28 bg-dark">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display uppercase font-bold text-white mb-3">
              Curated Production Packages
            </h2>
            <div className="w-16 h-[2px] bg-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/60 font-light">
              Carefully engineered tiers matching typical private, wedding, commercial, and corporate commission scales in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {CORE_PRICING_PACKAGES.map((pkg) => {
              const isHighlight = pkg.highlight;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-sm border transition-all duration-300 ${
                    isHighlight 
                      ? 'bg-[#121212] border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30' 
                      : 'bg-[#0f0f0f] border-white/10 hover:border-white/25'
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-display uppercase font-bold text-white">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 min-h-[36px]">
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="py-4 my-2 border-y border-white/10">
                      <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Starts From</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                          {pkg.displayPrice}
                        </span>
                        <span className="text-xs text-white/50">/ shoot</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    {/* Crew & Specs */}
                    <div className="my-4 text-xs text-white/70 flex items-center gap-2">
                      <Users size={14} className="text-white/40 shrink-0" />
                      <span>{pkg.crew}</span>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-2 mb-6">
                      <div className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                        What's Included
                      </div>
                      {pkg.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                          <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-2 pt-4 border-t border-white/10 mb-6">
                      <div className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                        Deliverables
                      </div>
                      {pkg.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/70 font-light">
                          <CheckCircle2 size={13} className="text-white/40 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Booking CTA */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => openPackageBooking(pkg)}
                      className={`w-full py-3.5 px-4 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all rounded-sm cursor-pointer shadow-lg active:scale-[0.98] ${
                        isHighlight 
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20' 
                          : 'bg-white hover:bg-white/90 text-black'
                      }`}
                    >
                      <CreditCard size={14} />
                      <span>Book Advance (50%) • Cashfree</span>
                    </button>
                    <div className="text-center mt-2 text-[10px] text-white/50 font-mono">
                      Cashfree Gateway • Instant UPI • Cards • NetBanking
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Quotation Calculator & Form */}
      <section id="calculator" className="py-20 md:py-28 bg-[#0a0a0a] border-y border-white/10 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 mb-3">
              <Calculator size={13} />
              <span>Real-Time Estimation Tool</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase font-bold text-white mb-3">
              Instant Quotation Calculator
            </h2>
            <p className="text-sm text-white/60 font-light max-w-xl mx-auto">
              Configure your exact shoot parameters. Get an instant, realistic budget range starting from ₹7,000, and request an official itemized proposal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Calculator Controls (Left Column) */}
            <div className="lg:col-span-7 bg-[#141414] border border-white/15 p-6 sm:p-8 rounded-sm space-y-7 shadow-xl">
              {/* Step 1: Select Service */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">1</span>
                  <span>Select Service Type</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CALCULATOR_CONFIG.services.map((srv) => {
                    const isSelected = srv.id === selectedServiceId;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 border-white text-white font-medium shadow-md'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{srv.name}</div>
                        <div className="text-[10px] text-white/40 mt-1">Starts at ₹{srv.baseRate.toLocaleString('en-IN')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">2</span>
                  <span>Event / Shoot Duration</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CALCULATOR_CONFIG.durations.map((dur) => {
                    const isSelected = dur.id === selectedDurationId;
                    return (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => setSelectedDurationId(dur.id)}
                        className={`p-2.5 text-center border rounded-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{dur.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Crew Setup */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">3</span>
                  <span>Crew & Coverage Format</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CALCULATOR_CONFIG.crewOptions.map((crew) => {
                    const isSelected = crew.id === selectedCrewId;
                    return (
                      <button
                        key={crew.id}
                        type="button"
                        onClick={() => setSelectedCrewId(crew.id)}
                        className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white font-medium'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-semibold flex items-center gap-1.5">
                          {isSelected && <Check size={12} className="text-emerald-400" />}
                          <span>{crew.label}</span>
                        </div>
                        <div className="text-[10px] text-white/40 mt-1">{crew.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Add-Ons */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">4</span>
                  <span>Optional Add-Ons</span>
                </label>
                <div className="space-y-2">
                  {CALCULATOR_CONFIG.addOns.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3 border rounded-sm flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isChecked ? 'bg-white/10 border-white/40' : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/30'
                          }`}>
                            {isChecked && <Check size={11} strokeWidth={3} />}
                          </div>
                          <div>
                            <div className="text-xs text-white font-medium">{addon.name}</div>
                            <div className="text-[10px] text-white/40">{addon.desc}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-emerald-400 font-semibold whitespace-nowrap">
                          +₹{addon.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Location */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">5</span>
                  <span>Shooting Location</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CALCULATOR_CONFIG.locations.map((loc) => {
                    const isSelected = loc.id === selectedLocationId;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocationId(loc.id)}
                        className={`p-2.5 text-left border rounded-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 border-white text-white font-medium'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        <div className="text-xs">{loc.label}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">
                          {loc.travelFee === 0 ? 'Local (No extra travel fee)' : `+₹${loc.travelFee.toLocaleString('en-IN')} travel allowance`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quotation Summary & Booking Form (Right Column) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              {/* Estimate Output Card */}
              <div className="bg-[#181818] border-2 border-emerald-500/50 p-6 sm:p-8 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-widest pb-3 border-b border-white/10">
                  <span>Live Project Estimate</span>
                  <span className="text-emerald-400 font-mono">India Standard</span>
                </div>

                <div className="py-6 text-center">
                  <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Estimated Quotation Range</div>
                  <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                    {calculatedEstimate.displayRange}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1">
                    Base rate starts from ₹7,000 • GST / actual logistics applicable
                  </div>
                </div>

                {/* Itemized Specification List */}
                <div className="space-y-2.5 py-4 border-y border-white/10 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Service:</span>
                    <span className="text-white font-medium truncate max-w-[200px] text-right">{calculatedEstimate.serviceName}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Duration:</span>
                    <span className="text-white font-medium">{calculatedEstimate.durationLabel}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Crew:</span>
                    <span className="text-white font-medium truncate max-w-[200px] text-right">{calculatedEstimate.crewLabel}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Location:</span>
                    <span className="text-white font-medium truncate max-w-[200px] text-right">{calculatedEstimate.locationLabel}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Selected Add-Ons:</span>
                    <span className="text-emerald-400 font-mono">{calculatedEstimate.addOnsCount} selected</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={openCalculatorBooking}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-xl transition-all cursor-pointer"
                  >
                    <CreditCard size={15} />
                    <span>Book via Cashfree (Advance: ₹{Math.round(calculatedEstimate.estimatedExact * 0.5).toLocaleString('en-IN')})</span>
                  </button>

                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Get Official Quote on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={copyQuoteToClipboard}
                    className="w-full py-2 border border-white/15 hover:border-white text-white/70 hover:text-white text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all cursor-pointer bg-white/5"
                  >
                    <Copy size={12} />
                    <span>{copiedQuote ? 'Copied to Clipboard!' : 'Copy Quotation Summary'}</span>
                  </button>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-[#121212] border border-white/15 p-6 rounded-sm">
                <h3 className="text-sm font-display uppercase font-bold text-white mb-1 flex items-center gap-2">
                  <Send size={14} className="text-emerald-400" />
                  <span>Send Direct Quotation Inquiry</span>
                </h3>
                <p className="text-[11px] text-white/50 mb-4">
                  Prefer email or callback? Fill in your shoot dates and venue:
                </p>

                {isSubmitted ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded text-center">
                    <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                    <div className="text-xs text-white font-semibold uppercase tracking-wider mb-1">
                      Quotation Inquiry Received!
                    </div>
                    <p className="text-[11px] text-white/70">
                      Our production team will review your specifications and get back within 4 hours. You can also message us directly on WhatsApp at +91 8827474622.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-sm focus:border-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        placeholder="Phone / WhatsApp *"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-sm focus:border-white focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-sm focus:border-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        placeholder="Event Date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-sm focus:border-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Venue / City"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-sm focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Additional details (e.g., number of guests, specific ritual requirements)"
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-sm focus:border-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveBooking({
                            serviceTitle: `${calculatedEstimate.serviceName} (${calculatedEstimate.durationLabel})`,
                            totalEstimate: calculatedEstimate.estimatedExact,
                            advanceAmount: Math.round(calculatedEstimate.estimatedExact * 0.5),
                            packageType: 'custom_calculator',
                            clientName,
                            clientPhone,
                            clientEmail,
                            eventDate,
                            eventVenue,
                            customNotes
                          });
                          setIsBookingModalOpen(true);
                        }}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <CreditCard size={15} />
                        <span>
                          {`Book via Cashfree (Advance: ₹${Math.round(calculatedEstimate.estimatedExact * 0.5).toLocaleString('en-IN')})`}
                        </span>
                      </button>

                      <button
                        type="submit"
                        className="w-full py-2 border border-white/20 hover:border-white text-white/80 hover:text-white font-medium text-xs uppercase tracking-wider transition-all rounded-sm cursor-pointer"
                      >
                        Submit Inquiry Without Payment
                      </button>
                    </div>

                    <p className="text-[10px] text-white/40 text-center leading-relaxed">
                      By submitting, you agree to our{' '}
                      <Link to="/terms-and-conditions" className="text-white/70 hover:text-white underline">Terms</Link>,{' '}
                      <Link to="/privacy-policy" className="text-white/70 hover:text-white underline">Privacy</Link>, &{' '}
                      <Link to="/refund-policy" className="text-white/70 hover:text-white underline">Refund Policy</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service-wise Rate Cards Section */}
      <section id="rate-cards" className="py-20 md:py-28 bg-dark">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display uppercase font-bold text-white mb-2">
                India Photography & Cinematography Rate Cards
              </h2>
              <div className="w-16 h-[2px] bg-white/20 mb-3" />
              <p className="text-sm text-white/60 font-light max-w-xl">
                Benchmark market rates compiled across freelance and studio productions in Mumbai, Delhi NCR, Bangalore, and destination hubs.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap rounded-full border transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-white text-black border-white font-semibold shadow'
                      : 'bg-black/40 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRateCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-[#111] border border-white/10 hover:border-white/30 transition-all duration-300 rounded-sm flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-emerald-400 mb-2">
                    <span>{card.category}</span>
                    <span>Starts ₹{card.startingPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <h3 className="text-lg font-display uppercase font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {card.serviceTitle}
                  </h3>

                  <div className="py-3 my-3 border-y border-white/10 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-display font-extrabold text-white">
                        {card.priceRange}
                      </div>
                      <div className="text-[11px] text-white/50">{card.unit}</div>
                    </div>
                    <div className="text-[11px] text-right text-white/50">
                      <div className="font-mono text-white/80">{card.deliveryTime}</div>
                      <div>Turnaround</div>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-light mb-4">
                    {card.description}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">
                      Standard Package Includes:
                    </div>
                    {card.standardInclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-[10px] text-white/40 truncate max-w-[200px]" title={card.gearUsed}>
                    <span className="text-white/60 font-mono">Kit: </span>{card.gearUsed}
                  </div>
                  <button
                    type="button"
                    onClick={() => openRateCardBooking(card)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    title="Direct advance reservation via Cashfree"
                  >
                    <CreditCard size={12} />
                    <span>Book via Cashfree (₹{Math.round(card.startingPrice * 0.5).toLocaleString('en-IN')})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Standards & Comparison Table */}
      <section className="py-20 bg-charcoal border-b border-white/10">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display uppercase font-bold text-white mb-2">
              The Aman Visual Guarantee
            </h2>
            <div className="w-16 h-[2px] bg-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/60 font-light">
              Why investing in professional photography & videography makes a lifetime of difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-black/40 border border-white/10 rounded-sm">
              <Camera size={24} className="text-emerald-400 mb-3" />
              <h3 className="text-base font-bold uppercase text-white mb-2">61MP Sensor Clarity</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Shot on Sony A7R V and Cinema series with G-Master prime glass. Every nuance, fabric texture, and facial expression is preserved in ultra-high resolution.
              </p>
            </div>
            <div className="p-6 bg-black/40 border border-white/10 rounded-sm">
              <Video size={24} className="text-emerald-400 mb-3" />
              <h3 className="text-base font-bold uppercase text-white mb-2">DaVinci Color Science</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                No cheap automated filters. Every video clip is color-graded in 10-bit 4:2:2 color space on calibrated monitors for genuine cinematic skin tones.
              </p>
            </div>
            <div className="p-6 bg-black/40 border border-white/10 rounded-sm">
              <Award size={24} className="text-emerald-400 mb-3" />
              <h3 className="text-base font-bold uppercase text-white mb-2">Triple-Redundant Backup</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Dual SD cards recorded concurrently in camera, backed up to SSD drives on shoot day, and uploaded to a private Google Drive cloud repository.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 md:py-28 bg-darker">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 mb-3">
              <HelpCircle size={13} />
              <span>Everything You Need to Know</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase font-bold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-white/60 font-light">
              Clear answers regarding payment milestones, outstation travel, deliverables, and booking terms in India.
            </p>
          </div>

          <div className="space-y-4">
            {PRICING_FAQS.map((faq, i) => (
              <div key={i} className="p-6 bg-[#111] border border-white/10 rounded-sm hover:border-white/20 transition-colors">
                <h3 className="text-base font-display font-bold uppercase text-white mb-2 flex items-start gap-3">
                  <span className="text-emerald-400 font-mono text-sm">0{i+1}.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Contact / Commission Callout */}
      <section className="py-20 border-t border-white/10 bg-dark text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display uppercase font-bold text-white mb-4">
            Have a Bespoke Vision in Mind?
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 font-light">
            Every celebration, commercial campaign, and creative production has unique requirements. Connect directly with Aman Visual for a customized proposal tailored to your vision and budget.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/918827474622"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-[0.2em] transition-all inline-flex items-center gap-2 shadow-xl rounded-sm"
            >
              <MessageSquare size={15} />
              <span>Chat on WhatsApp (+91 8827474622)</span>
            </a>
            <a
              href="tel:+918827474622"
              className="px-8 py-3.5 border border-white/30 text-white font-medium text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all rounded-sm inline-flex items-center gap-2"
            >
              <Phone size={14} />
              <span>Direct Phone Call</span>
            </a>
          </div>
        </div>
      </section>

      {/* Cashfree Online Booking Retainer Modal */}
      <CashfreeBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingDetails={activeBooking}
      />

      <Footer />
    </div>
  );
}
