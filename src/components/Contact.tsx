import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageCircle, Instagram, Linkedin, Youtube, ArrowRight, MapPin, CheckCircle2, AlertCircle, Loader2, Calendar, RefreshCw } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    shootDate: '',
    message: '',
    _website: '', // Spam honeypot (bots fill this, humans don't)
  });

  const [formMountTime, setFormMountTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [isSetupComingSoon, setIsSetupComingSoon] = useState(false);
  const [emailServiceConfigured, setEmailServiceConfigured] = useState<boolean | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    shootDate: '',
    message: '',
  });

  useEffect(() => {
    setFormMountTime(Date.now());
    fetch('/api/contact/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setEmailServiceConfigured(Boolean(data.emailConfigured));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
      setErrorDetails('');
    }
  };

  // Build properly URL-encoded WhatsApp enquiry message
  const buildWhatsAppUrl = (sourceData = formData) => {
    const lines = [
      'Hello Aman Visual, I would like to enquire about a project:',
      `• Name: ${sourceData.name.trim() || '[Not provided]'}`,
      sourceData.email.trim() ? `• Email: ${sourceData.email.trim()}` : null,
      sourceData.phone.trim() ? `• Phone: ${sourceData.phone.trim()}` : null,
      sourceData.service ? `• Service: ${sourceData.service}` : null,
      sourceData.shootDate.trim() ? `• Shoot Date: ${sourceData.shootDate.trim()}` : '• Shoot Date: To be scheduled',
      sourceData.message.trim() ? `• Project Details: ${sourceData.message.trim()}` : null,
    ].filter(Boolean);

    return `https://wa.me/918827474622?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Client-side validations
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setStatus('error');
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim() || phoneClean.length < 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit phone or WhatsApp number.');
      return;
    }

    if (!formData.service) {
      setStatus('error');
      setErrorMessage('Please select a service category.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setStatus('error');
      setErrorMessage('Please provide brief details about your project (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');
    setErrorDetails('');

    const submissionPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      shootDate: formData.shootDate.trim(),
      message: formData.message.trim(),
      _website: formData._website,
      _timestamp: formMountTime,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      const data = await response.json();

      // Show success if backend successfully saved/processed the enquiry
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'The server could not process your enquiry.');
      }

      // Check if email dispatch is in Setup coming soon mode
      setIsSetupComingSoon(Boolean(data.setupComingSoon || !data.emailSent));
      setReferenceId(data.enquiry?.id || '');
      setLastSubmitted({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        shootDate: formData.shootDate,
        message: formData.message,
      });
      setStatus('success');

      // Clear form inputs only on confirmed successful delivery
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        shootDate: '',
        message: '',
        _website: '',
      });
      setFormMountTime(Date.now());
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Email delivery failed.');
      setErrorDetails(
        'Your entered details have been retained in the form below. You can retry sending or click "Send Enquiry on WhatsApp" to deliver your enquiry immediately.'
      );
      // NOTE: Form details in formData are intentionally NOT cleared so the user can retry!
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrorMessage('');
    setErrorDetails('');
    setReferenceId('');
  };

  return (
    <section id="contact" className="py-24 md:py-40 bg-darker relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <h2 className="text-5xl md:text-7xl font-bold uppercase mb-8 leading-none">
              Let's <br/> Collaborate
            </h2>
            <p className="text-white/50 text-lg font-light mb-12 max-w-md">
              Available for commercial projects, real estate documentation, luxury weddings, and event coverage worldwide.
            </p>

            <div className="space-y-8 flex-1">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Studio Address</div>
                  <div className="font-display uppercase text-base sm:text-lg text-white group-hover:text-white/80 transition-colors leading-snug">
                    Evershine Cosmic, Andheri West,<br />
                    Mumbai, Maharashtra 400053
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Evershine+Cosmic+Andheri+West+Mumbai+400053" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white mt-1.5 tracking-wider uppercase underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>

              <a 
                href="https://wa.me/918827474622" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-6 group"
                id="contact-whatsapp-link"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-black text-white transition-all duration-300">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5 fill-current" 
                    aria-hidden="true"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-1">WhatsApp Direct</div>
                  <div className="font-display uppercase text-lg group-hover:text-emerald-400 transition-colors">+91 8827474622</div>
                </div>
              </a>
              
              <a href="tel:+918827474622" className="flex items-center gap-6 group" id="contact-phone-link">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Phone Call</div>
                  <div className="font-display uppercase text-lg group-hover:text-white/80 transition-colors">+91 8827474622</div>
                </div>
              </a>

              <a href="mailto:amanproductionsteam@gmail.com" className="flex items-center gap-6 group" id="contact-email-link">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Direct Production Email</div>
                  <div className="font-display uppercase text-lg group-hover:text-white/80 transition-colors">amanproductionsteam@gmail.com</div>
                </div>
              </a>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <a 
                href="https://wa.me/918827474622" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp Direct Message"
                className="text-white/50 hover:text-emerald-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/amanvisual.in?stkn=cGU5a25xNWw2cHE1&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram Profile"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Instagram size={24} strokeWidth={1.5} />
              </a>
              <a 
                href="https://www.linkedin.com/in/aman-visuals-5aa4b43b4" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn Profile"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Linkedin size={24} strokeWidth={1.5} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UC2yh3NtEq_Fb2tnqcTDf3OA" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube Channel"
                className="text-white/50 hover:text-red-500 hover:scale-105 transition-all"
              >
                <Youtube size={24} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-charcoal p-8 md:p-12 border border-white/5 relative"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-display uppercase">Send an Enquiry</h3>
                <p className="text-xs text-white/50 mt-1">
                  Delivered directly to <span className="text-white/80">amanproductionsteam@gmail.com</span> & recorded in studio database
                </p>
              </div>
            </div>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 flex flex-col items-start space-y-6"
                id="enquiry-success-container"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-display uppercase text-white mb-2">
                    Your enquiry has been submitted successfully
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed font-light">
                    Your project enquiry has been recorded in the studio database with Reference ID <strong className="text-white font-medium">{referenceId}</strong>. Our production team will review your specifications and get back to you within 4–24 hours.
                  </p>
                </div>

                {referenceId && (
                  <div className="w-full bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    <span className="text-white/40 uppercase tracking-wider">Booking Reference ID</span>
                    <span className="font-mono text-emerald-400 font-semibold tracking-widest bg-black/60 px-3 py-1 border border-white/10">
                      {referenceId}
                    </span>
                  </div>
                )}

                {/* Submitted Details Summary */}
                <div className="w-full bg-black/40 border border-white/10 p-4 space-y-2 text-xs text-white/70">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Name:</span>
                    <span className="text-white font-medium">{lastSubmitted.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Email:</span>
                    <span className="text-white font-medium">{lastSubmitted.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Phone:</span>
                    <span className="text-white font-medium">{lastSubmitted.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Service:</span>
                    <span className="text-white font-medium">{lastSubmitted.service}</span>
                  </div>
                  {lastSubmitted.shootDate && (
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/40">Target Shoot Date:</span>
                      <span className="text-amber-400 font-medium">{lastSubmitted.shootDate}</span>
                    </div>
                  )}
                </div>

                {/* Instant WhatsApp Option */}
                <div className="w-full space-y-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(lastSubmitted)}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="success-whatsapp-btn"
                    className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-widest transition-colors text-center inline-flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40"
                  >
                    <MessageCircle size={16} />
                    <span>Send Enquiry on WhatsApp</span>
                  </a>
                  <p className="text-[11px] text-white/40 text-center leading-relaxed">
                    Opens WhatsApp with your enquiry details pre-filled. Please tap <strong>Send</strong> in WhatsApp.
                  </p>
                </div>

                <div className="w-full pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                
                {/* Honeypot Spam Field (Invisible to real users, catches bots) */}
                <div className="opacity-0 absolute -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden="true">
                  <label htmlFor="_website">Do not fill this field</label>
                  <input
                    type="text"
                    id="_website"
                    name="_website"
                    value={formData._website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Error Banner with Retained Details notice */}
                {status === 'error' && errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-950/40 border border-red-500/40 space-y-2 text-xs leading-relaxed"
                    id="enquiry-error-banner"
                  >
                    <div className="flex items-start gap-2.5 text-red-200 font-medium">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                    {errorDetails && (
                      <p className="text-white/70 pl-6 text-[11px]">
                        {errorDetails}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Full Name */}
                <div className="relative">
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors peer disabled:opacity-50 text-sm"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute left-0 top-3 text-white/40 text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                  >
                    Customer Full Name *
                  </label>
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      disabled={isSubmitting}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors peer disabled:opacity-50 text-sm"
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-0 top-3 text-white/40 text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                    >
                      Email Address *
                    </label>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      disabled={isSubmitting}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors peer disabled:opacity-50 text-sm"
                    />
                    <label 
                      htmlFor="phone" 
                      className="absolute left-0 top-3 text-white/40 text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                    >
                      Phone / WhatsApp *
                    </label>
                  </div>
                </div>

                {/* Service Category & Shoot Date Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Category */}
                  <div className="relative">
                    <select 
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                      <option value="" disabled className="bg-[#121212] text-white/40">Select Service Category *</option>
                      <option value="Event Photography & Videography" className="bg-[#121212]">Event Photo & Video</option>
                      <option value="Corporate Film & Commercial" className="bg-[#121212]">Corporate Film & Commercial</option>
                      <option value="Real Estate Visuals & FPV" className="bg-[#121212]">Real Estate & FPV Drone</option>
                      <option value="Wedding Cinematography" className="bg-[#121212]">Wedding Cinematography</option>
                      <option value="Social Media Reels & Content" className="bg-[#121212]">Social Media Reels & Content</option>
                      <option value="Music Video Production" className="bg-[#121212]">Music Video Production</option>
                      <option value="Other Creative Production" className="bg-[#121212]">Other Creative Production</option>
                    </select>
                    <div className="absolute right-0 top-3 pointer-events-none text-white/40 text-xs">
                      ▼
                    </div>
                  </div>

                  {/* Shoot Date (Optional) */}
                  <div className="relative">
                    <input 
                      type="date" 
                      id="shootDate"
                      name="shootDate"
                      value={formData.shootDate}
                      onChange={handleChange}
                      placeholder=" "
                      disabled={isSubmitting}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors peer disabled:opacity-50 text-sm [color-scheme:dark]"
                    />
                    <label 
                      htmlFor="shootDate" 
                      className="absolute left-0 top-3 text-white/40 text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                    >
                      Target Shoot Date (Optional)
                    </label>
                  </div>
                </div>

                {/* Project Details Message */}
                <div className="relative">
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder=" "
                    required
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors peer resize-none disabled:opacity-50 text-sm"
                  />
                  <label 
                    htmlFor="message" 
                    className="absolute left-0 top-3 text-white/40 text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                  >
                    Project Details & Scope *
                  </label>
                </div>

                {/* Submit and WhatsApp Buttons Area */}
                <div className="pt-4 space-y-3">
                  {/* Primary: Submit via Transactional Email */}
                  <button 
                    type="submit"
                    id="submit-enquiry-btn"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-4 font-semibold text-xs tracking-widest uppercase hover:bg-white/90 disabled:bg-white/50 transition-colors flex items-center justify-center gap-3 group cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span>Saving Enquiry to Studio Inbox...</span>
                        <Loader2 size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-white/30">
                      or connect via whatsapp
                    </span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  {/* Separate Send Enquiry on WhatsApp button */}
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="whatsapp-enquiry-btn"
                    className="w-full border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 text-emerald-300 hover:text-emerald-200 py-3.5 px-4 font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2.5 group"
                  >
                    <MessageCircle size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Send Enquiry on WhatsApp</span>
                  </a>

                  {/* WhatsApp Disclaimer Note */}
                  <p className="text-[11px] text-white/40 text-center leading-relaxed px-2">
                    Opens WhatsApp with your enquiry details pre-filled. Please tap <strong className="text-white/70">Send</strong> in WhatsApp to deliver your message. (Opening WhatsApp does not automatically submit this website form).
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
