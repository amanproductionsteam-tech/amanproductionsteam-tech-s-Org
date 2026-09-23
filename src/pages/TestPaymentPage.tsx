/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  QrCode,
  Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export default function TestPaymentPage() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('order_id');

  const [customerName, setCustomerName] = useState('Aman Visual Client');
  const [customerPhone, setCustomerPhone] = useState('8827474622');
  const [customerEmail, setCustomerEmail] = useState('amanproductionsteam@gmail.com');
  const [amount, setAmount] = useState(100);

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<'_modal' | '_self'>('_modal');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [gatewayConfigured, setGatewayConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/cashfree/config')
      .then(res => res.json())
      .then(d => {
        if (d && d.success) {
          setGatewayConfigured(Boolean(d.isConfigured));
        }
      })
      .catch(() => {});
  }, []);

  // Success receipt state
  const [confirmedPayment, setConfirmedPayment] = useState<{
    orderId: string;
    amount: number;
    paymentMode?: string;
    referenceId?: string;
    paidAt: string;
  } | null>(null);

  // Verify on return URL if order_id is in query string
  useEffect(() => {
    if (initialOrderId) {
      verifyExistingOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const verifyExistingOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cashfree/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (data.success || data.status === 'PAID') {
        setConfirmedPayment({
          orderId,
          amount: data.amount || 100,
          paymentMode: data.paymentMode || 'Cashfree Production UPI/Card',
          referenceId: data.cfPaymentId,
          paidAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      console.error('Auto verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePay = async (target: '_modal' | '_self' = '_modal') => {
    setErrorMessage(null);
    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number for Cashfree verification.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create order on server
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail.trim(),
          serviceTitle: `Cashfree Production Live Gateway Test (₹${amount})`,
          eventVenue: 'Live Payment Verification',
          returnUrl: `${window.location.origin}/pay-test?order_id={order_id}&status=success`
        })
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Payment gateway response could not be parsed. Please try again.');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize payment session with Cashfree.');
      }

      const { orderId, paymentSessionId, mode } = data;

      // 2. Launch Cashfree JS SDK checkout
      if (window.Cashfree && paymentSessionId) {
        const cashfree = window.Cashfree({ mode: mode === 'production' ? 'production' : 'sandbox' });

        if (target === '_self') {
          // Direct full page redirect
          cashfree.checkout({
            paymentSessionId,
            redirectTarget: '_self'
          });
          return;
        }

        // Modal popup checkout
        const result = await cashfree.checkout({
          paymentSessionId,
          redirectTarget: '_modal'
        });

        if (result?.error) {
          throw new Error(result.error.message || 'Payment was cancelled or closed.');
        }

        // 3. Verify order with server
        const verifyRes = await fetch('/api/cashfree/verify-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentMode: 'Cashfree Production'
          })
        });

        const verifyText = await verifyRes.text();
        const verifyData = verifyText ? JSON.parse(verifyText) : {};

        setConfirmedPayment({
          orderId,
          amount,
          paymentMode: verifyData.paymentMode || 'Cashfree Production Gateway',
          paidAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        throw new Error('Cashfree SDK is initializing. Please refresh or try again.');
      }
    } catch (err: any) {
      console.error('Payment execution error:', err);
      setErrorMessage(err.message || 'Unable to open Cashfree payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCurrentLink = () => {
    navigator.clipboard.writeText(window.location.href.split('?')[0]);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
                  {gatewayConfigured === false ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Gateway Awaiting Configuration
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Production
                    </span>
                  )}
                </h1>
                <p className="text-xs text-white/50 font-light">
                  Cashfree Payments • Official Gateway Checkout
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
              <form onSubmit={(e) => { e.preventDefault(); handlePay(checkoutMode); }} className="space-y-5">
                {/* Notice Banner */}
                {gatewayConfigured === false ? (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3 text-xs text-amber-200">
                    <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">Gateway Status: Not Configured.</span> Cashfree production API credentials must be configured in environment variables (CASHFREE_APP_ID, CASHFREE_SECRET_KEY).
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-lg flex items-start gap-3 text-xs text-white/80">
                    <Lock size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Live Payment Verification:</span> This link processes a real ₹{amount} INR advance transaction directly through Cashfree Production into your merchant account.
                    </div>
                  </div>
                )}

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
                        Phone (UPI / SMS)
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
                        Email (Receipt)
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
                </div>

                {/* Payment Methods Supported */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
                    <span>Supported Payment Channels:</span>
                    <span className="text-emerald-400 font-mono">Zero Platform Fee</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-white/70">
                    <span className="px-2.5 py-1 bg-black/40 border border-white/10 rounded">GPay / PhonePe / Paytm</span>
                    <span className="px-2.5 py-1 bg-black/40 border border-white/10 rounded">UPI QR</span>
                    <span className="px-2.5 py-1 bg-black/40 border border-white/10 rounded">Cards (Visa/Mastercard)</span>
                    <span className="px-2.5 py-1 bg-black/40 border border-white/10 rounded">NetBanking</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => { setCheckoutMode('_modal'); handlePay('_modal'); }}
                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-sm uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={17} />
                        <span>Pay ₹{amount} (Instant Modal)</span>
                      </>
                    )}
                  </button>

                  {gatewayConfigured !== false && (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => { setCheckoutMode('_self'); handlePay('_self'); }}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      title="Recommended if opening from a mobile browser to directly open UPI apps"
                    >
                      <ExternalLink size={14} className="text-white/60" />
                      <span>Pay ₹{amount} via Full Page Redirect (Best for Mobile UPI)</span>
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-white/40 tracking-wider">
                    Secured by Cashfree 256-bit SSL encryption. Funds settle to Aman Visual.
                  </p>
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
                    Payment Successful!
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Your advance payment has been confirmed by Cashfree.
                  </p>
                </div>

                <div className="bg-black/60 border border-white/15 rounded-lg p-5 text-left text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Amount Paid:</span>
                    <span className="text-emerald-400 font-bold text-sm">₹{confirmedPayment.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Order ID:</span>
                    <span className="text-white select-all">{confirmedPayment.orderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Payment Gateway:</span>
                    <span className="text-white">Cashfree Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Timestamp:</span>
                    <span className="text-white">{confirmedPayment.paidAt}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/918827474622?text=${encodeURIComponent(
                      `Hello Aman Visual Team,\n\nI have completed the test payment of ₹${confirmedPayment.amount}.\nOrder ID: ${confirmedPayment.orderId}\n\nPlease confirm the receipt. Thank you!`
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
