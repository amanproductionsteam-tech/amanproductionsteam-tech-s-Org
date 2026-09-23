import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Video, 
  Layers, 
  Disc, 
  Aperture, 
  Check, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  Film,
  ArrowRight,
  Maximize2,
  List,
  LayoutGrid,
  Search,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

interface GearItem {
  id: string;
  name: string;
  category: 'sony-body' | 'sony-lens' | 'canon-body' | 'canon-lens' | 'gimbal';
  type: string;
  tag: string;
  image: string;
  specs: string[];
  bestFor: string;
  mount?: string;
  highlights: string;
}

const GEAR_INVENTORY: GearItem[] = [
  // SONY BODIES
  {
    id: 'sony-fx30',
    name: 'Sony FX30 Cinema Line',
    category: 'sony-body',
    type: 'Cinema Camera Body',
    tag: 'Cinema Line',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    highlights: 'Dual Base ISO (800/2500) • S-Cinetone • Active Cooling',
    specs: [
      'Super 35 Back-Illuminated 4K Sensor',
      '4K recording up to 120fps (10-bit 4:2:2)',
      'Dual Base ISO (800 / 2500) for clean low-light',
      'S-Cinetone, S-Log3 and user LUT support',
      'Active internal cooling fan for continuous live shoots',
      'Cage-friendly cinema body with top audio handle'
    ],
    bestFor: 'Commercial brand films, multi-camera live shoots, podcasts & music videos'
  },
  {
    id: 'sony-a6700',
    name: 'Sony A6700',
    category: 'sony-body',
    type: 'Hybrid Camera Body',
    tag: 'AI Real-Time AF',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
    highlights: 'AI Processing Unit • 26MP BSI Sensor • 4K 120p',
    specs: [
      '26.0MP Exmor R APS-C BSI CMOS Sensor',
      'BIONZ XR processing engine + dedicated AI Processing Unit',
      'Real-time subject tracking for humans, birds & motion',
      '4K 60p from 6K oversampling & 4K 120p high-speed',
      '5-axis in-body optical image stabilization',
      'Ideal B-camera for gimbal movement & tight spaces'
    ],
    bestFor: 'High-speed event videography, sports, run-and-gun b-roll & dynamic gimbal tracking'
  },
  {
    id: 'sony-a7iv',
    name: 'Sony A7 IV (Sony M4)',
    category: 'sony-body',
    type: 'Full-Frame Hybrid Body',
    tag: 'Full Frame Flagship',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    highlights: '33MP Full-Frame • 7K Oversampling • Dual Slots',
    specs: [
      '33MP Full-Frame Exmor R CMOS Sensor',
      '7K oversampled 4K 30p full-frame & 4K 60p Super 35',
      '10-bit 4:2:2 internal recording with All-Intra codec',
      '15+ stops of dynamic range in S-Log3',
      'Dual card slots (CFexpress Type A & SD UHS-II)',
      'Breath compensation with compatible Sony optics'
    ],
    bestFor: 'Corporate executive headshots, high-end commercial photo & hybrid cinema'
  },

  // SONY LENSES
  {
    id: 'sony-17-70',
    name: '17-70mm f/2.8 VC',
    category: 'sony-lens',
    type: 'Standard Zoom Lens',
    tag: 'Fast Constant Zoom',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80',
    highlights: 'Constant f/2.8 • Optical VC Stabilization • 25.5-105mm Eq',
    specs: [
      'Covers 25.5-105mm (35mm equivalent)',
      'Constant fast f/2.8 maximum aperture throughout range',
      'Vibration Compensation (VC) for steady handheld shooting',
      'Exceptional edge-to-edge resolution at open aperture',
      'Moisture-resistant construction for outdoor field production'
    ],
    bestFor: 'All-day commercial events, live performances, corporate interviews & run-and-gun'
  },
  {
    id: 'sony-10-18',
    name: '10-18mm f/2.8 Ultra Wide',
    category: 'sony-lens',
    type: 'Ultra Wide Zoom Lens',
    tag: 'Ultra Wide Angle',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=800&q=80',
    highlights: 'Expansive FOV • Bright f/2.8 Aperture • Compact Gimbal Ready',
    specs: [
      'Ultra-wide perspective ideal for expansive architectural spaces',
      'Bright f/2.8 aperture for low-light indoor environments',
      'Ultra-compact lightweight design for gimbal balancing',
      'Minimal distortion with straight optical lines'
    ],
    bestFor: 'Real estate interior walkthroughs, concert crowd perspectives & stage establishing shots'
  },
  {
    id: 'sony-85',
    name: '85mm f/1.8 Prime',
    category: 'sony-lens',
    type: 'Telephoto Prime Lens',
    tag: 'Portrait Prime',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80',
    highlights: 'Razor-Sharp Optics • Creamy 9-Blade Bokeh • Silent AF',
    specs: [
      'Classic 85mm portrait focal length',
      'Fast f/1.8 aperture for pronounced subject isolation',
      '9-blade circular aperture yielding smooth creamy background bokeh',
      'Double linear motor for silent and precise cinema autofocus'
    ],
    bestFor: 'Cinematic dialogue close-ups, fashion editorial & executive leadership portraits'
  },
  {
    id: 'sony-16',
    name: '16mm f/2.8 Prime',
    category: 'sony-lens',
    type: 'Wide Prime Lens',
    tag: 'Pancake / Wide Prime',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80',
    highlights: 'Featherweight Profile • Bright f/2.8 • Zero Vignetting',
    specs: [
      'Ultra-compact low-profile wide optic',
      'Bright f/2.8 aperture for night shoots and intimate spaces',
      'Instant agile gimbal balancing with negligible counterweight',
      'Natural wide field of view without fisheye curvature'
    ],
    bestFor: 'Car rig shots, tight interior podcast angles & quick gimbal walk-and-talks'
  },
  {
    id: 'sony-20',
    name: '20mm f/2.8 Prime',
    category: 'sony-lens',
    type: 'Wide Prime Lens',
    tag: 'Compact Prime',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1590291103653-997f5deee905?auto=format&fit=crop&w=800&q=80',
    highlights: 'Slim Profile • 30mm Cinematic Eq • Multi-Coated',
    specs: [
      '30mm equivalent cinematic documentary view',
      'Ultra-slim pancake profile for minimal footprint',
      'Quick response autofocus with silent stepper motor',
      'Multi-coated optics suppressing flares and ghosting'
    ],
    bestFor: 'Street documentary, discreet brand PR coverage & lightweight stabilizer work'
  },
  {
    id: 'sony-28-70',
    name: '28-70mm f/3.5 – f/5.6 OSS',
    category: 'sony-lens',
    type: 'Standard Zoom Lens',
    tag: 'Versatile Zoom',
    mount: 'Sony E-Mount',
    image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=800&q=80',
    highlights: 'Optical SteadyShot • Full-Frame Range • Travel Ready',
    specs: [
      'Full-frame versatile focal range',
      'Built-in Optical SteadyShot (OSS) image stabilization',
      'Lightweight portable walk-around optic',
      'Smooth internal zooming motion'
    ],
    bestFor: 'Multi-camera setup side angles, backup coverage & travel assignments'
  },

  // CANON BODIES
  {
    id: 'canon-r6-i',
    name: 'Canon EOS R6 Mark I',
    category: 'canon-body',
    type: 'Full-Frame Mirrorless Body',
    tag: 'Full Frame C-Log',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=800&q=80',
    highlights: '20.1MP Full Frame • Dual Pixel AF II • 8-Stop IBIS',
    specs: [
      '20.1 Megapixel Full-Frame CMOS Sensor',
      'Dual Pixel CMOS AF II with 1053 automatic AF zones',
      '4K 60p and 1080p 120p 10-bit 4:2:2 in Canon Log (C-Log)',
      'Up to 8 stops of Coordinated In-Body Image Stabilization (IBIS)',
      'Dual SD UHS-II card slots for redundant shoot safety',
      'World-class skin tone science and color fidelity'
    ],
    bestFor: 'Wedding ceremonies, emotional brand storytelling & studio portraiture'
  },
  {
    id: 'canon-r6-ii',
    name: 'Canon EOS R6 Mark II',
    category: 'canon-body',
    type: 'High-Speed Cinema Body',
    tag: '6K Oversampled 4K',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=800&q=80',
    highlights: '24.2MP Sensor • 40fps Continuous • 6K 60p ProRes RAW HDMI',
    specs: [
      '24.2 Megapixel Full-Frame Sensor',
      'Full-width 6K oversampled 4K 60p recording with no crop',
      'Up to 40fps electronic shutter with full AF/AE tracking',
      'Advanced deep-learning subject detection',
      'C-Log3 and HDR PQ for extensive post-production grading',
      '6K 60p ProRes RAW external recording capability via HDMI'
    ],
    bestFor: 'Commercial commercials, fast live events, concert stages & brand PR launches'
  },
  {
    id: 'canon-r6-iii',
    name: 'Canon EOS R6 Mark III',
    category: 'canon-body',
    type: 'Next-Gen Flagship Body',
    tag: 'Flagship Production',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1589872307379-0ffdf9829123?auto=format&fit=crop&w=800&q=80',
    highlights: 'Next-Gen Cinema Speed • High-Bandwidth • Timecode Sync',
    specs: [
      'Next-generation high-speed full-frame cinema architecture',
      'Pristine 4K / 6K video fidelity with advanced thermal dissipation',
      'Next-gen Dual Pixel AF tracking with enhanced low-light sensitivity',
      'Seamless multi-cam timecode synchronization',
      'Expanded dynamic range tailored for cinematic HDR workflows'
    ],
    bestFor: 'High-tier commercial productions, cinematic documentaries & broadcast campaigns'
  },

  // CANON LENSES
  {
    id: 'canon-28-70',
    name: '28-70mm f/2.8 RF',
    category: 'canon-lens',
    type: 'Pro Standard Zoom Lens',
    tag: 'Flagship Zoom',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    highlights: 'Constant f/2.8 • Pristine Rendering • Customizable Control Ring',
    specs: [
      'Constant fast f/2.8 aperture across the entire zoom range',
      'Advanced optical coatings reducing chromatic aberration',
      'Silent STM autofocus with customizable control ring',
      'Weather-sealed barrel engineered for demanding production sets'
    ],
    bestFor: 'High-fashion editorial, commercial brand campaigns & live stage coverage'
  },
  {
    id: 'canon-24-105',
    name: '24-105mm f/4 L IS USM',
    category: 'canon-lens',
    type: 'All-Round Standard Zoom Lens',
    tag: 'Workhorse L-Series',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    highlights: '5-Stop Optical IS • Nano USM • Legendary L-Series Red Ring',
    specs: [
      'Versatile 24mm wide to 105mm telephoto zoom range',
      'Constant f/4 aperture with 5-stop Optical Image Stabilizer',
      'High-speed, smooth, and quiet Nano USM motor',
      'Robust weather-sealing against dust and moisture'
    ],
    bestFor: 'Live event coverage, corporate summits, press launches & agile docu-shoots'
  },
  {
    id: 'canon-10-18',
    name: '10-18mm f/4 IS STM',
    category: 'canon-lens',
    type: 'Ultra Wide Zoom Lens',
    tag: 'Ultra Wide Angle',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=800&q=80',
    highlights: '4-Stop IS (7-Stop with IBIS) • Weighs Only 150g • Expansive View',
    specs: [
      'Expansive ultra-wide viewing angle for tight locations',
      '4-stop Optical Image Stabilization (up to 7 stops with IBIS)',
      'Weighs only 150g for effortless gimbal and crane balance',
      'Smooth movie servo AF tracking'
    ],
    bestFor: 'Luxury real estate tours, architectural documentation & expansive landscape shots'
  },
  {
    id: 'canon-16',
    name: '16mm f/2.8 STM',
    category: 'canon-lens',
    type: 'Ultra Wide Prime Lens',
    tag: 'Wide Prime',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80',
    highlights: '108° Diagonal FOV • Ultra-Compact Palm Size • Bright f/2.8',
    specs: [
      '108° diagonal field of view on full-frame cameras',
      'Fast f/2.8 maximum aperture for dramatic depth and night scenes',
      'Remarkably small form factor (fits in palm of hand)',
      'Customizable RF control ring for instant aperture adjustment'
    ],
    bestFor: 'Dynamic b-roll, wide establishing takes, behind-the-scenes & vlogging'
  },
  {
    id: 'canon-35',
    name: '35mm f/1.8 Macro IS STM',
    category: 'canon-lens',
    type: 'Cinema Story Prime Lens',
    tag: 'Story Prime',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    highlights: 'Optical IS • 1:2 Macro Ratio • Dreamy f/1.8 Separation',
    specs: [
      'Natural 35mm field of view matching classic cinematic masterpieces',
      'Fast f/1.8 aperture for dreamy background separation',
      '5-stop Optical Image Stabilization for handheld confidence',
      'Macro capability with 0.5x magnification for close-up product detail'
    ],
    bestFor: 'Commercial product close-ups, narrative dialogue, interviews & documentary'
  },
  {
    id: 'canon-50',
    name: '50mm f/1.8 STM',
    category: 'canon-lens',
    type: 'Standard Prime Lens',
    tag: 'The Nifty Fifty',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1590291103653-997f5deee905?auto=format&fit=crop&w=800&q=80',
    highlights: 'Human Eye Perspective • Bright f/1.8 • Super Spectra Coating',
    specs: [
      '50mm focal length closely resembling human eye perspective',
      'Bright f/1.8 aperture producing cinematic shallow depth of field',
      'Super Spectra Coating minimizing flares and reflections',
      'Essential prime for clean, undistorted visual storytelling'
    ],
    bestFor: 'Artistic portraits, brand ambassadors, casual set b-roll & low-light ambiance'
  },
  {
    id: 'canon-85',
    name: '85mm f/1.8 Prime',
    category: 'canon-lens',
    type: 'Pro Portrait Prime Lens',
    tag: 'Pro Portrait Optic',
    mount: 'Canon RF-Mount',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80',
    highlights: 'Flattering Compression • Butter Bokeh • Eye AF Precision',
    specs: [
      'Flattering 85mm focal compression that contours facial features',
      'Bright f/1.8 aperture for dramatic cinematic separation',
      'Smooth, accurate AF tracking on human eyes and faces',
      'Exceptional contrast and color balance across the frame'
    ],
    bestFor: 'High-end beauty shoots, corporate headshots & intimate interview scenes'
  },

  // GIMBALS & STABILIZATION
  {
    id: 'dji-rs4-mini',
    name: 'DJI RS 4 Mini Gimbal',
    category: 'gimbal',
    type: '3-Axis Camera Gimbal',
    tag: 'Agile Gimbal',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    highlights: '850g Lightweight • 2kg Payload • 2nd-Gen Auto-Locks',
    specs: [
      'Ultra-lightweight design weighing only 850g for prolonged single-handed operation',
      '2kg (4.4 lbs) tested payload capacity supporting Sony & Canon hybrid setups',
      '2nd-Gen Automated Axis Locks for instant deployment in seconds',
      'Native vertical shooting switch for instant 9:16 social reel capture',
      '10-hour battery runtime for full day production readiness'
    ],
    bestFor: 'Rapid mobile event tracking, fast-paced commercial reels & agile wedding moments'
  },
  {
    id: 'dji-rs5-dual',
    name: 'DJI RS 5 Gimbal (Dual Setup / 2x Units)',
    category: 'gimbal',
    type: 'Pro Cinema Stabilizers',
    tag: 'Dual 2x Units',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    highlights: 'Dual Setup • Heavy Cinema Rig Payload • Next-Gen RS Stabilization',
    specs: [
      'Two (x2) identical next-gen flagship DJI RS 5 stabilizers for simultaneous multi-cam work',
      'Heavy cinema payload capacity balancing Sony FX30 & Canon R-Series with cinema cages',
      'Enhanced carbon fiber construction for maximum rigidity and vibration suppression',
      'LiDAR automated focusing integration support for ultra-fast manual lens tracking',
      'Wireless video transmitter mount and multi-operator control compatibility'
    ],
    bestFor: 'Commercial sets, two-operator concert coverage, synchronized multi-cam live shoots'
  }
];

