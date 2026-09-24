import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Download,
  Share2,
  QrCode,
  RefreshCw,
  Building2,
  Check,
  Upload,
  Trash2,
  MessageCircle,
  ImageIcon,
  Copy,
  Printer
} from 'lucide-react';
import { STUDIO_PAYMENT_CONFIG } from '../config/payment';

export interface BookingItemDetails {
  serviceTitle: string;
  totalEstimate: number;
  advanceAmount: number;
  packageType?: 'package' | 'custom_calculator' | 'rate_card';
  eventDate?: string;
  eventVenue?: string;
  customNotes?: string;
  initialAdvanceType?: 'standard' | 'token' | 'full';
}

export interface VerifiedReceiptData {
  receiptNumber: string;
  orderId: string;
  utr: string;
  paidAt: string;
  paymentMode: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  eventDate?: string;
  eventVenue?: string;
  totalEstimate: number;
  balanceDue: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingItemDetails;
  onSuccess?: (orderId: string) => void;
}

type ModalStep = 'details' | 'payment_details' | 'confirmed_receipt';

export default function DirectBookingModal({
  isOpen,
  onClose,
  bookingDetails,
  onSuccess
}: BookingModalProps) {
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventDate, setEventDate] = useState(bookingDetails.eventDate || '');
  const [eventVenue, setEventVenue] = useState(bookingDetails.eventVenue || '');
  const [customNotes, setCustomNotes] = useState(bookingDetails.customNotes || '');

  // Advance calculation
  const total = bookingDetails.totalEstimate || 14000;
  const standardHalfAdvance = Math.round(total * 0.5);
  const [advanceType, setAdvanceType] = useState<'standard' | 'token' | 'full'>(
    bookingDetails.initialAdvanceType || 'standard'
  );
  
  const currentAdvance = advanceType === 'standard' 
    ? standardHalfAdvance 
    : advanceType === 'token' 
      ? Math.min(5000, standardHalfAdvance) 
      : total;

  const remainingBalance = Math.max(0, total - currentAdvance);

  // Modal Flow Step
  const [currentStep, setCurrentStep] = useState<ModalStep>('details');

  // Payment Verification State
  const [manualUtr, setManualUtr] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Screenshot Upload State
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmed Receipt Data
  const [confirmedReceipt, setConfirmedReceipt] = useState<VerifiedReceiptData | null>(null);

  // Reset or initialize state on open
  useEffect(() => {
    if (isOpen) {
      if (bookingDetails.eventDate) setEventDate(bookingDetails.eventDate);
      if (bookingDetails.eventVenue) setEventVenue(bookingDetails.eventVenue);
      if (bookingDetails.initialAdvanceType) setAdvanceType(bookingDetails.initialAdvanceType);
      setErrorMessage(null);
    } else {
      setCurrentStep('details');
      setConfirmedReceipt(null);
      setIsSubmitting(false);
      setManualUtr('');
      if (screenshotPreviewUrl) {
        URL.revokeObjectURL(screenshotPreviewUrl);
      }
      setScreenshotFile(null);
      setScreenshotPreviewUrl(null);
      setScreenshotError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, bookingDetails]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (screenshotPreviewUrl) {
        URL.revokeObjectURL(screenshotPreviewUrl);
      }
    };
  }, [screenshotPreviewUrl]);

  const handleCopyText = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleScreenshotSelect = (file: File) => {
    setScreenshotError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validExtensions = /\.(jpe?g|png|webp)$/i;

    if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
      setScreenshotError('Supported formats: JPG, PNG, or WebP.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setScreenshotError('Image size exceeds 5 MB. Please select an image under 5 MB.');
      return;
    }

    if (screenshotPreviewUrl) {
      URL.revokeObjectURL(screenshotPreviewUrl);
    }

    const newUrl = URL.createObjectURL(file);
    setScreenshotFile(file);
    setScreenshotPreviewUrl(newUrl);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleScreenshotSelect(file);
    }
  };

  const handleRemoveScreenshot = () => {
    if (screenshotPreviewUrl) {
      URL.revokeObjectURL(screenshotPreviewUrl);
    }
    setScreenshotFile(null);
    setScreenshotPreviewUrl(null);
    setScreenshotError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Move from Details to Payment Screen
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (!clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setErrorMessage('Please enter a valid email address to receive your official booking receipt.');
      return;
    }

    setCurrentStep('payment_details');
  };

  // Submit Booking with UPI/Bank Reference
  const handleSubmitBooking = async () => {
    setErrorMessage(null);
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      let screenshotBase64: string | undefined = undefined;
      if (screenshotFile) {
        screenshotBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(screenshotFile);
        });
      }

      const res = await fetch('/api/bookings/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAdvance,
          customerName: clientName.trim(),
          customerEmail: clientEmail.trim().toLowerCase(),
          customerPhone: cleanPhone,
          serviceTitle: `${bookingDetails.serviceTitle} (${advanceType === 'standard' ? '50% Retainer' : advanceType === 'token' ? 'Token Retainer' : 'Full Payment'})`,
          eventDate,
          eventVenue,
          customNotes,
          utr: manualUtr.trim() || undefined,
          screenshotUrl: screenshotBase64
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit booking retainer. Please retry.');
      }

      const confirmedData: VerifiedReceiptData = {
        receiptNumber: data.receipt?.receiptNumber || `AV-REC-${data.orderId}`,
        orderId: data.orderId,
        utr: manualUtr.trim() || 'Direct Kotak UPI Transfer',
        paidAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        paymentMode: 'Direct Kotak Mahindra Bank UPI',
        amount: currentAdvance,
        customerName: clientName.trim(),
        customerEmail: clientEmail.trim(),
        customerPhone: cleanPhone,
        serviceTitle: bookingDetails.serviceTitle,
        eventDate,
        eventVenue,
        totalEstimate: total,
        balanceDue: remainingBalance
      };

      setConfirmedReceipt(confirmedData);
      setCurrentStep('confirmed_receipt');

      if (onSuccess) {
        onSuccess(data.orderId);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not record booking. Please retry or contact Aman Visual directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Message for Direct Chat Confirmation
  const whatsappBookingUrl = `https://wa.me/918827474622?text=${encodeURIComponent(
    `Hello Aman Visual! I am booking ${bookingDetails.serviceTitle}.\n` +
    `Client: ${clientName.trim()}\n` +
    `Phone: ${clientPhone}\n` +
    `Date: ${eventDate || 'TBD'}\n` +
    `Venue: ${eventVenue || 'TBD'}\n` +
    `Retainer Amount: ₹${currentAdvance.toLocaleString('en-IN')}\n` +
    (manualUtr ? `Bank UTR / Ref: ${manualUtr}\n` : '') +
    `Please confirm my date reservation.`
  )}`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0e0e10] border border-white/15 rounded-xl shadow-2xl overflow-hidden my-6 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
                  Aman Visual Studio • Date Reservation
                </h2>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Official Direct Kotak Bank UPI & Retainer Confirmation
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-3 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-center">
            <div className={`py-2.5 border-r border-white/10 ${currentStep === 'details' ? 'bg-emerald-500/10 text-emerald-400 font-bold border-b-2 border-b-emerald-400' : 'text-white/40'}`}>
              1. Shoot Details
            </div>
            <div className={`py-2.5 border-r border-white/10 ${currentStep === 'payment_details' ? 'bg-emerald-500/10 text-emerald-400 font-bold border-b-2 border-b-emerald-400' : 'text-white/40'}`}>
              2. Kotak Bank UPI
            </div>
            <div className={`py-2.5 ${currentStep === 'confirmed_receipt' ? 'bg-emerald-500/10 text-emerald-400 font-bold border-b-2 border-b-emerald-400' : 'text-white/40'}`}>
              3. Official Receipt
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="m-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg flex items-center gap-2.5">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Shoot & Client Details */}
          {currentStep === 'details' && (
            <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
              {/* Service Summary Card */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                    Selected Service
                  </span>
                  <div className="text-base font-bold text-white mt-0.5">
                    {bookingDetails.serviceTitle}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    Estimated Production: ₹{total.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Advance Retainer
                  </span>
                  <div className="text-xl font-extrabold text-emerald-400">
                    ₹{currentAdvance.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-white/40">
                    Balance ₹{remainingBalance.toLocaleString('en-IN')} on shoot date
                  </div>
                </div>
              </div>

              {/* Advance Retainer Option Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                  Select Retainer Option
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAdvanceType('standard')}
                    className={`p-3 border rounded-lg text-left transition-all cursor-pointer ${
                      advanceType === 'standard'
                        ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">50% Advance</div>
                    <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                      ₹{standardHalfAdvance.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">Standard Booking</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdvanceType('token')}
                    className={`p-3 border rounded-lg text-left transition-all cursor-pointer ${
                      advanceType === 'token'
                        ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">₹5,000 Token</div>
                    <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                      ₹{Math.min(5000, standardHalfAdvance).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">Hold Date Slot</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdvanceType('full')}
                    className={`p-3 border rounded-lg text-left transition-all cursor-pointer ${
                      advanceType === 'full'
                        ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">100% Full</div>
                    <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                      ₹{total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">Complete Payment</div>
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1.5">
                    <User size={13} className="text-emerald-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-400" />
                    <span>WhatsApp / Phone Number *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-white/40">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98XXXXXXXX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/60 border border-white/15 pl-12 pr-3 py-2.5 text-xs text-white placeholder-white/30 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} className="text-emerald-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-emerald-400" />
                    <span>Shoot / Event Date</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 px-3 py-2.5 text-xs text-white rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>Venue / City Location</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Taj Lands End, Mumbai"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">
                  Shoot Brief & Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Number of days, drone requirement, delivery timelines, specific style..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
              >
                <span>Proceed to Payment (₹{currentAdvance.toLocaleString('en-IN')})</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* STEP 2: Official Kotak Bank UPI & Account Transfer */}
          {currentStep === 'payment_details' && (
            <div className="p-6 space-y-6">
              {/* Booking Summary Pill */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs">
                <div>
                  <span className="text-white/60 block text-[11px]">Booking For:</span>
                  <strong className="text-white font-bold">{clientName}</strong> • {bookingDetails.serviceTitle}
                </div>
                <div className="text-right">
                  <span className="text-white/60 block text-[11px]">Advance Due:</span>
                  <strong className="text-emerald-400 text-base font-extrabold">₹{currentAdvance.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left: QR Code Preview */}
                <div className="bg-black/60 border border-white/15 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                    <QrCode size={15} className="text-emerald-400" />
                    <span>Scan with Any UPI App</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-md border border-white/20 mb-3">
                    <img
                      src="/aman-visual-upi-qr.jpeg"
                      alt="Kotak Mahindra Bank UPI QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <div className="text-[11px] text-white/50">
                    Google Pay • PhonePe • Paytm • Cred • BHIM
                  </div>
                </div>

                {/* Right: Bank & UPI Credentials */}
                <div className="space-y-3.5">
                  <div className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Building2 size={14} />
                    <span>Official Studio Bank Details</span>
                  </div>

                  {/* UPI ID */}
                  <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase font-mono block">UPI ID</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {STUDIO_PAYMENT_CONFIG.upiId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(STUDIO_PAYMENT_CONFIG.upiId, 'upiId')}
                      className="px-2.5 py-1 text-[11px] bg-white/10 hover:bg-white/20 text-white rounded font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'upiId' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === 'upiId' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* UPI Number / Phone */}
                  <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase font-mono block">UPI Phone Number</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {STUDIO_PAYMENT_CONFIG.upiNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(STUDIO_PAYMENT_CONFIG.upiNumber, 'upiNum')}
                      className="px-2.5 py-1 text-[11px] bg-white/10 hover:bg-white/20 text-white rounded font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'upiNum' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === 'upiNum' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Bank Account Details */}
                  <div className="p-3.5 bg-black/40 border border-white/10 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between items-center text-white/80">
                      <span className="text-white/40">Bank:</span>
                      <span className="font-semibold">{STUDIO_PAYMENT_CONFIG.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span className="text-white/40">Account Name:</span>
                      <span className="font-semibold">{STUDIO_PAYMENT_CONFIG.bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span className="text-white/40">Account No.:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold">{STUDIO_PAYMENT_CONFIG.bankDetails.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(STUDIO_PAYMENT_CONFIG.bankDetails.accountNumber, 'accNum')}
                          className="text-white/40 hover:text-white"
                        >
                          {copiedField === 'accNum' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span className="text-white/40">IFSC Code:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold">{STUDIO_PAYMENT_CONFIG.bankDetails.ifscCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(STUDIO_PAYMENT_CONFIG.bankDetails.ifscCode, 'ifsc')}
                          className="text-white/40 hover:text-white"
                        >
                          {copiedField === 'ifsc' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* UTR Input & Screenshot Upload */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3.5">
                <div className="text-xs font-bold text-white">
                  Step 2: Enter Transaction Reference / UTR Number
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Enter 12-digit UTR / UPI Transaction Reference No."
                    value={manualUtr}
                    onChange={(e) => setManualUtr(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-white/30 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-white/40 mt-1">
                    Found in your Google Pay, PhonePe, or Paytm payment success receipt.
                  </p>
                </div>

                {/* Screenshot proof upload (Optional) */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  {screenshotPreviewUrl ? (
                    <div className="flex items-center justify-between p-2.5 bg-black/60 border border-emerald-500/40 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <img src={screenshotPreviewUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
                        <div>
                          <span className="text-emerald-400 font-medium block">Screenshot Attached</span>
                          <span className="text-[10px] text-white/40">{screenshotFile?.name}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 border border-dashed border-white/20 hover:border-white/40 rounded-lg text-xs text-white/60 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>Attach Payment Screenshot (Optional)</span>
                    </button>
                  )}
                  {screenshotError && (
                    <p className="text-[11px] text-red-400 mt-1">{screenshotError}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Generating Official Receipt...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Confirm Booking & Generate Official Receipt</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('details')}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg transition-colors cursor-pointer text-center"
                  >
                    ← Edit Shoot Details
                  </button>

                  <a
                    href={whatsappBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={14} />
                    <span>Confirm via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed Digital Tax Receipt */}
          {currentStep === 'confirmed_receipt' && confirmedReceipt && (
            <div className="p-6 space-y-6">
              {/* Success Badge */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <h3 className="text-lg font-bold text-white">Date Reservation Confirmed!</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Your advance retainer has been recorded. An official booking confirmation copy has been sent to{' '}
                  <strong className="text-emerald-400">{confirmedReceipt.customerEmail}</strong>.
                </p>
              </div>

              {/* Official Printable Tax Invoice / Retainer Receipt */}
              <div className="p-5 bg-white text-black rounded-xl shadow-lg font-sans space-y-4 text-xs">
                {/* Receipt Header */}
                <div className="flex items-start justify-between border-b border-black/10 pb-3">
                  <div>
                    <div className="text-base font-extrabold uppercase tracking-wider">AMAN VISUAL</div>
                    <div className="text-[11px] text-black/60">Cinematography & Photography Studio</div>
                    <div className="text-[10px] text-black/50">Mumbai, Maharashtra • +91 8827474622</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      RETAINER RECEIPT
                    </span>
                    <div className="text-[11px] font-bold mt-1">{confirmedReceipt.receiptNumber}</div>
                    <div className="text-[10px] text-black/50">{confirmedReceipt.paidAt}</div>
                  </div>
                </div>

                {/* Client & Shoot Details */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-black/50 block text-[10px] uppercase font-mono">Client Name</span>
                    <strong>{confirmedReceipt.customerName}</strong>
                    <div className="text-black/60">{confirmedReceipt.customerPhone}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-black/50 block text-[10px] uppercase font-mono">Shoot Details</span>
                    <strong>{confirmedReceipt.serviceTitle}</strong>
                    <div className="text-black/60">
                      {confirmedReceipt.eventDate ? `Date: ${confirmedReceipt.eventDate}` : 'Date: Scheduled'}
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="border-t border-b border-black/10 py-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span>Total Production Estimate:</span>
                    <span>₹{confirmedReceipt.totalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Advance Retainer Paid:</span>
                    <span>₹{confirmedReceipt.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-black/60 pt-1 border-t border-black/5">
                    <span>Remaining Balance on Shoot Day:</span>
                    <span>₹{confirmedReceipt.balanceDue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-black/50 pt-1">
                    <span>Payment Mode & Bank Ref:</span>
                    <span>{confirmedReceipt.utr}</span>
                  </div>
                </div>

                {/* Official Studio Stamp & Seal */}
                <div className="flex items-center justify-between pt-2 text-[10px] text-black/50">
                  <div>
                    Official Verified Retainer • Aman Visual Studio
                  </div>
                  <div className="text-right font-mono font-bold text-emerald-800">
                    STATUS: CONFIRMED ✓
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-3 bg-white text-black hover:bg-white/90 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print / Save Receipt</span>
                </button>

                <a
                  href={`https://wa.me/918827474622?text=${encodeURIComponent(
                    `Hi Aman, I have confirmed my booking for ${confirmedReceipt.serviceTitle}!\nReceipt No: ${confirmedReceipt.receiptNumber}\nAmount Paid: ₹${confirmedReceipt.amount.toLocaleString('en-IN')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
                >
                  <Share2 size={15} />
                  <span>Share on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
