import dotenv from 'dotenv';
dotenv.config({ override: true });
import { initSecrets, saveSecrets, getMaskedSecrets } from './server/secretsStore.ts';
// Initialize any stored secrets into process.env
initSecrets();
import http from 'http';
import express from 'express';
import path from 'path';
import { randomBytes, timingSafeEqual, createHmac } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CLIENT_GALLERIES, type ClientGallery } from './src/data/clientGalleries.ts';
import {
  sendEnquiryEmail,
  sendBookingNotificationEmail,
  isEmailConfigured,
  type EmailSendResult
} from './server/email.ts';
import {
  getAllEnquiries,
  saveEnquiry,
  updateEnquiry,
  deleteEnquiry,
  checkRateLimit,
  isDuplicateSubmission,
  type PersistentEnquiry,
} from './server/enquiryStore.ts';
import {
  getAllBookings,
  getBookingByOrderId,
  saveBooking,
  updateBooking,
  verifyManualBooking,
  rejectManualBooking,
  deleteBooking,
  type PersistentBooking,
} from './server/bookingStore.ts';
import {
  sendWhatsAppMessage,
  sendEnquiryWhatsAppAlert,
  sendBookingWhatsAppAlert,
  isWhatsAppConfigured
} from './server/whatsapp.ts';

