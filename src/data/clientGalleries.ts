export interface ClientGalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  src: string;
  category: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  videoDuration?: string;
  driveFileUrl?: string;
  resolution?: string;
}

export interface ClientGallery {
  id: string;
  slug: string;
  clientName: string;
  clientEmail?: string;
  title: string;
  serviceType: string;
  date: string;
  location: string;
  coverImage: string;
  driveFolderUrl: string;
  description: string;
  photoCount: number;
  videoCount: number;
  totalStorage: string;
  resolution: string;
  pin?: string;
  createdAt: string;
  items: ClientGalleryItem[];
}

export const INITIAL_CLIENT_GALLERIES: ClientGallery[] = [
  {
    id: 'cg-nisha-himanshu',
    slug: 'nisha-himanshu',
    clientName: 'Nisha & Himanshu',
    clientEmail: 'nisha.himanshu@gmail.com',
    title: 'Nisha & Himanshu Wedding & Celebrations',
    serviceType: 'Wedding Photo & Video',
    date: 'February 2025',
    location: 'Mumbai, India',
    coverImage: '/services/wedding.jpg',
    driveFolderUrl: 'https://drive.google.com/drive/folders/17mPtdq7uGz_BWntXtExGDxECaWJwff53?usp=sharing',
    description: 'Welcome Nisha & Himanshu! We are delighted to present your complete wedding deliverables package. All high-resolution color-graded master photography, 4K ceremony film cuts, and social media reels are hosted on Google Drive for high-speed cloud access and direct download.',
    photoCount: 520,
    videoCount: 4,
    totalStorage: '24.2 GB',
    resolution: 'Sony A7R V 61MP RAW + 4K ProRes 422 Cinema',
    pin: '',
    createdAt: '2025-02-28T12:00:00.000Z',
    items: [
      {
        id: 'nh-1',
        title: 'Bridal Portrait & Golden Glow',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        category: 'Bridal Elegance',
        aspectRatio: 'portrait',
        resolution: '9504 x 6336 px (61MP)'
      },
      {
        id: 'nh-2',
        title: 'Pheras & Sacred Vows Ritual',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        category: 'Wedding Rituals',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      },
      {
        id: 'nh-3',
        title: 'Cinematic 4K Wedding Highlights Cut',
        type: 'video',
        src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
        category: '4K Cinema Film',
        aspectRatio: 'landscape',
        videoDuration: '03:45',
        resolution: '3840 x 2160 (4K Cinema ProRes)'
      },
      {
        id: 'nh-4',
        title: 'Varmala Celebration & Floral Shower',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        category: 'Varmala',
        aspectRatio: 'landscape',
        resolution: '9504 x 6336 px'
      },
      {
        id: 'nh-5',
        title: 'Grand Reception & Couple First Dance',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
        category: 'Reception Gala',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      },
      {
        id: 'nh-6',
        title: 'Sangeet Choreography & Candid Moments',
        type: 'photo',
        src: '/services/wedding.jpg',
        category: 'Sangeet Highlights',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      }
    ]
  },
  {
    id: 'cg-1',
    slug: 'vanguard-luxury-gala-2025',
    clientName: 'Vanguard Society',
    clientEmail: 'events@vanguardsociety.org',
    title: 'Annual Luxury Gala & Awards 2025',
    serviceType: 'Event Photography & Videography',
    date: 'February 24, 2025',
    location: 'The St. Regis Grand Ballroom, Mumbai',
    coverImage: '/events/r.jpg',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1AmanVisual-VanguardGala-2025?usp=sharing',
    description: 'Welcome to your official Aman Visual deliverables portal. Here are all final color-graded high-resolution photos and 4K cinema cuts from the 2025 Vanguard Society Gala. All full-resolution print-ready files and vertical reels are accessible via your dedicated Google Drive folder.',
    photoCount: 420,
    videoCount: 4,
    totalStorage: '16.8 GB',
    resolution: 'Sony A7R V 61MP RAW + 4K ProRes 422',
    pin: '',
    createdAt: '2025-02-26T10:00:00.000Z',
    items: [
      {
        id: 'vg-1',
        title: 'VIP Step-and-Repeat Red Carpet',
        type: 'photo',
        src: '/events/r.jpg',
        category: 'Red Carpet',
        aspectRatio: 'portrait',
        resolution: '9504 x 6336 px (61MP)'
      },
      {
        id: 'vg-2',
        title: 'Opening Keynote & Arena Lighting',
        type: 'photo',
        src: '/events/1.jpg',
        category: 'Keynote',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      },
      {
        id: 'vg-3',
        title: 'Executive Leadership Panel Discussion',
        type: 'photo',
        src: '/events/2.jpg',
        category: 'Summit',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      },
      {
        id: 'vg-4',
        title: 'Awards Presentation Ceremony',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        category: 'Awards',
        aspectRatio: 'landscape',
        resolution: '9504 x 6336 px'
      },
      {
        id: 'vg-5',
        title: 'Cinematic 4K Highlights Film',
        type: 'video',
        src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        category: 'Video Highlights',
        aspectRatio: 'landscape',
        videoDuration: '02:45',
        resolution: '3840 x 2160 (4K Cinema)'
      },
      {
        id: 'vg-6',
        title: 'Live Musical Performance & Finale',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        category: 'Celebration',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      }
    ]
  },
  {
    id: 'cg-2',
    slug: 'rohan-aditi-royal-wedding',
    clientName: 'Rohan & Aditi Sharma',
    clientEmail: 'rohan.aditi.wedding@gmail.com',
    title: 'The Royal Heritage Wedding & Reception',
    serviceType: 'Wedding Photo & Video',
    date: 'January 18, 2025',
    location: 'Taj Lands End & Umaid Heritage, Mumbai',
    coverImage: '/services/wedding.jpg',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1AmanVisual-RohanAditi-Wedding?usp=sharing',
    description: 'Dearest Aditi & Rohan, it was our absolute honor documenting the beginning of your forever. Here is your master gallery containing every timeless portrait, emotional ceremony moment, and your 4K cinematic wedding teaser. Tap below to download full uncompressed albums directly from Google Drive.',
    photoCount: 650,
    videoCount: 6,
    totalStorage: '28.5 GB',
    resolution: '61MP Master RAW + 4K ProRes Film Cut',
    pin: '',
    createdAt: '2025-01-22T14:30:00.000Z',
    items: [
      {
        id: 'raw-1',
        title: 'Bridal Portraiture & Golden Hour Glow',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        category: 'Bridal',
        aspectRatio: 'portrait',
        resolution: '9504 x 6336 px'
      },
      {
        id: 'raw-2',
        title: 'Varmala Ceremony Under Flower Canopy',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        category: 'Ceremony',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      },
      {
        id: 'raw-3',
        title: 'The 4K Cinematic Wedding Film Teaser',
        type: 'video',
        src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
        category: 'Teaser Film',
        aspectRatio: 'landscape',
        videoDuration: '03:20',
        resolution: '4K Ultra HD Cinema'
      },
      {
        id: 'raw-4',
        title: 'Grand Reception Toast & First Dance',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        category: 'Reception',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      },
      {
        id: 'raw-5',
        title: 'Sangeet Choreography Highlights',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
        category: 'Sangeet',
        aspectRatio: 'landscape',
        resolution: '7008 x 4672 px'
      }
    ]
  },
  {
    id: 'cg-3',
    slug: 'worli-seaface-penthouse',
    clientName: 'Prestige Living Group',
    clientEmail: 'media@prestigeliving.in',
    title: 'Worli Seaface Triplex Penthouse Architectural Shoot',
    serviceType: 'Real Estate Photography & Videography',
    date: 'March 02, 2025',
    location: 'Worli Seaface, South Mumbai',
    coverImage: '/services/re-photo.jpg',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1AmanVisual-PrestigePenthouse?usp=sharing',
    description: 'Complete architectural visual portfolio for MLS listings, print brochures, and luxury social marketing. Includes twilight HDR brackets, interior wide-angle walkthroughs, and ultra-smooth FPV flythrough video.',
    photoCount: 85,
    videoCount: 3,
    totalStorage: '9.2 GB',
    resolution: 'HDR Architectural Multi-Exposure + 4K 60FPS FPV',
    pin: '',
    createdAt: '2025-03-04T08:00:00.000Z',
    items: [
      {
        id: 'wsp-1',
        title: 'Infinity Pool & Arabian Sea Skyline Twilight',
        type: 'photo',
        src: '/services/re-photo.jpg',
        category: 'Exterior HDR',
        aspectRatio: 'landscape',
        resolution: '9504 x 6336 px'
      },
      {
        id: 'wsp-2',
        title: 'Double-Height Living Salon & Italian Marble',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        category: 'Living Space',
        aspectRatio: 'landscape',
        resolution: '9504 x 6336 px'
      },
      {
        id: 'wsp-3',
        title: 'Cinematic FPV Interior Drone Tour',
        type: 'video',
        src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        category: 'FPV Flythrough',
        aspectRatio: 'landscape',
        videoDuration: '01:45',
        resolution: '4K 60FPS ProRes'
      }
    ]
  },
  {
    id: 'cg-4',
    slug: 'aura-couture-autumn-lookbook',
    clientName: 'Aura Haute Couture',
    clientEmail: 'editorial@auracouture.com',
    title: 'Autumn/Winter Luxury Lookbook & Brand Campaign',
    serviceType: 'Brand PR Shoots',
    date: 'January 28, 2025',
    location: 'Bandra Studio & Outdoor Heritage Fort, Mumbai',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1AmanVisual-AuraCouture-AW25?usp=sharing',
    description: 'High-fashion editorial, press launch media assets, and 9:16 vertical TikTok/Instagram reels for Aura Couture AW25. Full-resolution commercial licensing files ready on Google Drive.',
    photoCount: 160,
    videoCount: 8,
    totalStorage: '14.1 GB',
    resolution: 'Medium Format Grade Color Science + 4K Editorial Film',
    pin: '',
    createdAt: '2025-01-30T16:00:00.000Z',
    items: [
      {
        id: 'aura-1',
        title: 'Editorial Silk Draped Gown Portrait',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        category: 'Editorial',
        aspectRatio: 'portrait',
        resolution: '8000 x 5333 px'
      },
      {
        id: 'aura-2',
        title: 'Runway Press Photocall & Ambassador',
        type: 'photo',
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
        category: 'PR Media',
        aspectRatio: 'landscape',
        resolution: '9504 x 6336 px'
      },
      {
        id: 'aura-3',
        title: 'Behind-The-Scenes Campaign Reel',
        type: 'video',
        src: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80',
        category: 'Social Reel',
        aspectRatio: 'landscape',
        videoDuration: '00:58',
        resolution: 'Vertical 4K 9:16'
      }
    ]
  }
];
