import { motion } from 'motion/react';
import { Quote, Star, StarHalf, Building } from 'lucide-react';
import { REVIEWS } from '../data';

const CLIENT_BRANDS = [
  {
    id: 1,
    name: 'TATA MOTORS',
    sector: 'Automotive & Commercial',
    logo: (
      <svg viewBox="0 0 160 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* Tata Motors Official Mark */}
        <g transform="translate(4, 5)">
          <ellipse cx="26" cy="22" rx="24" ry="18" fill="none" stroke="#1B60AA" strokeWidth="3" />
          <path
            d="M 26 8 L 26 37 M 12 14 C 18 11 23 15 26 26 C 29 15 34 11 40 14"
            fill="none"
            stroke="#1B60AA"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {/* Wordmark */}
        <text x="64" y="24" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="13.5" letterSpacing="2.5">
          TATA
        </text>
        <text x="64" y="38" fill="#93C5FD" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="9" letterSpacing="2">
          MOTORS
        </text>
      </svg>
    ),
    font: 'font-sans font-bold tracking-widest text-xs md:text-sm',
  },
  {
    id: 2,
    name: 'IKEA',
    sector: 'Global Retail & Living',
    logo: (
      <svg viewBox="0 0 130 52" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* IKEA Official Blue & Yellow Emblem */}
        <rect width="130" height="52" rx="4" fill="#0058A3" />
        <ellipse cx="65" cy="26" rx="58" ry="21.5" fill="#FFDA1A" />
        <g fill="#0058A3" transform="translate(19, 13)">
          {/* Authentic Slab Serif IKEA Letters */}
          <path d="M 4 2 L 14 2 L 14 6 L 10.5 6 L 10.5 20 L 14 20 L 14 24 L 4 24 L 4 20 L 7.5 20 L 7.5 6 L 4 6 Z" />
          <path d="M 20 2 L 29 2 L 29 6 L 25.5 6 L 25.5 12 L 31.5 6 L 28 6 L 28 2 L 39 2 L 39 6 L 35 6 L 29.5 12 L 37.5 20 L 41 20 L 41 24 L 30 24 L 30 20 L 33 20 L 25.5 13 L 25.5 20 L 29 20 L 29 24 L 20 24 L 20 20 L 23.5 20 L 23.5 6 L 20 6 Z" />
          <path d="M 46 2 L 61 2 L 61 7 L 57 7 L 57 6 L 49.5 6 L 49.5 11.5 L 56 11.5 L 56 15 L 49.5 15 L 49.5 20 L 57 20 L 57 19 L 61 19 L 61 24 L 46 24 L 46 20 L 49.5 20 L 49.5 6 L 46 6 Z" />
          <path d="M 72 2 L 78 2 L 87 20 L 90 20 L 90 24 L 81 24 L 81 20 L 83.5 20 L 81 15 L 70 15 L 67.5 20 L 70 20 L 70 24 L 61 24 L 61 20 L 64 20 Z M 75.5 6 L 71.5 12.5 L 79.5 12.5 Z" />
        </g>
      </svg>
    ),
    font: 'font-sans font-black tracking-tight text-xs md:text-sm',
  },
  {
    id: 3,
    name: 'SHAPOORJI PALLONJI',
    sector: 'Infrastructure & Real Estate',
    logo: (
      <svg viewBox="0 0 170 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* SP Official Geometric Cube Emblem */}
        <g transform="translate(6, 6)">
          <polygon points="21,3 36,13 21,23 6,13" fill="#C5A059" />
          <polygon points="6,15 21,25 21,41 6,31" fill="#0F4C81" />
          <polygon points="36,15 36,31 21,41 21,25" fill="#1B365D" />
          <circle cx="21" cy="22" r="2.5" fill="#FFFFFF" />
        </g>
        {/* Wordmark */}
        <text x="54" y="23" fill="#FFFFFF" fontFamily="Georgia, serif" fontWeight="600" fontSize="11" letterSpacing="1.2">
          Shapoorji Pallonji
        </text>
        <text x="55" y="36" fill="#C5A059" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7" letterSpacing="2.2">
          ENGINEERING &amp; CONSTRUCTION
        </text>
      </svg>
    ),
    font: 'font-serif font-medium tracking-[0.15em] text-[11px] md:text-xs text-center leading-tight',
  },
  {
    id: 4,
    name: 'MUMBAI BMC',
    sector: 'Civic Administration & Heritage',
    logo: (
      <svg viewBox="0 0 150 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* BMC Official Municipal Crest */}
        <g transform="translate(6, 5)">
          <circle cx="22" cy="22" r="21" fill="#0A192F" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="22" cy="22" r="17.5" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 1.5" />
          {/* Gateway of India / Heritage Arch */}
          <path d="M 12 30 L 12 18 L 16 15 L 16 30 M 28 30 L 28 15 L 32 18 L 32 30" stroke="#D4AF37" strokeWidth="1.6" fill="none" />
          <path d="M 16 19 Q 22 13 28 19 L 28 30 L 16 30 Z" fill="#D4AF37" opacity="0.85" />
          <circle cx="22" cy="11" r="2" fill="#D4AF37" />
          <path d="M 10 33 Q 22 36 34 33" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        </g>
        <text x="56" y="24" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" letterSpacing="1.8">
          MCGM / BMC
        </text>
        <text x="56" y="37" fill="#D4AF37" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="7.5" letterSpacing="1.2">
          MUMBAI MUNICIPAL CORP
        </text>
      </svg>
    ),
    font: 'font-sans font-black tracking-tight text-xs md:text-sm',
  },
  {
    id: 5,
    name: 'T-SERIES',
    sector: 'Music & Entertainment',
    logo: (
      <svg viewBox="0 0 140 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* T-Series Official Red Badge */}
        <rect x="4" y="5" width="44" height="44" rx="8" fill="#E50914" />
        <circle cx="26" cy="27" r="17" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M 16 16 L 36 16 L 36 21 L 28.5 21 L 28.5 37 L 23.5 37 L 23.5 21 L 16 21 Z" fill="#FFFFFF" />
        <rect x="13" y="36" width="26" height="8" rx="2" fill="#FFFFFF" />
        <text x="26" y="42.5" textAnchor="middle" fill="#E50914" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="6.5" letterSpacing="1.2">
          SERIES
        </text>
        <text x="56" y="27" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="14" letterSpacing="2">
          T-SERIES
        </text>
        <text x="56" y="39" fill="#EF4444" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="8" letterSpacing="1.5">
          MUSIC &amp; FILMS
        </text>
      </svg>
    ),
    font: 'font-sans font-bold tracking-wide text-xs md:text-sm text-red-400 group-hover:text-red-300',
  },
  {
    id: 6,
    name: 'RELIANCE',
    sector: 'Conglomerate & Energy',
    logo: (
      <svg viewBox="0 0 160 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* Reliance Official Hexagon & Flame */}
        <g transform="translate(6, 6)">
          <polygon points="21,2 38,12 38,32 21,42 4,32 4,12" fill="#003B73" stroke="#004D99" strokeWidth="1" />
          <path d="M 21 8 C 16 16 17 25 21 29 C 25 25 26 16 21 8 Z" fill="#EE3124" />
          <path d="M 11 17 C 14 24 19 28 25 28 C 23 22 18 18 11 17 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M 31 17 C 28 24 23 28 17 28 C 19 22 24 18 31 17 Z" fill="#FFFFFF" opacity="0.9" />
          <circle cx="21" cy="34" r="2.5" fill="#EE3124" />
        </g>
        <text x="54" y="24" fill="#FFFFFF" fontFamily="Georgia, serif" fontWeight="700" fontSize="13.5" letterSpacing="1.8">
          Reliance
        </text>
        <text x="55" y="36" fill="#EE3124" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7" letterSpacing="2.5">
          GROWTH IS LIFE
        </text>
      </svg>
    ),
    font: 'font-sans font-light tracking-[0.25em] text-xs md:text-sm',
  },
  {
    id: 7,
    name: 'MAHINDRA',
    sector: 'Mobility & Technology',
    logo: (
      <svg viewBox="0 0 160 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* Mahindra Official Twin Peaks Emblem */}
        <g transform="translate(6, 10)">
          <path d="M 4 28 L 15 6 L 25 20 L 21 28 L 15 17 L 8 28 Z" fill="#D61F26" />
          <path d="M 42 28 L 31 6 L 21 20 L 25 28 L 31 17 L 38 28 Z" fill="#D61F26" />
          <polygon points="23,9 25,14 23,17 21,14" fill="#FFFFFF" />
        </g>
        <text x="56" y="25" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" letterSpacing="2.2">
          Mahindra
        </text>
        <text x="56" y="38" fill="#F87171" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="8" letterSpacing="2">
          RISE FOR GOOD
        </text>
      </svg>
    ),
    font: 'font-serif font-bold tracking-wider text-xs md:text-sm',
  },
  {
    id: 8,
    name: 'JIO',
    sector: 'Digital & Telecommunications',
    logo: (
      <svg viewBox="0 0 130 55" className="h-10 md:h-12 w-auto drop-shadow-md" aria-hidden="true">
        {/* Jio Official Crimson Circle & Script Logo */}
        <circle cx="26" cy="27" r="21" fill="#E21B22" />
        <g fill="#FFFFFF" transform="translate(13, 14)">
          {/* Authentic Jio Script Logo */}
          <path d="M 7 5 L 11 5 L 11 17 C 11 20 9 22 5 22 L 2 22 L 2 18.5 L 4.5 18.5 C 6.5 18.5 7 17.5 7 16 Z" />
          <circle cx="9" cy="1" r="2.2" />
          <rect x="14" y="7" width="3.8" height="15" rx="1.5" />
          <circle cx="16" cy="2" r="2.2" />
          <path d="M 20 14.5 C 20 10 23 6.5 28 6.5 C 33 6.5 36 10 36 14.5 C 36 19 33 22.5 28 22.5 C 23 22.5 20 19 20 14.5 Z M 24 14.5 C 24 17.2 25.5 19 28 19 C 30.5 19 32 17.2 32 14.5 C 32 11.8 30.5 10 28 10 C 25.5 10 24 11.8 24 14.5 Z" />
        </g>
        <text x="56" y="27" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="14" letterSpacing="2">
          Jio
        </text>
        <text x="56" y="39" fill="#93C5FD" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="8" letterSpacing="1.8">
          DIGITAL LIFE
        </text>
      </svg>
    ),
    font: 'font-sans font-black tracking-wide italic text-xs md:text-sm',
  },
];

