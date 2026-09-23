export interface PricingPackage {
  id: string;
  name: string;
  tagline: string;
  startingPrice: number; // in INR
  displayPrice: string;
  duration: string;
  crew: string;
  highlight?: boolean;
  badge?: string;
  inclusions: string[];
  deliverables: string[];
  recommendedFor: string;
}

export interface ServiceRateCard {
  id: string;
  category: string;
  serviceTitle: string;
  startingPrice: number;
  priceRange: string;
  unit: string;
  description: string;
  standardInclusions: string[];
  deliveryTime: string;
  gearUsed: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

// 4 Core Standard Tiered Packages
export const CORE_PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'starter-creative',
    name: 'Starter Creative',
    tagline: 'Ideal for headshots, model portfolios, intimate mini events, and individual creative portraits.',
    startingPrice: 7000,
    displayPrice: '₹7,000',
    duration: 'Up to 2 Hours',
    crew: '1 Senior Photographer',
    recommendedFor: 'LinkedIn Headshots, Actor Portfolio, Maternity, Solo Studio/Outdoor',
    inclusions: [
      '1 Professional Photographer with Sony A7R V / GM Lenses',
      'Professional strobe / natural lighting setup',
      'High-resolution raw files reviewed on-site',
      'Dedicated Google Drive client gallery link',
      'Fast 48-Hour delivery turnaround',
    ],
    deliverables: [
      '15–20 Fine-Art Skin Retouched Portraits',
      'All high-res unedited proofs for selection',
      'Web-optimized & print-ready JPEG formats',
    ],
  },
  {
    id: 'essential-event',
    name: 'Event & Corporate Essential',
    tagline: 'Comprehensive half-day or full-day coverage for celebrations, parties, and business conferences.',
    startingPrice: 16000,
    displayPrice: '₹16,000',
    duration: 'Half Day (up to 4–5 Hours)',
    crew: '1 Candid Photographer or 1 Cinematographer',
    highlight: false,
    recommendedFor: 'Birthdays, Anniversaries, Corporate Seminars, Product Launches, Cocktail Evenings',
    inclusions: [
      'Full coverage of decor, guests, keynote, and candid moments',
      'Dual-card backup on camera for guaranteed data safety',
      'Color grading matched to brand or festive aesthetic',
      'Direct client portal download with password protection',
    ],
    deliverables: [
      '100–150 Color-Graded High-Resolution Photos OR',
      '1–2 Min 4K Cinematic Highlight Recap Reel',
      'Delivery within 4–5 business days',
    ],
  },
  {
    id: 'cinematic-duo',
    name: 'Cinematic Duo (Photo + Video)',
    tagline: 'The most popular complete package for engagement ceremonies, pre-weddings, and day-long events.',
    startingPrice: 35000,
    displayPrice: '₹35,000',
    duration: 'Full Day (up to 8–9 Hours)',
    crew: '1 Candid Photographer + 1 Cinematographer',
    highlight: true,
    badge: 'Most Popular',
    recommendedFor: 'Pre-Wedding Shoots, Engagement, Sangeet, Day Wedding, Corporate Summit',
    inclusions: [
      'Dual crew: Senior Candid Photographer + Senior Cinematographer',
      'Cinema prime lenses + Gimbal stabilization setup',
      'Multi-source ambient & wireless lavalier audio recording',
      'Aerial 4K Drone photography coverage (subject to venue clearance)',
      'Direct client portal download link via Google Drive',
    ],
    deliverables: [
      '250–350 Master Color-Graded High-Resolution Photos',
      '1 Cinematic Teaser Reel (60–90 Seconds) for Instagram/Socials',
      '3–5 Minute 4K Cinematic Highlight Film with licensed soundtrack',
      'Complete uncompressed RAW video footage upon request',
    ],
  },
  {
    id: 'grand-signature',
    name: 'Grand Signature Production',
    tagline: 'Luxury multi-crew multi-day production for destination weddings, luxury brands, and music videos.',
    startingPrice: 75000,
    displayPrice: '₹75,000',
    duration: 'Multi-Day / Full Scale Event',
    crew: '3 to 5 Specialists (Photographers, Cinematographers & Drone Pilot)',
    recommendedFor: 'Grand Weddings (2–3 Days), Destination Ceremonies, High-Fashion Campaigns, Music Videos',
    inclusions: [
      'Comprehensive crew: 2 Candid Photographers + 2 Cinematographers + 1 Drone Specialist',
      'Cinema rig: Sony FX series, Ronin gimbals, wireless transmitters, master lighting kit',
      'Dedicated creative director & post-production colorist',
      'Luxury handcrafted hardcover photobook (30–40 pages, matte fine-art paper)',
      'Archival solid-state drive (SSD) with all 4K master files delivered to your doorstep',
    ],
    deliverables: [
      '600+ Master Edited High-Resolution Retouched Photos',
      '1 Minute 4K Teaser (delivered within 48 hours for social media)',
      '15–25 Minute Complete Documentary Wedding Film in 4K UHD',
      '3–5 Minute Extended Cinematic Highlights Teaser',
      'Custom embossed velvet/leather keepsake photobook',
    ],
  },
];

