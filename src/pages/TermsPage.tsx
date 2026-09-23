import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Scale, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Mail, 
  ArrowLeft, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const SECTIONS = [
  { id: 'agreement', label: '1. Engagement & Agreement' },
  { id: 'booking-deposit', label: '2. Booking & Advance Payment' },
  { id: 'shoot-responsibilities', label: '3. Production Execution & Permits' },
  { id: 'deliverables-timelines', label: '4. Deliverables & Turnaround' },
  { id: 'revisions', label: '5. Revision Cycles & Feedback' },
  { id: 'ip-copyright', label: '6. Copyright & Commercial License' },
  { id: 'safety-regulations', label: '7. Equipment & Drone Regulations' },
  { id: 'force-majeure', label: '8. Force Majeure & Liability' },
  { id: 'governing-law', label: '9. Jurisdiction & Governing Law' },
  { id: 'contact', label: '10. Inquiries & Official Notices' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('agreement');

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
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Master Service Agreement</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold uppercase tracking-tight mb-6">
              Terms & <br />Conditions
            </h1>
            <p className="text-white/70 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              These terms govern all commercial photography, cinema production, drone operations, and post-production engagements commissioned with Aman Visual.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-8 text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" />
                <span>Effective Date: September 2026</span>
              </span>
              <span>•</span>
              <span>Commercial Terms: Aman Visual (amanvisual.in)</span>
              <span>•</span>
              <span>Governing Law: Courts of Mumbai, India</span>
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
                  Terms Sections
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
                  <div className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Contract Questions?</div>
                  <p className="text-xs text-white/70 mb-3 leading-relaxed">
                    Have tailored agency terms, custom NDA requirements, or specialized licensing needs?
                  </p>
                  <a
                    href="mailto:amanproductionsteam@gmail.com"
                    className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors font-mono"
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
              <div className="p-6 md:p-8 bg-neutral-900 border border-amber-500/30 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 className="font-display uppercase font-bold text-sm tracking-wider text-white">
                    Key Highlights at a Glance
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  Shoot dates are secured strictly upon receipt of the agreed advance deposit. All deliverables undergo color grading and audio mastering. Two rounds of consolidated creative revisions are included with standard edits. Full commercial publication rights transfer to the client upon settlement of final payment.
                </p>
              </div>

              {/* 1. Agreement */}
              <div id="agreement" className="pt-4 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">01.</span>
                  Engagement & Agreement
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    By issuing a written purchase order, approving a digital quotation via <span className="text-white font-mono">amanvisual.in</span>, or remitting a booking deposit, the commissioning party ("Client") enters into a legally binding agreement with Aman Visual ("Studio").
                  </p>
                  <p>
                    These terms supersede prior oral discussions and constitute the definitive terms under which production crews, cameras (Cinema Line / FX Series), lighting, stabilization rigs, and crew members are dispatched.
                  </p>
                </div>
              </div>

              {/* 2. Booking & Payment */}
              <div id="booking-deposit" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">02.</span>
                  Booking Confirmation & Payment Schedule
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Because production crews and high-end cinema equipment are reserved exclusively per client date, bookings follow a structured payment milestone schedule:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="text-amber-400 font-display font-bold text-lg mb-1">50% Advance</div>
                      <div className="text-xs font-semibold uppercase text-white mb-2">Booking Retainer</div>
                      <p className="text-xs text-white/60">Locks calendar dates, equipment allocation, and core crew assignments.</p>
                    </div>

                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="text-white font-display font-bold text-lg mb-1">30% On Shoot Day</div>
                      <div className="text-xs font-semibold uppercase text-white mb-2">Production Milestone</div>
                      <p className="text-xs text-white/60">Payable upon commencement of principal photography or on-location wrap.</p>
                    </div>

                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="text-emerald-400 font-display font-bold text-lg mb-1">20% Balance</div>
                      <div className="text-xs font-semibold uppercase text-white mb-2">Final Master Delivery</div>
                      <p className="text-xs text-white/60">Payable prior to unlocking unwatermarked 4K master links and raw archives.</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/50">
                    * Payment modes supported: Official Bank NEFT/RTGS, Corporate IMPS, UPI, and authorized credit cards. All invoices include applicable GST in India.
                  </p>
                </div>
              </div>

              {/* 3. Production Execution & Permits */}
              <div id="shoot-responsibilities" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">03.</span>
                  Production Execution & Location Permits
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Successful production relies on collaboration between the client and studio crews:
                  </p>
                  <ul className="space-y-3 list-disc list-inside text-sm text-white/80">
                    <li><strong className="text-white">Venue Access & Approvals:</strong> The Client is responsible for securing shoot permissions, location gate passes, security clearances, and applicable venue fees for private properties, hotel ballrooms, heritage spots, or commercial facilities.</li>
                    <li><strong className="text-white">Call Times & Schedule:</strong> The production schedule begins strictly at the agreed call-time. Delays caused by late talent arrival, unready venues, or makeup delays are billed against the booked shoot duration.</li>
                    <li><strong className="text-white">Creative Brief & Key Stakeholders:</strong> A designated client representative or brand manager must be present or accessible on shoot day to approve critical setups and principal frames.</li>
                  </ul>
                </div>
              </div>

              {/* 4. Deliverables & Turnaround */}
              <div id="deliverables-timelines" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">04.</span>
                  Deliverables, Formats & Turnaround
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Deliverable timelines are calculated from the conclusion of the shoot:
                  </p>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3.5 bg-charcoal border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-white font-medium">Event & Brand Photography (Curated & Color-Graded)</span>
                      <span className="text-amber-400 font-mono font-semibold">3 – 5 Business Days</span>
                    </div>
                    <div className="p-3.5 bg-charcoal border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-white font-medium">Social Media Reels & Teaser Cuts (Vertical 9:16)</span>
                      <span className="text-amber-400 font-mono font-semibold">48 – 72 Hours</span>
                    </div>
                    <div className="p-3.5 bg-charcoal border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-white font-medium">Flagship Corporate / Commercial Films (4K Master)</span>
                      <span className="text-amber-400 font-mono font-semibold">7 – 12 Business Days</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 pt-1">
                    * Rush deliveries (24-hour turnaround) are available upon prior request subject to express post-production surcharge.
                  </p>
                </div>
              </div>

              {/* 5. Revision Cycles */}
              <div id="revisions" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">05.</span>
                  Revision Cycles & Client Feedback
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    We believe in close creative refinement to achieve your visual vision:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm text-white/80">
                    <li><strong className="text-white">Included Revisions:</strong> Every video quotation includes <span className="text-amber-400 font-medium">two (2) rounds of consolidated editorial revisions</span> (timing, pacing, text titles, color balance tweaks, music placement).</li>
                    <li><strong className="text-white">Feedback Window:</strong> Clients have 7 business days from preview delivery to provide consolidated feedback. Beyond 14 days without response, deliverables are deemed approved as final.</li>
                    <li><strong className="text-white">Scope Changes:</strong> Substantive script changes, re-shoots due to client brief changes, or radical genre re-edits not in original scope will be quoted as separate work orders.</li>
                  </ul>
                </div>
              </div>

              {/* 6. Copyright & Licensing */}
              <div id="ip-copyright" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">06.</span>
                  Copyright & Commercial Usage License
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Under standard international copyright conventions and the Indian Copyright Act, 1957:
                  </p>
                  <div className="p-4 bg-charcoal border border-white/10 rounded-sm space-y-2 text-xs sm:text-sm">
                    <p><strong className="text-white">Client Commercial License:</strong> Upon settlement of the final invoice, the Client receives an exclusive, perpetual, worldwide commercial usage license to publish, broadcast, distribute, and monetize the final delivered assets across websites, digital marketing, PR, broadcast, and social media.</p>
                    <p><strong className="text-white">Studio Attribution & Portfolio:</strong> Aman Visual retains artistic authorship and the non-exclusive right to display selected frames, stills, or video segments in our creative showcase, showreel, and digital portfolio, unless covered by an executed NDA.</p>
                    <p><strong className="text-white">Raw Camera Footage (RAW/Log):</strong> Uncut camera rushes remain internal production assets unless raw archival handover is explicitly included in the project scope.</p>
                  </div>
                </div>
              </div>

              {/* 7. Safety & Regulations */}
              <div id="safety-regulations" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">07.</span>
                  Equipment Safety & Drone Regulations
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    The safety of personnel, bystanders, and high-value cinema hardware is paramount:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm text-white/80">
                    <li><strong className="text-white">Aerial & Drone Filming:</strong> All drone flights comply with DGCA (Directorate General of Civil Aviation) rules in India. Aerial flights cannot operate in red zones, no-fly airport radii, or severe adverse weather (rain, high-velocity coastal winds). The pilot reserves ultimate authority on flight safety.</li>
                    <li><strong className="text-white">Hazardous Environments:</strong> Crew members will not be required to operate in hazardous, physically unsafe, or unconsented environments without suitable safety safeguards.</li>
                  </ul>
                </div>
              </div>

              {/* 8. Force Majeure & Liability */}
              <div id="force-majeure" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">08.</span>
                  Force Majeure & Limitation of Liability
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Neither party shall be held in breach of contract due to acts of God, extreme natural weather disruptions, civil unrest, sudden curfew, pandemic restrictions, or unforeseen utility blackouts.
                  </p>
                  <p>
                    In the extraordinary event of technical camera malfunction or irreversible media card corruption beyond standard backup redundancies, the Studio's total cumulative liability is strictly capped at the total fees paid by the Client for that specific assignment.
                  </p>
                </div>
              </div>

              {/* 9. Governing Law */}
              <div id="governing-law" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">09.</span>
                  Jurisdiction & Dispute Resolution
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    This agreement is constructed in accordance with the laws of the Republic of India. Any controversy or dispute arising under this agreement shall first be addressed through mutual executive consultation.
                  </p>
                  <p>
                    If unresolved within 30 days, the parties agree that the competent courts situated in <strong className="text-white">Mumbai, Maharashtra</strong> shall have exclusive jurisdiction.
                  </p>
                </div>
              </div>

              {/* 10. Contact */}
              <div id="contact" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-amber-400 font-mono text-base">10.</span>
                  Official Legal Notices & Booking Inquiries
                </h2>
                <div className="p-6 bg-charcoal border border-white/15 rounded-sm space-y-4">
                  <p className="text-sm text-white/80">
                    For customized contracts, corporate vendor onboarding forms, or legal notices:
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm font-mono text-white/80">
                    <p><strong className="text-white font-sans">Legal Entity:</strong> Aman Visual Production</p>
                    <p><strong className="text-white font-sans">Studio Office:</strong> Evershine Cosmic, Andheri West, Mumbai 400053, Maharashtra, India</p>
                    <p><strong className="text-white font-sans">Email:</strong> <a href="mailto:amanproductionsteam@gmail.com" className="text-amber-400 hover:underline">amanproductionsteam@gmail.com</a></p>
                    <p><strong className="text-white font-sans">WhatsApp Hotline:</strong> <a href="https://wa.me/918827474622" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">+91 8827474622</a></p>
                  </div>
                </div>
              </div>

              {/* Cross links */}
              <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-white/60">
                <span>Related Policies:</span>
                <Link to="/privacy-policy" className="text-white hover:text-amber-400 underline underline-offset-4">Privacy Policy</Link>
                <span>•</span>
                <Link to="/refund-policy" className="text-white hover:text-amber-400 underline underline-offset-4">Refund Policy</Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
