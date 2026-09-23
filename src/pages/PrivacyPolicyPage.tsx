import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Share2, 
  UserCheck, 
  Mail, 
  ArrowLeft, 
  ChevronRight,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const SECTIONS = [
  { id: 'introduction', label: '1. Overview & Commitment' },
  { id: 'information-collected', label: '2. Information We Collect' },
  { id: 'media-privacy', label: '3. Photo & Video Rights' },
  { id: 'usage-of-data', label: '4. How We Use Your Data' },
  { id: 'storage-security', label: '5. Storage & Cloud Security' },
  { id: 'third-party-services', label: '6. Third-Party Disclosures' },
  { id: 'your-rights', label: '7. Your Privacy Rights' },
  { id: 'contact', label: '8. Contact & Data Officer' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-darker text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="pt-32 md:pt-40 pb-24">
        {/* Header Hero */}
        <section className="container mx-auto px-6 md:px-12 mb-12 md:mb-16">
          <div className="mb-8">
            <Breadcrumbs variant="pill" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-6 uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Legal & Client Trust</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold uppercase tracking-tight mb-6">
              Privacy <br />Policy
            </h1>
            <p className="text-white/70 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              At Aman Visual, we prioritize the confidentiality and security of our clients' personal data, creative concepts, and produced media assets. This policy details how your information and visual deliverables are handled.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-8 text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-emerald-400" />
                <span>Last Updated: September 2026</span>
              </span>
              <span>•</span>
              <span>Applies to: amanvisual.in & Client Portals</span>
              <span>•</span>
              <span>Jurisdiction: Mumbai, India</span>
            </div>
          </motion.div>
        </section>

        {/* Content Layout */}
        <section className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Sticky Nav */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 bg-charcoal/80 border border-white/10 p-6 rounded-sm backdrop-blur-md">
                <h3 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1.5">
                  {SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`block px-3 py-2 text-xs transition-colors rounded-sm flex items-center justify-between ${
                        activeSection === sec.id
                          ? 'bg-white text-black font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{sec.label}</span>
                      <ChevronRight size={12} className={activeSection === sec.id ? 'text-black' : 'text-white/30'} />
                    </a>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Need Clarification?</div>
                  <p className="text-xs text-white/70 mb-3 leading-relaxed">
                    Have questions regarding your project confidentiality or media embargoes?
                  </p>
                  <a
                    href="mailto:amanproductionsteam@gmail.com"
                    className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
                  >
                    <Mail size={13} />
                    <span>amanproductionsteam@gmail.com</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Policy Text */}
            <div className="lg:col-span-8 space-y-12 leading-relaxed text-sm md:text-base text-white/80 font-light">
              
              {/* Highlight summary card */}
              <div className="p-6 md:p-8 bg-neutral-900 border border-emerald-500/30 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={18} className="text-emerald-400" />
                  <h3 className="font-display uppercase font-bold text-sm tracking-wider text-white">
                    Our Privacy Promise
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  We never sell, rent, or monetize your personal details or raw media. Your private client galleries are password-protected and accessible solely by authorized stakeholders. Unreleased commercials and proprietary corporate footage remain strictly under NDA until approved for publication.
                </p>
              </div>

              {/* 1. Overview */}
              <div id="introduction" className="pt-4 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">01.</span>
                  Overview & Commitment
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Aman Visual ("we", "our", or "the Studio") operates as a premiere visual production and cinematography studio based in Andheri West, Mumbai, India. This Privacy Policy governs your use of our official website (<span className="text-white font-mono">amanvisual.in</span>), our digital client delivery portals, internal quotation forms, and any associated communication channels.
                  </p>
                  <p>
                    By engaging our services, requesting project estimates, submitting booking inquiries, or accessing private client deliverables, you acknowledge and agree to the practices outlined in this policy.
                  </p>
                </div>
              </div>

              {/* 2. Information Collected */}
              <div id="information-collected" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">02.</span>
                  Information We Collect
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>We collect information necessary to prepare accurate estimates, execute photo and film shoots, and deliver high-resolution assets:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider mb-2">
                        <UserCheck size={14} className="text-emerald-400" />
                        <span>Client Contact Data</span>
                      </div>
                      <p className="text-xs text-white/60">
                        Full name, corporate entity, business email, WhatsApp/telephone contact, event or brand shoot location, and billing address.
                      </p>
                    </div>

                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider mb-2">
                        <Database size={14} className="text-emerald-400" />
                        <span>Project Specifications</span>
                      </div>
                      <p className="text-xs text-white/60">
                        Creative briefs, shot lists, storyboard references, mood boards, call-sheets, and delivery milestone requirements.
                      </p>
                    </div>

                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider mb-2">
                        <Lock size={14} className="text-emerald-400" />
                        <span>Client Portal Credentials</span>
                      </div>
                      <p className="text-xs text-white/60">
                        Secure access PINs and authentication tokens for viewing and downloading private client galleries and delivery links.
                      </p>
                    </div>

                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider mb-2">
                        <Eye size={14} className="text-emerald-400" />
                        <span>Technical Logs</span>
                      </div>
                      <p className="text-xs text-white/60">
                        Standard browser analytics, IP address, and anonymized user interaction telemetry to guarantee fast gallery download speeds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Photo & Video Rights */}
              <div id="media-privacy" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">03.</span>
                  Photo & Video Privacy & Promotional Rights
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Photography and cinematography inherently produce visual assets containing likenesses of people, corporate facilities, and private gatherings. We observe strict protocols:
                  </p>
                  <ul className="space-y-3 list-disc list-inside text-sm text-white/80">
                    <li>
                      <strong className="text-white">Commercial Embargoes:</strong> When shooting unannounced product launches, brand commercials, or confidential corporate summits, all media remains confidential under strict NDA until your public release date.
                    </li>
                    <li>
                      <strong className="text-white">Portfolio Showcases:</strong> Aman Visual reserves the right to display selected frames or highlight edits in our professional creative portfolio (website, showreels, Instagram @amanvisual.in) solely for demonstrating artistic capability, unless explicitly agreed otherwise in a private non-disclosure agreement.
                    </li>
                    <li>
                      <strong className="text-white">Opt-Out & Private Bookings:</strong> Clients who require 100% private non-disclosure (e.g. exclusive celebrity events, sensitive executive conferences, private family ceremonies) can request a Full Privacy Rider at contract signing.
                    </li>
                  </ul>
                </div>
              </div>

              {/* 4. How We Use Data */}
              <div id="usage-of-data" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">04.</span>
                  How We Use Your Data
                </h2>
                <div className="space-y-3 text-white/70">
                  <p>Your details are processed strictly for lawful business functions, including:</p>
                  <ul className="space-y-2 list-disc list-inside text-sm text-white/80">
                    <li>Executing commercial contracts, booking confirmations, and call-sheet logistics.</li>
                    <li>Generating verified commercial quotations, invoices, and GST receipts.</li>
                    <li>Delivering cloud-based photo proofs, color-graded video cuts, and 4K masters.</li>
                    <li>Notifying you of delivery completion, revision cycles, and archive expiration.</li>
                    <li>Complying with statutory accounting and tax regulations in India.</li>
                  </ul>
                </div>
              </div>

              {/* 5. Storage & Cloud Security */}
              <div id="storage-security" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">05.</span>
                  Storage, Cloud Backups & Archival Security
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Visual production involves high-capacity media files. We maintain a secure 3-2-1 backup protocol:
                  </p>
                  <div className="p-4 bg-charcoal border border-white/10 rounded-sm space-y-2 text-xs sm:text-sm">
                    <p><strong className="text-white">Active Production:</strong> Stored on encrypted high-speed solid-state RAID arrays in our Mumbai studio.</p>
                    <p><strong className="text-white">Cloud Delivery:</strong> Hosted on Google Drive Workspace and high-availability cloud servers with HTTPS 256-bit TLS encryption in transit.</p>
                    <p><strong className="text-white">Retention Period:</strong> Final exported masters are retained in our client delivery cloud for a minimum of 90 days from project handover. We advise clients to download and maintain local duplicates upon delivery.</p>
                  </div>
                </div>
              </div>

              {/* 6. Third-Party Disclosures */}
              <div id="third-party-services" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">06.</span>
                  Third-Party Infrastructure
                </h2>
                <div className="space-y-3 text-white/70">
                  <p>
                    We partner solely with reputable, industry-standard infrastructure providers to facilitate our digital workflow:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm text-white/80">
                    <li><strong className="text-white">Google Workspace & Drive:</strong> For cloud delivery, large file streaming, and document transmission.</li>
                    <li><strong className="text-white">WhatsApp / Meta Business:</strong> For real-time production coordination and shoot confirmations.</li>
                    <li><strong className="text-white">Banking & UPI Gateways:</strong> For secure electronic advance payments and official invoicing.</li>
                  </ul>
                  <p className="text-xs text-white/50 pt-2">
                    None of these third parties are authorized to utilize your personal or project data for their independent marketing purposes.
                  </p>
                </div>
              </div>

              {/* 7. Your Rights */}
              <div id="your-rights" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">07.</span>
                  Your Privacy Rights
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>Under applicable Indian data protection guidelines and global standards, you have the right to:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3 bg-neutral-900 border border-white/10 rounded-sm">
                      <strong className="text-white block mb-1">Access & Portability</strong>
                      Request a copy of your stored records and project metadata.
                    </div>
                    <div className="p-3 bg-neutral-900 border border-white/10 rounded-sm">
                      <strong className="text-white block mb-1">Correction & Updates</strong>
                      Rectify inaccurate company details, contact info, or invoice credentials.
                    </div>
                    <div className="p-3 bg-neutral-900 border border-white/10 rounded-sm">
                      <strong className="text-white block mb-1">Removal From Portfolio</strong>
                      Request removal of any published showcase image or reel from public channels.
                    </div>
                    <div className="p-3 bg-neutral-900 border border-white/10 rounded-sm">
                      <strong className="text-white block mb-1">Data Erasure</strong>
                      Request permanent deletion of your client profile following contract completion.
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Contact */}
              <div id="contact" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-emerald-400 font-mono text-base">08.</span>
                  Contact & Data Privacy Inquiries
                </h2>
                <div className="p-6 bg-charcoal border border-white/15 rounded-sm space-y-4">
                  <p className="text-sm text-white/80">
                    For questions regarding this policy, media permissions, or NDA enforcement, please contact our studio team directly:
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm font-mono text-white/80">
                    <p><strong className="text-white font-sans">Studio:</strong> Aman Visual (amanvisual.in)</p>
                    <p><strong className="text-white font-sans">Address:</strong> Evershine Cosmic, Andheri West, Mumbai 400053, Maharashtra, India</p>
                    <p><strong className="text-white font-sans">Direct Email:</strong> <a href="mailto:amanproductionsteam@gmail.com" className="text-emerald-400 hover:underline">amanproductionsteam@gmail.com</a></p>
                    <p><strong className="text-white font-sans">Production WhatsApp:</strong> <a href="https://wa.me/918827474622" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">+91 8827474622</a></p>
                  </div>
                </div>
              </div>

              {/* Cross links */}
              <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-white/60">
                <span>Related Policies:</span>
                <Link to="/terms-and-conditions" className="text-white hover:text-emerald-400 underline underline-offset-4">Terms & Conditions</Link>
                <span>•</span>
                <Link to="/refund-policy" className="text-white hover:text-emerald-400 underline underline-offset-4">Refund Policy</Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