// Service-wise Market Rate Cards in India (Transparent & Sourced from Mumbai / Delhi NCR / Bangalore / Goa Industry Norms)
export const SERVICE_RATE_CARDS: ServiceRateCard[] = [
  {
    id: 'portrait-headshot',
    category: 'Portraits & Studio',
    serviceTitle: 'Portraits, Modeling Portfolio & Headshots',
    startingPrice: 7000,
    priceRange: '₹7,000 – ₹16,000',
    unit: 'per session (1–3 hrs)',
    description: 'Crisp studio or outdoor personal branding, corporate executive headshots, and high-fashion model portfolios with bespoke lighting.',
    standardInclusions: [
      '15–25 fully retouched fine-art portraits',
      'Multiple outfit/look changes',
      'Posing guidance & expression coaching',
      'Digital delivery in 48 hours via private portal',
    ],
    deliveryTime: '2 to 3 days',
    gearUsed: 'Sony A7R V • 85mm f/1.4 GM • Godox AD600 Pro Strobes',
  },
  {
    id: 'private-events',
    category: 'Events & Parties',
    serviceTitle: 'Birthdays, Anniversaries & Intimate Parties',
    startingPrice: 8000,
    priceRange: '₹8,000 – ₹20,000',
    unit: 'per event (3–5 hrs)',
    description: 'Candid photo & video coverage capturing genuine emotions, decor, cake cutting, family moments, and vibrant party celebrations.',
    standardInclusions: [
      '100+ color-corrected candid photographs',
      'Stage, decor, and guest portraits',
      'Option to add 60-second highlight reel',
      'High-speed Google Drive link for instant guest sharing',
    ],
    deliveryTime: '3 to 5 days',
    gearUsed: 'Sony A7 IV • 24-70mm f/2.8 GM II • Wireless Flash Speedlights',
  },
  {
    id: 'pre-wedding',
    category: 'Weddings & Couples',
    serviceTitle: 'Pre-Wedding & Couple Story Shoots',
    startingPrice: 22000,
    priceRange: '₹22,000 – ₹45,000',
    unit: 'per day (outdoor / scenic)',
    description: 'Romantic, cinematic storytelling sessions across beaches, historic forts, lush gardens, or urban Mumbai architecture.',
    standardInclusions: [
      'Photo + Video dual coverage (1 Day shoot)',
      '100+ signature color-graded romance portraits',
      '1.5–2 min 4K cinematic couple teaser video',
      'Styling and location concept assistance',
      'Drone aerial establishing shots included',
    ],
    deliveryTime: '5 to 7 days',
    gearUsed: 'Sony A7R V + FX30 • DJI Ronin RS3 • DJI Mini 4 Pro Drone',
  },
  {
    id: 'wedding-day',
    category: 'Weddings & Couples',
    serviceTitle: 'Wedding Day Photography & Cinematography',
    startingPrice: 38000,
    priceRange: '₹38,000 – ₹95,000',
    unit: 'per day / per function',
    description: 'Unobtrusive candid photography combined with Bollywood-grade cinematic filmmaking to capture rituals, laughter, and timeless memories.',
    standardInclusions: [
      'Candid photographer + Cinematic videographer team',
      'Complete ritual coverage (Haldi, Mehendi, Baarat, Pheras, Reception)',
      '300+ master high-resolution retouched photos',
      '3–5 minute 4K cinematic film with custom color grading',
      'Same-day or 48-hr preview shots for Instagram',
    ],
    deliveryTime: '10 to 14 days (Teaser in 3 days)',
    gearUsed: 'Sony FX3 + A7R V • G-Master Prime Lenses • DJI Wireless Mics',
  },
  {
    id: 'corporate-conference',
    category: 'Corporate & Brands',
    serviceTitle: 'Corporate Summits, Conferences & Seminars',
    startingPrice: 15000,
    priceRange: '₹15,000 – ₹40,000',
    unit: 'per day (up to 8 hrs)',
    description: 'Polished media coverage for enterprise conventions, boardroom leadership meetings, startup summits, and award nights.',
    standardInclusions: [
      'Keynote speaker, audience, panel, and award moments',
      'Same-day press/PR photo selection (15 key photos delivered in 3 hrs)',
      'Full gallery of 200+ high-res images on private Drive portal',
      'Optional 90-sec LinkedIn & Twitter corporate recap reel',
    ],
    deliveryTime: '24 hrs for PR highlights / 3 days full gallery',
    gearUsed: 'Sony A7R V + 70-200mm f/2.8 GM II • Silent Shutter Mode',
  },
  {
    id: 'commercial-product',
    category: 'Commercial & Fashion',
    serviceTitle: 'E-Commerce, Catalog & Product Shoots',
    startingPrice: 12000,
    priceRange: '₹12,000 – ₹30,000',
    unit: 'per day / batch',
    description: 'Clean white-background Amazon/Flipkart compliant product imagery as well as aspirational lifestyle and flat-lay compositions.',
    standardInclusions: [
      '20–40 finished product items with deep clipping/transparency',
      'Color-accurate calibrated monitor workflow',
      'Lifestyle table setups with relevant props',
      'Web-optimized resolution for Shopify/WooCommerce',
    ],
    deliveryTime: '3 to 5 days',
    gearUsed: 'Sony 90mm f/2.8 Macro G • Calibrated Softbox Studio Rig',
  },
  {
    id: 'fashion-editorial',
    category: 'Commercial & Fashion',
    serviceTitle: 'Fashion Lookbooks & Brand Campaigns',
    startingPrice: 28000,
    priceRange: '₹28,000 – ₹65,000',
    unit: 'per day shoot',
    description: 'High-fashion editorial imagery for apparel labels, jewelry designers, footwear, and lifestyle fashion brands across India.',
    standardInclusions: [
      'Art direction collaboration & mood board execution',
      'High-end frequency separation & skin tone retouching',
      'Vertical 9:16 reels for Instagram advertising & collection launch',
      'Full commercial publishing rights included',
    ],
    deliveryTime: '5 to 7 days',
    gearUsed: 'Sony A7R V • 50mm f/1.2 GM • Profoto / Godox Studio Strobes',
  },
  {
    id: 'music-video',
    category: 'Films & Video',
    serviceTitle: 'Music Videos, Ad Films & Creative Reels',
    startingPrice: 45000,
    priceRange: '₹45,000 – ₹1,25,000',
    unit: 'per project',
    description: 'End-to-end cinematic music video and promotional commercial video production with dynamic camera movement and cinematic color grading.',
    standardInclusions: [
      'Cinematography with cinema camera rig + Ronin Gimbal',
      'Multi-point lighting package with RGB and key lights',
      'Full post-production: multi-track editing, color grading (DaVinci Resolve), sound master',
      'Master 4K UHD export + 9:16 vertical cut for teaser launch',
    ],
    deliveryTime: '10 to 18 days',
    gearUsed: 'Sony FX3 Cinema Line • Sirui Anamorphic / GM Glass • Gimbal + Rig',
  },
  {
    id: 'architecture-realestate',
    category: 'Architecture',
    serviceTitle: 'Real Estate, Luxury Interiors & Architecture',
    startingPrice: 12000,
    priceRange: '₹12,000 – ₹28,000',
    unit: 'per property',
    description: 'Wide-angle HDR interior captures, dusk twilight architectural stills, and 4K smooth walkthrough videos for architects and luxury builders.',
    standardInclusions: [
      '25–40 high-dynamic-range interior and exterior photos',
      'Perspective correction for vertical lines and natural light balancing',
      '4K 60fps walkthrough video tour (1–2 mins) with subtle music',
      'Optional licensed 4K aerial drone perspective',
    ],
    deliveryTime: '3 to 4 days',
    gearUsed: 'Sony 12-24mm f/2.8 GM • 16-35mm GM II • Tripod HDR Bracketing',
  },
];

