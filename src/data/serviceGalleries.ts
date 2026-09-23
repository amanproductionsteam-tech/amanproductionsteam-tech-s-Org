export interface ServiceGalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  src: string;
  category: string;
  client: string;
  location: string;
  gear: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  videoDuration?: string;
  isGoogleDrive?: boolean;
  driveFileId?: string;
  isInstagram?: boolean;
  instagramUrl?: string;
  thumbnailUrl?: string;
}

// Service Galleries Media Store:
// Each section contains 10+ high-resolution, curated media items strictly categorized according to its section head.
// Zero cross-contamination: each section only displays content authentic to its specific discipline.
export const SERVICE_GALLERIES: Record<string, ServiceGalleryItem[]> = {
  // 1. Event Photography & Videography (Live concerts, festivals, stage productions, arena tours)
  'event-photo': [
    {
      id: 'ep-01',
      title: 'Concert Arena Pyro & Laser Finale',
      type: 'photo',
      src: '/events/stage-pyro-finale.jpg',
      category: 'Concerts & Festivals',
      client: 'Live Arena World Tour',
      location: 'D.Y. Patil Stadium, Mumbai',
      gear: 'Sony A1 • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-02',
      title: 'Karan Aujla — It Was All A Dream Arena Tour',
      type: 'photo',
      src: '/events/karan-aujla-concert.jpg',
      category: 'Concerts & Festivals',
      client: 'Karan Aujla Live',
      location: 'Indira Gandhi Arena, New Delhi',
      gear: 'Sony A1 • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-03',
      title: 'KR$NA — Live Rap Arena India Tour',
      type: 'photo',
      src: '/events/krsna-concert.jpg',
      category: 'Concerts & Festivals',
      client: 'Kalamkaar Music Festival',
      location: 'Jio World Garden, Mumbai',
      gear: 'Sony FX3 • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-04',
      title: 'The Grand Stage Architectural Production',
      type: 'photo',
      src: '/events/the-stage-production.jpg',
      category: 'Stage & Sound',
      client: 'Mainstage Acoustic Design',
      location: 'Palace Grounds, Bangalore',
      gear: 'Sony FX3 Cinema • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-05',
      title: 'Arena Crowd Immersion & Collective Energy',
      type: 'photo',
      src: '/events/arena-crowd-immersion.jpg',
      category: 'Concerts & Festivals',
      client: 'Sunburn Arena Productions',
      location: 'MMRDA Grounds, BKC Mumbai',
      gear: 'Sony FX3 • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-06',
      title: 'Between Sets — High-Voltage Stadium Atmosphere',
      type: 'photo',
      src: '/events/stage-arena-crowd.jpg',
      category: 'Concerts & Festivals',
      client: 'Live Nation India',
      location: 'Vagator Arena, Goa',
      gear: 'Sony FX3 • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-07',
      title: 'Kinetic Lighting Beams & Stage Visuals',
      type: 'photo',
      src: '/events/stage-lighting-visuals.jpg',
      category: 'Stage & Sound',
      client: 'Bass Camp Electronic Festival',
      location: 'Dome NSCI, Mumbai',
      gear: 'Sony FX3 Cinema • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-08',
      title: 'Live Stage Pulse & Visual Immersion',
      type: 'photo',
      src: '/events/live-stage-pulse.jpg',
      category: 'Stage & Sound',
      client: 'EDM Live Network',
      location: 'Bhartiya City, Bengaluru',
      gear: 'Sony FX3 • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-09',
      title: 'Electric Guitar Lead & Amber Floodlights',
      type: 'photo',
      src: '/events/live-concert-performance.jpg',
      category: 'Concerts & Festivals',
      client: 'Rock In India Open Air',
      location: 'Pune Amphitheatre',
      gear: 'Sony A7 IV • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-10',
      title: 'Live Spotlight Vocalist Solo',
      type: 'photo',
      src: '/events/live-spotlight-artist.jpg',
      category: 'Live Stage Shows',
      client: 'Acoustic Soul Sessions',
      location: 'Royal Opera House, Mumbai',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-11',
      title: 'Soulful Melodies to Unforgettable Dances',
      type: 'photo',
      src: '/events/soulful-melodies-dance.jpg',
      category: 'Live Stage Shows',
      client: 'Melody & Rhythm Collective',
      location: 'NCPA Mumbai',
      gear: 'Sony A7 IV • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-12',
      title: 'Choreographed Troupe Dance & Laser Synchrony',
      type: 'photo',
      src: '/events/stage-live-dancing.jpg',
      category: 'Live Stage Shows',
      client: 'Dance Odyssey Troupe',
      location: 'NMACC Grand Theatre, Mumbai',
      gear: 'Sony FX3 • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-13',
      title: 'Indian Bank NRI Annual Executive Gala',
      type: 'photo',
      src: '/events/indian-bank-nri-event.jpg',
      category: 'Corporate Galas',
      client: 'Indian Bank Global Division',
      location: 'The Taj Mahal Palace, Mumbai',
      gear: 'Sony A7R V • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-14',
      title: 'Executive Global Keynote & Leadership Forum',
      type: 'photo',
      src: '/events/charleston-conference.jpg',
      category: 'Corporate Galas',
      client: 'Global Enterprise Forum',
      location: 'Jio World Convention Centre',
      gear: 'Sony A7 IV • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-15',
      title: 'India Expo Centre & Mart Grand Exhibition',
      type: 'photo',
      src: '/events/india-expo-centre.jpg',
      category: 'Corporate Galas',
      client: 'India Expo Mart Consortium',
      location: 'Greater Noida Expo Pavilion',
      gear: 'Sony A7 IV • 12-24mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-16',
      title: 'Sumant & Dahlgren — Architectural Gala Hall',
      type: 'photo',
      src: '/events/sumant-dahlgren-gala.jpg',
      category: 'Corporate Galas',
      client: 'Sumant & Dahlgren Foundation',
      location: 'Grand Heritage Library Hall, Mumbai',
      gear: 'Sony A7R V • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-17',
      title: 'The Boys Club — Lakmé Fashion Week Day 1 Opening',
      type: 'photo',
      src: '/events/lakme-fashion-week-day1.jpg',
      category: 'Corporate Galas',
      client: 'Lakmé Fashion Week Production',
      location: 'Jio World Convention Centre, Mumbai',
      gear: 'Sony A1 • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-18',
      title: 'Grand Gala Night Opening & Atmosphere',
      type: 'photo',
      src: '/events/gala-night-opening.jpg',
      category: 'Corporate Galas',
      client: 'Aman Visual Productions',
      location: 'Grand Hyatt Mumbai',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-19',
      title: 'LED Stick Grand Sangeet Entry',
      type: 'photo',
      src: '/events/led-stick-sangeet-entry.jpg',
      category: 'Sangeet & Celebrations',
      client: 'Sharma & Verma Celebration',
      location: 'Fairmont Jaipur',
      gear: 'Sony FX3 • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-20',
      title: 'Groom on the Dance Floor — High Energy Sangeet',
      type: 'photo',
      src: '/events/groom-dance-floor-sangeet.jpg',
      category: 'Sangeet & Celebrations',
      client: 'Kapoor & Mehra Gala',
      location: 'Taj Falaknuma Palace, Hyderabad',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-21',
      title: 'Sangeet Live Artists & Stage Performance',
      type: 'photo',
      src: '/events/sangeet-artists.jpg',
      category: 'Sangeet & Celebrations',
      client: 'Live Sangeet Ensemble',
      location: 'Rambagh Palace, Jaipur',
      gear: 'Sony A7R V • 135mm f/1.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-22',
      title: 'VIP Nightlife & Exclusive After-Party',
      type: 'photo',
      src: '/events/party-nightlife.jpg',
      category: 'Sangeet & Celebrations',
      client: 'Private VIP Network',
      location: 'Four Seasons Hotel Mumbai',
      gear: 'Sony A7 IV • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-23',
      title: 'Sania & Mughees — Mid-Event Candids',
      type: 'photo',
      src: '/events/sania-mughees-candids.jpg',
      category: 'Private Celebrations',
      client: 'Sania & Mughees',
      location: 'The Oberoi Amarvilas, Agra',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-24',
      title: 'Celebration Chemistry & Candid Frames',
      type: 'photo',
      src: '/events/its-all-about-us.jpg',
      category: 'Private Celebrations',
      client: 'Private Commission',
      location: 'City Palace, Udaipur',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-25',
      title: 'Haldi Vibes — Golden Petal Shower Extravaganza',
      type: 'photo',
      src: '/events/haldi-petal-shower.jpg',
      category: 'Private Celebrations',
      client: 'Roy & Singhania Event',
      location: 'Umaid Bhawan Palace, Jodhpur',
      gear: 'Sony A7R V • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-26',
      title: 'Royal Heritage Evening Moments',
      type: 'photo',
      src: '/events/elegant-indian-wedding-tradition.jpg',
      category: 'Private Celebrations',
      client: 'Singhania Family Gala',
      location: 'The Leela Palace, Udaipur',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-27',
      title: 'Navratri Special — Grand Ras Garba Mahotsav',
      type: 'photo',
      src: '/events/navratri-special.jpg',
      category: 'Cultural & Live Festivals',
      client: 'United Way Baroda',
      location: 'Vadodara Navratri Grounds',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-28',
      title: 'Valsad na Vighnaharta — Devotional Mahotsav',
      type: 'photo',
      src: '/events/valsad-vighnaharta-festival.jpg',
      category: 'Cultural & Live Festivals',
      client: 'Shree Ganeshotsav Samiti',
      location: 'Valsad, Gujarat',
      gear: 'Sony A7 IV • 24-105mm f/4 G',
      aspectRatio: 'landscape'
    },
    {
      id: 'ep-29',
      title: 'Where Color Meets Purpose — Live Production',
      type: 'photo',
      src: '/events/color-meets-purpose.jpg',
      category: 'Cultural & Live Festivals',
      client: 'Cultural Heritage Foundation',
      location: 'Sabarmati Riverfront, Ahmedabad',
      gear: 'Sony A7R V • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    }
  ],

  // 2. Brand PR Shoots (Press conferences, product announcements, brand ambassadors, media step-and-repeats)
  'brand-pr': [
    {
      id: 'bpr-01',
      title: 'Global Tech Flagship Press Conference',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85',
      category: 'Press Conferences',
      client: 'Nexus Tech Global',
      location: 'Grand Ballroom, Mumbai',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-02',
      title: 'Red Carpet Media Wall & Step-and-Repeat',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
      category: 'Media Galas',
      client: 'Vogue India Awards',
      location: 'St. Regis Mumbai',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-03',
      title: 'Brand Ambassador Contract Signing & Reveal',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=85',
      category: 'Brand Ambassadors',
      client: 'Apex Luxury Timepieces',
      location: 'Taj Lands End, Bandra',
      gear: 'Sony A1 • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-04',
      title: 'Automotive Electric Vehicle Press Launch',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
      category: 'Product Launches',
      client: 'Volt Motors India',
      location: 'Jio World Convention Centre',
      gear: 'Sony FX3 • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-05',
      title: 'Executive Media Briefing & Flash Photography',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85',
      category: 'Press Conferences',
      client: 'FinCorp India Summit',
      location: 'Trident Hotel, Nariman Point',
      gear: 'Sony A7 IV • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-06',
      title: 'Luxury Flagship Store Ribbon Cutting Ceremony',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=85',
      category: 'Product Launches',
      client: 'Maison Haute Joaillerie',
      location: 'Palladium Mall, Mumbai',
      gear: 'Sony A7R V • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-07',
      title: 'Influencer Brand Campaign VIP Preview',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85',
      category: 'Brand Ambassadors',
      client: 'Glow Cosmetics PR',
      location: 'Soho House Mumbai',
      gear: 'Sony A7 IV • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-08',
      title: 'Brand Keynote Presentation & Q&A Panel',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85',
      category: 'Press Conferences',
      client: 'Enterprise Cloud Forum',
      location: 'Hyatt Regency Delhi',
      gear: 'Sony A7 IV • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-09',
      title: 'Premium Beverage Brand Ambassador Launch',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
      category: 'Product Launches',
      client: 'Reserve Estates',
      location: 'Four Seasons Rooftop',
      gear: 'Sony A7R V • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'bpr-10',
      title: 'Exclusive Media Round-Table & Press Kit Unveiling',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
      category: 'Media Galas',
      client: 'Omni Media Group',
      location: 'The Oberoi, Mumbai',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    }
  ],

  // 3. Corporate Headshot & Photography (Executive portraits, leadership, boardroom teams, professional studio sessions)
  'corp-photo': [
    {
      id: 'cp-01',
      title: 'Chief Executive Officer Formal Studio Portrait',
      type: 'photo',
      src: '/services/corp-photo.jpg',
      category: 'Executive Headshots',
      client: 'Apex Capital Advisors',
      location: 'Bandra-Kurla Complex Studio',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-02',
      title: 'Senior Vice President Leadership Profile',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
      category: 'Leadership Portraits',
      client: 'Starlight Ventures',
      location: 'One BKC Tower, Mumbai',
      gear: 'Sony A7 IV • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-03',
      title: 'Managing Director Studio Corporate Headshot',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85',
      category: 'Executive Headshots',
      client: 'Global Asset Management',
      location: 'Nariman Point, Mumbai',
      gear: 'Sony A7R V • 135mm f/1.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-04',
      title: 'Technology Chief Architect Executive Portrait',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85',
      category: 'Executive Headshots',
      client: 'Synthetix AI Labs',
      location: 'Hiranandani Business Park, Powai',
      gear: 'Sony A7 IV • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-05',
      title: 'Senior Partner Law Firm Editorial Portrait',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=85',
      category: 'Leadership Portraits',
      client: 'Singhania & Partners LLP',
      location: 'Fort Chambers, Mumbai',
      gear: 'Sony A7R V • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-06',
      title: 'Executive Board of Directors Summit Session',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85',
      category: 'Board of Directors',
      client: 'Tata Sons Consulting',
      location: 'Taj Mahal Palace Boardroom',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-07',
      title: 'Financial Risk Director Studio Portrait',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
      category: 'Executive Headshots',
      client: 'Barclays Private Wealth',
      location: 'Nesco IT Park, Goregaon',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-08',
      title: 'Corporate Executive Workplace Documentation',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
      category: 'Corporate Culture',
      client: 'MindTree Innovations',
      location: 'Cyber City, Gurugram',
      gear: 'Sony FX3 • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-09',
      title: 'Chief Financial Officer Studio Portrait',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85',
      category: 'Executive Headshots',
      client: 'Kotak Mahindra Capital',
      location: 'BKC Financial Center',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cp-10',
      title: 'Founding Partner Editorial Office Portrait',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85',
      category: 'Leadership Portraits',
      client: 'Venture Catalyst India',
      location: 'Lower Parel Loft, Mumbai',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    }
  ],

  // 4. Live Shoot (Multi-camera cinema production, on-set cinematography, soundstage rigs, behind-the-scenes filmmaking)
  'corp-film': [
    {
      id: 'cf-01',
      title: 'Cinema Rig & Full Matte Box Studio Setup',
      type: 'photo',
      src: '/services/corp-film.jpg',
      category: 'Camera Rig Production',
      client: 'Red Chillies Production',
      location: 'Film City, Goregaon',
      gear: 'Sony FX3 Cinema • Arri Ultra Prime 35mm',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-02',
      title: 'Director On-Set Monitoring Through Atomos Rig',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
      category: 'Director & Crew',
      client: 'Dharma Media Labs',
      location: 'Mehboob Studios, Bandra',
      gear: 'Sony FX6 • 50mm T1.5 Cine',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-03',
      title: 'Steadicam Gimbal Operator Live Action Tracking',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=85',
      category: 'Cinema Tracking',
      client: 'Phantom Films Collective',
      location: 'Kamala Mills Soundstage',
      gear: 'DJI Ronin 2 • Sony FX3 • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-04',
      title: 'High-Output Studio Lighting & SkyPanel Grid',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
      category: 'Live Film Sets',
      client: 'Yash Raj Studios Soundstage 4',
      location: 'Andheri West, Mumbai',
      gear: 'Sony A7S III • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-05',
      title: 'Boom Mic Sound Recordist & Audio Monitoring',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
      category: 'Director & Crew',
      client: 'Sync Sound India',
      location: 'Whistling Woods International',
      gear: 'Sound Devices 833 • Sennheiser MKH416',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-06',
      title: 'Multi-Camera Broadcast Control & Live Switcher',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85',
      category: 'Camera Rig Production',
      client: 'Star Sports Production',
      location: 'Jio Studio Control Hub',
      gear: 'Blackmagic ATEM Constellation 4K',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-07',
      title: 'Cinematic Haze & Backlit Studio Production',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=85',
      category: 'Live Film Sets',
      client: 'T-Series Music Video Set',
      location: 'SJR Studio, Thane',
      gear: 'Sony FX3 • 85mm T1.5 Cine',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-08',
      title: 'Dynamic Crane Jib Shot Over Film Set',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=85',
      category: 'Cinema Tracking',
      client: 'Excel Entertainment',
      location: 'ND Studios, Karjat',
      gear: 'Technocrane 30 • Sony Venice 2',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-09',
      title: 'Wireless Video Village & Script Supervisor',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
      category: 'Director & Crew',
      client: 'Roy Kapur Films',
      location: 'Bandra Soundstage',
      gear: 'Teradek Bolt 4K • Sony FX3',
      aspectRatio: 'landscape'
    },
    {
      id: 'cf-10',
      title: 'Night Exterior Car Chase Camera Car Mount',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=1200&q=85',
      category: 'Cinema Tracking',
      client: 'Action Masters India',
      location: 'Eastern Freeway, Mumbai',
      gear: 'Sony FX3 Cinema • Tilta Hydra Alien',
      aspectRatio: 'landscape'
    }
  ],

  // 5. Real Estate Photography & Videography (Architectural villas, penthouses, modern marble kitchens, luxury estates)
  're-photo': [
    {
      id: 're-01',
      title: 'Modern Minimalist Architectural Villa at Twilight',
      type: 'photo',
      src: '/services/re-photo.jpg',
      category: 'Luxury Villas',
      client: 'Lodha Luxury Collection',
      location: 'Alibaug Coastal Estate',
      gear: 'Sony A7R V • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-02',
      title: 'Panoramic Oceanfront Penthouse Living Space',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      category: 'Penthouses',
      client: 'Piramal Mahalaxmi',
      location: 'Worli Sea Face, Mumbai',
      gear: 'Sony A7R V • 12-24mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-03',
      title: 'High-End Italian Marble Chef Kitchen & Island',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      category: 'Architectural Interiors',
      client: 'Godrej Properties Luxury',
      location: 'Bandra West, Mumbai',
      gear: 'Sony A7 IV • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-04',
      title: 'Double-Height Living Pavilion with Glass Facade',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
      category: 'Luxury Villas',
      client: 'Isprava Villas Goa',
      location: 'Assagao, North Goa',
      gear: 'Sony A7R V • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-05',
      title: 'Master Bedroom Suite Overlooking Skyline',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      category: 'Penthouses',
      client: 'Oberoi Sky City',
      location: 'Borivali East, Mumbai',
      gear: 'Sony A7 IV • 20mm f/1.8 G',
      aspectRatio: 'landscape'
    },
    {
      id: 're-06',
      title: 'Private Resort Infinity Pool & Sunken Firepit',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
      category: 'Resort Estates',
      client: 'SaffronStays Alibaug',
      location: 'Awas Beach, Alibaug',
      gear: 'Sony A7R V • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-07',
      title: 'Sculptural Floating Staircase & Warm Lighting',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
      category: 'Architectural Interiors',
      client: 'Rustomjee Elements',
      location: 'Juhu, Mumbai',
      gear: 'Sony A7R V • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-08',
      title: 'Spa-Inspired Bathroom with Freestanding Soaking Tub',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85',
      category: 'Architectural Interiors',
      client: 'Kalpataru Magnificence',
      location: 'Prabhadevi, Mumbai',
      gear: 'Sony A7 IV • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 're-09',
      title: 'Outdoor Covered Lanai & Alfresco Dining Terrace',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      category: 'Resort Estates',
      client: 'Sun Estates Goa',
      location: 'Candolim, Goa',
      gear: 'Sony A7R V • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 're-10',
      title: 'Contemporary Commercial Headquarters Lobby',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      category: 'Architectural Interiors',
      client: 'One World Center',
      location: 'Lower Parel, Mumbai',
      gear: 'Sony A7 IV • 12-24mm f/2.8 GM',
      aspectRatio: 'landscape'
    }
  ],

  // 6. Fashion & Portfolio Shoot (Haute couture, model lookbooks, runway catwalks, high-fashion editorial portraits)
  'fashion': [
    {
      id: 'fs-01',
      title: 'The Boys Club — Lakmé Fashion Week Runway',
      type: 'photo',
      src: '/fashion/lakme-fashion-week-boys-club.jpg',
      category: 'Runway & Catwalk',
      client: 'Lakmé Fashion Week 2026',
      location: 'Jio World Convention Centre',
      gear: 'Sony A1 • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-02',
      title: 'High-Fashion Editorial Flowing Silk Gown',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
      category: 'Haute Couture',
      client: "Harper's Bazaar India",
      location: 'Royal Opera House, Mumbai',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-03',
      title: 'Avant-Garde Studio Portrait & Dynamic Lighting',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      category: 'Editorial Lookbooks',
      client: 'Vogue India Editorial',
      location: 'Bandra Photo Studio',
      gear: 'Sony A7R V • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-04',
      title: 'Bespoke Menswear Editorial Lookbook',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
      category: 'Model Portfolios',
      client: 'Trojan Tailors Milan',
      location: 'Kala Ghoda Art Precinct',
      gear: 'Sony A7 IV • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-05',
      title: 'Milan Runway Fashion Week Catwalk Presentation',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85',
      category: 'Runway & Catwalk',
      client: 'FDCI India Fashion Week',
      location: 'Pragati Maidan, New Delhi',
      gear: 'Sony A1 • 135mm f/1.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-06',
      title: 'Minimalist Monochromatic Studio Beauty Portrait',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      category: 'Model Portfolios',
      client: 'Inez Model Management',
      location: 'Lower Parel Loft Studio',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-07',
      title: 'Desert Sunset Bohemian Fashion Editorial',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
      category: 'Editorial Lookbooks',
      client: 'Zara Spring Campaign',
      location: 'Sam Sand Dunes, Jaisalmer',
      gear: 'Sony A7 IV • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-08',
      title: 'Haute Joaillerie & High-End Fashion Model',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      category: 'Haute Couture',
      client: 'Tanishq High Jewelry',
      location: 'Taj Mahal Palace, Mumbai',
      gear: 'Sony A7R V • 90mm f/2.8 Macro',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-09',
      title: 'Urban Streetwear Contemporary Lookbook',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
      category: 'Editorial Lookbooks',
      client: 'Urban Syndicate Clothing',
      location: 'Ballard Estate, Mumbai',
      gear: 'Sony FX3 • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'fs-10',
      title: 'Dramatic Silhouette & Fluttering Chiffon Motion',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85',
      category: 'Haute Couture',
      client: 'Sabyasachi Couture Archive',
      location: 'City Palace, Jaipur',
      gear: 'Sony A7R V • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    }
  ],

  // 7. Drone Photography & Video (Bird-eye aerials, coastal shorelines, highway cloverleafs, mountain vistas)
  'drone': [
    {
      id: 'dr-01',
      title: 'Coastal Waves & Turquoise Shoreline Aerial',
      type: 'photo',
      src: '/services/drone.jpg',
      category: 'Aerial Coastlines',
      client: 'Goa Tourism Development',
      location: 'Cabo de Rama, South Goa',
      gear: 'DJI Inspire 3 • Zenmuse X9-8K Air',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-02',
      title: 'Geometric 90-Degree Highway Cloverleaf Intersection',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=85',
      category: 'Cityscape Bird-Eye',
      client: 'National Highway Authority',
      location: 'Bandra-Worli Sea Link Flyover',
      gear: 'DJI Mavic 3 Pro Cine • Hasselblad 4/3',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-03',
      title: 'Luxury Island Resort & Private Coral Lagoon',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      category: 'Aerial Coastlines',
      client: 'Andaman Luxury Resorts',
      location: 'Havelock Island, Andamans',
      gear: 'DJI Inspire 3 • 24mm F2.8',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-04',
      title: 'Golden Hour Mountain Ridge & Misty Valley',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
      category: 'Landscape Vistas',
      client: 'Incredible India Heritage',
      location: 'Pangong Lake, Ladakh',
      gear: 'DJI Mavic 3 Pro Cine • 70mm Tele',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-05',
      title: 'Circular Yacht Marina Top-Down Aerial Symmetry',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
      category: 'Cityscape Bird-Eye',
      client: 'Royal Bombay Yacht Club',
      location: 'Gateway of India Harbor',
      gear: 'DJI Inspire 3 • Zenmuse X9-8K',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-06',
      title: 'Mumbai Skyline & Sea Link Illuminated at Twilight',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85',
      category: 'Cityscape Bird-Eye',
      client: 'Brihanmumbai Municipal Corp',
      location: 'Bandra-Worli Sea Link, Mumbai',
      gear: 'DJI Mavic 3 Pro • Hasselblad',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-07',
      title: 'Serpentine Winding Mountain Ghat Road',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
      category: 'Landscape Vistas',
      client: 'Mahindra Adventure Expeditions',
      location: 'Malshej Ghat, Western Ghats',
      gear: 'DJI Mavic 3 Pro Cine • 24mm',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-08',
      title: 'Heritage Lake Palace Floating on Mirror Waters',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85',
      category: 'Architectural Aerials',
      client: 'Taj Lake Palace Management',
      location: 'Lake Pichola, Udaipur',
      gear: 'DJI Inspire 3 • Zenmuse X9-8K',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-09',
      title: 'Solitary Sailboat in Deep Cobalt Ocean Swell',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
      category: 'Aerial Coastlines',
      client: 'Ocean Sailing India',
      location: 'Arabian Sea off Mandwa',
      gear: 'DJI Mavic 3 Pro • Hasselblad',
      aspectRatio: 'landscape'
    },
    {
      id: 'dr-10',
      title: 'Sprawling Golf Course Greenery & Lake Architecture',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=85',
      category: 'Architectural Aerials',
      client: 'DLF Golf & Country Club',
      location: 'Gurugram, NCR',
      gear: 'DJI Inspire 3 • 35mm F2.8',
      aspectRatio: 'landscape'
    }
  ],

  // 8. Wedding Photo & Video (Royal Indian weddings, varmala, mandap pheras, bridal portraits, emotional moments)
  'wedding': [
    {
      id: 'wd-01',
      title: 'Traditional Indian Bride Royal Portrait',
      type: 'photo',
      src: '/wedding/traditional-bride-groom.jpg',
      category: 'Bridal Portraits',
      client: 'Sharma & Kapoor Wedding',
      location: 'Umaid Bhawan Palace, Jodhpur',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-02',
      title: 'Grand Varmala Exchange with Golden Cold Pyro',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      category: 'Ceremonies & Pheras',
      client: 'Mehra & Singhania Union',
      location: 'Rambagh Palace, Jaipur',
      gear: 'Sony FX3 • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-03',
      title: 'The Pheras — Sacred Fire Vows Ceremony',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      category: 'Ceremonies & Pheras',
      client: 'Verma & Bansal Nuptials',
      location: 'City Palace, Udaipur',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-04',
      title: 'Groom on the Dance Floor — High Energy Sangeet',
      type: 'photo',
      src: '/wedding/groom-dance-floor-sangeet.jpg',
      category: 'Celebrations',
      client: 'Kapoor & Mehra Gala',
      location: 'Taj Falaknuma Palace, Hyderabad',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-05',
      title: 'Haldi Petal Shower Extravaganza',
      type: 'photo',
      src: '/wedding/haldi-vibes-petal-shower.jpg',
      category: 'Celebrations',
      client: 'Roy & Singhania Event',
      location: 'Fairmont Jaipur',
      gear: 'Sony A7R V • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-06',
      title: 'Sania & Mughees — Mid-Event Candids',
      type: 'photo',
      src: '/wedding/sania-mughees-candids.jpg',
      category: 'Royal Couples',
      client: 'Sania & Mughees',
      location: 'The Oberoi Amarvilas, Agra',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-07',
      title: 'LED Stick Grand Sangeet Entry',
      type: 'photo',
      src: '/wedding/led-stick-sangeet-entry.jpg',
      category: 'Celebrations',
      client: 'Sharma & Verma Celebration',
      location: 'Fairmont Jaipur',
      gear: 'Sony FX3 • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-08',
      title: 'Bridal Heritage Library Editorial Portrait',
      type: 'photo',
      src: '/wedding/library-editorial-portrait.jpg',
      category: 'Bridal Portraits',
      client: 'Singhania Family Gala',
      location: 'Grand Heritage Library, Mumbai',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-09',
      title: 'Celebration Chemistry — Royal Couple Sunset',
      type: 'photo',
      src: '/wedding/its-all-about-us-couple.jpg',
      category: 'Royal Couples',
      client: 'Private Wedding Commission',
      location: 'Lake Palace, Udaipur',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'wd-10',
      title: 'Sangeet Live Artists & Stage Performance',
      type: 'photo',
      src: '/wedding/sangeet-live-artists.jpg',
      category: 'Celebrations',
      client: 'Live Sangeet Ensemble',
      location: 'Rambagh Palace, Jaipur',
      gear: 'Sony A7R V • 135mm f/1.8 GM',
      aspectRatio: 'landscape'
    }
  ],

  // 9. Product Photography (Luxury fragrances, horology timepieces, cosmetics, commercial technology macro)
  'product': [
    {
      id: 'pr-01',
      title: 'Luxury Amber Perfume with Water Droplets & Reflections',
      type: 'photo',
      src: '/services/product.jpg',
      category: 'Luxury Fragrance',
      client: 'Maison Noir Parfum',
      location: 'Aman Visual Studio, Mumbai',
      gear: 'Sony A7R V • 90mm f/2.8 Macro GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-02',
      title: 'Precision Chronograph Mechanical Watch Macro',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
      category: 'Timepieces & Jewelry',
      client: 'Kronos Swiss Timepieces',
      location: 'Aman Visual Studio, Mumbai',
      gear: 'Sony A7R V • 90mm f/2.8 Macro GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-03',
      title: 'Botanical Skincare Serum with Soft Natural Shadows',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85',
      category: 'Cosmetics & Skincare',
      client: 'Forest Essentials Luxury',
      location: 'Studio Daylight Bay, Mumbai',
      gear: 'Sony A7R V • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-04',
      title: 'Matte Black Noise-Cancelling Headphones Studio Rim Light',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
      category: 'Commercial Tech',
      client: 'Aether Acoustic Audio',
      location: 'Darkroom Tabletop Bay, Mumbai',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-05',
      title: 'Artisan Glass Beverage Bottle with Cold Condensation',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=85',
      category: 'Luxury Fragrance',
      client: 'Svami Artisan Drinks',
      location: 'High-Speed Lighting Studio',
      gear: 'Sony A7R V • 90mm f/2.8 Macro GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-06',
      title: 'Fine Leather Handcrafted Messenger Bag Profile',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      category: 'Timepieces & Jewelry',
      client: 'Nappa Dori Atelier',
      location: 'Studio Texture Lab, Mumbai',
      gear: 'Sony A7 IV • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-07',
      title: 'High-Performance Athletic Running Sneaker Mid-Air Splash',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
      category: 'Commercial Tech',
      client: 'Nike India Commercial',
      location: 'Splash Motion Stage, Mumbai',
      gear: 'Sony A1 • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-08',
      title: 'Solitaire Diamond Engagement Ring Prism Sparkle',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      category: 'Timepieces & Jewelry',
      client: 'Kalyan Jewellers Diamond Lab',
      location: 'Gemological Macro Studio',
      gear: 'Sony A7R V • 90mm f/2.8 Macro GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-09',
      title: 'Premium Ceramic Smart Device Curved Glass Edge',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85',
      category: 'Commercial Tech',
      client: 'OnePlus Flagship Campaign',
      location: 'Precision Tabletop Bay',
      gear: 'Sony A7R V • 90mm f/2.8 Macro GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pr-10',
      title: 'Organic Essential Oil Dropper with Honeycomb Glow',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1608248597359-0d19642646c2?auto=format&fit=crop&w=1200&q=85',
      category: 'Cosmetics & Skincare',
      client: 'Kama Ayurveda Organics',
      location: 'Aman Visual Studio, Mumbai',
      gear: 'Sony A7 IV • 90mm f/2.8 Macro GM',
      aspectRatio: 'landscape'
    }
  ],

  // 10. Social Media Reels (Fast-paced creator rigs, 9:16 vertical styling, street dance, dynamic product unboxing)
  'reels': [
    {
      id: 'rl-01',
      title: 'Content Creator Filming Vertical Rig on Mumbai Streets',
      type: 'photo',
      src: '/services/reels.jpg',
      category: 'Creator On-Location',
      client: 'Meta India Creator Lab',
      location: 'Marine Drive Promenade, Mumbai',
      gear: 'Sony FX3 Vertical Rig • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-02',
      title: 'Behind-the-Scenes Gimbal Tracking Street Style Dancer',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
      category: 'Dynamic Lifestyle',
      client: 'Red Bull Dance India',
      location: 'Kala Ghoda, Mumbai',
      gear: 'DJI RS3 Pro • Sony FX3 • 20mm f/1.8 G',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-03',
      title: 'Aesthetic Specialty Coffee Pour Reel Framing',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
      category: 'Dynamic Lifestyle',
      client: 'Subko Coffee Roasters',
      location: 'Bandra West, Mumbai',
      gear: 'Sony FX3 • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-04',
      title: 'Rapid Outfit Transition Fashion Reel Setup',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
      category: 'Vertical Fashion',
      client: 'H&M India Social Media',
      location: 'Studio Vert, Lower Parel',
      gear: 'Sony A7S III • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-05',
      title: 'Food Reviewer Night Market Dynamic RGB Lighting',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      category: 'Creator On-Location',
      client: 'Zomato Live Reels Series',
      location: 'Mohammed Ali Road, Mumbai',
      gear: 'Sony FX3 • Nanlite Pavotube 6C',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-06',
      title: 'High-Intensity Athletic Fitness Workout Reel',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
      category: 'Dynamic Lifestyle',
      client: 'Cult.fit Brand Campaign',
      location: 'CrossFit Box, BKC Mumbai',
      gear: 'Sony FX3 • 24mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-07',
      title: 'Scenic Travel Reel Filming with Wireless Audio Mic',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85',
      category: 'Creator On-Location',
      client: 'Airbnb Experiences India',
      location: 'Old Goa Heritage Quarter',
      gear: 'DJI Mic 2 • Sony A7C II • 16-35mm',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-08',
      title: 'Sneaker Unboxing Overhead 9:16 Tabletop Production',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      category: 'Viral Transitions',
      client: 'VegNonVeg Sneakers',
      location: 'Studio Overhead Arm Rig',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-09',
      title: 'Night City Street Portrait Reel with Anamorphic Flare',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
      category: 'Vertical Fashion',
      client: 'Spotify India Beats',
      location: 'Carter Road, Bandra',
      gear: 'Sony FX3 • Sirui 50mm Anamorphic',
      aspectRatio: 'landscape'
    },
    {
      id: 'rl-10',
      title: 'Post-Production Speed Editing Timeline on Location',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85',
      category: 'Viral Transitions',
      client: 'Viral Reel Agency',
      location: 'WeWork Enam Sambhav, BKC',
      gear: 'MacBook Pro M3 Max • Final Cut Pro',
      aspectRatio: 'landscape'
    }
  ],

  // 11. Podcast Shoot (Broadcast studio, Shure SM7B microphones, interview sets, soundproof acoustic panels)
  'exhibition': [
    {
      id: 'pod-01',
      title: 'Professional Dual-Mic Podcast Studio with Acoustic Oak Slats',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85',
      category: 'Studio Architecture',
      client: 'The BarberShop with Shantanu',
      location: 'Aman Visual Podcast Hub, Mumbai',
      gear: 'Sony FX3 Tri-Cam • Shure SM7B',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-02',
      title: 'Engaging Two-Host Dialogue Across Timber Podcast Desk',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=85',
      category: 'Interview Sets',
      client: 'FinTech Unfiltered Show',
      location: 'Studio 1, BKC Mumbai',
      gear: 'Sony FX6 A-Cam • 50mm f/1.2 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-03',
      title: 'Broadcast Control Console & Multi-Track Audio Interface',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
      category: 'Broadcast Control',
      client: 'Spotify India Originals',
      location: 'Sound Control Booth, Mumbai',
      gear: 'Rodecaster Pro II • Cloudlifter CL-4',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-04',
      title: 'Moody Neon Backlit Studio with Warm Filament Lighting',
      type: 'photo',
      src: '/services/exhibition.jpg',
      category: 'Studio Architecture',
      client: 'Unfiltered Voices Podcast',
      location: 'Lower Parel Media Loft',
      gear: 'Sony FX3 • Nanlite Pavotube 30C',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-05',
      title: 'Guest Expressive Interaction Under Soft Daylight Key Lighting',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=85',
      category: 'Interview Sets',
      client: 'Founders Unplugged India',
      location: 'Khar West Studio Suite',
      gear: 'Sony A7 IV B-Cam • 85mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-06',
      title: 'Multi-Camera Switching Monitor Preview in Real Time',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85',
      category: 'Broadcast Control',
      client: 'Club 12 Podcast Network',
      location: 'Broadcast Central, Andheri',
      gear: 'Blackmagic ATEM Mini Extreme ISO',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-07',
      title: 'Shure SM7B Dynamic Mic on Articulated Boom Arm',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1590602846989-e994966ff858?auto=format&fit=crop&w=1200&q=85',
      category: 'Acoustic Sessions',
      client: 'Audio Craft Productions',
      location: 'Aman Visual Studio, Mumbai',
      gear: 'Yellowtec M!ka Arm • Shure SM7B',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-08',
      title: 'Executive CEO Fireside Video Interview Layout',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
      category: 'Interview Sets',
      client: 'Forbes India Leadership Lounge',
      location: 'Four Seasons Hotel Suite',
      gear: 'Sony FX6 • 35mm f/1.4 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-09',
      title: 'Acoustic Fabric Baffle Diffusers & Studio Soundproofing',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
      category: 'Acoustic Sessions',
      client: 'Acoustic Sound Labs',
      location: 'Worli Studio Facility',
      gear: 'Primacoustic London 12 Room Kit',
      aspectRatio: 'landscape'
    },
    {
      id: 'pod-10',
      title: 'Celebrity Roundtable Conversation Multi-Angle Setup',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
      category: 'Interview Sets',
      client: 'Bollywood Hungama Conversations',
      location: 'Mehboob Studios Podcast Suite',
      gear: 'Sony FX3 Quad-Rig • 24-70mm GM II',
      aspectRatio: 'landscape'
    }
  ],

  // 12. Timelapse Photo & Video (Day-to-night transitions, star trails, highway light trails, cloud inversions)
  'timelapse': [
    {
      id: 'tl-01',
      title: '24-Hour Day-to-Night Seamless City Skyline Transition',
      type: 'photo',
      src: '/services/timelapse.jpg',
      category: 'City Sky Transitions',
      client: 'Mumbai Metropolitan Region Dev',
      location: 'Malabar Hill Lookout, Mumbai',
      gear: 'Sony A7R V • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-02',
      title: 'Long Exposure Highway Traffic Light Trails at Midnight',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=85',
      category: 'City Sky Transitions',
      client: 'Western Express Highway Project',
      location: 'Kalanagar Flyover, Mumbai',
      gear: 'Sony A7 IV • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-03',
      title: 'Celestial Star Trails Swirling Over Desert Horizon',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=85',
      category: 'Astrophotography',
      client: 'Dark Sky India Expedition',
      location: 'Nubra Valley, Ladakh',
      gear: 'Sony A7S III • 14mm f/1.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-04',
      title: 'Cloud Inversion Rolling Through High Mountain Peaks',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
      category: 'Nature Dynamics',
      client: 'Himachal Tourism Commission',
      location: 'Spiti Valley, Himachal Pradesh',
      gear: 'Sony A7R V • 24-105mm f/4 G',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-05',
      title: 'Super-Tall Skyscraper Construction Progress Timelapse',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=85',
      category: 'Construction Progress',
      client: 'Shapoorji Pallonji Engineering',
      location: 'World Towers, Lower Parel',
      gear: 'Solar-Powered Weatherproof Camera Rig',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-06',
      title: 'Tidal Flow & Golden Sunset Movement on Rocky Shore',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      category: 'Nature Dynamics',
      client: 'Konkan Coastal Trust',
      location: 'Kashid Beach, Raigad',
      gear: 'Sony A7 IV • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-07',
      title: 'Milky Way Galaxy Arc Rising Over Solitary Banyan Tree',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85',
      category: 'Astrophotography',
      client: 'National Geographic Traveler',
      location: 'Rann of Kutch, Gujarat',
      gear: 'Sony A7S III • 20mm f/1.8 G',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-08',
      title: 'Container Terminal Cargo Crane Speed Documentation',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85',
      category: 'Construction Progress',
      client: 'JNPT Port Authority',
      location: 'Nhava Sheva Port, Navi Mumbai',
      gear: 'Sony A7 IV • 24-70mm f/2.8 GM II',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-09',
      title: 'Monsoon Rain Storm Clouds Sweeping Over Mumbai Bay',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=85',
      category: 'Nature Dynamics',
      client: 'Met Atmospheric Media',
      location: 'Nariman Point Promenade',
      gear: 'Sony A7R V • 16-35mm f/2.8 GM',
      aspectRatio: 'landscape'
    },
    {
      id: 'tl-10',
      title: 'Bustling Harbor Passenger Ferry Trails at Golden Hour',
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85',
      category: 'City Sky Transitions',
      client: 'Mumbai Port Trust',
      location: 'Apollo Bunder, Gateway of India',
      gear: 'Sony A7 IV • 70-200mm f/2.8 GM II',
      aspectRatio: 'landscape'
    }
  ],

  // Extra secondary video galleries populated for architectural & live concert video routes
  'event-video': [
    {
      id: 'ev-01',
      title: 'Arena Stadium Tour 4K Multi-Cam Recap',
      type: 'video',
      src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'Concerts & Festivals',
      client: 'Sunburn Arena',
      location: 'DY Patil Stadium',
      gear: 'Sony FX3 Cinema Rig',
      aspectRatio: 'landscape'
    }
  ],
  're-video': [
    {
      id: 'rv-01',
      title: 'Architectural Ultra-Luxury Villa Walkthrough',
      type: 'video',
      src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'Luxury Villas',
      client: 'Lodha Group Luxury',
      location: 'Alibaug, Maharashtra',
      gear: 'DJI Ronin 2 • Sony FX3',
      aspectRatio: 'landscape'
    }
  ]
};