const PACKAGES = [
  {
    title: 'Commercial & Brand Film Kit',
    subtitle: 'Cinema-grade full production package for brand manifestos, TVCs, and PR launches.',
    bodies: ['Sony FX30 Cinema Line', 'Canon EOS R6 Mark II'],
    lenses: ['Canon 28-70mm f/2.8', 'Sony 85mm f/1.8', 'Canon 35mm f/1.8'],
    stabilization: 'DJI RS 5 Gimbal (Pro Rig)',
    highlights: '10-bit 4:2:2 C-Log3 & S-Cinetone dual color matching'
  },
  {
    title: 'Multi-Camera Live Shoot Package',
    subtitle: 'Synchronized multi-camera production for live stage, concerts, summits, and keynotes.',
    bodies: ['Sony FX30', 'Canon EOS R6 Mark I', 'Canon EOS R6 Mark II'],
    lenses: ['Canon 24-105mm f/4 L IS', 'Sony 17-70mm f/2.8 VC', 'Canon 85mm f/1.8'],
    stabilization: 'DJI RS 5 + DJI RS 4 Mini (Dual Operator Setup)',
    highlights: 'Active cooling for non-stop multi-hour continuous recording'
  },
  {
    title: 'Podcast Studio Setup',
    subtitle: 'Multi-angle studio visual podcast production with host, guest & wide table coverage.',
    bodies: ['Sony FX30 (Host)', 'Sony A7 IV (Guest)', 'Canon R6 (Wide Angle)'],
    lenses: ['Sony 85mm f/1.8', 'Canon 50mm f/1.8', 'Canon 16mm f/2.8'],
    stabilization: 'Studio tripods with micro-fluid heads & overhead booms',
    highlights: 'Zero-latency HDMI out for real-time live vision switching'
  },
  {
    title: 'Real Estate & Architectural Walkthrough',
    subtitle: 'Smooth fluid walkthroughs with optimal dynamic range and rectilinear wide optics.',
    bodies: ['Canon EOS R6 Mark II', 'Sony A6700'],
    lenses: ['Canon 10-18mm f/4 IS', 'Sony 10-18mm f/2.8 Wide', 'Canon 16mm f/2.8'],
    stabilization: 'DJI RS 4 Mini (Native Horizon Leveling)',
    highlights: 'Straight architectural lines without fisheye distortion'
  }
];

