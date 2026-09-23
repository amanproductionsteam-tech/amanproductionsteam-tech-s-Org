import { 
  Camera, 
  Video, 
  Building2, 
  Film, 
  Home, 
  PlaneTakeoff, 
  Heart, 
  Package, 
  Smartphone, 
  MonitorPlay,
  Clock,
  Sparkles,
  Megaphone,
  Mic
} from 'lucide-react';

export const SERVICES = [
  { id: 'event-photo', title: 'Event Photography & Videography', icon: Camera, desc: 'Capturing the vibrant atmosphere, crucial moments, and cinematic video coverage of live events.', image: '/events/the-stage-production.jpg' },
  { id: 'brand-pr', title: 'Brand PR Shoots', icon: Megaphone, desc: 'High-impact press launches, brand ambassador campaigns, product endorsements, and media PR coverage.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80' },
  { id: 'corp-photo', title: 'Corporate Headshot & Photography', icon: Building2, desc: 'Professional executive headshots, leadership portraits, and workplace documentation.', image: '/services/corp-photo.jpg' },
  { id: 'corp-film', title: 'Live Shoot', icon: Film, desc: 'High-energy live shoot coverage, multi-camera set production, concert performances, and dynamic on-location cinematography.', image: '/services/corp-film.jpg' },
  { id: 're-photo', title: 'Real Estate Photography & Videography', icon: Home, desc: 'Showcasing properties with optimal lighting, wide perspectives, and cinematic walkthroughs.', image: '/services/re-photo.jpg' },
  { id: 'fashion', title: 'Fashion & Portfolio Shoot', icon: Sparkles, desc: 'High-fashion editorial, model portfolios, lookbooks, and haute couture portraiture.', image: '/fashion/lakme-fashion-week-boys-club.jpg' },
  { id: 'drone', title: 'Drone Photography & Video', icon: PlaneTakeoff, desc: 'Breathtaking aerial perspectives for properties and events.', image: '/services/drone.jpg' },
  { id: 'wedding', title: 'Wedding Photo & Video', icon: Heart, desc: 'Timeless, cinematic storytelling for your special day.', image: '/wedding/traditional-bride-groom.jpg' },
  { id: 'product', title: 'Product Photography', icon: Package, desc: 'Clean, high-resolution imagery for commercial use.', image: '/services/product.jpg' },
  { id: 'reels', title: 'Social Media Reels', icon: Smartphone, desc: 'Engaging, fast-paced vertical video content for modern platforms.', image: '/services/reels.jpg' },
  { id: 'exhibition', title: 'Podcast Shoot', icon: Mic, desc: 'Multi-camera podcast studio production, broadcast-quality audio recording, dynamic switching, and visual interview sets.', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80' },
  { id: 'timelapse', title: 'Timelapse Photo & Video', icon: Clock, desc: 'Long-term project documentation and dynamic transitions.', image: '/services/timelapse.jpg' },
];

export const EDITING_CATEGORIES = [
  'All',
  'Video Editing',
  'Color Grading',
  'Photo Retouching',
  'Motion Graphics',
  'Sound Design'
];

export const EDITING_ITEMS = [
  { id: 1, title: 'Cinematic Reel Cut', category: 'Video Editing', image: 'placeholder' },
  { id: 2, title: 'Commercial Color Grade', category: 'Color Grading', image: 'placeholder' },
  { id: 3, title: 'High-End Skin Retouching', category: 'Photo Retouching', image: 'placeholder' },
  { id: 4, title: 'Title Animation', category: 'Motion Graphics', image: 'placeholder' },
  { id: 5, title: 'Event Recap Edit', category: 'Video Editing', image: 'placeholder' },
  { id: 6, title: 'Real Estate HDR Blend', category: 'Photo Retouching', image: 'placeholder' },
];

export const REVIEWS = [
  {
    id: 1,
    client: 'Priya Sharma',
    role: 'Marketing Director, Lumina',
    rating: 5,
    text: "Aman's eye for cinematic detail is unmatched. The corporate film he delivered for us completely redefined our brand identity. A true professional who understands exactly how to light and frame a scene for maximum impact.",
    bgImage: '/services/corp-film.jpg',
    tag: 'Corporate Film Shoot',
  },
  {
    id: 2,
    client: 'Rahul Desai',
    role: 'Event Organizer, Mumbai Tech Summit',
    rating: 4.5,
    text: "The event photography and videography were phenomenal. He managed to capture the energy of the crowd and the key moments on stage without ever being intrusive. We won't use anyone else for our future events.",
    bgImage: '/events/the-stage-production.jpg',
    tag: 'Live Stage Production',
  },
  {
    id: 3,
    client: 'Ananya Verma',
    role: 'Creative Head, Studio Waveform Mumbai',
    rating: 5,
    text: "From aerial drone cinematography to intimate narrative framing, the sheer quality and dynamic range of his work is outstanding. The final edit was delivered on time and exceeded all our expectations.",
    bgImage: '/services/drone.jpg',
    tag: 'Aerial Cinematography',
  }
];

export const PROJECTS = [
  {
    id: 'proj-1',
    title: 'Modern Architecture Showcase',
    client: 'Premium Estate Developers',
    location: 'Mumbai, India',
    services: ['Real Estate Photography', 'Drone Video', 'Corporate Film'],
    description: 'A comprehensive documentation of a newly developed luxury residential complex, highlighting architectural details and lifestyle amenities in a highly cinematic style.',
    results: 'Produced a hero film, 4 social reels, and a 50-image portfolio used across all marketing channels.',
    images: [1, 2, 3] 
  },
  {
    id: 'proj-2',
    title: 'Annual Tech Summit',
    client: 'Global Tech Corp',
    location: 'Mumbai, India',
    services: ['Event Photography', 'Event Videography', 'Social Media Reels'],
    description: 'Full three-day coverage of an international technology summit, including keynote speeches, panel discussions, and candid networking moments.',
    results: 'Delivered daily recap reels within 12 hours and a final cinematic event highlight film.',
    images: [1, 2]
  }
];
