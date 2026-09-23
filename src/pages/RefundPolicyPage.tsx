import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  CloudRain, 
  Sparkles, 
  Mail, 
  ArrowLeft, 
  ChevronRight,
  ShieldAlert,
  CreditCard
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const SECTIONS = [
  { id: 'overview', label: '1. Production Scope & Overview' },
  { id: 'retainer-deposits', label: '2. Advance Retainer Policy' },
  { id: 'cancellation-tiers', label: '3. Cancellation Schedule & Fees' },
  { id: 'rescheduling-policy', label: '4. Rescheduling & Weather Delays' },
  { id: 'studio-cancellations', label: '5. Studio-Initiated Cancellations' },
  { id: 'post-production-revisions', label: '6. Post-Production Revisions' },
  { id: 'payout-timelines', label: '7. Refund Processing & Payouts' },
  { id: 'contact', label: '8. Claims & Support Helpdesk' },
];

export default function RefundPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');

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
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Transparency & Protection</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold uppercase tracking-tight mb-6">
              Refund & <br />Cancellation Policy
            </h1>
            <p className="text-white/70 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              Clear, transparent guidelines regarding shoot reservations, date transfers, rescheduling protocols, and refund processing for our commercial visual production clients.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-8 text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-rose-400" />
                <span>Effective Date: September 2026</span>
              </span>
              <span>•</span>
              <span>Direct Studio Guarantee: Aman Visual</span>
              <span>•</span>
              <span>Processed in: 5 – 7 Business Days</span>
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
                  Policy Navigation
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
                  <div className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Need a Reschedule?</div>
                  <p className="text-xs text-white/70 mb-3 leading-relaxed">
                    Need to change your event date or adjust production timing? Reach out right away:
                  </p>
                  <a
                    href="https://wa.me/918827474622"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors font-mono"
                  >
                    <Mail size={13} />
                    <span>WhatsApp: +91 8827474622</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Policy Text */}
            <div className="lg:col-span-8 space-y-12 leading-relaxed text-sm md:text-base text-white/80 font-light">
              
              {/* Highlight summary card */}
              <div className="p-6 md:p-8 bg-neutral-900 border border-rose-500/30 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={18} className="text-rose-400" />
                  <h3 className="font-display uppercase font-bold text-sm tracking-wider text-white">
                    Fairness & Flexibility First
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  We understand dates change, weather shifts, and live events face unexpected obstacles. While reserved production dates block our calendar from other commercial inquiries, we offer flexible rescheduling credits and 100% refunds if the Studio is ever unable to fulfill a scheduled date.
                </p>
              </div>

              {/* 1. Overview */}
              <div id="overview" className="pt-4 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">01.</span>
                  Production Scope & Overview
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Commercial photography, cinematography, drone filming, and post-production are professional, creative, time-committed services rather than off-the-shelf physical inventory.
                  </p>
                  <p>
                    When a client commissions Aman Visual for an assignment, our studio reserves high-value cinema hardware (Sony FX Cinema rigs, G-Master primes, DJI Ronin gimbals, lighting trucks) and blocks expert crew members (Director of Photography, gaffers, drone pilots, sound engineers) from accepting competing bookings for those dates.
                  </p>
                </div>
              </div>

              {/* 2. Retainer Policy */}
              <div id="retainer-deposits" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">02.</span>
                  Advance Retainer Policy
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    To guarantee date exclusivity, an advance retainer (typically 50% of the contracted quotation value) is required upon confirmation.
                  </p>
                  <div className="p-4 bg-charcoal border border-white/10 rounded-sm space-y-2 text-xs sm:text-sm">
                    <p><strong className="text-white">Why Deposits are Non-Refundable by Default:</strong> The retainer covers pre-production planning, location risk audits, storyboard review, and compensates for turned-away client opportunities.</p>
                    <p><strong className="text-white">Rescheduling Value:</strong> If your event must be rescheduled with reasonable notice, 100% of your deposit can be applied towards an alternate date within 6 months.</p>
                  </div>
                </div>
              </div>

              {/* 3. Cancellation Schedule */}
              <div id="cancellation-tiers" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">03.</span>
                  Cancellation Schedule & Refund Tiers
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Should the Client find it necessary to cancel a confirmed production, refund eligibility is determined by the written notice provided prior to the scheduled call date:
                  </p>

                  <div className="space-y-3 my-4">
                    {/* Tier 1 */}
                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-white font-semibold uppercase text-xs tracking-wider">Notice Given: 30+ Days Prior</span>
                        <span className="text-emerald-400 font-mono text-xs font-bold">50% Cash Refund or 100% Date Credit</span>
                      </div>
                      <p className="text-xs text-white/60">
                        The client may choose between a 50% refund of the advance retainer or a 100% credit transferrable to any future shoot within 180 days.
                      </p>
                    </div>

                    {/* Tier 2 */}
                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-white font-semibold uppercase text-xs tracking-wider">Notice Given: 15 to 29 Days Prior</span>
                        <span className="text-amber-400 font-mono text-xs font-bold">Deposit Forfeited • No Further Invoicing</span>
                      </div>
                      <p className="text-xs text-white/60">
                        The advance retainer is retained to compensate for lost booking windows. The remaining shoot milestone balances will not be billed.
                      </p>
                    </div>

                    {/* Tier 3 */}
                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-white font-semibold uppercase text-xs tracking-wider">Notice Given: 3 to 14 Days Prior</span>
                        <span className="text-rose-400 font-mono text-xs font-bold">Deposit + Out-of-Pocket Reimbursement</span>
                      </div>
                      <p className="text-xs text-white/60">
                        The advance deposit is non-refundable. Additionally, any non-cancellable third-party expenses already incurred (specialized drone permits, specialized lens rentals, sub-hired crew cancellation fees) will be billed at cost.
                      </p>
                    </div>

                    {/* Tier 4 */}
                    <div className="p-4 bg-charcoal border border-white/10 rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-white font-semibold uppercase text-xs tracking-wider">Notice Given: Under 48 Hours or No-Show</span>
                        <span className="text-rose-400 font-mono text-xs font-bold">100% Day-Rate Payable</span>
                      </div>
                      <p className="text-xs text-white/60">
                        Because crew and equipment are fully mobilized, the entire contracted Day 1 fee is payable in full.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Rescheduling */}
              <div id="rescheduling-policy" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">04.</span>
                  Rescheduling & Weather Contingencies
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    We actively encourage rescheduling over cancellation:
                  </p>
                  <ul className="space-y-3 list-disc list-inside text-sm text-white/80">
                    <li><strong className="text-white">Advance Date Transfer:</strong> One (1) schedule change is accommodated free of charge when requested at least 7 days prior to the shoot date, subject to studio calendar availability.</li>
                    <li><strong className="text-white">Inclement Weather & Rain (Outdoor Shoots):</strong> For outdoor landscape, commercial architecture, or drone operations, extreme weather (e.g. torrential Mumbai monsoon, cyclone alerts, zero visibility) allows the client to postpone without penalty to the nearest mutually clear weather window.</li>
                  </ul>
                </div>
              </div>

              {/* 5. Studio Cancellations */}
              <div id="studio-cancellations" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">05.</span>
                  Studio-Initiated Cancellations & Equipment Failures
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    While Aman Visual has maintained a 100% on-time shoot record with zero unfulfilled commissions, we provide absolute client protection:
                  </p>
                  <div className="p-4 bg-charcoal border border-emerald-500/30 rounded-sm space-y-2 text-xs sm:text-sm">
                    <p><strong className="text-white">100% Immediate Refund Guarantee:</strong> If the Studio must cancel due to severe illness, technical hardware emergency, or emergency logistical breakdown without a certified equivalent backup crew, 100% of all monies received will be refunded immediately without deduction.</p>
                    <p><strong className="text-white">Complimentary Future Credit:</strong> In such an unlikely occurrence, we will also provide a 15% goodwill discount voucher applicable to your next visual production.</p>
                  </div>
                </div>
              </div>

              {/* 6. Post-Production Revisions */}
              <div id="post-production-revisions" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">06.</span>
                  Post-Production & Editorial Satisfaction
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>
                    Once photography and filming are wrapped, significant creative labor is invested into sorting, RAW processing, color grading, and audio mastering:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm text-white/80">
                    <li><strong className="text-white">Completed Deliveries are Non-Refundable:</strong> After client review and final master download, completed post-production work cannot be refunded.</li>
                    <li><strong className="text-white">Revision Safeguards:</strong> If a delivery does not meet the approved mood board or technical specifications, we address concerns through your included revision rounds (pacing adjustments, alternate takes, grade tuning, audio balance).</li>
                  </ul>
                </div>
              </div>

              {/* 7. Payout Timelines */}
              <div id="payout-timelines" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">07.</span>
                  Refund Processing & Payout Modes
                </h2>
                <div className="space-y-4 text-white/70">
                  <p>Approved refunds are processed with complete transparency:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm">
                      <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider mb-2">
                        <Clock size={15} className="text-rose-400" />
                        <span>Processing Window</span>
                      </div>
                      <p className="text-white/60">
                        Refunds are initiated within 48 hours of written approval and typically reflect in your bank account in <strong>5 to 7 business days</strong>.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm">
                      <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider mb-2">
                        <CreditCard size={15} className="text-rose-400" />
                        <span>Payment Mode</span>
                      </div>
                      <p className="text-white/60">
                        Refunds are remitted strictly back to the original source bank account via official NEFT/RTGS, corporate transfer, or UPI.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Contact */}
              <div id="contact" className="pt-6 border-t border-white/10 scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-display uppercase font-bold text-white tracking-wide mb-4 flex items-center gap-3">
                  <span className="text-rose-400 font-mono text-base">08.</span>
                  Cancellation & Refund Claims Desk
                </h2>
                <div className="p-6 bg-charcoal border border-white/15 rounded-sm space-y-4">
                  <p className="text-sm text-white/80">
                    To request an official date reschedule or submit a written cancellation notice:
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm font-mono text-white/80">
                    <p><strong className="text-white font-sans">Studio:</strong> Aman Visual (amanvisual.in)</p>
                    <p><strong className="text-white font-sans">Address:</strong> Evershine Cosmic, Andheri West, Mumbai 400053, Maharashtra, India</p>
                    <p><strong className="text-white font-sans">Formal Email:</strong> <a href="mailto:amanproductionsteam@gmail.com" className="text-rose-400 hover:underline">amanproductionsteam@gmail.com</a></p>
                    <p><strong className="text-white font-sans">Production WhatsApp:</strong> <a href="https://wa.me/918827474622" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline">+91 8827474622</a></p>
                  </div>
                  <p className="text-xs text-white/50 pt-2 border-t border-white/10">
                    * Cancellation notices must be transmitted in written form via official email or authorized WhatsApp confirmation to timestamp the notice period accurately.
                  </p>
                </div>
              </div>

              {/* Cross links */}
              <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-white/60">
                <span>Related Policies:</span>
                <Link to="/privacy-policy" className="text-white hover:text-rose-400 underline underline-offset-4">Privacy Policy</Link>
                <span>•</span>
                <Link to="/terms-and-conditions" className="text-white hover:text-rose-400 underline underline-offset-4">Terms & Conditions</Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
