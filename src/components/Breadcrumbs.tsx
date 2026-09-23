/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { SERVICES } from '../data';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  variant?: 'inline' | 'pill' | 'bar';
  showHomeIcon?: boolean;
  className?: string;
}

export default function Breadcrumbs({
  items: customItems,
  variant = 'inline',
  showHomeIcon = true,
  className = ''
}: BreadcrumbsProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Compute breadcrumbs dynamically from route if custom items not provided
  const crumbs: BreadcrumbItem[] = useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }

    // On home root, return empty (breadcrumbs not displayed on root)
    if (pathname === '/') {
      return [];
    }

    const list: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    if (pathname === '/portfolio') {
      list.push({ label: 'Portfolio' });
    } else if (pathname === '/pricing' || pathname === '/quotation') {
      list.push({ label: 'Pricing & Quotations' });
    } else if (pathname === '/gear' || pathname === '/equipment') {
      list.push({ label: 'Camera Gear & Kit' });
    } else if (pathname === '/reviews') {
      list.push({ label: 'Client Reviews' });
    } else if (pathname === '/client-galleries') {
      list.push({ label: 'Client Galleries' });
    } else if (pathname.startsWith('/client-gallery/')) {
      const slug = pathname.replace('/client-gallery/', '');
      const formattedTitle = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      list.push({ label: 'Client Galleries', href: '/client-galleries' });
      list.push({ label: formattedTitle || 'Client Deliverables' });
    } else if (pathname.startsWith('/services/')) {
      const serviceId = pathname.replace('/services/', '');
      const srv = SERVICES.find((s) => s.id === serviceId);
      list.push({ label: 'Services', href: '/#services' });
      list.push({ label: srv ? srv.title : 'Service Detail' });
    } else if (pathname === '/privacy-policy') {
      list.push({ label: 'Legal' });
      list.push({ label: 'Privacy Policy' });
    } else if (pathname === '/terms-and-conditions') {
      list.push({ label: 'Legal' });
      list.push({ label: 'Terms & Conditions' });
    } else if (pathname === '/refund-policy') {
      list.push({ label: 'Legal' });
      list.push({ label: 'Refund Policy' });
    } else if (pathname === '/pay-test' || pathname === '/pay' || pathname === '/pay-100') {
      list.push({ label: 'Payments' });
      list.push({ label: 'Direct Retainer Checkout' });
    } else if (pathname === '/drive') {
      list.push({ label: 'Studio Drive' });
    } else if (pathname === '/admin') {
      list.push({ label: 'Studio Administration' });
    } else {
      // General path segment fallback
      const segments = pathname.split('/').filter(Boolean);
      segments.forEach((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const segmentHref = `/${segments.slice(0, idx + 1).join('/')}`;
        const segmentLabel = seg
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        list.push({
          label: segmentLabel,
          href: isLast ? undefined : segmentHref
        });
      });
    }

    return list;
  }, [customItems, pathname]);

  if (!crumbs || crumbs.length <= 1) {
    return null;
  }

  // Schema.org BreadcrumbList structured data
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://amanvisual.in';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `${baseUrl}${crumb.href}` : `${baseUrl}${pathname}`
    }))
  };

  // Base styling for variant modes
  const containerClasses = {
    inline: 'flex items-center gap-1.5 text-xs text-white/60 font-mono tracking-wider',
    pill: 'inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono uppercase tracking-wider text-white/60 backdrop-blur-md shadow-sm',
    bar: 'w-full py-2.5 px-6 md:px-12 bg-[#0c0c0c]/80 border-b border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-mono tracking-wider'
  }[variant];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`${containerClasses} ${className} overflow-x-auto scrollbar-none whitespace-nowrap`}
      >
        <ol className="flex items-center gap-1.5 sm:gap-2">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const isHome = index === 0;

            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5 sm:gap-2">
                {index > 0 && (
                  <ChevronRight
                    size={12}
                    className="text-white/30 shrink-0 select-none"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-white font-medium truncate max-w-[200px] sm:max-w-[320px]"
                    title={crumb.label}
                  >
                    {crumb.label}
                  </span>
                ) : crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    {isHome && showHomeIcon && (
                      <Home size={12} className="text-white/50 shrink-0" aria-hidden="true" />
                    )}
                    <span>{crumb.label}</span>
                  </Link>
                ) : (
                  <span className="text-white/40">{crumb.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