export default function GearPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Default to LIST FORMAT as requested
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = GEAR_INVENTORY.filter(item => {
    // Category filter
    const matchesCategory = 
      activeCategory === 'all' ? true :
      activeCategory === 'sony' ? item.category.startsWith('sony') :
      activeCategory === 'canon' ? item.category.startsWith('canon') :
      activeCategory === 'bodies' ? item.category.endsWith('body') :
      activeCategory === 'lenses' ? item.category.endsWith('lens') :
      activeCategory === 'gimbals' ? item.category === 'gimbal' : true;

    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.highlights.toLowerCase().includes(q) ||
      item.bestFor.toLowerCase().includes(q) ||
      (item.mount && item.mount.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const totalBodies = GEAR_INVENTORY.filter(i => i.category.endsWith('body')).length;
  const totalLenses = GEAR_INVENTORY.filter(i => i.category.endsWith('lens')).length;
  const totalGimbals = 3; // RS 4 Mini + RS 5 x 2

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-white/10">
        {/* Subtle Background Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute top-10 left-1/4 w-[40vw] h-[40vw] rounded-full bg-blue-900/15 blur-[140px] mix-blend-screen" />
          <div className="absolute bottom-10 right-1/4 w-[35vw] h-[35vw] rounded-full bg-amber-900/15 blur-[150px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
          <div className="mb-6">
            <Breadcrumbs variant="pill" />
          </div>

          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight leading-[1.05] mb-6">
              Shoot Gear & <br />
              <span className="text-white/50">Production Arsenal</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-8">
              Every production is captured using in-house, studio-owned cinema systems, high-speed prime optics, and multi-camera stabilization rigs calibrated for broadcast-grade commercial, live shoot, and podcast delivery.
            </p>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-sm">
              <div className="border-r border-white/5 pr-4">
                <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-0.5">{totalBodies} Camera Bodies</div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">Sony Cinema & Canon R</div>
              </div>
              <div className="border-r border-white/5 pr-4">
                <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-0.5">{totalLenses} Prime & Zooms</div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">10mm to 105mm Optics</div>
              </div>
              <div className="border-r border-white/5 pr-4">
                <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-0.5">{totalGimbals} Gimbal Rigs</div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">DJI RS 4 Mini & RS 5 x2</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-amber-300 mb-0.5">100% Owned</div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">Zero Rental Delay</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gear Showcase Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          
          {/* Controls Bar: Search, Category Tabs, and List/Grid View Switcher */}
          <div className="flex flex-col gap-6 pb-8 mb-10 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-1">
                  Camera & Lens Inventory
                </h2>
                <p className="text-xs text-white/50">
                  Showing {filteredItems.length} studio-owned production assets with specifications & optical photos
                </p>
              </div>

              {/* View Mode Switcher (LIST vs GRID) & Search */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search camera, lens, mount..."
                    className="pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 w-48 sm:w-60 transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* View Format Switcher */}
                <div className="flex items-center border border-white/15 rounded-sm p-0.5 bg-white/5 shrink-0">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-sm transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-black font-semibold shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                    title="List Format with Photos"
                  >
                    <List size={14} />
                    <span className="hidden sm:inline">List View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-sm transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-black font-semibold shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                    title="Grid Cards Format"
                  >
                    <LayoutGrid size={14} />
                    <span className="hidden sm:inline">Grid View</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Equipment' },
                { id: 'bodies', label: 'Camera Bodies' },
                { id: 'lenses', label: 'Optics & Lenses' },
                { id: 'sony', label: 'Sony Gear' },
                { id: 'canon', label: 'Canon Gear' },
                { id: 'gimbals', label: 'Gimbals & Rigs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-wider transition-all duration-200 border rounded-sm ${
                    activeCategory === tab.id
                      ? 'bg-white text-black font-bold border-white shadow-lg'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* LIST FORMAT (Default View) */}
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredItems.map((item, index) => {
                const isSony = item.category.startsWith('sony');
                const isCanon = item.category.startsWith('canon');
                const isBody = item.category.endsWith('body');
                const isLens = item.category.endsWith('lens');

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % 5) * 0.05 }}
                    className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/25 rounded-sm p-4 sm:p-5 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 group relative overflow-hidden"
                  >
                    {/* Left: Camera / Lens Photo with Zoom Effect */}
                    <div className="w-full md:w-48 lg:w-56 h-48 md:h-36 shrink-0 relative rounded-sm overflow-hidden bg-black/60 border border-white/10 group-hover:border-white/30 transition-colors">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to stylized dark camera background if external photo has connectivity issues
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                      {/* Brand Pill on Photo */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border backdrop-blur-md ${
                          isSony 
                            ? 'bg-blue-950/70 text-blue-300 border-blue-500/40'
                            : isCanon
                            ? 'bg-red-950/70 text-red-300 border-red-500/40'
                            : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {item.tag}
                        </span>
                      </div>

                      {/* Mount / Type indicator on photo */}
                      {item.mount && (
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/80">
                          <span className="truncate">{item.mount}</span>
                        </div>
                      )}
                    </div>

                    {/* Center: Details, Name, Specs List */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] text-white/40 uppercase tracking-widest font-mono">
                          {item.type}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-xs text-amber-300/90 font-mono">
                          {item.highlights}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white group-hover:text-amber-300 transition-colors mb-2">
                        {item.name}
                      </h3>

                      {/* Specs Row */}
                      <div className="flex flex-wrap gap-2 my-2.5">
                        {item.specs.slice(0, 4).map((spec, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 text-white/80 text-xs rounded-sm"
                          >
                            <Check size={11} className="text-amber-400 shrink-0" />
                            <span className="line-clamp-1">{spec}</span>
                          </span>
                        ))}
                      </div>

                      {/* Best For Note */}
                      <p className="text-xs text-white/60 mt-2 flex items-center gap-1.5">
                        <span className="text-white/40 uppercase tracking-wider font-mono text-[10px]">Best For:</span>
                        <span>{item.bestFor}</span>
                      </p>
                    </div>

                    {/* Right: Studio Status & Action */}
                    <div className="w-full md:w-auto shrink-0 flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                      <div className="text-left md:text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                          <CheckCircle2 size={12} /> In-House Studio
                        </span>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider">
                          Ready For Mumbai & Pan-India
                        </div>
                      </div>

                      <Link
                        to="/#contact"
                        className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wider text-[11px] hover:bg-white/90 transition-all rounded-sm flex items-center gap-1.5"
                      >
                        <span>Book Gear</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* GRID FORMAT */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const isSony = item.category.startsWith('sony');
                const isCanon = item.category.startsWith('canon');

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
                    className="bg-white/[0.02] border border-white/10 hover:border-white/25 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 group relative"
                  >
                    {/* Top Photo */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border-b border-white/10">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Badges on Photo */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border backdrop-blur-md ${
                          isSony 
                            ? 'bg-blue-950/70 text-blue-300 border-blue-500/40'
                            : isCanon
                            ? 'bg-red-950/70 text-red-300 border-red-500/40'
                            : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {item.tag}
                        </span>

                        {item.mount && (
                          <span className="text-[10px] text-white/80 tracking-wider uppercase font-mono px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm">
                            {item.mount}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 text-xs text-amber-300/90 font-mono truncate">
                        {item.highlights}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] text-white/40 uppercase tracking-widest mb-1">
                          {item.type}
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-amber-300 transition-colors mb-3">
                          {item.name}
                        </h3>

                        {/* Specs List */}
                        <div className="space-y-1.5 py-3 border-t border-b border-white/5 my-3">
                          {item.specs.slice(0, 3).map((spec, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                              <span className="text-amber-400 mt-0.5 shrink-0">
                                <Check size={12} />
                              </span>
                              <span className="line-clamp-1">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Best For Scenario & CTA */}
                      <div className="mt-2 pt-2 flex items-center justify-between">
                        <div className="text-xs text-white/60 line-clamp-1 pr-2">
                          {item.bestFor}
                        </div>
                        <Link 
                          to="/#contact"
                          className="shrink-0 text-[11px] uppercase tracking-wider text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                        >
                          Book <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty state if search has no match */}
          {filteredItems.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/15 rounded-sm p-8">
              <Camera size={36} className="mx-auto text-white/30 mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-2">
                No Gear Found Matching "{searchQuery}"
              </h3>
              <p className="text-xs text-white/50 mb-6">
                Try searching for a different lens, camera body or clear filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-white/90"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Production Packages & Multi-Cam Kits */}
      <section className="py-20 bg-darker/60 border-t border-b border-white/10 relative">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-2 block">
              Pre-Configured Setups
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight">
              Calibrated Shooting Kits
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-3">
              How these cameras, prime lenses, and dual gimbals are deployed on actual client shoots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-sm hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                      {pkg.title}
                    </h3>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                  <p className="text-xs text-white/60 mb-6 leading-relaxed">
                    {pkg.subtitle}
                  </p>

                  <div className="space-y-3.5 border-t border-white/5 pt-5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                        Camera System
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.bodies.map(b => (
                          <span key={b} className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/90 rounded-sm font-medium">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                        Optics Deployed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.lenses.map(l => (
                          <span key={l} className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80 rounded-sm">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                        Support & Stabilization
                      </span>
                      <span className="text-white/80 font-medium">
                        {pkg.stabilization}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-amber-300">
                  <span>★ {pkg.highlights}</span>
                  <Link to="/#contact" className="hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider text-[11px] font-semibold">
                    Book This Setup <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Call to Action */}
      <section className="py-20 md:py-28 text-center relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 text-amber-300">
            <Film size={24} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-5">
            Ready For Your Next Production?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-8 font-light">
            Need multi-camera coverage in Mumbai or on-location across India? Let’s configure the right gear package for your shoot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/#contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all duration-300 text-center"
            >
              Inquire & Book Shoot
            </Link>
            <a
              href="https://wa.me/918827474622?text=Hi%20Aman,%20I%20would%20like%20to%20inquire%20about%20your%20camera%20gear%20and%20production%20availability."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 text-center"
            >
              WhatsApp Studio Direct
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