// Interactive Quotation Calculator Configuration
export const CALCULATOR_CONFIG = {
  services: [
    { id: 'portrait', name: 'Portraits / Headshots / Modeling', baseRate: 7000 },
    { id: 'private_event', name: 'Private Event (Birthday, Party, Baby Shower)', baseRate: 9000 },
    { id: 'pre_wedding', name: 'Pre-Wedding / Couple Shoot', baseRate: 22000 },
    { id: 'wedding', name: 'Wedding / Sangeet / Reception', baseRate: 38000 },
    { id: 'corporate', name: 'Corporate Summit / Conference / Seminar', baseRate: 16000 },
    { id: 'product', name: 'E-Commerce / Product Shoot', baseRate: 12000 },
    { id: 'fashion', name: 'Fashion Lookbook / Brand Campaign', baseRate: 28000 },
    { id: 'music_video', name: 'Music Video / Commercial Film', baseRate: 45000 },
    { id: 'real_estate', name: 'Real Estate / Interior Architecture', baseRate: 13000 },
  ],
  durations: [
    { id: 'half_day', label: 'Half Day (up to 4 hours)', multiplier: 1.0 },
    { id: 'full_day_1', label: '1 Full Day (8–10 hours)', multiplier: 1.6 },
    { id: 'days_2', label: '2 Full Days', multiplier: 2.9 },
    { id: 'days_3', label: '3 Full Days', multiplier: 4.2 },
  ],
  crewOptions: [
    { id: 'photo_only', label: 'Photographer Only (1 Crew)', multiplier: 1.0, desc: 'Ideal for still photo documentation' },
    { id: 'video_only', label: 'Cinematographer Only (1 Crew)', multiplier: 1.15, desc: 'Focus purely on 4K cinematic video' },
    { id: 'photo_and_video', label: 'Duo: 1 Photographer + 1 Cinematographer', multiplier: 1.85, desc: 'Complete coverage for photos & cinematic video' },
    { id: 'full_production', label: 'Full Production Team (3–4 Crew + Director)', multiplier: 2.8, desc: 'For grand multi-cam events and weddings' },
  ],
  addOns: [
    { id: 'drone', name: 'Licensed 4K Aerial Drone Coverage', price: 8000, desc: 'Breathtaking bird’s-eye perspective (venue compliant)' },
    { id: 'express', name: '24-Hour Express Teaser Reel', price: 4000, desc: '60-sec social reel delivered the morning after your shoot' },
    { id: 'photobook', name: 'Luxury Printed Hardcover Photobook', price: 7000, desc: '30-page Italian fine-art photo album with presentation box' },
    { id: 'raw_archive', name: 'Complete RAW Photo & Video SSD Drive', price: 4000, desc: 'Every raw file and uncompressed clip delivered on portable SSD' },
  ],
  locations: [
    { id: 'mumbai', label: 'Mumbai & MMR (Local)', travelFee: 0 },
    { id: 'outstation_near', label: 'Pune / Lonavala / Alibaug / Goa', travelFee: 6000 },
    { id: 'pan_india', label: 'Pan-India Destination (Delhi, Jaipur, Bangalore, etc.)', travelFee: 14000 },
    { id: 'international', label: 'International Destination', travelFee: 35000 },
  ],
};