export default function Reviews() {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-1 mb-5 relative z-10" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && (
          <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-white/20" />
        ))}
        <span className="ml-2 text-xs font-semibold text-amber-400/90">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <section id="reviews" className="py-24 md:py-36 bg-dark border-t border-white/5">
      <motion.div 
        className="container mx-auto px-6 md:px-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6">Client <br className="hidden md:block" />Reviews</h2>
            <div className="w-24 h-[1px] bg-white/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full self-start md:self-auto"
          >
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-white tracking-wide">4.9 / 5.0</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest border-l border-white/10 pl-3">Client Rating</span>
          </motion.div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-sm border border-white/10 group hover:border-white/25 bg-[#0f0f0f] hover:bg-[#141414] transition-all duration-300 flex flex-col justify-between p-8 sm:p-10 lg:p-12 min-h-[360px] shadow-lg"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 group-hover:text-white/15 transition-colors duration-500 z-10" strokeWidth={1} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-6">
                  {renderStars(review.rating || 5)}
                  {review.tag && (
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/70 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                      {review.tag}
                    </span>
                  )}
                </div>
                <p className="text-white/85 font-light text-base lg:text-lg leading-relaxed mb-8 drop-shadow-sm">
                  "{review.text}"
                </p>
              </div>
              
              <div className="relative z-10 border-t border-white/15 pt-6">
                <h4 className="text-xl font-display font-medium uppercase mb-1 text-white tracking-wide">{review.client}</h4>
                <p className="text-[10px] tracking-widest uppercase text-white/50 font-mono">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Client Brands Showcase Strip */}
        <div className="mt-20 md:mt-28 pt-16 md:pt-20 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-12"
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 mb-3">
              Trusted by Industry Giants & Leading Brands
            </p>
            <div className="w-16 h-[1px] bg-white/20" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-stretch">
            {CLIENT_BRANDS.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className="group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-sm bg-neutral-900/60 border border-white/10 hover:border-white/25 hover:bg-neutral-900/90 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                {/* Brand Logo in Original Form */}
                <div className="h-12 md:h-14 w-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 mb-3">
                  {client.logo}
                </div>

                {/* Brand Sector */}
                <span className="text-[9px] uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-colors font-mono text-center mt-1">
                  {client.sector}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
