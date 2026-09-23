import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Clock,
  Download,
  Share2,
  QrCode,
  RefreshCw,
  FileCheck,
  Building2,
  Check,
  Upload,
  Trash2,
  MessageCircle,
  ImageIcon,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCashfreePaymentLink } from '../config/payment';

// Extend window for Cashfree v3 JS SDK
declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_modal' | '_blank';
      }) => Promise<{
        error?: { message: string; code?: string };
        paymentDetails?: { paymentMessage?: string };
      }>;
    };
  }
}

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

export interface CashfreeVerifiedReceipt {
  receiptNumber: string;
  cfPaymentId: string;
  utr: string;
  paidAt: string;
  paymentMode: string;
  orderId: string;
  amount: number;
  customerName: string;
  serviceTitle: string;
  eventDate?: string;
  eventVenue?: string;
}

interface CashfreeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingItemDetails;
  onSuccess?: (orderId: string) => void;
}

type ModalStep = 'details' | 'awaiting_receipt' | 'receipt_confirmed' | 'pending_verification';

export default function CashfreeBookingModal({
  isOpen,
  onClose,
  bookingDetails,
  onSuccess
}: CashfreeBookingModalProps) {
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

  // Status & Transaction State
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingReceipt, setIsVerifyingReceipt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activePaymentSessionId, setActivePaymentSessionId] = useState<string | null>(null);
  const [activePaymentSessionMode, setActivePaymentSessionMode] = useState<string>('production');
  const [gatewayMode, setGatewayMode] = useState<'production' | 'sandbox'>('production');
  const [manualUtr, setManualUtr] = useState('');
  const [showManualUtrInput, setShowManualUtrInput] = useState(false);
  const [showDirectUpiQr, setShowDirectUpiQr] = useState(false);

  // In-memory payment proof screenshot state (browser memory only, never uploaded to server/storage)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [customReportedAmount, setCustomReportedAmount] = useState<string>('');
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct Cashfree payment link (if configured by studio) and gateway status
  const [directPaymentLink, setDirectPaymentLink] = useState<string>(() => getCashfreePaymentLink());
  const [gatewayConfigured, setGatewayConfigured] = useState<boolean | null>(null);
  const [pendingDirectBooking, setPendingDirectBooking] = useState<{
    id: string;
    amount: number;
    customerName: string;
    serviceTitle: string;
    status: string;
    createdAt: string;
    utr?: string;
  } | null>(null);
  const [isSubmittingDirectUpi, setIsSubmittingDirectUpi] = useState(false);

  useEffect(() => {
    const updateLink = () => {
      setDirectPaymentLink(getCashfreePaymentLink());
    };
    updateLink();
    window.addEventListener('cashfree_link_updated', updateLink);
    fetch('/api/cashfree/config')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          if (d.directPaymentLink && !d.directPaymentLink.includes('yb26am38h5e0')) {
            setDirectPaymentLink(d.directPaymentLink);
          } else {
            setDirectPaymentLink('');
          }
          setGatewayConfigured(Boolean(d.isConfigured));
          if (d.mode) {
            setGatewayMode(d.mode === 'production' ? 'production' : 'sandbox');
            setActivePaymentSessionMode(d.mode);
          }
        }
      })
      .catch(() => {});
    return () => {
      window.removeEventListener('cashfree_link_updated', updateLink);
    };
  }, []);

  const handleCopyText = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Revoke preview URL when replaced or unmounted
  useEffect(() => {
    return () => {
      if (screenshotPreviewUrl) {
        URL.revokeObjectURL(screenshotPreviewUrl);
      }
    };
  }, [screenshotPreviewUrl]);

  // Check Web Share API file-sharing capability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'canShare' in navigator && screenshotFile) {
      try {
        const canShare = navigator.canShare({ files: [screenshotFile] });
        setCanShareFiles(Boolean(canShare));
      } catch {
        setCanShareFiles(false);
      }
    } else {
      setCanShareFiles(false);
    }
  }, [screenshotFile]);

  // Confirmed Cashfree Receipt
  const [confirmedReceipt, setConfirmedReceipt] = useState<CashfreeVerifiedReceipt | null>(null);

  // Reset or initialize state on open
  useEffect(() => {
    if (isOpen) {
      if (bookingDetails.eventDate) setEventDate(bookingDetails.eventDate);
      if (bookingDetails.eventVenue) setEventVenue(bookingDetails.eventVenue);
      if (bookingDetails.initialAdvanceType) setAdvanceType(bookingDetails.initialAdvanceType);
      // Reset errors
      setErrorMessage(null);
    } else {
      // Clean up when modal closes
      setCurrentStep('details');
      setActiveOrderId(null);
      setConfirmedReceipt(null);
      setIsLoading(false);
      setIsVerifyingReceipt(false);
      setShowManualUtrInput(false);
      setShowDirectUpiQr(false);
      
      // Clean up screenshot in-memory preview
      if (screenshotPreviewUrl) {
        URL.revokeObjectURL(screenshotPreviewUrl);
      }
      setScreenshotFile(null);
      setScreenshotPreviewUrl(null);
      setScreenshotError(null);
      setCustomReportedAmount('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, bookingDetails, screenshotPreviewUrl]);

  // Screenshot handling logic
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

    // Clean up previous preview URL
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // WhatsApp Message Preparation with customizable paid amount
  const effectivePaidAmount = customReportedAmount.trim() !== ''
    ? customReportedAmount.trim()
    : currentAdvance.toLocaleString('en-IN');

  const customerNameForMsg = clientName.trim() || 'Customer';
  const serviceForMsg = bookingDetails.serviceTitle;
  const dateForMsg = eventDate.trim() || 'To be scheduled';

  const upiProofWhatsAppMessage = `Hello Aman Visual, I have made a direct UPI payment.
Name: ${customerNameForMsg}
Service: ${serviceForMsg}
Amount I paid: ₹${effectivePaidAmount}
Shoot date: ${dateForMsg}
Please verify my payment. I am sharing the payment screenshot.`;

  const upiProofWhatsAppUrl = `https://wa.me/918827474622?text=${encodeURIComponent(upiProofWhatsAppMessage)}`;

  // Web Share API Handler
  const handleShareScreenshot = async () => {
    if (!screenshotFile || !canShareFiles) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Aman Visual Payment Screenshot',
          text: upiProofWhatsAppMessage,
          files: [screenshotFile]
        });
      }
    } catch (err: unknown) {
      // Retain screenshot & form details on cancellation
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('Share screenshot action was not completed:', err);
      }
    }
  };

  // Open Cashfree Checkout (modal mode)
  const handleOpenCashfreeCheckout = async (sessionId?: string, sessionMode?: string) => {
    const targetSessionId = sessionId || activePaymentSessionId;
    if (!targetSessionId) return;

    const effMode = (sessionMode || activePaymentSessionMode || gatewayMode || 'production') === 'sandbox' ? 'sandbox' : 'production';

    if (window.Cashfree) {
      try {
        const cashfree = window.Cashfree({ mode: effMode });
        const result = await cashfree.checkout({
          paymentSessionId: targetSessionId,
          redirectTarget: '_modal'
        });

        if (result?.error) {
          console.warn('Cashfree checkout modal notice:', result.error);
        } else {
          await verifyCashfreeReceipt(activeOrderId || undefined, 'Cashfree PG Checkout');
        }
      } catch (cfErr) {
        console.warn('Cashfree checkout modal/window error:', cfErr);
      }
    }
  };

  // Step 1: Initiate Cashfree Payment Order
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number for verification.');
      return;
    }

    setIsLoading(true);

    const safeOrigin =
      typeof window !== 'undefined' &&
      window.location.origin &&
      window.location.origin !== 'null' &&
      window.location.origin.startsWith('http')
        ? window.location.origin
        : 'https://amanvisual.in';

    try {
      const createRes = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAdvance,
          customerName: clientName.trim(),
          customerEmail: clientEmail.trim(),
          customerPhone: cleanPhone,
          serviceTitle: `${bookingDetails.serviceTitle} (${advanceType === 'standard' ? '50% Retainer' : advanceType === 'token' ? 'Token Retainer' : 'Full Payment'})`,
          eventDate,
          eventVenue,
          customNotes,
          returnUrl: `${safeOrigin}/pricing?order_id={order_id}&status=success`
        })
      });

      let orderData: any = {};
      try {
        const responseText = await createRes.text();
        orderData = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        console.warn('Non-JSON response received from order initiation:', parseErr);
      }

      if (createRes.ok && orderData.success && orderData.orderId) {
        const { orderId, paymentSessionId, mode } = orderData;
        setActiveOrderId(orderId);
        setActivePaymentSessionId(paymentSessionId);
        if (mode) setActivePaymentSessionMode(mode);

        // Move to awaiting receipt screen
        setCurrentStep('awaiting_receipt');
        setIsLoading(false);

        // If Cashfree JS SDK session exists, launch checkout
        if (paymentSessionId) {
          handleOpenCashfreeCheckout(paymentSessionId, mode || 'production');
        }
        return;
      }

      setErrorMessage(orderData?.error || 'Could not start secure checkout. If online gateway is unavailable, you can pay directly via Kotak Bank UPI QR below.');
      setIsLoading(false);
    } catch (err: any) {
      console.warn('Cashfree checkout failed:', err);
      setErrorMessage('Could not connect to the payment gateway. Please try again or pay directly via Kotak Bank UPI QR below.');
      setIsLoading(false);
    }
  };

  // Direct Kotak Bank UPI / QR manual booking submission
  const handleDirectUpiSubmit = async () => {
    setErrorMessage(null);
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    if (!clientName.trim()) {
      setErrorMessage('Please enter your full name in the form above before submitting.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp / phone number.');
      return;
    }

    setIsSubmittingDirectUpi(true);
    try {
      const rawAmt = Number(effectivePaidAmount.replace(/[^0-9]/g, '')) || currentAdvance;
      const res = await fetch('/api/cashfree/direct-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: rawAmt,
          customerName: clientName.trim(),
          customerEmail: clientEmail.trim(),
          customerPhone: cleanPhone,
          serviceTitle: `${bookingDetails.serviceTitle} (${advanceType === 'standard' ? '50% Retainer' : advanceType === 'token' ? 'Token Retainer' : 'Full Payment'})`,
          eventDate,
          eventVenue,
          customNotes,
          utr: manualUtr.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit direct UPI payment for verification.');
      }

      setPendingDirectBooking(data.booking);
      setCurrentStep('pending_verification');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not record direct UPI payment. Please retry or contact Aman Visual directly.');
    } finally {
      setIsSubmittingDirectUpi(false);
    }
  };

  // Step 2: Verify Cashfree Receipt
  const verifyCashfreeReceipt = async (orderIdToVerify?: string, mode?: string) => {
    const targetOrderId = orderIdToVerify || activeOrderId;
    if (!targetOrderId) {
      setErrorMessage('No active Cashfree Order ID found to verify.');
      return;
    }

    setIsVerifyingReceipt(true);
    setErrorMessage(null);

    try {
      const verifyRes = await fetch('/api/cashfree/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: targetOrderId,
          paymentMode: mode || 'Cashfree Verified Payment'
        })
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success && verifyData.status === 'PAID' && verifyData.receipt) {
        // RECEIPT RECEIVED FROM CASHFREE
        const receiptData: CashfreeVerifiedReceipt = {
          receiptNumber: verifyData.receipt.receiptNumber,
          cfPaymentId: verifyData.receipt.cfPaymentId,
          utr: verifyData.receipt.utr || '',
          paidAt: verifyData.receipt.paidAt,
          paymentMode: verifyData.receipt.paymentMode || 'Cashfree Gateway (UPI / QR)',
          orderId: targetOrderId,
          amount: verifyData.receipt.amount,
          customerName: verifyData.receipt.customerName,
          serviceTitle: bookingDetails.serviceTitle,
          eventDate,
          eventVenue
        };

        setConfirmedReceipt(receiptData);
        setCurrentStep('receipt_confirmed');

        if (onSuccess) {
          onSuccess(targetOrderId);
        }
      } else {
        setErrorMessage(
          verifyData.message || 
          'Payment receipt has not yet been confirmed by Cashfree. Please complete the transaction in your UPI app or enter your UTR reference.'
        );
      }
    } catch (verErr: any) {
      console.error('Receipt verification error:', verErr);
      setErrorMessage('Could not connect to Cashfree receipt verification service. Please retry in a few seconds.');
    } finally {
      setIsVerifyingReceipt(false);
    }
  };

  // Step 3 Actions: WhatsApp Voucher Share
  const handleWhatsAppConfirmation = () => {
    if (!confirmedReceipt) return;
    const text = `Hello Aman Visual! I have just booked and received my official Cashfree payment receipt.\n\n` +
      `🧾 *Cashfree Receipt #:* ${confirmedReceipt.receiptNumber}\n` +
      `📋 *Order ID:* ${confirmedReceipt.orderId}\n` +
      `💳 *UTR / Ref:* ${confirmedReceipt.utr}\n` +
      `🎬 *Service:* ${bookingDetails.serviceTitle}\n` +
      `💰 *Advance Paid:* ₹${confirmedReceipt.amount.toLocaleString('en-IN')}\n` +
      `📅 *Date:* ${eventDate || 'Scheduled with client'}\n` +
      `📍 *Venue:* ${eventVenue || 'Mumbai'}\n` +
      `👤 *Client:* ${clientName} (${clientPhone})\n\n` +
      `Please confirm the crew slot. Thank you!`;

    window.open(`https://wa.me/918827474622?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Step 3 Actions: Printable / PDF Official Cashfree Tax Receipt
  const handlePrintReceipt = () => {
    if (!confirmedReceipt) return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Cashfree Receipt - ${confirmedReceipt.receiptNumber} - Aman Visual Studio</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111; background: #fff; line-height: 1.5; font-size: 13px; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand { font-size: 22px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
            .brand span { color: #10b981; }
            .badge { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; margin-top: 8px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 28px 0; }
            .meta-block h4 { text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; color: #64748b; margin: 0 0 6px 0; }
            .meta-block p { margin: 2px 0; font-weight: 600; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            th { text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; color: #475569; }
            td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
            .total-row td { font-weight: 700; border-top: 2px solid #0f172a; font-size: 14px; }
            .stamp { border: 2px dashed #10b981; color: #047857; padding: 8px 14px; border-radius: 6px; display: inline-block; font-weight: 800; font-size: 11px; text-transform: uppercase; margin-top: 20px; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Aman Visual <span>Studio</span></div>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Cinema Production • Photography • Mumbai, India</p>
              <div class="badge">✓ Verified Cashfree Payment Receipt</div>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">TAX INVOICE & RETAINER VOUCHER</p>
              <p style="margin: 3px 0; color: #64748b;">Receipt #: <strong>${confirmedReceipt.receiptNumber}</strong></p>
              <p style="margin: 3px 0; color: #64748b;">Date: ${new Date(confirmedReceipt.paidAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-block">
              <h4>Billed To (Client)</h4>
              <p style="font-size: 15px;">${confirmedReceipt.customerName || 'Valued Client'}</p>
              <p>Phone: +91 ${clientPhone}</p>
              ${clientEmail ? `<p>Email: ${clientEmail}</p>` : ''}
              ${eventVenue ? `<p>Venue: ${eventVenue}</p>` : ''}
              ${eventDate ? `<p>Scheduled Shoot Date: ${eventDate}</p>` : ''}
            </div>
            <div class="meta-block">
              <h4>Payment Gateway Audit</h4>
              <p>Gateway: <strong>Cashfree Payments India Pvt. Ltd.</strong></p>
              <p>Order ID: <code>${confirmedReceipt.orderId}</code></p>
              <p>Payment ID: <code>${confirmedReceipt.cfPaymentId}</code></p>
              <p>Bank Reference / UTR: <code>${confirmedReceipt.utr}</code></p>
              <p>Payment Channel: ${confirmedReceipt.paymentMode}</p>
              <p>Status: <strong style="color: #047857;">PAID & ALLOCATED</strong></p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Description</th>
                <th style="text-align: right;">Total Package</th>
                <th style="text-align: right;">Advance Paid (Retainer)</th>
                <th style="text-align: right;">Balance Due on Shoot</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${confirmedReceipt.serviceTitle}</strong><br>
                  <span style="font-size: 11px; color: #64748b;">Cinema rig crew booking, 4K Sony Alpha equipment allocation, and shoot schedule locking.</span>
                </td>
                <td style="text-align: right;">₹${total.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-weight: 700; color: #047857;">₹${confirmedReceipt.amount.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-weight: 600;">₹${remainingBalance.toLocaleString('en-IN')}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" style="text-align: right;">Total Amount Received via Cashfree:</td>
                <td style="text-align: right; color: #047857;">₹${confirmedReceipt.amount.toLocaleString('en-IN')}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div class="stamp">✓ Cashfree Digital Payment Verified</div>
              <p style="font-size: 10px; color: #64748b; margin-top: 6px;">Authorized Studio Booking Confirmation • 256-Bit Encrypted</p>
            </div>
            <div style="text-align: right; font-size: 12px;">
              <p style="margin: 0; color: #64748b;">Authorized Signatory</p>
              <p style="margin: 4px 0 0 0; font-weight: 800; letter-spacing: 1px;">AMAN PRODUCTION STUDIO</p>
            </div>
          </div>

          <div class="footer">
            <p>Aman Visual Studio • Mumbai, India • Contact: +91 88274 74622 • Email: amanproductionsteam@gmail.com</p>
            <p>Thank you for choosing Aman Visual. This document serves as legal proof of booking advance payment.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-[#111111] border border-white/15 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl my-8 relative text-left"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold uppercase text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
                  <span>Secure Booking Checkout</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border ${
                    currentStep === 'receipt_confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : currentStep === 'awaiting_receipt'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-white/10 text-white/70 border-white/20'
                  }`}>
                    {currentStep === 'receipt_confirmed' 
                      ? 'Receipt Confirmed' 
                      : currentStep === 'awaiting_receipt' 
                        ? 'Awaiting Receipt' 
                        : 'Booking Details'}
                  </span>
                </h3>
                <p className="text-[11px] text-white/50 tracking-wide">
                  Aman Visual Studio • Mumbai, India
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content (Targeted Container) */}
          <div className="p-6">
            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-red-200 leading-relaxed">{errorMessage}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDirectUpiQr(true);
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <QrCode size={12} />
                      <span>Pay via Kotak Bank UPI QR instead</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/15 text-white/70 hover:text-white rounded text-[11px] cursor-pointer transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Client Information & Retainer Selection */}
            {currentStep === 'details' && (
              <>
                {/* Booking Service Summary Card */}
                <div className="p-4 bg-white/5 border border-white/10 rounded mb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                        Selected Service
                      </span>
                      <h4 className="font-display font-bold text-white text-base mt-0.5">
                        {bookingDetails.serviceTitle}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                        Est. Total
                      </span>
                      <div className="text-white font-bold text-sm">
                        ₹{total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                {/* Advance Retainer Selector */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-2 font-semibold">
                    Select Booking Advance to Pay Today:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdvanceType('standard')}
                      className={`p-2 rounded text-left border transition-all cursor-pointer ${
                        advanceType === 'standard'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                          : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono">50% Retainer</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">
                        ₹{standardHalfAdvance.toLocaleString('en-IN')}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdvanceType('token')}
                      className={`p-2 rounded text-left border transition-all cursor-pointer ${
                        advanceType === 'token'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                          : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono">Token Hold</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">
                        ₹{Math.min(5000, standardHalfAdvance).toLocaleString('en-IN')}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdvanceType('full')}
                      className={`p-2 rounded text-left border transition-all cursor-pointer ${
                        advanceType === 'full'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                          : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono">100% Full</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">
                        ₹{total.toLocaleString('en-IN')}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-white/60">Balance Due on Shoot Day:</span>
                  <span className="text-white font-mono font-medium">₹{remainingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Cashfree Gateway Notice if unconfigured */}
              {gatewayConfigured === false && (
                <div className="mb-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-amber-300 block">Cashfree Payment Gateway</span>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Cashfree online cards & netbanking is currently undergoing scheduled maintenance. You can complete your advance booking directly using the Kotak Mahindra Bank UPI QR below.
                    </p>
                  </div>
                </div>
              )}

              {/* Client Booking Form */}
                <form onSubmit={handleInitiatePayment} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-semibold">
                      Client Full Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Khanna"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-semibold">
                        WhatsApp / Phone *
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="tel"
                          required
                          placeholder="10-digit number"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-semibold">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="email"
                          placeholder="client@gmail.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-semibold">
                        Shoot Date
                      </label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-semibold">
                        Venue / Location
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder="e.g. Andheri West, Mumbai"
                          value={eventVenue}
                          onChange={(e) => setEventVenue(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cashfree Payment Badges */}
                  <div className="p-3 bg-black/40 border border-white/10 rounded flex items-center justify-between gap-2 flex-wrap text-[10px] text-white/50">
                    <div className="flex items-center gap-1.5 text-white/80">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>Cashfree 256-Bit SSL Encrypted</span>
                    </div>
                    <div className="font-mono text-[10px] text-white/40">
                      UPI • GPay • PhonePe • Cards • NetBanking
                    </div>
                  </div>

                  {/* Payment Actions */}
                  <div className="space-y-2 pt-1">
                    {/* Pay via Debit / Credit Card Button */}
                    <button
                      id="cashfree-debit-credit-pay-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_22px_rgba(16,185,129,0.35)] hover:shadow-[0_0_32px_rgba(16,185,129,0.55)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span className="text-black font-bold">Connecting to Cashfree Gateway...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} className="text-black shrink-0" />
                          <span className="text-black font-extrabold tracking-wider">Pay Advance via Cashfree</span>
                          <ArrowRight size={15} className="text-black shrink-0" />
                        </>
                      )}
                    </button>

                    {/* Direct Cashfree Payment Gateway Page Link Button (if configured) */}
                    {directPaymentLink && (
                      <a
                        href={directPaymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded transition-all border border-emerald-500/40 flex items-center justify-center gap-2 cursor-pointer text-center"
                      >
                        <ExternalLink size={14} />
                        <span>Open Cashfree Payment Gateway Page</span>
                      </a>
                    )}

                    {/* Direct bank UPI QR — manually verified after bank credit */}
                    <button
                      type="button"
                      onClick={() => setShowDirectUpiQr((shown) => !shown)}
                      aria-expanded={showDirectUpiQr}
                      aria-controls="direct-upi-qr"
                      className="w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded transition-all border border-emerald-500/35 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCode size={15} />
                      <span>{showDirectUpiQr ? 'Hide Direct UPI QR' : 'Pay Directly via UPI QR'}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {showDirectUpiQr && (
                        <motion.div
                          id="direct-upi-qr"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 rounded-lg border border-emerald-500/30 bg-black/60 p-4">
                            {/* QR Code and Bank Details Beside QR */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                              {/* Left: Complete Unclipped QR display */}
                              <div className="flex flex-col items-center justify-center p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                                <div className="w-full max-w-[210px] overflow-hidden rounded-md border border-white/15 bg-white p-2 shadow-md">
                                  <img
                                    src="/aman-visual-upi-qr.jpeg"
                                    alt="Aman Visual direct bank UPI payment QR code"
                                    className="aspect-square w-full object-contain"
                                    loading="lazy"
                                  />
                                </div>
                                <p className="text-xs font-bold text-white mt-2">
                                  Scan with any UPI app
                                </p>
                                <p className="mt-0.5 text-xs font-mono text-emerald-300 font-semibold">
                                  Amount: ₹{currentAdvance.toLocaleString('en-IN')}
                                </p>
                              </div>

                              {/* Right: Bank Details Beside QR */}
                              <div className="p-3.5 bg-black/70 rounded-lg border border-emerald-500/30 space-y-2.5 text-left">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <Building2 size={14} className="text-emerald-400 shrink-0" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-white">Bank Details</span>
                                  </div>
                                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded font-semibold">
                                    Kotak Mahindra
                                  </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                  {/* Banking Name */}
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-white/50">Banking Name:</span>
                                    <span className="font-bold text-emerald-400">Aman Tiwari</span>
                                  </div>

                                  {/* Bank Name */}
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-white/50">Bank:</span>
                                    <span className="font-semibold text-white">Kotak Mahindra bank</span>
                                  </div>

                                  {/* 1️⃣ A/c No. */}
                                  <div className="flex items-center justify-between bg-white/5 px-2 py-1.5 rounded border border-white/10">
                                    <div>
                                      <span className="text-white/50 text-[10px] block font-mono">1️⃣ A/c No.:</span>
                                      <span className="font-mono font-bold text-white text-xs tracking-wider">1645939816</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText('1645939816', 'ac')}
                                      className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Copy Account Number"
                                    >
                                      {copiedField === 'ac' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                      <span>{copiedField === 'ac' ? 'Copied' : 'Copy'}</span>
                                    </button>
                                  </div>

                                  {/* 2️⃣ IFSC Code */}
                                  <div className="flex items-center justify-between bg-white/5 px-2 py-1.5 rounded border border-white/10">
                                    <div>
                                      <span className="text-white/50 text-[10px] block font-mono">2️⃣ IFSC Code:</span>
                                      <span className="font-mono font-bold text-emerald-300 text-xs tracking-wider">KKBK0000133</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText('KKBK0000133', 'ifsc')}
                                      className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Copy IFSC Code"
                                    >
                                      {copiedField === 'ifsc' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                      <span>{copiedField === 'ifsc' ? 'Copied' : 'Copy'}</span>
                                    </button>
                                  </div>

                                  {/* UPI Number */}
                                  <div className="flex items-center justify-between bg-white/5 px-2 py-1.5 rounded border border-white/10">
                                    <div>
                                      <span className="text-white/50 text-[10px] block font-mono">UPI NUMBER:</span>
                                      <span className="font-mono font-bold text-white text-xs tracking-wider">8827474622</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText('8827474622', 'upi')}
                                      className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Copy UPI Number"
                                    >
                                      {copiedField === 'upi' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                      <span>{copiedField === 'upi' ? 'Copied' : 'Copy'}</span>
                                    </button>
                                  </div>

                                  {/* 3️⃣ Home Branch */}
                                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                                    <span className="text-white/50">3️⃣ Home Branch:</span>
                                    <span className="font-semibold text-white/90 font-mono">BILASPUR</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <p className="mx-auto mt-3 max-w-lg text-[10px] text-center leading-relaxed text-white/45">
                              Payment goes directly to the linked bank account. No transaction code is required here. Booking confirmation follows after the bank credit is manually verified by Aman Visual.
                            </p>

                            {/* Already paid? Share your payment screenshot section */}
                            <div className="mt-5 pt-4 border-t border-white/10 text-left space-y-3">
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                  <span>Already paid? Share your payment screenshot.</span>
                                </h4>
                                <p className="text-[11px] text-white/50 mt-0.5">
                                  Upload your transaction proof to share it with Aman Visual for manual verification.
                                </p>
                              </div>

                              {/* Upload Payment Screenshot Control (Optional) */}
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                                className="hidden"
                                id="payment-screenshot-upload"
                              />

                              {!screenshotPreviewUrl ? (
                                <div
                                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                  onDragLeave={() => setIsDragging(false)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleScreenshotSelect(file);
                                  }}
                                  onClick={() => fileInputRef.current?.click()}
                                  className={`border border-dashed rounded p-3 sm:p-4 text-center cursor-pointer transition-all ${
                                    isDragging
                                      ? 'border-emerald-400 bg-emerald-500/10'
                                      : 'border-white/20 hover:border-emerald-400/60 bg-white/[0.03] hover:bg-white/[0.07]'
                                  }`}
                                >
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 mb-0.5">
                                      <Upload size={15} />
                                    </div>
                                    <span className="text-xs font-semibold text-white">
                                      Upload Payment Screenshot (Optional)
                                    </span>
                                    <span className="text-[10px] text-white/45">
                                      JPG, PNG, or WebP • Max 5 MB
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-black/60 border border-white/15 rounded p-3 space-y-2.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded overflow-hidden border border-white/20 shrink-0 bg-[#121212] flex items-center justify-center">
                                      <img
                                        src={screenshotPreviewUrl}
                                        alt="Payment screenshot preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-white truncate">
                                        {screenshotFile?.name}
                                      </p>
                                      <p className="text-[10px] text-white/50 font-mono">
                                        {screenshotFile ? formatFileSize(screenshotFile.size) : ''}
                                      </p>
                                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                        In-Memory Preview Only
                                      </span>
                                    </div>
                                  </div>

                                  {/* Replace and Remove Controls */}
                                  <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                                    <button
                                      type="button"
                                      onClick={() => fileInputRef.current?.click()}
                                      className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <RefreshCw size={12} />
                                      <span>Replace</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleRemoveScreenshot}
                                      className="flex-1 py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={12} />
                                      <span>Remove</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {screenshotError && (
                                <div className="text-[11px] text-red-400 flex items-center gap-1.5">
                                  <AlertCircle size={13} className="shrink-0" />
                                  <span>{screenshotError}</span>
                                </div>
                              )}

                              {/* Customer amount correction control */}
                              <div className="p-2.5 bg-black/40 border border-white/10 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/60">
                                    Amount I paid:
                                  </label>
                                  <span className="text-[10px] text-white/40 font-mono">
                                    Default: ₹{currentAdvance.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white/50 text-xs font-mono">₹</span>
                                  <input
                                    type="text"
                                    value={customReportedAmount !== '' ? customReportedAmount : currentAdvance.toString()}
                                    onChange={(e) => setCustomReportedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder={currentAdvance.toString()}
                                    className="w-full bg-white/5 border border-white/15 rounded px-2.5 py-1 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <p className="text-[10px] text-white/40 mt-1">
                                  You can adjust this if you transferred a different advance or rounded token amount.
                                </p>
                              </div>

                              {/* Share Actions */}
                              <div className="space-y-2 pt-1">
                                {/* Web Share API File-sharing button when supported & file selected */}
                                {screenshotFile && canShareFiles && (
                                  <div className="space-y-1">
                                    <button
                                      type="button"
                                      onClick={handleShareScreenshot}
                                      className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                                    >
                                      <Share2 size={14} />
                                      <span>Share Screenshot</span>
                                    </button>
                                    <p className="text-[10px] text-white/50 text-center leading-relaxed">
                                      Select WhatsApp from the share sheet and choose <strong>Aman Visual (+91 8827474622)</strong>.
                                    </p>
                                  </div>
                                )}

                                {/* Direct UPI Database Recording Button */}
                                <button
                                  type="button"
                                  onClick={handleDirectUpiSubmit}
                                  disabled={isSubmittingDirectUpi}
                                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                                >
                                  {isSubmittingDirectUpi ? (
                                    <>
                                      <RefreshCw size={14} className="animate-spin" />
                                      <span>Recording Payment in Database...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 size={15} />
                                      <span>I Have Transferred via UPI — Submit for Verification</span>
                                    </>
                                  )}
                                </button>

                                {/* Open Aman Visual WhatsApp */}
                                <a
                                  href={upiProofWhatsAppUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                  <MessageCircle size={15} />
                                  <span>Open Aman Visual WhatsApp</span>
                                </a>

                                {/* Explanation beside WhatsApp button */}
                                <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                                  <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold block text-amber-300">
                                      Attach your payment screenshot in WhatsApp before sending.
                                    </span>
                                    <span className="text-[10px] text-amber-200/70 block mt-0.5">
                                      A normal WhatsApp link cannot attach an image file automatically. Please use the paperclip or photo icon in WhatsApp chat to attach your screenshot.
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Manual verification notice */}
                              <div className="p-2 bg-white/5 border border-white/10 rounded text-center">
                                <p className="text-[11px] text-amber-300 font-medium flex items-center justify-center gap-1.5">
                                  <Clock size={12} className="shrink-0" />
                                  <span>Payment confirmation is pending manual verification by Aman Visual.</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="text-[10px] text-white/40 text-center leading-relaxed">
                    By confirming, you agree to our{' '}
                    <Link to="/terms-and-conditions" target="_blank" className="underline hover:text-white">Terms</Link> &{' '}
                    <Link to="/refund-policy" target="_blank" className="underline hover:text-white">Refund Policy</Link>. Official Cashfree digital receipt issued upon payment approval.
                  </p>
                </form>
              </>
            )}

            {/* STEP 2: AWAITING CASHFREE PAYMENT RECEIPT */}
            {currentStep === 'awaiting_receipt' && (
              <div className="space-y-4 text-left">
                {/* Gateway Pending Banner */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <Clock size={20} className="animate-pulse" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-black animate-ping" />
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase text-white tracking-wider flex items-center gap-2">
                      <span>Waiting for Payment Receipt from Cashfree</span>
                    </h4>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      Your booking confirmation and schedule allocation will be completed automatically once Cashfree confirms the transaction.
                    </p>
                  </div>
                </div>

                {/* Live Order Payment Info */}
                <div className="p-4 bg-white/5 border border-white/10 rounded space-y-3 text-xs">
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Cashfree Order ID:</span>
                    <span className="font-mono text-emerald-400 font-bold">{activeOrderId}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Client Name:</span>
                    <span className="text-white font-medium">{clientName}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Service:</span>
                    <span className="text-white font-medium">{bookingDetails.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70 border-t border-white/10 pt-2.5">
                    <span className="text-white/60 font-semibold">Advance Amount Due:</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      ₹{currentAdvance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Instant UPI & Payment Options Guidance */}
                <div className="p-3.5 bg-black/50 border border-white/10 rounded space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-[11px] font-semibold">
                    <QrCode size={15} className="text-emerald-400" />
                    <span>Pay via any UPI App / Cashfree Gateway</span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    Complete your payment of <strong className="text-white">₹{currentAdvance.toLocaleString('en-IN')}</strong> using Google Pay, PhonePe, Paytm, or NetBanking.
                  </p>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-[10px] text-white/80 font-mono">
                      GPay
                    </div>
                    <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-[10px] text-white/80 font-mono">
                      PhonePe
                    </div>
                    <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-[10px] text-white/80 font-mono">
                      Paytm
                    </div>
                    <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-[10px] text-white/80 font-mono">
                      Cards / Net
                    </div>
                  </div>
                </div>

                {/* Manual UTR Reference Input Option */}
                {showManualUtrInput ? (
                  <div className="p-3 bg-white/5 border border-white/15 rounded space-y-2">
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-white/60">
                      Bank Transaction ID / UTR Number:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423409823471 or Cashfree Ref"
                      value={manualUtr}
                      onChange={(e) => setManualUtr(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white placeholder-white/30 rounded focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowManualUtrInput(true)}
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer block"
                  >
                    + Enter Bank UTR / Transaction ID manually
                  </button>
                )}

                {/* Verify Actions */}
                <div className="space-y-2.5 pt-2">
                  {/* Open Cashfree Checkout if session is active */}
                  {activePaymentSessionId && (
                    <button
                      type="button"
                      onClick={() => handleOpenCashfreeCheckout()}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_22px_rgba(16,185,129,0.35)] hover:shadow-[0_0_32px_rgba(16,185,129,0.55)] transform active:scale-[0.99]"
                    >
                      <CreditCard size={15} />
                      <span>Open Cashfree Card / UPI Checkout Window</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => verifyCashfreeReceipt(activeOrderId || undefined)}
                    disabled={isVerifyingReceipt}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingReceipt ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verifying with Cashfree...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck size={15} />
                        <span>I Have Completed Payment — Verify Status</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('details')}
                    className="w-full py-2 bg-transparent hover:bg-white/5 text-white/50 hover:text-white text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    ← Back to edit booking details
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: OFFICIAL CASHFREE RECEIPT CONFIRMED */}
            {currentStep === 'receipt_confirmed' && confirmedReceipt && (
              <div className="text-center py-2 space-y-4">
                {/* Official Cashfree Verified Badge */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 size={34} />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <Check size={12} />
                    <span>Payment Receipt Received from Cashfree</span>
                  </div>
                  <h4 className="font-display font-bold uppercase text-lg text-white">
                    Booking Retainer Confirmed!
                  </h4>
                  <p className="text-xs text-white/60 mt-1">
                    Your shoot date has been officially locked on the studio production schedule.
                  </p>
                </div>

                {/* Official Cashfree Receipt Card */}
                <div className="p-4 bg-white/5 border border-emerald-500/30 rounded text-left space-y-2.5 text-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-emerald-400" />
                      <span className="font-display font-bold text-white uppercase tracking-wider text-[11px]">
                        Aman Visual Studio Tax Receipt
                      </span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">
                      {confirmedReceipt.receiptNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-white/70 text-[11px]">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Cashfree Order ID</span>
                      <span className="font-mono text-white">{confirmedReceipt.orderId}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Cashfree Payment ID</span>
                      <span className="font-mono text-white">{confirmedReceipt.cfPaymentId}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-white/70 text-[11px]">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Bank UTR / Ref</span>
                      <span className="font-mono text-white">{confirmedReceipt.utr}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Payment Mode</span>
                      <span className="text-white">{confirmedReceipt.paymentMode}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2 space-y-1.5">
                    <div className="flex justify-between text-white/70">
                      <span className="text-white/40">Service:</span>
                      <span className="text-white font-medium">{confirmedReceipt.serviceTitle}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span className="text-white/40">Shoot Date & Venue:</span>
                      <span className="text-white">{eventDate || 'Scheduled with client'} • {eventVenue || 'Mumbai'}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span className="text-white/40">Advance Paid via Cashfree:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ₹{confirmedReceipt.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span className="text-white/40">Balance Due on Shoot Day:</span>
                      <span className="text-white font-mono">₹{remainingBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Receipt Actions */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:bg-white/90"
                  >
                    <Download size={14} />
                    <span>Download / Print Official PDF Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppConfirmation}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                  >
                    <Share2 size={14} />
                    <span>Send Booking Voucher on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 bg-white/10 hover:bg-white hover:text-black text-white text-xs uppercase tracking-wider rounded transition-all cursor-pointer font-semibold"
                  >
                    Done & Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DIRECT UPI PENDING MANUAL VERIFICATION */}
            {currentStep === 'pending_verification' && pendingDirectBooking && (
              <div className="text-center py-2 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                  <Clock size={34} className="animate-pulse" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <ShieldCheck size={12} />
                    <span>Pending Manual Bank Verification</span>
                  </div>
                  <h3 className="text-xl font-display font-bold uppercase text-white tracking-wide">
                    Direct UPI Transfer Recorded
                  </h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto mt-1">
                    Your advance payment submission has been saved to the Aman Visual production database. Our team will verify the Kotak Mahindra Bank transfer and confirm your booking.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-white/10 rounded-lg text-left space-y-2.5 text-xs max-w-md mx-auto">
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Reference Booking ID:</span>
                    <span className="font-mono text-emerald-400 font-bold">{pendingDirectBooking.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Status:</span>
                    <span className="font-mono text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] uppercase">
                      Pending Bank Verification
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Amount Submitted:</span>
                    <span className="font-mono text-white font-bold text-sm">₹{pendingDirectBooking.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Client:</span>
                    <span className="text-white font-medium">{pendingDirectBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-white/40">Service:</span>
                    <span className="text-white font-medium">{bookingDetails.serviceTitle}</span>
                  </div>
                  {eventDate && (
                    <div className="flex justify-between items-center text-white/70">
                      <span className="text-white/40">Shoot Date:</span>
                      <span className="text-white font-medium">{eventDate}</span>
                    </div>
                  )}
                  {pendingDirectBooking.utr && (
                    <div className="flex justify-between items-center text-white/70">
                      <span className="text-white/40">UTR / Ref:</span>
                      <span className="font-mono text-emerald-400">{pendingDirectBooking.utr}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-white/70 border-t border-white/10 pt-2">
                    <span className="text-white/40">Destination Bank:</span>
                    <span className="text-white font-mono text-[11px]">Kotak Mahindra Bank (A/c 1645939816)</span>
                  </div>
                </div>

                <div className="space-y-2 max-w-md mx-auto pt-2">
                  <a
                    href={`https://wa.me/918827474622?text=${encodeURIComponent(
                      `Hello Aman Visual! I have submitted my direct UPI transfer proof for booking Reference: ${pendingDirectBooking.id}.\nAmount: ₹${pendingDirectBooking.amount}\nService: ${bookingDetails.serviceTitle}\nClient: ${pendingDirectBooking.customerName}\nPlease verify the Kotak Mahindra Bank transfer.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MessageCircle size={15} />
                    <span>Send Booking Reference & Screenshot on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white hover:text-black text-white text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