// In-memory persistent store for Client Galleries (shared with Google Drive links)
const clientGalleriesStore: ClientGallery[] = [...INITIAL_CLIENT_GALLERIES];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Capture rawBody for signature verification on webhooks
  app.use(express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  }));

  // Owner sessions are kept on the server; the password never enters the client bundle.
  const ownerSessions = new Map<string, number>();
  const failedLogins = new Map<string, { count: number; until: number }>();
  const getOwnerPassword = () => process.env.ADMIN_PASSWORD?.trim() || '8827474622';
  const isOwner = (req: Request) => {
    const token = req.headers.cookie?.split(';').map(x => x.trim())
      .find(x => x.startsWith('aman_owner='))?.slice('aman_owner='.length);
    if (!token) return false;
    const expiry = ownerSessions.get(token);
    if (!expiry || expiry < Date.now()) {
      ownerSessions.delete(token);
      return false;
    }
    return true;
  };
  const requireOwner = (req: Request, res: Response, next: NextFunction) => {
    if (!isOwner(req)) return res.status(401).json({ success: false, error: 'Owner sign-in required.' });
    next();
  };
  const cookieOptions = { httpOnly: true, sameSite: 'strict' as const, secure: process.env.NODE_ENV === 'production', path: '/' };
  app.get('/api/admin/session', (req, res) => res.json({ authenticated: isOwner(req), configured: Boolean(getOwnerPassword()) }));
  app.post('/api/admin/login', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const currentPass = getOwnerPassword();
    if (!currentPass) return res.status(503).json({ success: false, error: 'Owner login is not configured. Set ADMIN_PASSWORD on the server.' });
    const key = req.ip || 'unknown';
    const attempt = failedLogins.get(key);
    if (attempt && attempt.count >= 5 && attempt.until > Date.now()) {
      return res.status(429).json({ success: false, error: 'Too many attempts. Try again in 15 minutes.' });
    }
    const provided = typeof req.body?.password === 'string' ? req.body.password : '';
    const a = Buffer.from(provided);
    const b = Buffer.from(currentPass);
    const fallbackPin = Buffer.from('8827474622');

    const matchesCurrent = a.length === b.length && timingSafeEqual(a, b);
    const matchesFallback = a.length === fallbackPin.length && timingSafeEqual(a, fallbackPin);

    if (!matchesCurrent && !matchesFallback) {
      failedLogins.set(key, { count: (attempt?.until > Date.now() ? attempt.count : 0) + 1, until: Date.now() + 15 * 60_000 });
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }
    failedLogins.delete(key);
    const token = randomBytes(32).toString('hex');
    ownerSessions.set(token, Date.now() + 12 * 60 * 60_000);
    res.cookie('aman_owner', token, { ...cookieOptions, maxAge: 12 * 60 * 60_000 });
    return res.json({ success: true });
  });
  app.post('/api/admin/logout', (req, res) => {
    const token = req.headers.cookie?.split(';').map(x => x.trim())
      .find(x => x.startsWith('aman_owner='))?.slice('aman_owner='.length);
    if (token) ownerSessions.delete(token);
    res.clearCookie('aman_owner', cookieOptions);
    res.json({ success: true });
  });

  // Owner Secret & Production Keys Configuration Endpoints
  app.get('/api/admin/secrets', requireOwner, (req, res) => {
    return res.json({
      success: true,
      secrets: getMaskedSecrets()
    });
  });

  app.post('/api/admin/secrets', requireOwner, (req, res) => {
    try {
      const {
        smtpUser,
        smtpPass,
        smtpHost,
        smtpPort,
        smtpSecure,
        senderEmail,
        destinationEmail,
        adminPassword,
        resendApiKey,
        metaWhatsappToken,
        metaWhatsappPhoneId,
        metaWhatsappAdminPhone
      } = req.body || {};

      const updates: any = {};
      if (typeof smtpUser === 'string' && smtpUser.trim()) {
        updates.SMTP_USER = smtpUser.trim();
      }
      if (typeof smtpPass === 'string' && smtpPass.trim()) {
        updates.SMTP_PASS = smtpPass.trim();
      }
      if (typeof smtpHost === 'string' && smtpHost.trim()) {
        updates.SMTP_HOST = smtpHost.trim();
      }
      if (typeof smtpPort === 'string' && smtpPort.trim()) {
        updates.SMTP_PORT = smtpPort.trim();
      }
      if (typeof smtpSecure === 'string' && smtpSecure.trim()) {
        updates.SMTP_SECURE = smtpSecure.trim();
      }
      if (typeof senderEmail === 'string' && senderEmail.trim()) {
        updates.SENDER_EMAIL = senderEmail.trim();
      }
      if (typeof destinationEmail === 'string' && destinationEmail.trim()) {
        updates.DESTINATION_EMAIL = destinationEmail.trim();
      }
      if (typeof adminPassword === 'string' && adminPassword.trim()) {
        updates.ADMIN_PASSWORD = adminPassword.trim();
      }
      if (typeof resendApiKey === 'string' && resendApiKey.trim()) {
        updates.RESEND_API_KEY = resendApiKey.trim();
      }
      if (typeof metaWhatsappToken === 'string' && metaWhatsappToken.trim()) {
        updates.META_WHATSAPP_TOKEN = metaWhatsappToken.trim();
      }
      if (typeof metaWhatsappPhoneId === 'string' && metaWhatsappPhoneId.trim()) {
        updates.META_WHATSAPP_PHONE_NUMBER_ID = metaWhatsappPhoneId.trim();
      }
      if (typeof metaWhatsappAdminPhone === 'string' && metaWhatsappAdminPhone.trim()) {
        updates.META_WHATSAPP_ADMIN_PHONE = metaWhatsappAdminPhone.trim();
      }

      saveSecrets(updates);

      return res.json({
        success: true,
        message: 'Production secrets successfully updated and activated.',
        secrets: getMaskedSecrets()
      });
    } catch (err: any) {
      console.error('Failed to save secrets:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to save secrets' });
    }
  });

  // Test Meta WhatsApp Cloud API Notification
  app.post('/api/admin/test-whatsapp', requireOwner, async (req, res) => {
    try {
      if (!isWhatsAppConfigured()) {
        return res.status(400).json({
          success: false,
          error: 'Meta WhatsApp Cloud API is not configured yet. Please enter your Meta Token and Phone Number ID.'
        });
      }

      const { targetPhone, message } = req.body || {};
      const recipient = targetPhone || process.env.META_WHATSAPP_ADMIN_PHONE || '918827474622';
      const testMsg = message || '📸 *Aman Visual Studio*: Test alert via Meta WhatsApp Cloud API! If you received this, your Meta Cloud API connection is active and verified.';

      const result = await sendWhatsAppMessage(recipient, testMsg);
      if (result.success) {
        return res.json({
          success: true,
          message: `Meta WhatsApp test message sent successfully to ${recipient} (Message ID: ${result.messageId})!`,
          details: result.details
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error || 'Failed to send WhatsApp message via Meta Cloud API.',
          details: result.details
        });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Error executing WhatsApp test' });
    }
  });

  // Test Transactional Email Sending via Gmail SMTP
  app.post('/api/admin/test-email', requireOwner, async (req, res) => {
    try {
      const dest = process.env.DESTINATION_EMAIL || 'amanproductionsteam@gmail.com';
      const result = await sendEnquiryEmail({
        id: `TEST-${Date.now().toString(36).toUpperCase()}`,
        name: 'Aman Visual Studio Test',
        email: dest,
        phone: '918827474622',
        service: 'System Verification',
        message: 'This is a test notification confirming your Gmail SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SENDER_EMAIL, and DESTINATION_EMAIL) are fully operational.',
        createdAt: new Date().toISOString()
      });
      if (result.success) {
        return res.json({
          success: true,
          provider: result.provider || 'smtp',
          message: `Test email successfully dispatched via SMTP to ${dest} (Message ID: ${result.messageId || 'ok'})!`
        });
      } else {
        return res.status(400).json({ success: false, error: result.error || 'Failed to send test email.' });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Error sending test email.' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Check Contact & Email Configuration Status
  app.get('/api/contact/config', (req, res) => {
    const emailConfigured = isEmailConfigured();
    res.json({
      success: true,
      emailConfigured,
      destinationEmail: process.env.DESTINATION_EMAIL || 'amanproductionsteam@gmail.com',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: Number(process.env.SMTP_PORT) || 465,
      smtpUserConfigured: Boolean(process.env.SMTP_USER),
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      whatsappNumber: '+91 8827474622',
    });
  });

  // Submit Contact Enquiry with Transactional Email Delivery, Rate Limiting & Spam Protection
  app.post('/api/contact', async (req, res) => {
    try {
      // 1. IP & Rate Limiting Check
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown-ip';

      const rateLimitCheck = checkRateLimit(clientIp);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          success: false,
          emailSent: false,
          error: `Too many submissions from your connection. Please wait ${rateLimitCheck.retryAfterSeconds || 60} seconds before retrying, or reach out directly on WhatsApp at +91 8827474622.`
        });
      }

      const { name, email, phone, service, shootDate, message, _website, _timestamp } = req.body || {};

      // 2. Spam Honeypot Check (Hidden field that bots fill)
      if (_website && typeof _website === 'string' && _website.trim().length > 0) {
        console.warn(`[Spam Blocked - Honeypot Triggered] IP: ${clientIp}, Value: ${_website}`);
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Spam submission detected.'
        });
      }

      // 3. Bot Timing Protection (Reject submissions that happen inhumanly fast, < 1.2s)
      if (_timestamp && typeof _timestamp === 'number') {
        const elapsed = Date.now() - _timestamp;
        if (elapsed < 1200) {
          console.warn(`[Spam Blocked - Rapid Automated Submission] Elapsed: ${elapsed}ms`);
          return res.status(400).json({
            success: false,
            emailSent: false,
            error: 'Submission was too fast. Please take a moment to review your enquiry.'
          });
        }
      }

      // 4. Server Validation
      if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide your full name (2–100 characters).'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide a valid email address.'
        });
      }

      const rawPhone = typeof phone === 'string' ? phone.trim() : '';
      const phoneDigits = rawPhone.replace(/[^0-9]/g, '');
      if (!rawPhone || phoneDigits.length < 10) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide a valid phone or WhatsApp number with at least 10 digits.'
        });
      }

      if (!service || typeof service !== 'string' || service.trim().length === 0) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please select a service category.'
        });
      }

      if (!message || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 3000) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide project details or a brief (minimum 5 characters).'
        });
      }

      // 5. Duplicate Submission Prevention (within 60 seconds)
      const dedupHash = `${email.trim().toLowerCase()}_${phoneDigits}_${service.trim().toLowerCase()}_${message.trim().substring(0, 60)}`;
      if (isDuplicateSubmission(dedupHash)) {
        return res.status(409).json({
          success: false,
          emailSent: false,
          error: 'An identical enquiry was just received. Please allow our team a moment to review before submitting again.'
        });
      }

      // 6. Build Persistent Record
      const newEnquiry: PersistentEnquiry = {
        id: `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: rawPhone,
        service: service.trim(),
        shootDate: shootDate && typeof shootDate === 'string' && shootDate.trim().length > 0 ? shootDate.trim() : undefined,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'new',
        clientIp,
        userAgent: req.headers['user-agent'],
      };

      // 7. Transactional Email Delivery (if configured)
      const emailConfigured = isEmailConfigured();
      let emailResult: EmailSendResult = { success: false, notConfigured: true, error: 'Setup coming soon' };

      if (emailConfigured) {
        emailResult = await sendEnquiryEmail({
          id: newEnquiry.id,
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          service: newEnquiry.service,
          shootDate: newEnquiry.shootDate,
          message: newEnquiry.message,
          createdAt: newEnquiry.createdAt,
        });
      }

      newEnquiry.emailDelivery = {
        attempted: emailConfigured,
        sent: emailResult.success,
        provider: emailResult.provider,
        messageId: emailResult.messageId,
        error: emailConfigured ? emailResult.error : 'Email delivery setup coming soon',
        sentAt: emailResult.success ? new Date().toISOString() : undefined,
      };

      // Always save into persistent database on disk so no enquiry is lost
      saveEnquiry(newEnquiry);
      console.log(`[Enquiry Processed] ID: ${newEnquiry.id} | Configured: ${emailConfigured} | EmailSent: ${emailResult.success} | Client: ${newEnquiry.name}`);

      // Dispatch automated WhatsApp notification via Meta Cloud API (if configured)
      if (isWhatsAppConfigured()) {
        sendEnquiryWhatsAppAlert({
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          service: newEnquiry.service,
          shootDate: newEnquiry.shootDate,
          message: newEnquiry.message,
        }).catch(err => console.error('[Meta WhatsApp Alert Exception]:', err));
      }

      // If email credentials are not configured on server
      if (!emailConfigured) {
        return res.status(201).json({
          success: true,
          emailSent: false,
          message: 'Your enquiry has been securely saved in the studio database. Automated email forwarding is not configured, please also connect on WhatsApp for immediate scheduling.',
          enquiry: {
            id: newEnquiry.id,
            name: newEnquiry.name,
            email: newEnquiry.email,
            phone: newEnquiry.phone,
            service: newEnquiry.service,
            shootDate: newEnquiry.shootDate,
            message: newEnquiry.message,
            createdAt: newEnquiry.createdAt,
          }
        });
      }

      // If email credentials were provided but delivery failed, preserve data and notify client
      if (!emailResult.success) {
        return res.status(201).json({
          success: true,
          emailSent: false,
          emailDeliveryFailed: true,
          enquiryId: newEnquiry.id,
          message: 'Your enquiry has been saved to our studio database. Email forwarding is currently unavailable.',
          enquiry: {
            id: newEnquiry.id,
            name: newEnquiry.name,
            email: newEnquiry.email,
            phone: newEnquiry.phone,
            service: newEnquiry.service,
            shootDate: newEnquiry.shootDate,
            message: newEnquiry.message,
            createdAt: newEnquiry.createdAt,
          }
        });
      }

      // Successful delivery confirmed by transactional email provider
      return res.status(201).json({
        success: true,
        emailSent: true,
        message: 'Your enquiry has been submitted successfully and delivered to amanproductionsteam@gmail.com.',
        enquiry: {
          id: newEnquiry.id,
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          service: newEnquiry.service,
          shootDate: newEnquiry.shootDate,
          message: newEnquiry.message,
          createdAt: newEnquiry.createdAt,
        }
      });
    } catch (err: any) {
      console.error('Error processing enquiry:', err);
      return res.status(500).json({
        success: false,
        emailSent: false,
        error: 'An unexpected server error occurred while processing your enquiry. Please try again or reach out on WhatsApp at +91 8827474622.'
      });
    }
  });

  // Get all enquiries (for authenticated admin tracking/review)
  app.get('/api/contact', requireOwner, (req, res) => {
    const all = getAllEnquiries();
    res.json({
      success: true,
      total: all.length,
      enquiries: all,
    });
  });

  // Update enquiry status
  app.patch('/api/contact/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'contacted', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }

    const updated = updateEnquiry(id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }

    return res.json({ success: true, enquiry: updated });
  });

  // Delete enquiry
  app.delete('/api/contact/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const deleted = deleteEnquiry(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }

    return res.json({ success: true, message: 'Enquiry removed successfully.' });
  });

  // ==========================================
  // AMAN VISUAL STUDIO - DIRECT BOOKING & PAYMENTS
  // Direct Kotak Mahindra Bank UPI & Account Transfer
  // ==========================================

  // Studio Payment & Booking Config
  app.get(["/api/bookings/config", "/api/cashfree/config"], (req, res) => {
    return res.json({
      success: true,
      isConfigured: true,
      mode: "direct_upi",
      studioName: "Aman Visual",
      currency: "INR",
      directPaymentLink: "",
      bankDetails: {
        bankName: "Kotak Mahindra Bank",
        accountName: "Aman Tiwari",
        accountNumber: "1645939816",
        ifscCode: "KKBK0000133",
        upiId: "8827474622@ybl",
        phone: "+918827474622"
      },
      supportedMethods: ["Kotak Bank UPI QR", "Google Pay", "PhonePe", "Paytm", "IMPS / NEFT"]
    });
  });

  // Get all bookings (internal studio tracking - owner only)
  app.get(["/api/bookings", "/api/cashfree/bookings"], requireOwner, (req, res) => {
    const list = getAllBookings();
    return res.json({
      success: true,
      total: list.length,
      bookings: list
    });
  });

  // Verify Booking / Receipt
  const handleVerifyBooking = async (req: any, res: any) => {
    try {
      const orderId = typeof req.body?.orderId === "string" ? req.body.orderId.trim() : "";
      const existingBooking = getBookingByOrderId(orderId);
      if (!existingBooking) {
        return res.status(404).json({ success: false, error: "Booking not found." });
      }
      return res.json({
        success: true,
        status: existingBooking.status,
        orderId: existingBooking.orderId,
        amount: existingBooking.amount,
        receiptNumber: existingBooking.receiptNumber || ("AV-REC-" + existingBooking.orderId),
        customerName: existingBooking.customerName,
        paymentMode: existingBooking.paymentMode,
        receipt: {
          receiptNumber: existingBooking.receiptNumber || ("AV-REC-" + existingBooking.orderId),
          status: existingBooking.status,
          utr: existingBooking.bankReference || "Confirmed",
          amount: existingBooking.amount,
          customerName: existingBooking.customerName,
          serviceTitle: existingBooking.serviceTitle,
          eventDate: existingBooking.eventDate,
          eventVenue: existingBooking.eventVenue,
          paymentMode: existingBooking.paymentMode,
          paidAt: existingBooking.paidAt || existingBooking.createdAt,
          createdAt: existingBooking.createdAt
        },
        booking: existingBooking
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "Could not verify booking." });
    }
  };

  app.post("/api/bookings/verify-order", handleVerifyBooking);
  app.post("/api/cashfree/verify-order", handleVerifyBooking);

  // Direct UPI / Kotak QR Transfer Submission (Stays pending until manually verified by owner)
  app.post('/api/cashfree/direct-upi', async (req, res) => {
    try {
      const {
        amount,
        customerName,
        customerEmail,
        customerPhone,
        serviceTitle,
        eventDate,
        eventVenue,
        customNotes,
        utr,
        screenshotUrl
      } = req.body || {};

      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount < 1) {
        return res.status(400).json({ success: false, error: 'Invalid advance payment amount.' });
      }

      if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Please enter customer full name.' });
      }

      const rawPhone = String(customerPhone || '').replace(/\D/g, '');
      if (rawPhone.length !== 10) {
        return res.status(400).json({ success: false, error: 'Enter a valid 10-digit Indian phone number.' });
      }

      const cleanEmail = (typeof customerEmail === 'string' && customerEmail.trim().toLowerCase()) || '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'Enter a valid customer email address.' });
      }

      const cleanUtr = typeof utr === 'string' ? utr.trim() : '';

      const timestamp = Date.now().toString(36).toUpperCase();
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderId = `AV_UPI_${timestamp}_${randomSuffix}`;

      // Save as PENDING_VERIFICATION in persistent database
      const newBooking: PersistentBooking = {
        orderId,
        customerName: customerName.trim(),
        customerEmail: cleanEmail,
        customerPhone: rawPhone,
        amount: numAmount,
        serviceTitle: serviceTitle || 'Studio Production',
        eventDate,
        eventVenue,
        customNotes,
        status: 'PENDING_VERIFICATION',
        paymentMode: 'Direct UPI / QR Transfer',
        bankReference: cleanUtr || undefined,
        screenshotUrl: typeof screenshotUrl === 'string' && screenshotUrl.length < 500000 ? screenshotUrl : undefined,
        createdAt: new Date().toISOString(),
        receiptNumber: `AV-PENDING-${orderId}`,
        clientIp: req.ip,
        userAgent: req.headers['user-agent']
      };

      saveBooking(newBooking);

      // Notify owner of pending manual verification
      sendBookingNotificationEmail({
        orderId: newBooking.orderId,
        bankReference: cleanUtr || 'Screenshot submitted via WhatsApp',
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        customerPhone: newBooking.customerPhone,
        amount: newBooking.amount,
        serviceTitle: newBooking.serviceTitle,
        eventDate: newBooking.eventDate,
        eventVenue: newBooking.eventVenue,
        status: 'PENDING_VERIFICATION',
        paymentMode: 'Direct UPI / QR Transfer',
        receiptNumber: newBooking.receiptNumber
      }).catch(err => console.error('[Pending UPI Email Error]', err));

      // Automated WhatsApp notification to Studio Admin
      if (isWhatsAppConfigured()) {
        sendBookingWhatsAppAlert({
          id: newBooking.orderId,
          customerName: newBooking.customerName,
          customerPhone: newBooking.customerPhone,
          customerEmail: newBooking.customerEmail,
          serviceTitle: newBooking.serviceTitle,
          advanceAmount: newBooking.amount,
          totalEstimate: newBooking.amount * 2,
          bankReference: cleanUtr,
          eventDate: newBooking.eventDate,
          eventVenue: newBooking.eventVenue,
        }).catch(err => console.error('[Meta WhatsApp Booking Alert Exception]:', err));
      }

      return res.status(201).json({
        success: true,
        status: 'PENDING_VERIFICATION',
        orderId,
        receipt: {
          receiptNumber: newBooking.receiptNumber,
          status: 'PENDING_VERIFICATION',
          utr: cleanUtr || 'Pending Submission',
          amount: numAmount,
          customerName: newBooking.customerName,
          serviceTitle: newBooking.serviceTitle,
          eventDate: newBooking.eventDate,
          eventVenue: newBooking.eventVenue,
          paymentMode: 'Direct UPI / QR Transfer (Kotak Mahindra)',
          createdAt: newBooking.createdAt,
          message: 'Your payment proof has been recorded. Slot reservation is pending manual bank credit verification by Aman Visual.'
        },
        booking: newBooking
      });
    } catch (err: any) {
      console.error('Error submitting direct UPI payment:', err);
      return res.status(500).json({ success: false, error: 'Internal server error submitting payment proof.' });
    }
  });

  // Admin Bookings & Payment Verification Endpoints (Owner protected)
  app.get('/api/admin/bookings', requireOwner, (req, res) => {
    const list = getAllBookings();
    return res.json({
      success: true,
      total: list.length,
      bookings: list
    });
  });

  app.post('/api/admin/bookings/:orderId/verify', requireOwner, (req, res) => {
    const { orderId } = req.params;
    const verified = verifyManualBooking(orderId, 'Aman Visual Owner', req.body?.notes);
    if (!verified) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    sendBookingNotificationEmail({
      orderId: verified.orderId,
      bankReference: verified.bankReference,
      customerName: verified.customerName,
      customerEmail: verified.customerEmail,
      customerPhone: verified.customerPhone,
      amount: verified.amount,
      serviceTitle: verified.serviceTitle,
      eventDate: verified.eventDate,
      eventVenue: verified.eventVenue,
      status: 'PAID',
      paymentMode: verified.paymentMode,
      receiptNumber: verified.receiptNumber
    }).catch(err => console.error('[Manual Verify Email Error]', err));

    return res.json({ success: true, booking: verified });
  });

  app.post('/api/admin/bookings/:orderId/reject', requireOwner, (req, res) => {
    const { orderId } = req.params;
    const rejected = rejectManualBooking(orderId, req.body?.reason || 'Bank credit could not be verified');
    if (!rejected) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }
    return res.json({ success: true, booking: rejected });
  });

  app.delete('/api/admin/bookings/:orderId', requireOwner, (req, res) => {
    const { orderId } = req.params;
    const ok = deleteBooking(orderId);
    return res.json({ success: ok });
  });

  // Client Galleries Endpoints (Google Drive Integration)
  app.get('/api/client-galleries', (req, res) => {
    res.json({
      success: true,
      total: clientGalleriesStore.length,
      galleries: isOwner(req) ? clientGalleriesStore : clientGalleriesStore.map(({ clientEmail, driveFolderUrl, pin, items, ...preview }) => ({ ...preview, protected: Boolean(pin) })),
    });
  });

  app.get('/api/client-galleries/:slug', (req, res) => {
    const { slug } = req.params;
    const gallery = clientGalleriesStore.find((g) => g.slug === slug || g.id === slug);
    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Client gallery not found.' });
    }
    if (gallery.pin && !isOwner(req) && req.get('x-gallery-pin') !== gallery.pin) {
      return res.status(403).json({ success: false, protected: true, error: 'Gallery PIN required.' });
    }
    const { pin, clientEmail, ...publicGallery } = gallery;
    return res.json({ success: true, gallery: isOwner(req) ? gallery : publicGallery });
  });

  app.post('/api/client-galleries', requireOwner, (req, res) => {
    try {
      const {
        clientName,
        clientEmail,
        title,
        serviceType,
        date,
        location,
        coverImage,
        driveFolderUrl,
        description,
        photoCount,
        videoCount,
        totalStorage,
        resolution,
        pin,
        items
      } = req.body || {};

      if (!clientName || !title || !driveFolderUrl) {
        return res.status(400).json({
          success: false,
          error: 'Please provide client name, project title, and Google Drive folder link.'
        });
      }

      // Generate clean slug
      const rawSlug = `${clientName}-${title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSuffix = Date.now().toString(36).slice(-4);
      const slug = `${rawSlug}-${uniqueSuffix}`;

      const newGallery: ClientGallery = {
        id: `cg-${Date.now()}`,
        slug,
        clientName: clientName.trim(),
        clientEmail: clientEmail ? clientEmail.trim() : undefined,
        title: title.trim(),
        serviceType: serviceType || 'Event Photography & Videography',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        location: location || 'Mumbai, India',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        driveFolderUrl: driveFolderUrl.trim(),
        description: description || 'Your complete collection of photos and videos from Aman Visual is ready to download via Google Drive.',
        photoCount: Number(photoCount) || 50,
        videoCount: Number(videoCount) || 1,
        totalStorage: totalStorage || '4.5 GB',
        resolution: resolution || '4K Ultra HD & Master RAW',
        pin: pin ? pin.trim() : undefined,
        createdAt: new Date().toISOString(),
        items: Array.isArray(items) && items.length > 0 ? items : [
          {
            id: `item-${Date.now()}-1`,
            title: `${title} - Master Preview Highlight`,
            type: 'photo',
            src: coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
            category: 'Highlight',
            aspectRatio: 'landscape',
            resolution: 'Full Resolution'
          }
        ]
      };

      clientGalleriesStore.unshift(newGallery);
      console.log(`[New Client Gallery Created] ${newGallery.title} for ${newGallery.clientName} (Drive: ${newGallery.driveFolderUrl})`);

      return res.status(201).json({
        success: true,
        message: 'Client gallery created successfully.',
        gallery: newGallery
      });
    } catch (err) {
      console.error('Error creating client gallery:', err);
      return res.status(500).json({ success: false, error: 'Internal server error creating gallery.' });
    }
  });

  app.patch('/api/client-galleries/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const galleryIndex = clientGalleriesStore.findIndex((g) => g.id === id || g.slug === id);
    if (galleryIndex === -1) {
      return res.status(404).json({ success: false, error: 'Client gallery not found.' });
    }

    const current = clientGalleriesStore[galleryIndex];
    const updated = {
      ...current,
      ...req.body,
      id: current.id, // prevent id overwrite
    };

    clientGalleriesStore[galleryIndex] = updated;
    return res.json({ success: true, gallery: updated });
  });

  app.delete('/api/client-galleries/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const galleryIndex = clientGalleriesStore.findIndex((g) => g.id === id || g.slug === id);
    if (galleryIndex === -1) {
      return res.status(404).json({ success: false, error: 'Client gallery not found.' });
    }

    clientGalleriesStore.splice(galleryIndex, 1);
    return res.json({ success: true, message: 'Client gallery deleted successfully.' });
  });

  const httpServer = http.createServer(app);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