// Frequently Asked Questions regarding Pricing in India
export const PRICING_FAQS = [
  {
    q: 'Why do rates start from ₹7,000 onwards?',
    a: 'Our starting rate of ₹7,000 for individual portraits reflects professional-grade equipment (Sony A7R V 61MP, G-Master f/1.2 & f/1.4 prime lenses, calibrated strobe lighting), years of technical mastery, and meticulous post-processing color grading rather than quick automated phone filters.',
  },
  {
    q: 'How do you handle payment milestones for shoots?',
    a: 'We accept online date reservation retainers directly through Cashfree Payments, supporting instant UPI (Google Pay, PhonePe, Paytm, BHIM, QR), Credit/Debit Cards, NetBanking, and Wallets. Our standard schedule is a 50% advance retainer to guarantee your crew and camera date, 30% on the day of shoot, and the remaining 20% on final 4K master delivery.',
  },
  {
    q: 'Are travel and accommodation included in the price?',
    a: 'Local travel within Mumbai and nearby MMR is fully covered in the quoted package. For outstation destination shoots (Goa, Jaipur, Delhi, Udaipur, Bengaluru, etc.), travel tickets (flight/train) and decent lodging for the crew are either arranged by the client or billed at actuals transparently.',
  },
  {
    q: 'What is your typical delivery timeline?',
    a: 'For portrait, corporate, and private party shoots: 48 to 72 hours for initial proofs, with final retouched photos within 5 business days. For weddings and multi-day celebrations: social media teaser in 48–72 hours, color-graded photo album gallery in 7–10 days, and full 4K cinematic film within 2 to 3 weeks.',
  },
  {
    q: 'Can we get all the RAW unedited files and video footage?',
    a: 'Yes! We deliver all selected high-resolution color-graded JPEGs and 4K MP4 exports via your private Google Drive portal. If you require every uncompressed camera RAW image and S-Log video clip, we offer the complete raw archival SSD add-on.',
  },
  {
    q: 'Can I customize a bespoke package for my exact budget or requirement?',
    a: 'Absolutely. Every creative project is unique. Use our interactive quotation builder above or reach out directly on WhatsApp (+91 8827474622) with your event details for an official customized quotation tailored to your scope.',
  },
];
