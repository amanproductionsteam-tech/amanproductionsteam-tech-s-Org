/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVICES } from '../data';

export interface SeoMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'video.other';
  noIndex?: boolean;
}

interface RouteSeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogType: 'website' | 'article' | 'profile' | 'video.other';
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

const DEFAULT_SITE_TITLE = 'Aman Visual | Commercial Cinematographer & Photographer Mumbai';
const DEFAULT_SITE_DESC =
  'Award-winning commercial cinematography and photography studio in Mumbai by Aman. Specialized in brand films, corporate shoots, luxury events, drone visuals, and high-fashion commissions.';
const DEFAULT_SITE_KEYWORDS =
  'Aman Visual, cinematographer Mumbai, commercial photographer Mumbai, brand films, event photography, corporate headshots, drone cinematography, video production Mumbai';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';

export default function SeoMetadata({
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  ogImage: propOgImage,
  ogType: propOgType,
  noIndex: propNoIndex
}: SeoMetadataProps = {}) {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://amanvisual.in';
    const canonicalUrl = `${origin}${pathname}`;

    // Resolve route-specific SEO config
    let config: RouteSeoConfig = {
      title: DEFAULT_SITE_TITLE,
      description: DEFAULT_SITE_DESC,
      keywords: DEFAULT_SITE_KEYWORDS,
      ogType: 'website',
      noIndex: false
    };

    if (pathname === '/') {
      config = {
        title: 'Aman Visual | Commercial Cinematography & Photography Studio Mumbai',
        description:
          'Premier commercial cinematography and editorial photography studio based in Mumbai. Directed by Aman, delivering world-class brand films, corporate events, and aerial visuals.',
        keywords:
          'cinematographer Mumbai, commercial photographer, Mumbai event videographer, brand films, drone operator India, Aman Visual',
        ogType: 'website',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Aman Visual',
          image: `${origin}/logo.png`,
          url: origin,
          telephone: '+918827474622',
          email: 'amanproductionsteam@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mumbai',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '19.0760',
            longitude: '72.8777'
          },
          priceRange: '₹₹₹',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '48'
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '20:00'
          }
        }
      };
    } else if (pathname === '/portfolio') {
      config = {
        title: 'Cinematic Portfolio & Commercial Works | Aman Visual',
        description:
          'Explore selected commercial films, architectural showcases, high-fashion editorials, and event productions shot and directed by Aman Visual.',
        keywords:
          'cinematography portfolio, film director Mumbai, commercial showreel, fashion editorial, video production portfolio',
        ogType: 'website',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Aman Visual Portfolio',
          description: 'Curated commercial cinematography and photography commissions.',
          publisher: {
            '@type': 'Organization',
            name: 'Aman Visual'
          }
        }
      };
    } else if (pathname === '/pricing' || pathname === '/quotation') {
      config = {
        title: 'Production Pricing & Instant Quotation Calculator | Aman Visual',
        description:
          'Calculate instant rates for commercial photography, event videography, and cinema crew deployments. Clear transparent pricing by Aman Visual.',
        keywords:
          'photography pricing Mumbai, cinematography rates, film crew pricing calculator, video production cost India, Aman Visual rates',
        ogType: 'website',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'PriceSpecification',
          name: 'Production Rate Card',
          priceCurrency: 'INR',
          minPrice: '14000',
          description: 'Production packages for photography, videography, and cinematic direction.'
        }
      };
    } else if (pathname === '/gear' || pathname === '/equipment') {
      config = {
        title: 'Cinema Gear & Production Equipment Kit | Aman Visual',
        description:
          'Explore our full inventory of cinema cameras, prime lenses, aerial drones, wireless audio transmitters, and gimbal stabilization kits utilized on set.',
        keywords:
          'cinema equipment, FX3, Sony cine lenses, DJI Ronin gimbal, drone videography gear, professional photography kit',
        ogType: 'website'
      };
    } else if (pathname === '/reviews') {
      config = {
        title: 'Client Reviews & Verified Testimonials (4.9★) | Aman Visual',
        description:
          'Read authentic testimonials from leading brands, corporate directors, and event clients who partnered with Aman Visual for their flagship productions.',
        keywords:
          'Aman Visual reviews, client feedback, Mumbai videographer rating, trusted commercial cinematographer',
        ogType: 'website',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Aman Visual',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            ratingCount: '48'
          }
        }
      };
    } else if (pathname === '/client-galleries' || pathname.startsWith('/client-gallery/')) {
      config = {
        title: 'Client Gallery Portal | Private Proofing - Aman Visual',
        description:
          'Private and secure high-resolution client proofing portal. Review, favorite, and download commissioned photos and videos.',
        keywords: 'client proofing, private gallery, photo delivery portal, Aman Visual',
        ogType: 'website',
        noIndex: pathname.startsWith('/client-gallery/') // Protect private client albums from search indexing
      };
    } else if (pathname.startsWith('/services/')) {
      const serviceId = pathname.replace('/services/', '');
      const service = SERVICES.find((s) => s.id === serviceId);

      if (service) {
        config = {
          title: `${service.title} | Production Studio - Aman Visual`,
          description: `${service.desc} Professional cinematic coverage and creative direction in Mumbai & pan-India.`,
          keywords: `${service.title}, Mumbai ${service.title}, professional cinematography, photography services, Aman Visual`,
          ogType: 'website',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: service.title,
            provider: {
              '@type': 'ProfessionalService',
              name: 'Aman Visual',
              telephone: '+918827474622',
              url: origin
            },
            description: service.desc,
            areaServed: {
              '@type': 'City',
              name: 'Mumbai'
            }
          }
        };
      }
    } else if (pathname === '/privacy-policy') {
      config = {
        title: 'Privacy Policy | Aman Visual Production Studio',
        description: 'Privacy policy and data protection practices for clients and visitors of Aman Visual.',
        keywords: 'privacy policy, terms of data, Aman Visual',
        ogType: 'website'
      };
    } else if (pathname === '/terms-and-conditions') {
      config = {
        title: 'Terms & Conditions | Aman Visual Studio',
        description: 'Commercial booking, copyright, commission agreements, and terms of service for Aman Visual.',
        keywords: 'terms and conditions, booking policy, commercial photography contract, Aman Visual',
        ogType: 'website'
      };
    } else if (pathname === '/refund-policy') {
      config = {
        title: 'Cancellation & Refund Policy | Aman Visual Studio',
        description: 'Advance retainer, date rescheduling, and cancellation terms for commissioned productions.',
        keywords: 'refund policy, cancellation terms, retainer policy, Aman Visual',
        ogType: 'website'
      };
    } else if (pathname === '/pay-test') {
      config = {
        title: 'Direct Payment Checkout | Aman Visual',
        description: 'Direct Kotak Mahindra Bank UPI checkout portal for Aman Visual production retainers.',
        keywords: 'pay online, UPI payment, Aman Visual checkout, Kotak bank',
        ogType: 'website',
        noIndex: true
      };
    } else if (pathname === '/admin' || pathname === '/drive') {
      config = {
        title: 'Studio Management Workspace | Aman Visual',
        description: 'Authorized studio management and asset administration portal.',
        keywords: 'admin',
        ogType: 'website',
        noIndex: true
      };
    }

    // Explicit props override route defaults if provided
    const finalTitle = propTitle || config.title;
    const finalDescription = propDescription || config.description;
    const finalKeywords = propKeywords || config.keywords;
    const finalOgImage = propOgImage || DEFAULT_OG_IMAGE;
    const finalOgType = propOgType || config.ogType;
    const finalNoIndex = propNoIndex !== undefined ? propNoIndex : config.noIndex;

    // 1. Update Document Title
    document.title = finalTitle;

    // Helper to create or update meta tags
    const updateMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Search Engine Metadata
    updateMeta('name', 'description', finalDescription);
    updateMeta('name', 'keywords', finalKeywords);
    updateMeta('name', 'robots', finalNoIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. OpenGraph Social Share Metadata
    updateMeta('property', 'og:site_name', 'Aman Visual');
    updateMeta('property', 'og:title', finalTitle);
    updateMeta('property', 'og:description', finalDescription);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:type', finalOgType);
    updateMeta('property', 'og:image', finalOgImage);

    // 4. Twitter / X Card Metadata
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', finalTitle);
    updateMeta('name', 'twitter:description', finalDescription);
    updateMeta('name', 'twitter:image', finalOgImage);

    // 5. Canonical Link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // 6. Schema.org JSON-LD Structured Data
    const structuredDataId = 'aman-visual-seo-jsonld';
    let scriptElement = document.getElementById(structuredDataId) as HTMLScriptElement | null;
    
    if (config.structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = structuredDataId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(config.structuredData);
    } else if (scriptElement) {
      // Fallback base organizational schema
      scriptElement.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Aman Visual',
        url: origin,
        logo: `${origin}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+918827474622',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi']
        }
      });
    }
  }, [
    location.pathname,
    propTitle,
    propDescription,
    propKeywords,
    propOgImage,
    propOgType,
    propNoIndex
  ]);

  // Headless utility component
  return null;
}
