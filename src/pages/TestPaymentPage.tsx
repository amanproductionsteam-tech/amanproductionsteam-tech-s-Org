/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  Mail, 
  User, 
  QrCode,
  Lock,
  Building2,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { STUDIO_PAYMENT_CONFIG } from '../config/payment';

export default function TestPaymentPage() {
  const [customerName, setCustomerName] = useState('Aman Visual Client');
  const [customerPhone, setCustomerPhone] = useState('8827474622');
  const [customerEmail, setCustomerEmail] = useState('amanproductionsteam@gmail.com');
  const [utrNumber, setUtrNumber] = useState('');
  const [amount] = useState(100);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Success receipt state
  const [confirmedPayment, setConfirmedPayment] = useState<{
    orderId: string;
    amount: number;
    paymentMode?: string;
    utr: string;
    paidAt: string;
  } | null>(null);

  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(STUDIO_PAYMENT_CONFIG.upiId)}&pn=${encodeURIComponent(STUDIO_PAYMENT_CONFIG.bankDetails.accountName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Aman Visual Retainer Test')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(STUDIO_PAYMENT_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const copyCurrentLink = () => {
    navigator.clipboard.writeText(window.location.href.split('?')[0]);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!utrNumber.trim()) {
      setErrorMessage('Please enter the 12-digit UTR or Bank Transaction Reference Number from your payment app.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: cleanPhone,
          serviceTitle: `Direct Retainer Verification (₹${amount})`,
          advanceAmount: amount,
          totalEstimate: amount,
          bankReference: utrNumber.trim(),
          paymentMode: 'Direct Kotak UPI',
          eventDate: new Date().toISOString().split('T')[0],
          eventVenue: 'Studio Direct Booking'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit verification.');
      }

      setConfirmedPayment({
        orderId: data.booking?.id || `AV-BK-${Date.now().toString(36).toUpperCase()}`,
        amount,
        paymentMode: 'Kotak Mahindra Bank UPI',
        utr: utrNumber.trim(),
        paidAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Unable to submit payment details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-32 pb-20 max-w-xl">
        {/* Navigation Breadcrumb & Share */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <Breadcrumbs variant="inline" />

          <button
            type="button"
            onClick={copyCurrentLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Copy direct payment link to clipboard"
          >
            {copiedLink ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Share Payment Link</span>
              </>
            )}
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-[#111111] border border-white/15 rounded-xl shadow-2xl overflow-hidden relative">
          {/* Top Decorative Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CreditCard size={20} />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Aman Visual Studio</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Kotak Bank UPI
                  </span>
                </h1>
                <p className="text-xs text-white/50 font-light">
                  Official Retainer & Advance Portal
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono tracking-wider text-white/40">Amount</div>
              <div className="text-2xl font-display font-bold text-emerald-400">
                ₹{amount}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {!confirmedPayment ? (
              <form onSubmit={handleSubmitBooking} className="space-y-5">
                {/* Official Bank Banner */}
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3 text-xs text-white/90">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Direct Official Retainer:</span> Payments credit instantly to Kotak Mahindra Bank under beneficiary <strong>{STUDIO_PAYMENT_CONFIG.bankDetails.accountName}</strong>.
                  </div>
                </div>

                {/* QR Code & UPI Details */}
                <div className="bg-black/60 border border-white/10 p-5 rounded-lg text-center space-y-4">
                  <div className="inline-block p-2 bg-white rounded-lg shadow-xl">
                    <img 
                      src={qrCodeUrl} 
                      alt="Kotak Bank UPI QR" 
                      className="w-40 h-40 object-contain mx-auto"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {STUDIO_PAYMENT_CONFIG.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/70 text-left bg-black/40 p-2.5 rounded border border-white/5">
                    <div>Bank: <span className="text-white font-bold">{STUDIO_PAYMENT_CONFIG.bankDetails.bankName}</span></div>
                    <div>IFSC: <span className="text-white font-bold">{STUDIO_PAYMENT_CONFIG.bankDetails.ifscCode}</span></div>
                    <div>Account: <span className="text-white font-bold">{STUDIO_PAYMENT_CONFIG.bankDetails.accountNumber}</span></div>
                    <div>A/C Name: <span className="text-white font-bold">{STUDIO_PAYMENT_CONFIG.bankDetails.accountName}</span></div>
                  </div>

                  <a
                    href={upiIntentUrl}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    <span>Pay ₹{amount} via UPI App (GPay/PhonePe/Paytm)</span>
                  </a>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Customer Details */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-white/60 mb-1">
                      Customer / Payer Name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-md py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="e.g. Aman Sharma"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-white/60 mb-1">
                        Phone (UPI / WhatsApp)
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-black/60 border border-white/20 rounded-md py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-white/60 mb-1">
                        Email (Receipt Delivery)
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/20 rounded-md py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="client@gmail.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-white/60 mb-1">
                      Bank UTR / Transaction Reference Number
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="12-digit UPI reference number from your receipt"
                      className="w-full bg-black/60 border border-white/20 rounded-md py-2.5 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-sm uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        <span>Confirm Retainer Payment (₹{amount})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Receipt */
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                    Retainer Submitted!
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Your direct payment details have been logged and submitted for instant verification.
                  </p>
                </div>

                <div className="bg-black/60 border border-white/15 rounded-lg p-5 text-left text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Amount:</span>
                    <span className="text-emerald-400 font-bold text-sm">₹{confirmedPayment.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Booking Ref:</span>
                    <span className="text-white select-all">{confirmedPayment.orderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">UTR Number:</span>
                    <span className="text-white select-all">{confirmedPayment.utr}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Payment Method:</span>
                    <span className="text-white">{confirmedPayment.paymentMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Timestamp:</span>
                    <span className="text-white">{confirmedPayment.paidAt}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/918827474622?text=${encodeURIComponent(
                      `Hello Aman Visual Team,\n\nI have completed the test payment of ₹${confirmedPayment.amount}.\nBooking Ref: ${confirmedPayment.orderId}\nUTR: ${confirmedPayment.utr}\n\nPlease confirm the receipt. Thank you!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <span>Send WhatsApp Confirmation</span>
                  </a>

                  <Link
                    to="/pricing"
                    className="w-full py-2.5 px-4 border border-white/20 hover:border-white text-white text-xs font-semibold uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Return to Studio Pricing</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share Hint */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/50">
            Need to test from another phone or share with your team?
          </p>
          <button
            onClick={copyCurrentLink}
            className="mt-2 text-xs font-mono text-emerald-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy direct link to this ₹100 payment page</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
